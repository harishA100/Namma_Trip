export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  xpPoints: number;
  travelLevel: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface Destination {
  id: number;
  name: string;
  category: string;
  description: string;
  bestSeason: string;
  rating: number;
  images: string;
  latitude: number;
  longitude: number;
  savedByCurrentUser: boolean;
}

export interface TravelPost {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string | null;
  destinationId: number | null;
  destinationName: string | null;
  images: string | null;
  caption: string;
  likeCount: number;
  likedByCurrentUser: boolean;
  commentCount: number;
  createdAt: string;
}

export interface Trip {
  id: number;
  userId: number;
  userName: string;
  destination: string;
  duration: number;
  budget: number;
  itinerary: string;
  status: string;
  companions: string;
  interests: string;
  createdAt: string;
}

export interface Expense {
  id: number;
  tripId: number;
  category: string;
  amount: number;
  description: string;
  expenseDate: string;
}

export interface ChecklistItem {
  id: number;
  tripId: number;
  item: string;
  completed: boolean;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface Experience {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string | null;
  destination: string;
  title: string;
  description: string;
  rating: number;
  images: string | null;
  createdAt: string;
}

export interface Comment {
  id: number;
  content: string;
  userName: string;
  userAvatar: string | null;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: {
    time: string;
    activity: string;
    description: string;
    estimatedCost: number;
    location: string;
  }[];
  meals: {
    type: string;
    suggestion: string;
    estimatedCost: number;
  }[];
  accommodation: {
    name: string;
    estimatedCost: number;
  };
}

export interface Itinerary {
  title: string;
  summary: string;
  days: ItineraryDay[];
  tips: string[];
  totalEstimatedCost: number;
}
