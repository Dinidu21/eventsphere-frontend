import axios from 'axios';

// Use environment variable or default to localhost for dev
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

console.log(`API Base URL: ${API_BASE_URL}`);

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

// User Service APIs
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(`User registration failed: ${error.message}`);
  }
};

export const getUser = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

// Venue APIs
export const createVenue = async (venueData) => {
  try {
    const response = await apiClient.post('/venues/create', venueData);
    return response.data;
  } catch (error) {
    throw new Error(`Venue creation failed: ${error.message}`);
  }
};

export const getVenues = async () => {
  try {
    const response = await apiClient.get('/venues');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch venues: ${error.message}`);
  }
};

// Event APIs
export const createEvent = async (eventData) => {
  try {
    const response = await apiClient.post('/events/create', eventData);
    return response.data;
  } catch (error) {
    throw new Error(`Event creation failed: ${error.message}`);
  }
};

export const getEvent = async (eventId) => {
  try {
    const response = await apiClient.get(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch event: ${error.message}`);
  }
};

export const getEventsByVenue = async (venueId) => {
  try {
    const response = await apiClient.get(`/events/venue/${venueId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }
};

// Ticket Type APIs
export const createTicketType = async (ticketData) => {
  try {
    const response = await apiClient.post('/ticket-types/create', ticketData);
    return response.data;
  } catch (error) {
    throw new Error(`Ticket type creation failed: ${error.message}`);
  }
};

export const getTicketTypes = async (eventId) => {
  try {
    const response = await apiClient.get(`/ticket-types/event/${eventId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ticket types: ${error.message}`);
  }
};

// Booking APIs
export const createBooking = async (bookingData) => {
  try {
    const response = await apiClient.post('/bookings/create', bookingData);
    return response.data;
  } catch (error) {
    throw new Error(`Booking creation failed: ${error.message}`);
  }
};

export const getBooking = async (bookingId) => {
  try {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch booking: ${error.message}`);
  }
};

export const getUserBookings = async (userId) => {
  try {
    const response = await apiClient.get(`/bookings/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch user bookings: ${error.message}`);
  }
};

// Review APIs
export const submitReview = async (reviewData) => {
  try {
    const response = await apiClient.post('/reviews/submit', reviewData);
    return response.data;
  } catch (error) {
    throw new Error(`Review submission failed: ${error.message}`);
  }
};

export const getReviews = async (bookingId) => {
  try {
    const response = await apiClient.get(`/reviews/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch reviews: ${error.message}`);
  }
};

export default apiClient;