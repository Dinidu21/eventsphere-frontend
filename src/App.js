import React, { useState, useEffect } from 'react';
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
import { loginUser, registerUser, getCurrentUser, logout } from './services/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { toast } = useToast();

  // Load user from localStorage on mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentPage('events');
    }
  }, []);

  const handleUserLogin = (user) => {
    setCurrentUser(user);
    setCurrentPage('events');
    toast({
      title: "Welcome back! 👋",
      description: `Logged in as ${user.email}`,
    });
  };

  const handleUserRegister = (user) => {
    setCurrentUser(user);
    setCurrentPage('events');
    toast({
      title: "Welcome to EventSphere! 🎉",
      description: `Account created. Let's find you an amazing event.`,
    });
  };

  const handleLogout = () => {
    logout();
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

  const handleBookingComplete = (booking) => {
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
              
              <div className="space-y-4">
                <LoginSection onLogin={handleUserLogin} />
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300"></span>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gradient-to-br from-slate-50 to-slate-100 text-gray-500">
                      or create new account
                    </span>
                  </div>
                </div>
                <RegisterSection onRegister={handleUserRegister} />
              </div>
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

        {currentPage === 'review' && currentUser && selectedEvent && (
          <ReviewForm
            user={currentUser}
            event={selectedEvent}
            onSubmit={handleReviewSubmit}
          />
        )}
      </main>

      <Toaster />
    </div>
  );
}

function LoginSection({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const user = await loginUser(formData.email, formData.password);
      onLogin(user);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="text-left">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full group" disabled={loading}>
            {loading ? (
              'Signing In...'
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function RegisterSection({ onRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'USER',
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
      const user = await registerUser(formData.email, formData.password, formData.role);
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
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Join EventSphere to start booking events
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">Password</Label>
            <Input
              id="reg-password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-role">Account Type</Label>
            <select
              id="reg-role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md"
            >
              <option value="USER">User (Attendee)</option>
              <option value="ADMIN">Admin (Event Organizer)</option>
            </select>
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