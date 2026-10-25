import React from 'react';
import { Calendar, MapPin, Trophy, Users, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, onRegister, isRegistered }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const percentFull = Math.min(
    100,
    Math.round(((event.registeredCount || 0) / (event.maxParticipants || 16)) * 100)
  );

  const spotsRemaining = Math.max(0, (event.maxParticipants || 16) - (event.registeredCount || 0));

  return (
    <div className="group bg-dball-card rounded-2xl border border-dball-border hover:border-dball-red/50 transition-all duration-300 hover:shadow-xl hover:shadow-dball-red/10 flex flex-col overflow-hidden relative">
      {/* Banner & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-dball-surface">
        <img
          src={event.bannerImage || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dball-card via-black/40 to-transparent"></div>

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-dball-dark/80 backdrop-blur-md text-dball-gold border border-dball-gold/30">
            {event.category}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
              event.status === 'upcoming'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : event.status === 'ongoing'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}
          >
            {event.status}
          </span>
        </div>

        {/* Date Overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-semibold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
          <Calendar className="w-3.5 h-3.5 text-dball-red" />
          <span>{formattedDate}</span>
          <span className="text-gray-400">•</span>
          <Clock className="w-3.5 h-3.5 text-dball-gold" />
          <span>{event.time}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 mb-1 font-heading">
          {event.title}
        </h3>
        {event.subtitle && (
          <p className="text-xs font-medium text-dball-gold/90 line-clamp-1 mb-2">
            {event.subtitle}
          </p>
        )}
        <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed flex-1">
          {event.description}
        </p>

        {/* Event Key Specs */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mb-4 p-3 bg-dball-surface/60 rounded-xl border border-dball-border/60">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-dball-red shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{event.teamType || 'Team (5v5)'}</span>
          </div>
          <div className="col-span-2 flex items-center gap-2 pt-1 border-t border-dball-border/40 text-dball-gold font-medium">
            <Trophy className="w-4 h-4 shrink-0" />
            <span className="truncate">{event.prizePool || 'Trophies & Medals'}</span>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-gray-400">Registered Slots</span>
            <span className={spotsRemaining <= 2 ? 'text-red-400 font-bold' : 'text-gray-300'}>
              {event.registeredCount || 0} / {event.maxParticipants || 16} slots ({spotsRemaining} left)
            </span>
          </div>
          <div className="w-full h-1.5 bg-dball-surface rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                percentFull >= 80 ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${percentFull}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-dball-border/60">
          <Link
            to={`/events/${event._id}`}
            className="flex-1 py-2.5 px-3 text-center text-xs font-bold text-gray-300 hover:text-white bg-dball-surface hover:bg-white/10 rounded-xl border border-dball-border transition-colors"
          >
            View Details
          </Link>

          {isRegistered ? (
            <span className="flex-1 py-2.5 px-3 text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Registered
            </span>
          ) : spotsRemaining <= 0 ? (
            <button
              disabled
              className="flex-1 py-2.5 px-3 text-center text-xs font-bold text-gray-500 bg-gray-800/50 rounded-xl cursor-not-allowed"
            >
              Slots Full
            </button>
          ) : (
            <button
              onClick={() => onRegister(event)}
              className="flex-1 py-2.5 px-3 text-center text-xs font-bold text-white bg-dball-red hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-950 flex items-center justify-center gap-1.5 transform active:scale-95"
            >
              Register Now <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
