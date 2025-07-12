import React, { createContext, useContext, useReducer } from 'react';

interface Trip {
  id: string;
  route: {
    originCity: string;
    destinationCity: string;
  };
  bus: {
    model: string;
    capacity: number;
    amenities: string[];
  };
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
}

interface Booking {
  id?: string;
  tripId: string;
  trip?: Trip;
  seatNumbers: number[];
  totalAmount: number;
  status?: string;
  bookingCode?: string;
}

interface BookingState {
  currentBooking: Booking | null;
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

type BookingAction =
  | { type: 'SET_CURRENT_BOOKING'; payload: Booking }
  | { type: 'CLEAR_CURRENT_BOOKING' }
  | { type: 'SET_BOOKINGS'; payload: Booking[] }
  | { type: 'BOOKING_START' }
  | { type: 'BOOKING_SUCCESS'; payload: Booking }
  | { type: 'BOOKING_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: BookingState = {
  currentBooking: null,
  bookings: [],
  loading: false,
  error: null
};

const bookingReducer = (state: BookingState, action: BookingAction): BookingState => {
  switch (action.type) {
    case 'SET_CURRENT_BOOKING':
      return { ...state, currentBooking: action.payload };
    case 'CLEAR_CURRENT_BOOKING':
      return { ...state, currentBooking: null };
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload };
    case 'BOOKING_START':
      return { ...state, loading: true, error: null };
    case 'BOOKING_SUCCESS':
      return {
        ...state,
        loading: false,
        bookings: [...state.bookings, action.payload],
        currentBooking: action.payload
      };
    case 'BOOKING_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface BookingContextType {
  state: BookingState;
  setCurrentBooking: (booking: Booking) => void;
  clearCurrentBooking: () => void;
  setBookings: (bookings: Booking[]) => void;
  clearError: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const setCurrentBooking = (booking: Booking) => {
    dispatch({ type: 'SET_CURRENT_BOOKING', payload: booking });
  };

  const clearCurrentBooking = () => {
    dispatch({ type: 'CLEAR_CURRENT_BOOKING' });
  };

  const setBookings = (bookings: Booking[]) => {
    dispatch({ type: 'SET_BOOKINGS', payload: bookings });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <BookingContext.Provider value={{
      state,
      setCurrentBooking,
      clearCurrentBooking,
      setBookings,
      clearError
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
