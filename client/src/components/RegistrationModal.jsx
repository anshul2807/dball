import React, { useState } from 'react';
import { X, Trophy, Calendar, MapPin, Users, Check, AlertCircle, Plus, Trash2, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';
import { registrationAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const RegistrationModal = ({ event, isOpen, onClose, user, onSuccess }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    teamName: '',
    captainName: user?.name || '',
    collegeName: user?.college || '',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    notes: '',
  });

  const [teamMembers, setTeamMembers] = useState([
    { name: user?.name || '', jerseyNumber: '7', position: 'Point Guard', phone: user?.phone || '' },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  if (!isOpen || !event) return null;

  const isTeamEvent = event.teamType?.includes('Team');

  const handleMemberChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const addMember = () => {
    if (teamMembers.length >= (event.maxTeamMembers || 12)) return;
    setTeamMembers([
      ...teamMembers,
      { name: '', jerseyNumber: '', position: 'Guard', phone: '' },
    ]);
  };

  const removeMember = (index) => {
    if (teamMembers.length <= 1) return;
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.captainName || !formData.collegeName || !formData.contactPhone) {
      setError('Please fill in all required contact and college details');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        eventId: event._id,
        teamName: formData.teamName || `${formData.captainName}'s Team`,
        captainName: formData.captainName,
        collegeName: formData.collegeName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        teamMembers: isTeamEvent ? teamMembers : [],
        notes: formData.notes,
      };

      const res = await registrationAPI.register(payload);
      if (res.data.success) {
        setSuccessData(res.data.data);
        if (onSuccess) onSuccess(event._id);

        // Fire celebration confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration could not be completed. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-dball-card border border-dball-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-dball-surface/95 backdrop-blur border-b border-dball-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <span className="text-xs font-bold text-dball-gold uppercase tracking-wider">
              {event.category}
            </span>
            <h2 className="text-xl font-bold text-white font-heading">
              {successData ? 'Registration Confirmed!' : `Register for ${event.title}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-dball-card text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {successData ? (
            /* SUCCESS STATE */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white font-heading">
                  You're Officially Registered!
                </h3>
                <p className="text-sm text-gray-300 mt-1">
                  Get ready to bring the energy to D-BALL 2026. Your digital registration pass is active.
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="max-w-md mx-auto bg-gradient-to-br from-dball-surface to-dball-card border-2 border-dball-gold/50 rounded-2xl p-6 text-left relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-dball-gold/10 rounded-full blur-xl pointer-events-none"></div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-dball-red px-2 py-0.5 bg-dball-red/20 rounded">
                      Official E-Pass
                    </span>
                    <h4 className="text-lg font-bold text-white font-heading mt-1">
                      {event.title}
                    </h4>
                  </div>
                  <Ticket className="w-8 h-8 text-dball-gold" />
                </div>

                <div className="space-y-2 text-xs text-gray-300 border-t border-b border-dball-border py-3 my-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Team / Participant:</span>
                    <span className="font-bold text-white">{successData.teamName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Captain / Player:</span>
                    <span className="font-semibold text-white">{successData.captainName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">College:</span>
                    <span className="font-semibold text-white">{successData.collegeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Venue:</span>
                    <span className="font-semibold text-emerald-400">{event.venue}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-[10px] text-gray-400">TICKET PASS CODE</p>
                    <p className="text-base font-mono font-extrabold text-dball-gold tracking-widest">
                      {successData.ticketCode}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white p-1 rounded-lg">
                    {/* QR Code Placeholder Pattern */}
                    <div className="w-full h-full bg-black flex items-center justify-center text-[8px] font-mono text-white text-center font-bold">
                      QR PASS
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/dashboard');
                  }}
                  className="px-6 py-3 bg-dball-red hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-900/30"
                >
                  View in My Passes
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-dball-surface hover:bg-white/10 text-gray-300 font-bold rounded-xl text-sm border border-dball-border transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Event Quick Info Banner */}
              <div className="p-4 bg-dball-surface rounded-xl border border-dball-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-dball-red shrink-0" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-dball-gold shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{event.teamType || 'Team (5v5)'}</span>
                </div>
              </div>

              {error && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2.5 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isTeamEvent && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Team / Squad Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DU Titans, Hindu Hawks, etc."
                      value={formData.teamName}
                      onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                      className="w-full bg-dball-dark border border-dball-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dball-red transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Captain / Lead Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.captainName}
                    onChange={(e) => setFormData({ ...formData, captainName: e.target.value })}
                    className="w-full bg-dball-dark border border-dball-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dball-red transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    College / Institution *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hindu College, St. Stephen's"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className="w-full bg-dball-dark border border-dball-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dball-red transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Contact Phone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9810001399"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full bg-dball-dark border border-dball-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dball-red transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full bg-dball-dark border border-dball-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-dball-red transition-colors"
                  />
                </div>
              </div>

              {/* Roster Section for Team Events */}
              {isTeamEvent && (
                <div className="pt-2 border-t border-dball-border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        Squad Roster ({teamMembers.length} Players)
                      </h4>
                      <p className="text-xs text-gray-400">
                        Add starting five and bench substitutes.
                      </p>
                    </div>
                    {teamMembers.length < (event.maxTeamMembers || 12) && (
                      <button
                        type="button"
                        onClick={addMember}
                        className="px-3 py-1.5 bg-dball-surface hover:bg-white/10 text-xs font-bold text-emerald-400 border border-emerald-500/30 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Player
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {teamMembers.map((member, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-2 items-center bg-dball-surface/60 p-2.5 rounded-xl border border-dball-border/60 text-xs"
                      >
                        <span className="col-span-1 text-center font-bold text-gray-400">
                          #{index + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="Player Name"
                          required
                          value={member.name}
                          onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                          className="col-span-5 bg-dball-dark border border-dball-border rounded-lg px-2.5 py-1.5 text-white"
                        />
                        <input
                          type="text"
                          placeholder="Jersey #"
                          value={member.jerseyNumber}
                          onChange={(e) => handleMemberChange(index, 'jerseyNumber', e.target.value)}
                          className="col-span-2 bg-dball-dark border border-dball-border rounded-lg px-2 py-1.5 text-white text-center"
                        />
                        <select
                          value={member.position}
                          onChange={(e) => handleMemberChange(index, 'position', e.target.value)}
                          className="col-span-3 bg-dball-dark border border-dball-border rounded-lg px-2 py-1.5 text-white"
                        >
                          <option value="Point Guard">Point Guard</option>
                          <option value="Shooting Guard">Shooting Guard</option>
                          <option value="Small Forward">Small Forward</option>
                          <option value="Power Forward">Power Forward</option>
                          <option value="Center">Center</option>
                        </select>
                        <div className="col-span-1 flex justify-center">
                          {teamMembers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMember(index)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Team Notes / Bio (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Past tournament achievements, team accomplishments..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-dball-dark border border-dball-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-dball-red transition-colors"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-dball-red hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-900/40 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Confirming Registration...' : 'Complete Registration (Free)'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
