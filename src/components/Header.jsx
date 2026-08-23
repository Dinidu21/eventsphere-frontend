import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Calendar, LogOut } from 'lucide-react';

function Header({ currentUser, onLogout }) {
  const getInitials = (email) => {
    return email
      .split('@')[0]
      .split('')
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            EventSphere
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(currentUser.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{currentUser.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{currentUser.role?.toLowerCase()}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;