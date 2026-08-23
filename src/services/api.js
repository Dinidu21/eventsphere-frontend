import axios from 'axios';

// Use environment variable or default to localhost for dev
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://136.68.42.194:80'; // Replace with your actual API base URL

console.log(`API Base URL: ${API_BASE_URL}`);

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    // Handle 401 - redirect to login if needed
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/';
    }
    throw error;
  }
);

// ==================== USER SERVICE ====================

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (e.g., 'USER', 'ADMIN')
 * @returns {Promise} User data with token
 */
export const registerUser = async (email, password, role = 'USER') => {
  try {
    const response = await apiClient.post('/api/users/register', {
      email,
      password,
      role,
    });
    
    // Store token and user data if returned
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    localStorage.setItem('currentUser', JSON.stringify(response.data));
    
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `User registration failed: ${error.message}`
    );
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} User data with token
 */
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/api/users/login', {
      email,
      password,
    });
    
    // Store token and user data if returned
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    localStorage.setItem('currentUser', JSON.stringify(response.data));
    
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Login failed: ${error.message}`
    );
  }
};

/**
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Promise} User data
 */
export const getUser = async (userId) => {
  try {
    const response = await apiClient.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch user: ${error.message}`
    );
  }
};

/**
 * Update user
 * @param {number} userId - User ID
 * @param {object} userData - Updated user data (email, role)
 * @returns {Promise} Updated user data
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/api/users/${userId}`, userData);
    localStorage.setItem('currentUser', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to update user: ${error.message}`
    );
  }
};

/**
 * Delete user
 * @param {number} userId - User ID
 * @returns {Promise}
 */
export const deleteUser = async (userId) => {
  try {
    await apiClient.delete(`/api/users/${userId}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to delete user: ${error.message}`
    );
  }
};

// ==================== VENUE APIS ====================

/**
 * Create a new venue
 * @param {object} venueData - Venue data (name, city, capacity)
 * @returns {Promise} Created venue
 */
export const createVenue = async (venueData) => {
  try {
    const response = await apiClient.post('/api/venues', venueData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Venue creation failed: ${error.message}`
    );
  }
};

/**
 * Get all venues
 * @returns {Promise} List of venues
 */
export const getVenues = async () => {
  try {
    const response = await apiClient.get('/api/venues');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch venues: ${error.message}`
    );
  }
};

/**
 * Get venue by ID
 * @param {number} venueId - Venue ID
 * @returns {Promise} Venue data
 */
export const getVenue = async (venueId) => {
  try {
    const response = await apiClient.get(`/api/venues/${venueId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch venue: ${error.message}`
    );
  }
};

/**
 * Update venue
 * @param {number} venueId - Venue ID
 * @param {object} venueData - Updated venue data
 * @returns {Promise} Updated venue
 */
export const updateVenue = async (venueId, venueData) => {
  try {
    const response = await apiClient.put(`/api/venues/${venueId}`, venueData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to update venue: ${error.message}`
    );
  }
};

/**
 * Delete venue
 * @param {number} venueId - Venue ID
 * @returns {Promise}
 */
export const deleteVenue = async (venueId) => {
  try {
    await apiClient.delete(`/api/venues/${venueId}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to delete venue: ${error.message}`
    );
  }
};

// ==================== EVENT APIS ====================

/**
 * Create a new event
 * @param {object} eventData - Event data (title, startsAt, organizerId, venueId, bannerUrl)
 * @returns {Promise} Created event
 */
export const createEvent = async (eventData) => {
  try {
    const response = await apiClient.post('/api/events', eventData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Event creation failed: ${error.message}`
    );
  }
};

/**
 * Get all events
 * @returns {Promise} List of events
 */
export const getEvents = async () => {
  try {
    const response = await apiClient.get('/api/events');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch events: ${error.message}`
    );
  }
};

/**
 * Get event by ID
 * @param {number} eventId - Event ID
 * @returns {Promise} Event data
 */
export const getEvent = async (eventId) => {
  try {
    const response = await apiClient.get(`/api/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch event: ${error.message}`
    );
  }
};

/**
 * Update event
 * @param {number} eventId - Event ID
 * @param {object} eventData - Updated event data
 * @returns {Promise} Updated event
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await apiClient.put(`/api/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to update event: ${error.message}`
    );
  }
};

/**
 * Delete event
 * @param {number} eventId - Event ID
 * @returns {Promise}
 */
export const deleteEvent = async (eventId) => {
  try {
    await apiClient.delete(`/api/events/${eventId}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to delete event: ${error.message}`
    );
  }
};

// ==================== TICKET TYPE APIS ====================

/**
 * Create ticket type for an event
 * @param {number} eventId - Event ID
 * @param {object} ticketData - Ticket data (name, price, seatsTotal)
 * @returns {Promise} Created ticket type
 */
export const createTicketType = async (eventId, ticketData) => {
  try {
    const response = await apiClient.post(
      `/api/events/${eventId}/ticket-types`,
      ticketData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Ticket type creation failed: ${error.message}`
    );
  }
};

/**
 * Get ticket types for an event
 * @param {number} eventId - Event ID
 * @returns {Promise} List of ticket types
 */
export const getTicketTypes = async (eventId) => {
  try {
    const response = await apiClient.get(
      `/api/events/${eventId}/ticket-types`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch ticket types: ${error.message}`
    );
  }
};

/**
 * Get ticket type by ID
 * @param {number} ticketTypeId - Ticket type ID
 * @returns {Promise} Ticket type data
 */
export const getTicketType = async (ticketTypeId) => {
  try {
    const response = await apiClient.get(`/api/ticket-types/${ticketTypeId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch ticket type: ${error.message}`
    );
  }
};

/**
 * Update ticket type
 * @param {number} ticketTypeId - Ticket type ID
 * @param {object} ticketData - Updated ticket data
 * @returns {Promise} Updated ticket type
 */
export const updateTicketType = async (ticketTypeId, ticketData) => {
  try {
    const response = await apiClient.put(
      `/api/ticket-types/${ticketTypeId}`,
      ticketData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to update ticket type: ${error.message}`
    );
  }
};

/**
 * Delete ticket type
 * @param {number} ticketTypeId - Ticket type ID
 * @returns {Promise}
 */
export const deleteTicketType = async (ticketTypeId) => {
  try {
    await apiClient.delete(`/api/ticket-types/${ticketTypeId}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to delete ticket type: ${error.message}`
    );
  }
};

// ==================== BOOKING APIS ====================

/**
 * Create a new booking
 * Backend handles: userId, ticketTypeId, quantity
 * @param {number} userId - User ID
 * @param {number} ticketTypeId - Ticket type ID
 * @param {number} quantity - Number of tickets to book
 * @returns {Promise} Created booking
 */
export const createBooking = async (userId, ticketTypeId, quantity) => {
  try {
    const response = await apiClient.post('/api/bookings', {
      userId,
      ticketTypeId,
      quantity,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Booking creation failed: ${error.message}`
    );
  }
};

/**
 * Get booking by ID
 * @param {number} bookingId - Booking ID
 * @returns {Promise} Booking data
 */
export const getBooking = async (bookingId) => {
  try {
    const response = await apiClient.get(`/api/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch booking: ${error.message}`
    );
  }
};

/**
 * Get all bookings for a user
 * @param {number} userId - User ID
 * @returns {Promise} List of user bookings
 */
export const getUserBookings = async (userId) => {
  try {
    const response = await apiClient.get(`/api/bookings/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch user bookings: ${error.message}`
    );
  }
};

/**
 * Update booking status
 * @param {number} bookingId - Booking ID
 * @param {string} status - New status (e.g., 'CONFIRMED', 'CANCELLED')
 * @returns {Promise} Updated booking
 */
export const updateBooking = async (bookingId, status) => {
  try {
    const response = await apiClient.put(`/api/bookings/${bookingId}`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to update booking: ${error.message}`
    );
  }
};

/**
 * Cancel a booking
 * @param {number} bookingId - Booking ID
 * @returns {Promise} Updated booking
 */
export const cancelBooking = async (bookingId) => {
  return updateBooking(bookingId, 'CANCELLED');
};

/**
 * Confirm a booking
 * @param {number} bookingId - Booking ID
 * @returns {Promise} Updated booking
 */
export const confirmBooking = async (bookingId) => {
  return updateBooking(bookingId, 'CONFIRMED');
};

/**
 * Delete booking
 * @param {number} bookingId - Booking ID
 * @returns {Promise}
 */
export const deleteBooking = async (bookingId) => {
  try {
    await apiClient.delete(`/api/bookings/${bookingId}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to delete booking: ${error.message}`
    );
  }
};

// ==================== REVIEW APIS ====================

/**
 * Create a review with optional file attachments
 * Supports multipart/form-data for file uploads
 * @param {number} eventId - Event ID
 * @param {number} userId - User ID
 * @param {number} rating - Rating (1-5)
 * @param {string} text - Review text
 * @param {File[]} files - Optional file attachments
 * @returns {Promise} Created review
 */
export const createReview = async (eventId, userId, rating, text, files = null) => {
  try {
    // If files are provided, use multipart/form-data
    if (files && files.length > 0) {
      const formData = new FormData();
      
      // Add review data as JSON string in form
      formData.append('review', JSON.stringify({
        eventId,
        userId,
        rating,
        text,
      }));
      
      // Add files
      files.forEach((file) => {
        formData.append('files', file);
      });
      
      // Create temporary config without JSON content-type
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      
      const response = await apiClient.post('/api/reviews', formData, config);
      return response.data;
    } else {
      // No files, use regular JSON
      const response = await apiClient.post('/api/reviews', {
        eventId,
        userId,
        rating,
        text,
      });
      return response.data;
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Review submission failed: ${error.message}`
    );
  }
};

/**
 * Get all reviews
 * @returns {Promise} List of reviews
 */
export const getReviews = async () => {
  try {
    const response = await apiClient.get('/api/reviews');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch reviews: ${error.message}`
    );
  }
};

/**
 * Get review by ID
 * @param {string} reviewId - Review ID
 * @returns {Promise} Review data
 */
export const getReview = async (reviewId) => {
  try {
    const response = await apiClient.get(`/api/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch review: ${error.message}`
    );
  }
};

/**
 * Get reviews for an event
 * @param {number} eventId - Event ID
 * @returns {Promise} List of reviews for event
 */
export const getEventReviews = async (eventId) => {
  try {
    const response = await apiClient.get(`/api/reviews/event/${eventId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch event reviews: ${error.message}`
    );
  }
};

/**
 * Get reviews by user
 * @param {number} userId - User ID
 * @returns {Promise} List of user reviews
 */
export const getUserReviews = async (userId) => {
  try {
    const response = await apiClient.get(`/api/reviews/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch user reviews: ${error.message}`
    );
  }
};

/**
 * Update review
 * @param {string} reviewId - Review ID
 * @param {object} reviewData - Updated review data
 * @returns {Promise} Updated review
 */
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await apiClient.put(`/api/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to update review: ${error.message}`
    );
  }
};

/**
 * Delete review
 * @param {string} reviewId - Review ID
 * @returns {Promise}
 */
export const deleteReview = async (reviewId) => {
  try {
    await apiClient.delete(`/api/reviews/${reviewId}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to delete review: ${error.message}`
    );
  }
};

// ==================== NOTIFICATION APIS ====================

/**
 * Create notification
 * @param {object} notificationData - Notification data
 * @returns {Promise} Created notification
 */
export const createNotification = async (notificationData) => {
  try {
    const response = await apiClient.post(
      '/api/reviews/notifications',
      notificationData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Notification creation failed: ${error.message}`
    );
  }
};

/**
 * Get all notifications
 * @returns {Promise} List of notifications
 */
export const getNotifications = async () => {
  try {
    const response = await apiClient.get('/api/reviews/notifications');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch notifications: ${error.message}`
    );
  }
};

/**
 * Get notification by ID
 * @param {string} notificationId - Notification ID
 * @returns {Promise} Notification data
 */
export const getNotification = async (notificationId) => {
  try {
    const response = await apiClient.get(
      `/api/reviews/notifications/${notificationId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch notification: ${error.message}`
    );
  }
};

/**
 * Get notifications for a user
 * @param {number} userId - User ID
 * @returns {Promise} List of user notifications
 */
export const getUserNotifications = async (userId) => {
  try {
    const response = await apiClient.get(
      `/api/reviews/notifications/user/${userId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to fetch user notifications: ${error.message}`
    );
  }
};

/**
 * Update notification
 * @param {string} notificationId - Notification ID
 * @param {object} notificationData - Updated notification data
 * @returns {Promise} Updated notification
 */
export const updateNotification = async (notificationId, notificationData) => {
  try {
    const response = await apiClient.put(
      `/api/reviews/notifications/${notificationId}`,
      notificationData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to update notification: ${error.message}`
    );
  }
};

/**
 * Delete notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise}
 */
export const deleteNotification = async (notificationId) => {
  try {
    await apiClient.delete(`/api/reviews/notifications/${notificationId}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      `Failed to delete notification: ${error.message}`
    );
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

/**
 * Get stored current user
 * @returns {object|null}
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
};

export default apiClient;