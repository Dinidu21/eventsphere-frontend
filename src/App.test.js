import React, { useState } from 'react';
import { Toaster } from './components/ui/toaster';
import { useToast } from './components/ui/use-toast';
import Header from './components/Header';
import EventList from './components/EventList';
import BookingForm from './components/BookingForm';
import ReviewForm from './components/ReviewForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Sparkles, ArrowRight, Users, Calendar, Ticket } from 'lucide-react';

// Mock user for testing
const MOCK_USER = {
  id: 'test-user-123',
  name: 'Test User',
  email: 'test@example.com',
  phone: '+1 234 567 8900'
};

// Mock events for testing
const MOCK_EVENTS = [
  {
    id: 'event-1',
    name: 'Summer Music Festival',
    venue: 'Central Park',
    date: '2026-09-15',
    time: '6:00 PM - 11:00 PM',
    description: 'Join us for an amazing summer music festival with top artists.'
  },
  {
    id: 'event-2',
    name: 'Tech Conference 2026',
    venue: 'Convention Center',
    date: '2026-10-05',
    time: '9:00 AM - 6:00 PM',
    description: 'The biggest tech conference of the year with industry leaders.'
  },
  {
    id: 'event-3',
    name: 'Food & Wine Expo',
    venue: 'Grand Hotel',
    date: '2026-11-20',
    time: '12:00 PM - 8:00 PM',
    description: 'Taste the best cuisine and wines from around the world.'
  },
  {
    id: 'event-4',
    name: 'Art Exhibition Gala',
    venue: 'Modern Art Museum',
    date: '2026-12-01',
    time: '7:00 PM - 10:00 PM',
    description: 'An exclusive evening of art, culture, and networking.'
  }
];

// Mock ticket types
const MOCK_TICKET_TYPES = [
  { id: 'ticket-1', name: 'Standard', price: 50 },
  { id: 'ticket-2', name: 'VIP', price: 150 },
  { id: 'ticket-3', name: 'Premium', price: 250 }
];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { toast } = useToast();

  const handleUserRegister = (user) => {
    setCurrentUser(user);
    setCurrentPage('events');
    toast({
      title: "Welcome to EventSphere! 🎉",
      description: `Hello ${user.name}, let's find you an amazing event.`,
    });
  };

  const handleQuickTest = () => {
    setCurrentUser(MOCK_USER);
    setCurrentPage('events');
    toast({
      title: "Quick Test Mode 🚀",
      description: "You're now in test mode with mock data.",
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setCurrentPage('booking');
  };

  const handleBookingComplete = () => {
    setCurrentPage('review');
  };

  const handleReviewSubmit = () => {
    setCurrentPage('events');
    toast({
      title: "Review submitted! 🌟",
      description: "Thank you for your feedback!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      
      <main className="container py-8">
        {!currentUser && currentPage === 'home' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Discover Amazing Events</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  EventSphere
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                Book tickets to the best events in your city. Simple, fast, and secure.
              </p>

              {/* Quick Test Button */}
              <Card className="max-w-md mx-auto border-2 border-dashed border-primary/30">
                <CardHeader>
                  <CardTitle className="text-center">🚀 Quick Test Mode</CardTitle>
                  <CardDescription className="text-center">
                    Skip registration and test the UI with mock data
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    onClick={handleQuickTest} 
                    className="w-full bg-gradient-to-r from-primary to-purple-600"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Enter Test Mode
                  </Button>
                </CardFooter>
              </Card>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or register normally
                  </span>
                </div>
              </div>
              
              <RegisterSection onRegister={handleUserRegister} />
            </div>
          </div>
        )}

        {currentUser && currentPage === 'events' && (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{MOCK_EVENTS.length}</div>
                  <p className="text-xs text-muted-foreground">Available for booking</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">My Bookings</CardTitle>
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Book an event to get started</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Test Mode</CardTitle>
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">Active</div>
                  <p className="text-xs text-muted-foreground">Using mock data</p>
                </CardContent>
              </Card>
            </div>

            <EventList onEventSelect={handleEventSelect} />
          </>
        )}

        {currentPage === 'booking' && currentUser && selectedEvent && (
          <BookingForm
            event={selectedEvent}
            user={currentUser}
            onComplete={handleBookingComplete}
          />
        )}

        {currentPage === 'review' && currentUser && (
          <ReviewForm
            user={currentUser}
            onSubmit={handleReviewSubmit}
          />
        )}
      </main>

      <Toaster />
    </div>
  );
}

function RegisterSection({ onRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use mock registration for testing
      const user = {
        id: 'user-' + Date.now(),
        ...formData
      };
      onRegister(user);
      toast({
        title: "Registration Successful! 🎉",
        description: `Welcome ${user.name}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="text-left max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
        <CardDescription>
          Create your account to start booking events
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full group" disabled={loading}>
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                Register & Continue
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default App;