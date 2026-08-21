import React, { useState } from 'react';
import { submitReview } from '../services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, Star } from 'lucide-react';
import { useToast } from './ui/use-toast';

function ReviewForm({ user, onSubmit }) {
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const reviewData = {
        userId: user.id,
        rating: parseInt(rating),
        comment,
      };
      await submitReview(reviewData);
      toast({
        title: "Review Submitted! 🌟",
        description: "Thank you for sharing your experience",
      });
      onSubmit();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Share Your Experience
        </CardTitle>
        <CardDescription>
          Tell us about your experience at the event
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">⭐ 5 - Excellent</SelectItem>
                <SelectItem value="4">⭐ 4 - Very Good</SelectItem>
                <SelectItem value="3">⭐ 3 - Good</SelectItem>
                <SelectItem value="2">⭐ 2 - Fair</SelectItem>
                <SelectItem value="1">⭐ 1 - Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default ReviewForm;