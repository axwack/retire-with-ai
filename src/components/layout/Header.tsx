import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, CreditCard, BookOpen, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/aira", label: "AiRA", icon: Sparkles },
    { href: "/credits", label: "Credits", icon: CreditCard },
    { href: "/blog", label: "Blog", icon: BookOpen },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            RetireWise
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Button
                variant={isActive(link.href) ? "secondary" : "ghost"}
                className={`gap-2 ${isActive(link.href) ? "bg-sage-light text-sage-dark" : ""}`}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {profile && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-light">
                  <CreditCard className="h-4 w-4 text-sage" />
                  <span className="text-sm font-medium text-sage-dark">{profile.credits} Credits</span>
                </div>
              )}
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="outline-gold" className="gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
              >
                <Button
                  variant={isActive(link.href) ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-2 ${isActive(link.href) ? "bg-sage-light text-sage-dark" : ""}`}
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                </Button>
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              {user ? (
                <div className="space-y-2">
                  {profile && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sage-light">
                      <CreditCard className="h-4 w-4 text-sage" />
                      <span className="text-sm font-medium text-sage-dark">{profile.credits} Credits</span>
                    </div>
                  )}
                  <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => { handleSignOut(); setIsMenuOpen(false); }}>
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="hero" className="w-full gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
