import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, MapPin, Calendar, Wallet, Users, Heart, Loader2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { tripApi } from '../api/api';

const popularDestinations = ['Ooty', 'Kodaikanal', 'Pondicherry', 'Madurai', 'Rameswaram', 'Mahabalipuram', 'Kanyakumari', 'Chettinad'];
const interestOptions = ['Temples', 'Beaches', 'Hill Stations', 'Food', 'Heritage', 'Adventure', 'Photography', 'Wildlife'];

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function TripPlannerPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [companions, setCompanions] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Vanakkam! 🙏 I'm your AI travel planner for Tamil Nadu. Let's create your perfect trip! Where would you like to go?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [generatedTripId, setGeneratedTripId] = useState<number | null>(null);

  const addMessage = (role: 'user' | 'ai', content: string) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const handleDestination = (dest: string) => {
    setDestination(dest);
    addMessage('user', dest);
    setTimeout(() => {
      addMessage('ai', `${dest} is a fantastic choice! 🎉 What's your budget for this trip? (in ₹)`);
      setStep(1);
    }, 500);
  };

  const handleBudget = () => {
    if (!budget) return;
    addMessage('user', `₹${budget}`);
    setTimeout(() => {
      addMessage('ai', 'Great! How many days are you planning to travel?');
      setStep(2);
    }, 500);
  };

  const handleDuration = () => {
    if (!duration) return;
    addMessage('user', `${duration} days`);
    setTimeout(() => {
      addMessage('ai', 'Who are you traveling with? (Solo, Family, Friends, Couple)');
      setStep(3);
    }, 500);
  };

  const handleCompanions = (comp: string) => {
    setCompanions(comp);
    addMessage('user', comp);
    setTimeout(() => {
      addMessage('ai', 'Almost done! What are your interests? Select all that apply:');
      setStep(4);
    }, 500);
  };

  const handleGenerate = async () => {
    addMessage('user', interests.join(', '));
    addMessage('ai', '🔮 Generating your personalized itinerary...');
    setLoading(true);

    try {
      const res = await tripApi.generate({
        destination,
        budget: Number(budget),
        duration: Number(duration),
        companions,
        interests: interests.join(', '),
      });
      const trip = res.data.data;
      setGeneratedTripId(trip.id);
      addMessage('ai', `✅ Your ${duration}-day ${destination} itinerary is ready! Click below to view your journey.`);
      setStep(5);
    } catch (e) {
      addMessage('ai', '❌ Oops, something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const toggleInterest = (i: string) => {
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  return (
    <div className="py-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" /> Powered by Gemini AI
        </div>
        <h1 className="text-3xl font-bold mb-2">AI Trip Planner</h1>
        <p className="text-[var(--color-text-muted)]">Tell me about your dream trip and I'll create the perfect itinerary</p>
      </motion.div>

      {/* Chat */}
      <div className="card p-6 mb-6 max-h-[60vh] overflow-y-auto space-y-4" id="ai-chat">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'gradient-bg text-white rounded-br-sm'
                  : 'glass rounded-bl-sm'
              }`}>
                {msg.role === 'ai' && <Sparkles className="w-4 h-4 text-[var(--color-secondary)] mb-1 inline-block mr-1" />}
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div className="glass p-4 rounded-2xl rounded-bl-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--color-primary)]" />
              <span className="text-sm">Creating your itinerary...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="dest" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="card p-5">
              <p className="text-sm font-medium mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-[var(--color-primary)]" /> Popular Destinations</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {popularDestinations.map(d => (
                  <button key={d} onClick={() => handleDestination(d)}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 border border-white/10 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all">
                    {d}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)}
                  placeholder="Or type your destination..." className="input flex-1" />
                <button onClick={() => destination && handleDestination(destination)} className="btn-primary px-4">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="budget" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="card p-5">
              <p className="text-sm font-medium mb-3 flex items-center gap-2"><Wallet className="w-4 h-4 text-[var(--color-secondary)]" /> Budget</p>
              <div className="flex gap-2">
                <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter budget in ₹" className="input flex-1" id="planner-budget" />
                <button onClick={handleBudget} className="btn-primary px-4"><ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-2 mt-3">
                {['3000', '5000', '10000', '20000'].map(b => (
                  <button key={b} onClick={() => { setBudget(b); }} className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                    ₹{Number(b).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="duration" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="card p-5">
              <p className="text-sm font-medium mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-green-400" /> Duration</p>
              <div className="flex gap-2">
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
                  placeholder="Number of days" className="input flex-1" min="1" max="30" id="planner-duration" />
                <button onClick={handleDuration} className="btn-primary px-4"><ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-2 mt-3">
                {['2', '3', '5', '7'].map(d => (
                  <button key={d} onClick={() => setDuration(d)} className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                    {d} days
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="companions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="card p-5">
              <p className="text-sm font-medium mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" /> Travel Companions</p>
              <div className="grid grid-cols-2 gap-2">
                {['Solo 🧳', 'Couple 💑', 'Family 👨‍👩‍👧‍👦', 'Friends 🎉'].map(c => (
                  <button key={c} onClick={() => handleCompanions(c.split(' ')[0])}
                    className="p-3 rounded-xl text-sm font-medium bg-white/5 border border-white/10 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all">
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="interests" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="card p-5">
              <p className="text-sm font-medium mb-3 flex items-center gap-2"><Heart className="w-4 h-4 text-pink-400" /> Interests</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {interestOptions.map(i => (
                  <button key={i} onClick={() => toggleInterest(i)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      interests.includes(i)
                        ? 'gradient-bg text-white shadow-lg shadow-[var(--color-primary)]/25'
                        : 'bg-white/5 border border-white/10 hover:border-[var(--color-primary)]'
                    }`}>
                    {i}
                  </button>
                ))}
              </div>
              <button onClick={handleGenerate} disabled={interests.length === 0 || loading}
                className="btn-primary w-full flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> Generate My Itinerary
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && generatedTripId && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card p-5 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold mb-2">Your itinerary is ready!</h3>
              <p className="text-[var(--color-text-muted)] text-sm mb-4">
                {duration}-day trip to {destination} · ₹{Number(budget).toLocaleString()} budget
              </p>
              <button onClick={() => navigate(`/feed/trip/${generatedTripId}`)}
                className="btn-primary px-8 py-3 text-base">
                View Trip Dashboard →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
