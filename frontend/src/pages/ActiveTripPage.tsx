import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Map, DollarSign, CheckSquare, Users, Bell, Plus, Trash2, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { tripApi, expenseApi, checklistApi } from '../api/api';
import { Trip, Expense, ChecklistItem, Itinerary } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const EXPENSE_COLORS = { FOOD: '#F59E0B', TRAVEL: '#6366F1', STAY: '#10B981', SHOPPING: '#EF4444', OTHER: '#8B5CF6' };
const tabs = [
  { id: 'journey', icon: Map, label: 'Journey' },
  { id: 'expenses', icon: DollarSign, label: 'Expenses' },
  { id: 'checklist', icon: CheckSquare, label: 'Checklist' },
  { id: 'partner', icon: Users, label: 'Partner' },
  { id: 'alerts', icon: Bell, label: 'Alerts' },
];

export default function ActiveTripPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [activeTab, setActiveTab] = useState('journey');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: 'FOOD', amount: '', description: '' });

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      const res = await tripApi.getById(Number(id));
      const t = res.data.data;
      setTrip(t);
      try { setItinerary(JSON.parse(t.itinerary)); } catch { setItinerary(null); }
      const [expRes, checkRes, sumRes] = await Promise.all([
        expenseApi.getByTrip(Number(id)).catch(() => ({ data: { data: [] } })),
        checklistApi.getByTrip(Number(id)).catch(() => ({ data: { data: [] } })),
        expenseApi.getSummary(Number(id)).catch(() => ({ data: { data: null } })),
      ]);
      setExpenses(expRes.data?.data || []);
      setChecklist(checkRes.data?.data || []);
      setSummary(sumRes.data?.data || null);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleAddExpense = async () => {
    if (!newExpense.amount) return;
    try {
      await expenseApi.add({ tripId: Number(id), category: newExpense.category, amount: Number(newExpense.amount), description: newExpense.description });
      setNewExpense({ category: 'FOOD', amount: '', description: '' });
      setShowAddExpense(false);
      loadTrip();
    } catch (e) { console.error(e); }
  };

  const handleToggleChecklist = async (itemId: number) => {
    try {
      await checklistApi.toggle(itemId);
      setChecklist(checklist.map(c => c.id === itemId ? { ...c, completed: !c.completed } : c));
    } catch (e) { console.error(e); }
  };

  const handleGenerateChecklist = async () => {
    try {
      const res = await checklistApi.generate(Number(id));
      setChecklist(res.data?.data || []);
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="py-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)] mx-auto" /></div>;
  if (!trip) return <div className="py-12 text-center text-[var(--color-text-muted)]">Trip not found</div>;

  const pieData = summary?.categoryBreakdown ? Object.entries(summary.categoryBreakdown).map(([k, v]) => ({ name: k, value: Number(v) })) : [];

  return (
    <div className="py-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-6 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-accent)]/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className={`badge ${trip.status === 'ACTIVE' ? 'badge-success' : trip.status === 'COMPLETED' ? 'badge-primary' : 'badge-warning'} mb-2`}>
              {trip.status}
            </span>
            <h1 className="text-2xl font-bold">{trip.destination}</h1>
            <p className="text-[var(--color-text-muted)] text-sm">{trip.duration} days · ₹{Number(trip.budget).toLocaleString()} budget</p>
          </div>
          {trip.status === 'PLANNED' && (
            <button onClick={async () => { await tripApi.updateStatus(trip.id, 'ACTIVE'); loadTrip(); }}
              className="btn-primary">Start Trip 🚀</button>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === t.id ? 'gradient-bg text-white shadow-lg shadow-[var(--color-primary)]/25' : 'text-[var(--color-text-muted)] hover:bg-white/5'
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Journey Tab */}
      {activeTab === 'journey' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {itinerary ? (
            <>
              <div className="card p-5">
                <h2 className="text-xl font-bold mb-1">{itinerary.title}</h2>
                <p className="text-sm text-[var(--color-text-muted)]">{itinerary.summary}</p>
              </div>
              {itinerary.days?.map((day, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="card p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-bold">{day.day}</div>
                    <h3 className="font-semibold">{day.title}</h3>
                  </div>
                  <div className="space-y-3 ml-5 border-l-2 border-[var(--color-primary)]/20 pl-5">
                    {day.activities?.map((act, j) => (
                      <div key={j} className="relative">
                        <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[var(--color-primary)] border-2 border-[var(--color-background)]" />
                        <p className="text-xs text-[var(--color-primary)] font-medium">{act.time}</p>
                        <p className="font-medium text-sm">{act.activity}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{act.description}</p>
                        {act.estimatedCost > 0 && <span className="text-xs text-[var(--color-secondary)]">~₹{act.estimatedCost}</span>}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
              {itinerary.tips && (
                <div className="card p-5">
                  <h3 className="font-semibold mb-3">💡 Travel Tips</h3>
                  <ul className="space-y-2">
                    {itinerary.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                        <span className="text-[var(--color-secondary)]">•</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="card p-5">
              <h3 className="font-semibold mb-2">Itinerary</h3>
              <pre className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap">{trip.itinerary}</pre>
            </div>
          )}
        </motion.div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card p-5 text-center">
                <p className="text-sm text-[var(--color-text-muted)]">Budget</p>
                <p className="text-2xl font-bold text-[var(--color-primary)]">₹{Number(summary.budget).toLocaleString()}</p>
              </div>
              <div className="card p-5 text-center">
                <p className="text-sm text-[var(--color-text-muted)]">Spent</p>
                <p className="text-2xl font-bold text-[var(--color-danger)]">₹{Number(summary.totalSpent).toLocaleString()}</p>
              </div>
              <div className="card p-5 text-center">
                <p className="text-sm text-[var(--color-text-muted)]">Remaining</p>
                <p className="text-2xl font-bold text-[var(--color-success)]">₹{Number(summary.remaining).toLocaleString()}</p>
              </div>
            </div>
          )}

          {pieData.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold mb-4">Spending Breakdown</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ₹${value}`}>
                      {pieData.map((entry, i) => <Cell key={i} fill={EXPENSE_COLORS[entry.name as keyof typeof EXPENSE_COLORS] || '#8B5CF6'} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Expenses</h3>
              <button onClick={() => setShowAddExpense(true)} className="btn-primary text-sm py-2 px-3 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {showAddExpense && (
              <div className="p-4 rounded-xl bg-white/5 mb-4 space-y-3">
                <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className="input">
                  <option value="FOOD">🍽️ Food</option><option value="TRAVEL">🚗 Travel</option>
                  <option value="STAY">🏨 Stay</option><option value="SHOPPING">🛍️ Shopping</option>
                  <option value="OTHER">📦 Other</option>
                </select>
                <input type="number" placeholder="Amount (₹)" value={newExpense.amount}
                  onChange={e => setNewExpense({...newExpense, amount: e.target.value})} className="input" />
                <input type="text" placeholder="Description" value={newExpense.description}
                  onChange={e => setNewExpense({...newExpense, description: e.target.value})} className="input" />
                <div className="flex gap-2">
                  <button onClick={() => setShowAddExpense(false)} className="btn-secondary flex-1 text-sm py-2">Cancel</button>
                  <button onClick={handleAddExpense} className="btn-primary flex-1 text-sm py-2">Add Expense</button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {expenses.map(exp => (
                <div key={exp.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{exp.category === 'FOOD' ? '🍽️' : exp.category === 'TRAVEL' ? '🚗' : exp.category === 'STAY' ? '🏨' : exp.category === 'SHOPPING' ? '🛍️' : '📦'}</span>
                    <div>
                      <p className="text-sm font-medium">{exp.description || exp.category}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{exp.expenseDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">₹{Number(exp.amount).toLocaleString()}</span>
                    <button onClick={async () => { await expenseApi.delete(exp.id); loadTrip(); }}
                      className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {expenses.length === 0 && (
                <p className="text-center text-sm text-[var(--color-text-muted)] py-4">No expenses recorded yet</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Checklist Tab */}
      {activeTab === 'checklist' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Smart Checklist</h3>
              {checklist.length === 0 && (
                <button onClick={handleGenerateChecklist} className="btn-primary text-sm py-2 px-3 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Generate with AI
                </button>
              )}
            </div>
            <div className="space-y-2">
              {checklist.map(item => (
                <div key={item.id} onClick={() => handleToggleChecklist(item.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    item.completed ? 'bg-[var(--color-success)]/10' : 'bg-white/5 hover:bg-white/10'
                  }`}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    item.completed ? 'border-[var(--color-success)] bg-[var(--color-success)]' : 'border-white/20'
                  }`}>
                    {item.completed && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`text-sm ${item.completed ? 'line-through text-[var(--color-text-muted)]' : ''}`}>{item.item}</span>
                </div>
              ))}
              {checklist.length === 0 && (
                <p className="text-center text-sm text-[var(--color-text-muted)] py-8">Click "Generate with AI" to create a smart checklist for your trip</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Partner Tab */}
      {activeTab === 'partner' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="card p-8 text-center">
            <Users className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Find Travel Partners</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">Connect with travelers heading to {trip.destination}</p>
            <button className="btn-primary">Find Partners</button>
          </div>
        </motion.div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="card p-8 text-center">
            <Bell className="w-12 h-12 text-[var(--color-secondary)] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Trip Alerts</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Weather updates, budget alerts, and nearby attractions will appear here</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
