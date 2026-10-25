import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  Download,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Trophy,
  MapPin,
  ExternalLink,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { eventAPI, registrationAPI, statsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('events'); // 'events', 'registrations', 'analytics'
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states for registrations
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Event Create / Edit Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'Inter-College Championship',
    date: '',
    time: '10:00 AM - 06:00 PM',
    venue: '',
    location: 'Delhi, India',
    prizePool: '₹1,00,000 + Trophies & Medals',
    maxParticipants: 16,
    teamType: 'Team (5v5)',
    rules: '',
    eligibility: 'Open to enrolled college students aged 16-28 with valid ID.',
    bannerImage:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming',
  });
  const [eventModalError, setEventModalError] = useState('');
  const [savingEvent, setSavingEvent] = useState(false);

  // Roster details modal
  const [selectedRosterReg, setSelectedRosterReg] = useState(null);

  // Fetch all admin data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, eventsRes, regsRes] = await Promise.all([
        statsAPI.getAdmin(),
        eventAPI.getAll(),
        registrationAPI.getAll(),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (eventsRes.data.success) setEvents(eventsRes.data.data);
      if (regsRes.data.success) setRegistrations(regsRes.data.data);
    } catch (err) {
      console.error('Error loading admin console:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Event Modal Open (Create vs Edit)
  const openCreateModal = () => {
    setEditingEvent(null);
    setEventFormData({
      title: '',
      subtitle: '',
      description: '',
      category: 'Inter-College Championship',
      date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      time: '10:00 AM - 06:00 PM',
      venue: 'Delhi University Sports Complex',
      location: 'North Campus, Delhi',
      prizePool: '₹1,50,000 + Trophies & Scouting',
      maxParticipants: 16,
      teamType: 'Team (5v5)',
      rules:
        'Official FIBA collegiate rules apply.\n4 quarters of 10 minutes.\nValid college student ID mandatory.\nMatching jerseys with clear numbers required.',
      eligibility: 'Open to college students aged 16-28.',
      bannerImage:
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
      status: 'upcoming',
    });
    setEventModalError('');
    setIsEventModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setEventFormData({
      title: event.title,
      subtitle: event.subtitle || '',
      description: event.description,
      category: event.category,
      date: new Date(event.date).toISOString().split('T')[0],
      time: event.time || '10:00 AM - 06:00 PM',
      venue: event.venue,
      location: event.location || 'Delhi, India',
      prizePool: event.prizePool || '',
      maxParticipants: event.maxParticipants || 16,
      teamType: event.teamType || 'Team (5v5)',
      rules: Array.isArray(event.rules) ? event.rules.join('\n') : event.rules || '',
      eligibility: event.eligibility || '',
      bannerImage: event.bannerImage || '',
      status: event.status || 'upcoming',
    });
    setEventModalError('');
    setIsEventModalOpen(true);
  };

  // Submit Create or Edit Event
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setSavingEvent(true);
    setEventModalError('');

    try {
      if (editingEvent) {
        const res = await eventAPI.update(editingEvent._id, eventFormData);
        if (res.data.success) {
          setIsEventModalOpen(false);
          fetchData();
        }
      } else {
        const res = await eventAPI.create(eventFormData);
        if (res.data.success) {
          setIsEventModalOpen(false);
          fetchData();
        }
      }
    } catch (err) {
      setEventModalError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setSavingEvent(false);
    }
  };

  // Delete Event
  const handleDeleteEvent = async (id, title) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${title}"? This will also remove all its registrations!`
      )
    ) {
      return;
    }

    try {
      const res = await eventAPI.delete(id);
      if (res.data.success) {
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  // Update Registration Status
  const handleStatusChange = async (regId, newStatus) => {
    try {
      const res = await registrationAPI.updateStatus(regId, newStatus);
      if (res.data.success) {
        setRegistrations((prev) =>
          prev.map((r) => (r._id === regId ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Filtered registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const matchEvent =
      selectedEventFilter === 'all' ||
      reg.event?._id === selectedEventFilter ||
      reg.event === selectedEventFilter;

    const s = searchQuery.toLowerCase();
    const matchSearch =
      !searchQuery ||
      reg.teamName?.toLowerCase().includes(s) ||
      reg.captainName?.toLowerCase().includes(s) ||
      reg.collegeName?.toLowerCase().includes(s) ||
      reg.contactEmail?.toLowerCase().includes(s) ||
      reg.contactPhone?.includes(s) ||
      reg.ticketCode?.toLowerCase().includes(s) ||
      reg.user?.name?.toLowerCase().includes(s);

    return matchEvent && matchSearch;
  });

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert('No registrations available to export.');
      return;
    }

    const headers = [
      'Ticket Code',
      'Event Name',
      'Team Name',
      'Captain Name',
      'College Name',
      'Phone',
      'Email',
      'Status',
      'Registered Date',
      'Roster Count',
      'Player Names',
    ];

    const rows = filteredRegistrations.map((r) => [
      `"${r.ticketCode || ''}"`,
      `"${r.event?.title || ''}"`,
      `"${r.teamName || ''}"`,
      `"${r.captainName || ''}"`,
      `"${r.collegeName || ''}"`,
      `"${r.contactPhone || ''}"`,
      `"${r.contactEmail || ''}"`,
      `"${r.status || 'confirmed'}"`,
      `"${new Date(r.createdAt).toLocaleDateString()}"`,
      `"${r.teamMembers ? r.teamMembers.length : 0}"`,
      `"${r.teamMembers ? r.teamMembers.map((m) => `${m.name} (${m.jerseyNumber || '-'})`).join('; ') : ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `DBall_Registrations_Export_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-dball-dark py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-dball-card via-dball-surface to-dball-card p-6 sm:p-8 rounded-3xl border border-dball-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-dball-red/20 border border-dball-red/40 flex items-center justify-center text-dball-red shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white font-heading uppercase">
                  D-BALL Admin Console
                </h1>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-dball-red text-white">
                  Admin
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Manage collegiate tournaments, review player rosters, and coordinate Season 4 operations.
              </p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="px-5 py-3 bg-dball-red hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-950 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create New Tournament
          </button>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-dball-card border border-dball-border rounded-2xl p-5">
              <span className="text-xs text-gray-400 font-bold uppercase">Total Tournaments</span>
              <p className="text-3xl font-black text-white font-heading mt-1">
                {stats.events?.total || events.length}
              </p>
              <span className="text-[11px] text-emerald-400 font-medium">
                {stats.events?.upcoming || 0} upcoming & active
              </span>
            </div>

            <div className="bg-dball-card border border-dball-border rounded-2xl p-5">
              <span className="text-xs text-gray-400 font-bold uppercase">Total Registrations</span>
              <p className="text-3xl font-black text-dball-gold font-heading mt-1">
                {stats.registrations?.total || registrations.length}
              </p>
              <span className="text-[11px] text-gray-400 font-medium">
                {stats.registrations?.confirmed || 0} confirmed squads
              </span>
            </div>

            <div className="bg-dball-card border border-dball-border rounded-2xl p-5">
              <span className="text-xs text-gray-400 font-bold uppercase">Registered Users</span>
              <p className="text-3xl font-black text-white font-heading mt-1">
                {stats.users?.total || 0}
              </p>
              <span className="text-[11px] text-blue-400 font-medium">
                {stats.users?.normalUsers || 0} players & captains
              </span>
            </div>

            <div className="bg-dball-card border border-dball-border rounded-2xl p-5">
              <span className="text-xs text-gray-400 font-bold uppercase">Colleges Represented</span>
              <p className="text-3xl font-black text-emerald-400 font-heading mt-1">
                {new Set(registrations.map((r) => r.collegeName)).size || '12+'}
              </p>
              <span className="text-[11px] text-gray-400 font-medium">Pan-City Delhi Network</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-dball-border pb-2">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'events'
                ? 'bg-dball-surface text-white border border-dball-border shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 text-dball-red" />
            Tournament Management ({events.length})
          </button>

          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'registrations'
                ? 'bg-dball-surface text-white border border-dball-border shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-dball-gold" />
            Registered Users & Teams ({registrations.length})
          </button>
        </div>

        {/* TAB 1: TOURNAMENT MANAGEMENT */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-dball-card border border-dball-border rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl"
                >
                  <div className="relative h-44 w-full">
                    <img
                      src={event.bannerImage}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dball-card to-transparent"></div>
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/70 text-dball-gold border border-dball-gold/30">
                      {event.category}
                    </span>
                    <span
                      className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        event.status === 'upcoming'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white font-heading line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="mt-3 pt-3 border-t border-dball-border/60 text-xs text-gray-300 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-dball-red shrink-0" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 font-bold text-dball-gold">
                          <span>Capacity / Filled:</span>
                          <span>
                            {event.registeredCount || 0} / {event.maxParticipants} slots
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-dball-border flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedEventFilter(event._id);
                          setActiveTab('registrations');
                        }}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                      >
                        <Users className="w-3.5 h-3.5" /> Registrations ({event.registeredCount || 0})
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(event)}
                          className="p-2 bg-dball-surface hover:bg-white/10 text-gray-200 rounded-lg border border-dball-border transition-colors"
                          title="Edit Event"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id, event.title)}
                          className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg border border-red-500/20 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: REGISTERED USERS & TEAMS */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-dball-card border border-dball-border rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by team, captain, phone, ticket..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-dball-surface border border-dball-border rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-dball-red"
                  />
                </div>

                {/* Event Selector */}
                <select
                  value={selectedEventFilter}
                  onChange={(e) => setSelectedEventFilter(e.target.value)}
                  className="w-full sm:w-auto bg-dball-surface border border-dball-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-dball-red"
                >
                  <option value="all">All Tournaments ({registrations.length})</option>
                  {events.map((evt) => (
                    <option key={evt._id} value={evt._id}>
                      {evt.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Export to CSV Button */}
              <button
                onClick={exportToCSV}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Export CSV for Check-In
              </button>
            </div>

            {/* Registrations Table */}
            <div className="bg-dball-card border border-dball-border rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-dball-surface/80 uppercase tracking-wider text-[10px] text-gray-400 border-b border-dball-border font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Ticket Pass</th>
                      <th className="py-3.5 px-4">Tournament</th>
                      <th className="py-3.5 px-4">Team / Captain</th>
                      <th className="py-3.5 px-4">College</th>
                      <th className="py-3.5 px-4">Contact (Phone/Email)</th>
                      <th className="py-3.5 px-4">Roster</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dball-border">
                    {filteredRegistrations.length > 0 ? (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-dball-gold">
                            {reg.ticketCode}
                          </td>
                          <td className="py-3 px-4 font-semibold text-white max-w-[180px] truncate">
                            {reg.event?.title || 'Unknown Event'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-white block">{reg.teamName}</span>
                            <span className="text-[11px] text-gray-400">
                              Cap: {reg.captainName}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-300">{reg.collegeName}</td>
                          <td className="py-3 px-4">
                            <span className="block text-white font-medium">{reg.contactPhone}</span>
                            <span className="text-[11px] text-gray-400">{reg.contactEmail}</span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setSelectedRosterReg(reg)}
                              className="px-2.5 py-1 bg-dball-surface hover:bg-white/10 border border-dball-border rounded-lg text-xs font-semibold text-white flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5 text-dball-gold" />
                              {reg.teamMembers?.length || 1} Players
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={reg.status}
                              onChange={(e) => handleStatusChange(reg._id, e.target.value)}
                              className={`text-[11px] font-bold rounded-lg px-2 py-1 bg-dball-dark border ${
                                reg.status === 'confirmed'
                                  ? 'text-emerald-400 border-emerald-500/40'
                                  : reg.status === 'waitlisted'
                                  ? 'text-amber-400 border-amber-500/40'
                                  : 'text-red-400 border-red-500/40'
                              }`}
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="waitlisted">Waitlisted</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-[11px] text-gray-500">
                              {new Date(reg.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="py-12 text-center text-gray-500">
                          No registrations found matching the filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CREATE / EDIT EVENT MODAL */}
        {isEventModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-dball-card border border-dball-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
              <div className="flex justify-between items-center border-b border-dball-border pb-3">
                <h3 className="text-xl font-bold text-white font-heading">
                  {editingEvent ? 'Edit Tournament Event' : 'Create New Tournament Event'}
                </h3>
                <button
                  onClick={() => setIsEventModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {eventModalError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{eventModalError}</span>
                </div>
              )}

              <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. D-BALL Pan-City Championship Season 4"
                    value={eventFormData.title}
                    onChange={(e) =>
                      setEventFormData({ ...eventFormData, title: e.target.value })
                    }
                    className="w-full bg-dball-dark border border-dball-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dball-red"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Subtitle / Punchline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12+ Colleges Competing • Live Commentary & Fan Zones"
                    value={eventFormData.subtitle}
                    onChange={(e) =>
                      setEventFormData({ ...eventFormData, subtitle: e.target.value })
                    }
                    className="w-full bg-dball-dark border border-dball-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-dball-red"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={eventFormData.category}
                      onChange={(e) =>
                        setEventFormData({ ...eventFormData, category: e.target.value })
                      }
                      className="w-full bg-dball-dark border border-dball-border rounded-xl px-3 py-2 text-sm text-white"
                    >
                      <option value="Pan-City League">Pan-City League</option>
                      <option value="Inter-College Championship">Inter-College Championship</option>
                      <option value="Slam Dunk Contest">Slam Dunk Contest</option>
                      <option value="3-Point Battle">3-Point Battle</option>
                      <option value="Grassroots Camp">Grassroots Camp</option>
                      <option value="All-Star Weekend">All-Star Weekend</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Format / Team Type
                    </label>
                    <select
                      value={eventFormData.teamType}
                      onChange={(e) =>
                        setEventFormData({ ...eventFormData, teamType: e.target.value })
                      }
                      className="w-full bg-dball-dark border border-dball-border rounded-xl px-3 py-2 text-sm text-white"
                    >
                      <option value="Team (5v5)">Team (5v5)</option>
                      <option value="Team (3v3)">Team (3v3)</option>
                      <option value="Solo Participant">Solo Participant</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={eventFormData.date}
                      onChange={(e) =>
                        setEventFormData({ ...eventFormData, date: e.target.value })
                      }
                      className="w-full bg-dball-dark border border-dball-border rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      value={eventFormData.time}
                      onChange={(e) =>
                        setEventFormData({ ...eventFormData, time: e.target.value })
                      }
                      className="w-full bg-dball-dark border border-dball-border rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Max Slots
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="100"
                      value={eventFormData.maxParticipants}
                      onChange={(e) =>
                        setEventFormData({
                          ...eventFormData,
                          maxParticipants: parseInt(e.target.value) || 16,
                        })
                      }
                      className="w-full bg-dball-dark border border-dball-border rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Venue *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hindu College Basketball Arena"
                      value={eventFormData.venue}
                      onChange={(e) =>
                        setEventFormData({ ...eventFormData, venue: e.target.value })
                      }
                      className="w-full bg-dball-dark border border-dball-border rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Prize Pool
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹2,50,000 + Trophies"
                      value={eventFormData.prizePool}
                      onChange={(e) =>
                        setEventFormData({ ...eventFormData, prizePool: e.target.value })
                      }
                      className="w-full bg-dball-dark border border-dball-border rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Event Description *
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={eventFormData.description}
                    onChange={(e) =>
                      setEventFormData({ ...eventFormData, description: e.target.value })
                    }
                    className="w-full bg-dball-dark border border-dball-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-dball-red"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Rules (One per line)
                  </label>
                  <textarea
                    rows="3"
                    placeholder="FIBA rules apply.&#10;College ID card mandatory.&#10;Matching jerseys required."
                    value={eventFormData.rules}
                    onChange={(e) =>
                      setEventFormData({ ...eventFormData, rules: e.target.value })
                    }
                    className="w-full bg-dball-dark border border-dball-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-dball-red"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={eventFormData.status}
                      onChange={(e) =>
                        setEventFormData({ ...eventFormData, status: e.target.value })
                      }
                      className="w-full bg-dball-dark border border-dball-border rounded-xl px-3 py-2 text-sm text-white"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Banner Image URL
                    </label>
                    <input
                      type="url"
                      value={eventFormData.bannerImage}
                      onChange={(e) =>
                        setEventFormData({ ...eventFormData, bannerImage: e.target.value })
                      }
                      className="w-full bg-dball-dark border border-dball-border rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-dball-border flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEventModalOpen(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEvent}
                    className="px-6 py-2.5 bg-dball-red hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-red-950 disabled:opacity-50"
                  >
                    {savingEvent ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Tournament'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ROSTER INSPECTION MODAL */}
        {selectedRosterReg && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-dball-card border border-dball-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-start border-b border-dball-border pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-dball-gold">
                    Ticket: {selectedRosterReg.ticketCode}
                  </span>
                  <h3 className="text-xl font-bold text-white font-heading">
                    {selectedRosterReg.teamName} Roster
                  </h3>
                  <p className="text-xs text-gray-400">
                    {selectedRosterReg.collegeName} • Captain: {selectedRosterReg.captainName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRosterReg(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {selectedRosterReg.teamMembers && selectedRosterReg.teamMembers.length > 0 ? (
                  selectedRosterReg.teamMembers.map((m, i) => (
                    <div
                      key={i}
                      className="p-3 bg-dball-surface rounded-xl border border-dball-border flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-dball-card flex items-center justify-center font-bold text-dball-gold font-mono">
                          #{m.jerseyNumber || i + 1}
                        </span>
                        <div>
                          <p className="font-bold text-white">{m.name}</p>
                          <p className="text-[10px] text-gray-400">{m.position || 'Player'}</p>
                        </div>
                      </div>
                      {m.phone && <span className="text-gray-400 font-mono">{m.phone}</span>}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">
                    Solo participant: {selectedRosterReg.captainName}
                  </p>
                )}
              </div>

              {selectedRosterReg.notes && (
                <div className="p-3 bg-dball-surface/50 rounded-xl text-xs text-gray-300 border border-dball-border">
                  <span className="text-gray-400 font-bold block mb-1">Notes / Bio:</span>
                  {selectedRosterReg.notes}
                </div>
              )}

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedRosterReg(null)}
                  className="px-4 py-2 bg-dball-surface border border-dball-border rounded-xl text-xs font-bold text-white hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
