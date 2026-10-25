import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Trophy,
  Calendar,
  Flame,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Ticket,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Upcoming Events', path: '/events' },
    { name: 'The Legacy', path: '/#legacy' },
    { name: 'For Sponsors', path: '/#sponsors' },
    { name: 'Grassroots (CSR)', path: '/#grassroots' },
    { name: 'Contact', path: '/#contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/#')) return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-dball-dark/95 backdrop-blur-md border-b border-dball-border/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-dball-red to-red-800 rounded-xl shadow-lg shadow-dball-red/20 group-hover:scale-105 transition-transform border border-red-500/30">
              {/* Basketball crest icon */}
              <div className="relative">
                <span className="text-2xl select-none">🏀</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-dball-gold rounded-full border-2 border-dball-dark"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-wider text-white font-heading uppercase group-hover:text-red-400 transition-colors">
                  D-BALL <span className="text-dball-red">LEAGUE</span>
                </span>
                <span className="bg-dball-red/20 text-dball-red border border-dball-red/40 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium tracking-wide">
                Where Passion <span className="text-dball-gold font-semibold">Meets Power</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'text-white bg-dball-green/40 border border-dball-greenAccent/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-dball-surface border border-dball-border hover:border-dball-greenAccent/50 transition-all text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-dball-green to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white max-w-[120px] truncate">
                        {user.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          isAdmin
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isAdmin ? 'Admin' : 'Player'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 truncate max-w-[130px]">
                      {user.college || user.email}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-dball-card border border-dball-border shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-dball-border">
                      <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                    </div>

                    {isAdmin ? (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-200 hover:text-white hover:bg-dball-green/30 transition-colors font-medium"
                        >
                          <Shield className="w-4 h-4 text-dball-red" />
                          Admin Console
                        </Link>
                        <Link
                          to="/admin?tab=events&action=create"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-200 hover:text-white hover:bg-dball-green/30 transition-colors font-medium"
                        >
                          <PlusCircle className="w-4 h-4 text-dball-gold" />
                          Create New Event
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-200 hover:text-white hover:bg-dball-green/30 transition-colors font-medium"
                        >
                          <Ticket className="w-4 h-4 text-emerald-400" />
                          My Registrations & Passes
                        </Link>
                      </>
                    )}

                    <div className="border-t border-dball-border my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-dball-red to-red-700 hover:from-red-600 hover:to-red-800 rounded-xl shadow-lg shadow-dball-red/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Join D-Ball
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-dball-surface border border-dball-border text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dball-card/95 border-b border-dball-border px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-semibold text-gray-200 hover:bg-white/5"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-dball-border">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-dball-surface rounded-lg">
                  <div className="font-bold text-white text-sm">{user.name}</div>
                  <div className="text-xs text-gray-400">{user.email} ({user.role})</div>
                </div>

                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-400 bg-red-500/10 rounded-lg"
                  >
                    <Shield className="w-4 h-4" /> Admin Console
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-emerald-400 bg-emerald-500/10 rounded-lg"
                  >
                    <Ticket className="w-4 h-4" /> My Registrations & Passes
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-gray-300 hover:text-red-400"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-center text-sm font-bold text-gray-200 bg-dball-surface border border-dball-border rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-center text-sm font-bold text-white bg-dball-red rounded-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
