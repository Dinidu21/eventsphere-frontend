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
import { Sparkles, ArrowRight } from 'lucide-react';

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
              
              <RegisterSection onRegister={handleUserRegister} />
            </div>
          </div>
        )}

        {currentUser && currentPage === 'events' && (
          <EventList onEventSelect={handleEventSelect} />
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
      const { registerUser } = await import('./services/api');
      const user = await registerUser(formData);
      onRegister(user);
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
    <Card className="text-left">
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