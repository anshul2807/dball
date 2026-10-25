import React, { useState, useEffect } from 'react';
import { Search, Filter, Trophy, Calendar, Sparkles } from 'lucide-react';
import { eventAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import RegistrationModal from '../components/RegistrationModal';
import { useNavigate } from 'react-router-dom';

const categories = [
  'all',
  'Pan-City League',
  'Inter-College Championship',
  'Slam Dunk Contest',
  '3-Point Battle',
  'Grassroots Camp',
];

const EventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedStatus !== 'all') params.status = selectedStatus;

      const res = await eventAPI.getAll(params);
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleRegisterClick = (event) => {
    if (!user) {
      navigate('/login', {
        state: { message: 'Please log in to register for D-BALL tournaments' },
      });
      return;
    }
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleRegistrationSuccess = (eventId) => {
    setRegisteredEventIds((prev) => [...prev, eventId]);
    fetchEvents(); // Refresh registered counts
  };

  return (
    <div className="min-h-screen bg-dball-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-dball-red uppercase tracking-widest bg-dball-red/10 px-3 py-1 rounded-md border border-dball-red/30">
            D-BALL 2026 Season Schedule
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white font-heading uppercase mt-3">
            Tournaments & Events
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-2">
            Explore all upcoming collegiate brackets, skill challenges, dunk contests, and community camps.
          </p>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-dball-card border border-dball-border rounded-2xl p-4 sm:p-6 mb-10 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tournaments by title, venue, or college..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-dball-surface border border-dball-border rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-dball-red"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-dball-red hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-red-950"
            >
              Search
            </button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-dball-border/60">
            <span className="text-xs text-gray-400 font-bold uppercase mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-dball-red text-white'
                    : 'bg-dball-surface text-gray-400 hover:text-white border border-dball-border'
                }`}
              >
                {cat === 'all' ? 'All Tournaments' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-dball-card animate-pulse border border-dball-border"></div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onRegister={handleRegisterClick}
                isRegistered={registeredEventIds.includes(event._id)}
              />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-dball-card rounded-2xl border border-dball-border max-w-lg mx-auto">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white font-heading">No Events Found</h3>
            <p className="text-sm text-gray-400 mt-2">
              No tournaments match your current filters. Try searching for a different keyword or reset filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="mt-6 px-4 py-2 bg-dball-surface text-sm font-semibold text-white rounded-xl border border-dball-border hover:bg-white/10"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={user}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
};

export default EventsPage;
