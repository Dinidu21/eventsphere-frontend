import React, { useState, useEffect } from 'react';
import { getTicketTypes, createBooking } from '../services/api';

function BookingForm({ event, user, onComplete }) {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        const types = await getTicketTypes(event.id);
        setTicketTypes(types);
        if (types.length > 0) {
          setSelectedTicketType(types[0].id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketTypes();
  }, [event.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        userId: user.id,
        eventId: event.id,
        ticketTypeId: selectedTicketType,
        quantity,
      };
      await createBooking(bookingData);
      alert('Booking successful!');
      onComplete();
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading ticket types...</div>;

  return (
    <div className="booking-form-container">
      <h2>Book Tickets for {event.name}</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="ticket-type">Ticket Type:</label>
          <select
            id="ticket-type"
            value={selectedTicketType}
            onChange={(e) => setSelectedTicketType(e.target.value)}
            required
          >
            {ticketTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} - ${type.price}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Number of Tickets:</label>
          <input
            id="quantity"
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Complete Booking
        </button>
      </form>
    </div>
  );
}

export default BookingForm;