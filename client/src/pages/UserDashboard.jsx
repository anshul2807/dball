import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  Users,
  Trophy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  User,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registrationAPI } from '../services/api';

const UserDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' or 'profile'

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    college: user?.college || '',
  });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchRegistrations = async () => {
    try {
      const res = await registrationAPI.getMyRegistrations();
      if (res.data.success) {
        setRegistrations(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelRegistration = async (regId, eventTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to cancel your registration for "${eventTitle}"? This will free up the spot for another team.`
      )
    ) {
      return;
    }

    try {
      const res = await registrationAPI.cancel(regId);
      if (res.data.success) {
        setRegistrations((prev) => prev.filter((r) => r._id !== regId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel registration');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ type: '', text: '' });

    const res = await updateProfile(profileData);
    setProfileLoading(false);

    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setProfileMsg({ type: 'error', text: res.message || 'Update failed' });
    }
  };

  return (
    <div className="min-h-screen bg-dball-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-dball-card to-dball-surface p-6 sm:p-8 rounded-3xl border border-dball-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-dball-red to-red-800 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-red-950">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white font-heading uppercase">
                  {user?.name}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {user?.college || 'Delhi University'} • {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/events"
              className="px-5 py-2.5 bg-dball-red hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-red-950 flex items-center gap-1.5"
            >
              Browse Tournaments <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-dball-border pb-2">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              activeTab === 'tickets'
                ? 'bg-dball-surface text-white border border-dball-border shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4 text-dball-gold" />
            My Registered Passes ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              activeTab === 'profile'
                ? 'bg-dball-surface text-white border border-dball-border shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 text-emerald-400" />
            Player Profile Settings
          </button>
        </div>

        {/* TAB 1: REGISTERED TICKETS */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-44 bg-dball-card rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : registrations.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {registrations.map((reg) => (
                  <div
                    key={reg._id}
                    className="bg-dball-card rounded-2xl border-2 border-dball-border hover:border-dball-gold/50 transition-all p-6 relative overflow-hidden flex flex-col justify-between shadow-xl"
                  >
                    {/* Glowing corner */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-dball-gold/5 rounded-full blur-2xl pointer-events-none"></div>

                    <div>
                      {/* Top bar with Ticket Code */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-dball-gold px-2 py-0.5 bg-dball-gold/10 rounded border border-dball-gold/20">
                            {reg.event?.category || 'Collegiate Tournament'}
                          </span>
                          <h3 className="text-xl font-bold text-white font-heading mt-1">
                            {reg.event?.title}
                          </h3>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {reg.status}
                        </span>
                      </div>

                      {/* Event Key Info */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 py-3 border-t border-b border-dball-border/70 my-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-dball-red shrink-0" />
                          <span>{reg.event ? new Date(reg.event.date).toLocaleDateString() : 'TBD'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-dball-gold shrink-0" />
                          <span>{reg.event?.time || '10:00 AM'}</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{reg.event?.venue}</span>
                        </div>
                      </div>

                      {/* Team & Registration Specifics */}
                      <div className="space-y-1.5 text-xs text-gray-400">
                        <div className="flex justify-between">
                          <span>Team / Entry:</span>
                          <span className="text-white font-bold">{reg.teamName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Captain:</span>
                          <span className="text-gray-200">{reg.captainName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>College:</span>
                          <span className="text-gray-200">{reg.collegeName}</span>
                        </div>
                        {reg.teamMembers && reg.teamMembers.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[11px] text-gray-400 block mb-1">
                              Registered Roster ({reg.teamMembers.length} players):
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {reg.teamMembers.map((m, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-dball-surface rounded text-[10px] text-gray-300"
                                >
                                  {m.name} {m.jerseyNumber ? `(#${m.jerseyNumber})` : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom ticket code & actions */}
                    <div className="mt-5 pt-4 border-t border-dball-border/80 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">
                          Official E-Pass Code
                        </p>
                        <p className="text-sm font-mono font-black text-dball-gold tracking-wider">
                          {reg.ticketCode}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {reg.event && (
                          <Link
                            to={`/events/${reg.event._id}`}
                            className="px-3 py-1.5 bg-dball-surface hover:bg-white/10 text-xs font-semibold text-gray-300 rounded-lg transition-colors"
                          >
                            Event Info
                          </Link>
                        )}
                        <button
                          onClick={() => handleCancelRegistration(reg._id, reg.event?.title)}
                          className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-xs font-bold text-red-400 rounded-lg border border-red-500/20 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center bg-dball-card rounded-3xl border border-dball-border max-w-md mx-auto space-y-4">
                <Ticket className="w-16 h-16 text-gray-600 mx-auto" />
                <h3 className="text-xl font-bold text-white font-heading">
                  No Registered Tournaments Yet
                </h3>
                <p className="text-xs text-gray-400">
                  Ready to step onto the court? Explore our upcoming season 4 collegiate tournaments and claim your squad's slot!
                </p>
                <Link
                  to="/events"
                  className="inline-block px-6 py-3 bg-dball-red hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-red-950"
                >
                  Explore Upcoming Tournaments
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto bg-dball-card border border-dball-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h3 className="text-xl font-bold text-white font-heading uppercase">
                Player Profile Information
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Keep your institution and contact details up-to-date for automatic tournament pre-fills.
              </p>
            </div>

            {profileMsg.text && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}
              >
                {profileMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-dball-dark border border-dball-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dball-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Email (Registered Account)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-dball-surface border border-dball-border rounded-xl px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full bg-dball-dark border border-dball-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dball-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  College / University
                </label>
                <input
                  type="text"
                  placeholder="Hindu College, Delhi University"
                  value={profileData.college}
                  onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                  className="w-full bg-dball-dark border border-dball-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dball-red"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full py-3 bg-dball-red hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-red-950 disabled:opacity-50"
                >
                  {profileLoading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
