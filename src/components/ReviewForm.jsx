import React, { useState } from 'react';
import { submitReview } from '../services/api';

function ReviewForm({ user, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const reviewData = {
        userId: user.id,
        rating,
        comment,
      };
      await submitReview(reviewData);
      onSubmit();
    } catch (err) {
      setError(err.message);
      console.error('Review submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <h2>Share Your Experience</h2>
      <form onSubmit={handleSubmit} className="review-form">
        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="rating">Rating:</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
          >
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Your Review:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            rows="5"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;