// Shared types between frontend and backend

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'DRIVER';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Route {
  id: string;
  originCity: string;
  destinationCity: string;
  distance: number;
  estimatedDuration: number; // in minutes
  basePrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bus {
  id: string;
  plateNumber: string;
  model: string;
  capacity: number;
  amenities: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Trip {
  id: string;
  routeId: string;
  busId: string;
  departureTime: Date;
  arrivalTime: Date;
  price: number;
  availableSeats: number;
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED' | 'DELAYED';
  createdAt: Date;
  updatedAt: Date;
  route?: Route;
  bus?: Bus;
}

export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  seatNumbers: number[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';
  bookingCode: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  trip?: Trip;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  stripePaymentId?: string;
  stripeIntentId?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  date: string;
}
