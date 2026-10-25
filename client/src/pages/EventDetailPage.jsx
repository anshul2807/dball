import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  Shield,
  ArrowLeft,
  CheckCircle,
  Share2,
  Ticket,
  AlertTriangle,
} from 'lucide-react';
import { eventAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RegistrationModal from '../components/RegistrationModal';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRegistration, setUserRegistration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvent = async () => {
    try {
      const res = await eventAPI.getById(id);
      if (res.data.success) {
        setEvent(res.data.data);
        setIsRegistered(res.data.isUserRegistered);
        setUserRegistration(res.data.userRegistration);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Event not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dball-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-dball-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-dball-dark flex flex-col items-center justify-center p-4">
        <AlertTriangle className="w-16 h-16 text-dball-red mb-4" />
        <h2 className="text-2xl font-bold text-white font-heading">{error || 'Event Not Found'}</h2>
        <Link
          to="/events"
          className="mt-4 px-6 py-2.5 bg-dball-surface border border-dball-border text-white rounded-xl text-sm font-semibold hover:bg-white/10"
        >
          Back to All Events
        </Link>
      </div>
    );
  }

  const spotsRemaining = Math.max(0, (event.maxParticipants || 16) - (event.registeredCount || 0));

  return (
    <div className="min-h-screen bg-dball-dark py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Events
        </Link>

        {/* Hero Card */}
        <div className="bg-dball-card border border-dball-border rounded-3xl overflow-hidden relative shadow-2xl">
          <div className="relative h-72 sm:h-96 w-full">
            <img
              src={event.bannerImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dball-card via-black/50 to-transparent"></div>

            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-xl bg-dball-dark/80 backdrop-blur text-xs font-bold uppercase tracking-wider text-dball-gold border border-dball-gold/30">
                {event.category}
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 backdrop-blur text-xs font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                {event.status}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl sm:text-5xl font-black text-white font-heading uppercase leading-tight drop-shadow-md">
                {event.title}
              </h1>
              {event.subtitle && (
                <p className="text-sm sm:text-base text-dball-gold font-medium mt-1">
                  {event.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Quick Specs Bar */}
          <div className="p-6 bg-dball-surface/70 border-b border-dball-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-dball-red shrink-0" />
              <div>
                <p className="text-gray-400 font-medium">Date</p>
                <p className="text-white font-bold">{new Date(event.date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-dball-gold shrink-0" />
              <div>
                <p className="text-gray-400 font-medium">Time</p>
                <p className="text-white font-bold">{event.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-gray-400 font-medium">Venue</p>
                <p className="text-white font-bold truncate">{event.venue}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-gray-400 font-medium">Prize Pool</p>
                <p className="text-white font-bold truncate">{event.prizePool}</p>
              </div>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-white font-heading uppercase mb-3">
                  About This Event
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Tournament Rules */}
              {event.rules && event.rules.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white font-heading uppercase mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-dball-red" />
                    Rules & Regulations
                  </h3>
                  <div className="space-y-2 bg-dball-surface/50 p-4 rounded-2xl border border-dball-border">
                    {event.rules.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-dball-red shrink-0 mt-2"></span>
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Eligibility */}
              {event.eligibility && (
                <div>
                  <h3 className="text-xl font-bold text-white font-heading uppercase mb-2">
                    Eligibility Criteria
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 p-4 bg-dball-surface/50 rounded-2xl border border-dball-border">
                    {event.eligibility}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar / CTA */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-dball-surface p-6 rounded-2xl border border-dball-border space-y-5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-semibold uppercase">Registration Status</span>
                  <span className="font-bold text-emerald-400">Open (Free Entry)</span>
                </div>

                {/* Slots remaining */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-300">Slots Remaining</span>
                    <span className="text-dball-gold font-bold">
                      {spotsRemaining} / {event.maxParticipants} slots left
                    </span>
                  </div>
                  <div className="w-full h-2 bg-dball-card rounded-full overflow-hidden">
                    <div
                      className="h-full bg-dball-red rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          ((event.registeredCount || 0) / (event.maxParticipants || 16)) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Action button */}
                {isRegistered ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-sm font-bold text-white">You Are Registered!</p>
                    {userRegistration && (
                      <p className="text-xs font-mono text-dball-gold font-bold">
                        Ticket: {userRegistration.ticketCode}
                      </p>
                    )}
                    <Link
                      to="/dashboard"
                      className="inline-block mt-2 text-xs font-bold text-emerald-400 underline"
                    >
                      View Digital Pass in Dashboard
                    </Link>
                  </div>
                ) : spotsRemaining <= 0 ? (
                  <button
                    disabled
                    className="w-full py-3.5 bg-gray-800 text-gray-500 font-bold rounded-xl text-sm cursor-not-allowed"
                  >
                    Tournament Full
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!user) {
                        navigate('/login', {
                          state: { message: 'Please log in to register for this event' },
                        });
                        return;
                      }
                      setIsModalOpen(true);
                    }}
                    className="w-full py-3.5 bg-dball-red hover:bg-red-700 text-white font-black uppercase tracking-wider rounded-xl text-sm shadow-xl shadow-red-950 transition-all transform hover:-translate-y-0.5"
                  >
                    Register Team / Solo
                  </button>
                )}

                <div className="text-[11px] text-gray-400 text-center leading-relaxed">
                  Official collegiate event. Queries? Call Rishab Sarvaria at <strong className="text-gray-200">9810001399</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {event && (
        <RegistrationModal
          event={event}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={user}
          onSuccess={() => {
            setIsRegistered(true);
            fetchEvent();
          }}
        />
      )}
    </div>
  );
};

export default EventDetailPage;
