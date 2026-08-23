import React, { useState, useEffect } from 'react';
import { getTicketTypes, createBooking } from '../services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from './ui/use-toast';

function BookingForm({ event, user, onComplete }) {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        setError(null);
        const types = await getTicketTypes(event.id);
        setTicketTypes(types);
        if (types.length > 0) {
          setSelectedTicketTypeId(types[0].id);
        }
      } catch (err) {
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Failed to load ticket types",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTicketTypes();
  }, [event.id, toast]);

  const selectedTicketType = ticketTypes.find(t => t.id === selectedTicketTypeId);
  const seatsAvailable = selectedTicketType?.seatsRemaining || 0;
  const maxQuantity = Math.min(10, seatsAvailable);
  const totalPrice = selectedTicketType ? (selectedTicketType.price * quantity) : 0;

  const handleQuantityChange = (value) => {
    const num = parseInt(value);
    if (num >= 1 && num <= maxQuantity) {
      setQuantity(num);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTicketTypeId) {
      setError('Please select a ticket type');
      return;
    }

    if (quantity > seatsAvailable) {
      setError(`Only ${seatsAvailable} seats available`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const booking = await createBooking(
        user.id,
        selectedTicketTypeId,
        quantity
      );
      
      toast({
        title: "Booking Successful! 🎉",
        description: `${quantity} ticket(s) booked for ${event.title}`,
      });
      
      onComplete(booking);
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (ticketTypes.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>No Tickets Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This event has no ticket types available at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Book Tickets for {event.title}</CardTitle>
        <CardDescription>
          Select your ticket type and quantity
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="ticket-type">Ticket Type</Label>
            <Select 
              value={selectedTicketTypeId?.toString() || ''} 
              onValueChange={(value) => setSelectedTicketTypeId(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a ticket type" />
              </SelectTrigger>
              <SelectContent>
                {ticketTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    <span className="flex items-center gap-2">
                      {type.name} - ${type.price}
                      <span className="text-xs text-muted-foreground">
                        ({type.seatsRemaining} available)
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTicketType && seatsAvailable === 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
              This ticket type is sold out
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="quantity">Number of Tickets</Label>
              <span className="text-sm text-muted-foreground">
                {seatsAvailable} available
              </span>
            </div>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={maxQuantity}
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              disabled={seatsAvailable === 0}
              required
            />
            {seatsAvailable > 0 && quantity > seatsAvailable && (
              <p className="text-sm text-destructive">
                Only {seatsAvailable} seats available
              </p>
            )}
          </div>

          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price per ticket:</span>
              <span>${selectedTicketType?.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity:</span>
              <span>{quantity}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button 
            type="submit" 
            className="flex-1" 
            disabled={submitting || seatsAvailable === 0}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              'Complete Booking'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default BookingForm;