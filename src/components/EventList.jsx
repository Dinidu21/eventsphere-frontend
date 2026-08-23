import React, { useState, useEffect } from 'react';
import { getEvents, getEventReviews } from '../services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Loader2, Calendar, MapPin, Users, Star, Search } from 'lucide-react';
import { useToast } from './ui/use-toast';

function EventList({ onEventSelect }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventReviews, setEventReviews] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setError(null);
        const data = await getEvents();
        setEvents(data);

        // Fetch reviews for all events to show ratings
        const reviewsMap = {};
        for (const event of data) {
          try {
            const reviews = await getEventReviews(event.id);
            reviewsMap[event.id] = reviews;
          } catch (err) {
            // Reviews might not exist, that's okay
            reviewsMap[event.id] = [];
          }
        }
        setEventReviews(reviewsMap);
      } catch (err) {
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Failed to load events",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const calculateAverageRating = (eventId) => {
    const reviews = eventReviews[eventId] || [];
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.venue?.name && event.venue.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (event.venue?.city && event.venue.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>No Events Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            There are no events available at this time. Please check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Discover Events</h2>
        <p className="text-muted-foreground">
          Browse and book tickets to amazing events
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by event title, venue, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No events found matching "{searchQuery}"
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              averageRating={calculateAverageRating(event.id)}
              reviewCount={eventReviews[event.id]?.length || 0}
              onSelect={onEventSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ event, averageRating, reviewCount, onSelect }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col">
      {event.bannerUrl && (
        <div className="relative h-40 overflow-hidden bg-slate-200">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <CardTitle className="line-clamp-2">{event.title}</CardTitle>
          
          {averageRating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-medium">{averageRating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-1 space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              {new Date(event.startsAt).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {event.venue && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div>{event.venue.name}</div>
                <div className="text-xs">{event.venue.city}</div>
              </div>
            </div>
          )}

          {event.venue?.capacity && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm">Capacity: {event.venue.capacity}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => onSelect(event)}
          className="w-full"
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}

export default EventList;