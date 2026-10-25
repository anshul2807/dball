import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Trophy,
  Flame,
  Calendar,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  ChevronRight,
  Activity,
  Heart,
  TrendingUp,
  ShieldCheck,
  Play,
  Zap,
} from 'lucide-react';
import { eventAPI, statsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import RegistrationModal from '../components/RegistrationModal';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);

  // Scroll to hash anchor on navigation
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  // Fetch upcoming events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventAPI.getUpcoming();
        if (res.data.success) {
          setUpcomingEvents(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load upcoming events', err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegisterClick = (event) => {
    if (!user) {
      navigate('/login', { state: { message: 'Please log in to register for upcoming tournaments' } });
      return;
    }
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleRegistrationSuccess = (eventId) => {
    setRegisteredEventIds((prev) => [...prev, eventId]);
  };

  // Timeline data from PPT slide 6
  const journeyTimeline = [
    {
      season: 'Season 1',
      year: '2023',
      venue: 'Delhi University',
      teams: '8 Boys / 6 Girls teams',
      highlights: 'Birth of the League - Massive youth buzz across colleges',
      badge: 'Inception',
    },
    {
      season: 'Season 2',
      year: '2024',
      venue: 'Hindu College',
      teams: '10 Boys / 8 Girls',
      highlights: 'Sponsors joined in, crowd tripled, media spotlight',
      badge: 'Expansion',
    },
    {
      season: 'Season 3',
      year: '2025',
      venue: 'Hindu College',
      teams: 'Expanded Collegiate Teams',
      highlights: 'Pan-university participation & national basketball scouting',
      badge: 'Breakthrough',
    },
    {
      season: 'Season 4',
      year: '2026',
      venue: 'Delhi (Pan-City League)',
      teams: '12+ Colleges',
      highlights: 'New knockout formats, bigger fan zones & broadcast coverage',
      badge: 'Current Era',
      active: true,
    },
    {
      season: 'Season 5',
      year: '2027',
      venue: 'Delhi (Pan-City League)',
      teams: '22+ Colleges',
      highlights: 'Pan-India expansion, city franchises, and OTT integration',
      badge: 'The Future',
    },
  ];

  // Sponsorship packages from PPT slide 15
  const sponsorshipTiers = [
    {
      category: 'Title Partner',
      value: '₹50 Lakhs',
      color: 'border-dball-red bg-red-950/20',
      badgeColor: 'bg-dball-red text-white',
      inclusions: ['Complete Naming Rights', 'Digital & Ground Branding', 'Jersey Crest Placement', 'VIP Fan Zone Activations'],
    },
    {
      category: 'Powered By Partner',
      value: '₹30 Lakhs',
      color: 'border-amber-500/50 bg-amber-950/20',
      badgeColor: 'bg-amber-500 text-black font-bold',
      inclusions: ['Co-brand Visibility', 'Jersey & Media Rights', 'Halftime Show Sponsorship', 'Live Stream Billboards'],
    },
    {
      category: 'Associate Partner',
      value: '₹10 Lakhs',
      color: 'border-emerald-500/50 bg-emerald-950/20',
      badgeColor: 'bg-emerald-500 text-white',
      inclusions: ['Logo Placement on Courts', 'Fan Zone Activation Stalls', 'Arena LED Boards', 'Event Brochure Presence'],
    },
    {
      category: 'Digital Partner',
      value: '₹5 Lakhs',
      color: 'border-blue-500/50 bg-blue-950/20',
      badgeColor: 'bg-blue-500 text-white',
      inclusions: ['Branded Content Collabs', 'Influencer & Creator Shoutouts', 'Social Media Handles', 'Highlight Clips Integration'],
    },
    {
      category: 'Team Ownership',
      value: '₹2 Lakhs',
      color: 'border-purple-500/50 bg-purple-950/20',
      badgeColor: 'bg-purple-500 text-white',
      inclusions: ['Official College Franchise Name', 'Kit & Merch Customization', 'Scouted Talent Roster', 'Dedicated Team Dugout'],
    },
  ];

  return (
    <div className="min-h-screen bg-dball-dark text-slate-100 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-10 pb-20 px-4 sm:px-6 lg:px-8 border-b border-dball-border">
        {/* Dynamic Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 filter grayscale hover:grayscale-0 transition-all duration-1000"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=2000&q=80)',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dball-dark via-dball-dark/85 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dball-green/20 via-transparent to-transparent"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-dball-surface/90 border border-dball-red/40 backdrop-blur-md shadow-lg shadow-red-950/50 animate-bounce">
            <span className="w-2.5 h-2.5 rounded-full bg-dball-red animate-ping"></span>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-white">
              Official Season 4 (2026) Registrations Live
            </span>
          </div>

          {/* Main Title from PPT Slide 1 & 2 */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight font-heading uppercase text-white leading-none">
            D-BALL LEAGUE <span className="text-dball-red drop-shadow-md">2026</span>
          </h1>

          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dball-gold font-heading tracking-wide uppercase">
            Where Passion Meets Power
          </p>

          {/* Slogan from Slide 2 */}
          <div className="max-w-2xl mx-auto pt-2">
            <p className="text-base sm:text-lg text-gray-300 font-medium italic border-l-2 border-r-2 border-dball-red/60 px-4 py-1 inline-block bg-black/40 rounded-lg">
              “Play With Pride. Rise With Purpose.”
            </p>
            <p className="text-sm text-gray-400 mt-2">
              India's fastest-growing collegiate basketball revolution. Redefining campus sports and giving basketball a real home in India.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/events"
              className="w-full sm:w-auto px-8 py-4 bg-dball-red hover:bg-red-700 text-white font-extrabold text-base rounded-2xl transition-all shadow-xl shadow-dball-red/30 flex items-center justify-center gap-2.5 transform hover:-translate-y-1 active:translate-y-0"
            >
              <Zap className="w-5 h-5" />
              Register for Tournaments
            </Link>

            <a
              href="#legacy"
              className="w-full sm:w-auto px-8 py-4 bg-dball-surface hover:bg-white/10 text-gray-200 font-bold text-base rounded-2xl border border-dball-border transition-all flex items-center justify-center gap-2"
            >
              Explore Legacy & Deck <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          {/* Quick Stats Strip (PPT Slide 3) */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-dball-surface/80 border border-dball-border backdrop-blur">
              <span className="text-3xl sm:text-4xl font-black text-white font-heading">3</span>
              <p className="text-xs uppercase font-bold text-dball-gold tracking-wider mt-1">Successful Seasons</p>
            </div>
            <div className="p-4 rounded-2xl bg-dball-surface/80 border border-dball-border backdrop-blur">
              <span className="text-3xl sm:text-4xl font-black text-white font-heading">40+</span>
              <p className="text-xs uppercase font-bold text-emerald-400 tracking-wider mt-1">Collegiate Teams</p>
            </div>
            <div className="p-4 rounded-2xl bg-dball-surface/80 border border-dball-border backdrop-blur">
              <span className="text-3xl sm:text-4xl font-black text-white font-heading">25,000+</span>
              <p className="text-xs uppercase font-bold text-dball-red tracking-wider mt-1">Live Spectators</p>
            </div>
            <div className="p-4 rounded-2xl bg-dball-surface/80 border border-dball-border backdrop-blur">
              <span className="text-3xl sm:text-4xl font-black text-white font-heading">10M+</span>
              <p className="text-xs uppercase font-bold text-blue-400 tracking-wider mt-1">Digital Reach</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. UPCOMING EVENTS SHOWCASE (Dynamic MERN Core) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-dball-red font-bold text-xs uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4" /> Live & Upcoming Tournaments
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-heading uppercase">
              Enter The Court & Compete
            </h2>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              Register your collegiate squad or enter solo skill challenges. Free registration for enrolled student athletes.
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-bold text-dball-gold hover:text-white transition-colors"
          >
            View All Tournaments & Brackets <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-dball-surface animate-pulse"></div>
            ))}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onRegister={handleRegisterClick}
                isRegistered={registeredEventIds.includes(event._id)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-dball-card rounded-2xl border border-dball-border">
            <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No tournaments listed currently</h3>
            <p className="text-sm text-gray-400 mt-1">Check back soon for new season announcements!</p>
          </div>
        )}
      </section>

      {/* 3. THE LEGACY & STORY (PPT Slide 3) */}
      <section id="legacy" className="py-20 bg-dball-surface/40 border-t border-b border-dball-border relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-dball-gold uppercase tracking-widest bg-dball-gold/10 px-3 py-1 rounded-md border border-dball-gold/30">
                The Legacy
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-heading uppercase leading-tight">
                India’s Fastest-Growing Basketball Revolution
              </h2>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                From a small dream in <strong>Delhi University</strong> to one of India’s most anticipated collegiate leagues, D-BALL has become a movement—inspiring young athletes, redefining campus sports, and giving basketball a real home in India.
              </p>
              <div className="p-5 rounded-2xl bg-dball-card border border-dball-border">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-dball-red font-heading">
                  “Play With Pride. Because this is where legends begin.”
                </h4>
                <p className="text-xs text-gray-400">
                  D-BALL provides the national-level collegiate stage where talent is scouted, celebrated, and elevated to professional leagues.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-dball-card to-dball-dark border border-dball-border hover:border-dball-red/40 transition-colors">
                <Trophy className="w-10 h-10 text-dball-red mb-3" />
                <h3 className="text-2xl font-black text-white font-heading">3 SEASONS</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Consecutive successful editions with multiplying participation and viewership.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-dball-card to-dball-dark border border-dball-border hover:border-emerald-500/40 transition-colors">
                <Users className="w-10 h-10 text-emerald-400 mb-3" />
                <h3 className="text-2xl font-black text-white font-heading">40+ TEAMS</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Elite collegiate squads competing in men's and women's brackets.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-dball-card to-dball-dark border border-dball-border hover:border-dball-gold/40 transition-colors">
                <Flame className="w-10 h-10 text-dball-gold mb-3" />
                <h3 className="text-2xl font-black text-white font-heading">25,000+</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Passionate court-side live spectators filling university arenas.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-dball-card to-dball-dark border border-dball-border hover:border-blue-500/40 transition-colors">
                <TrendingUp className="w-10 h-10 text-blue-400 mb-3" />
                <h3 className="text-2xl font-black text-white font-heading">10M+ REACH</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Social media impressions, highlight reels, and digital engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE JOURNEY SO FAR (PPT Slide 6 Interactive Timeline) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-dball-red uppercase tracking-widest bg-dball-red/10 px-3 py-1 rounded-md border border-dball-red/30">
            Timeline of Growth
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-heading uppercase mt-3">
            The Journey So Far
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Tracing our journey from an intra-university tournament to a pan-city collegiate basketball power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {journeyTimeline.map((item, idx) => (
            <div
              key={item.season}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                item.active
                  ? 'bg-gradient-to-b from-dball-surface to-dball-card border-dball-red shadow-xl shadow-red-950/40 ring-1 ring-dball-red'
                  : 'bg-dball-card border-dball-border hover:border-gray-600'
              }`}
            >
              {item.active && (
                <div className="absolute top-0 right-0 bg-dball-red text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl">
                  LIVE
                </div>
              )}
              <div>
                <span className="text-xs font-bold text-dball-gold uppercase">{item.badge}</span>
                <h3 className="text-2xl font-black text-white font-heading mt-1">
                  {item.season} <span className="text-sm font-normal text-gray-400 font-sans">({item.year})</span>
                </h3>
                <div className="mt-3 text-xs space-y-1.5">
                  <div className="text-gray-300 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-dball-red"></span>
                    {item.venue}
                  </div>
                  <div className="text-gray-400">
                    <strong>Scale:</strong> {item.teams}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-dball-border/60 text-xs text-gray-300 leading-snug">
                {item.highlights}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. THE VISION & CORE VALUES (PPT Slide 4) */}
      <section className="py-20 bg-dball-surface/40 border-t border-dball-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/30">
                Our Purpose
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-heading uppercase leading-tight">
                The Vision
              </h2>
              <p className="text-base text-gray-300 leading-relaxed">
                “To build India’s first professional basketball ecosystem that empowers players, excites fans, and offers brands a vibrant platform to connect with GenZ and youth audiences.”
              </p>
              <div className="p-4 bg-dball-card rounded-2xl border border-dball-border">
                <p className="text-xs text-gray-400 font-semibold uppercase">The Opportunity (Slide 5)</p>
                <ul className="mt-2 space-y-1.5 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-dball-gold">🏀</span> Sports industry growing at 10% annually in India
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-dball-gold">🏀</span> 20M+ urban youth play or watch basketball casually
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-dball-gold">🏀</span> Gen Z prefers fast-paced, high-flying global sports
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-dball-gold">🏀</span> First scalable national collegiate basketball property
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-dball-card border border-dball-border flex flex-col justify-between hover:border-dball-red/50 transition-colors">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-dball-red/20 text-dball-red flex items-center justify-center text-xl mb-4">
                    🛡️
                  </div>
                  <h4 className="text-lg font-bold text-white font-heading uppercase">
                    Discipline & Sportsmanship
                  </h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Instilling relentless work ethic, athletic integrity, and mutual respect on and off the court.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-dball-card border border-dball-border flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl mb-4">
                    🤝
                  </div>
                  <h4 className="text-lg font-bold text-white font-heading uppercase">
                    Teamwork & Integrity
                  </h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Uniting diverse college rosters into unified squads with unyielding commitment to fair play.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-dball-card border border-dball-border flex flex-col justify-between hover:border-dball-gold/50 transition-colors">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-dball-gold/20 text-dball-gold flex items-center justify-center text-xl mb-4">
                    ⚡
                  </div>
                  <h4 className="text-lg font-bold text-white font-heading uppercase">
                    Energy & Inclusivity
                  </h4>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    High tempo hip-hop beats, electrifying dunk contests, fan entertainment, and equal opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHAT'S NEW IN D-BALL (PPT Slide 7) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-dball-gold uppercase tracking-widest bg-dball-gold/10 px-3 py-1 rounded-md border border-dball-gold/30">
            Evolution
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-heading uppercase mt-3">
            D-BALL 2026 & Beyond — What's New
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Taking the collegiate basketball experience to international production and fan standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Multi-College Knockout + All-Star Weekend',
              desc: 'Expanded bracket featuring top 12+ colleges, culminating in a marquee All-Star showcase.',
              icon: '🏆',
            },
            {
              title: 'Live Commentary & High-Def Broadcasts',
              desc: 'Digital streaming across YouTube and Instagram with pro play-by-play commentators.',
              icon: '🎙️',
            },
            {
              title: 'Fan Zones & Live Music Acts',
              desc: 'A vibrant fusion of sport, music, dance battles, and sneakerhead street culture.',
              icon: '🎵',
            },
            {
              title: 'Skill Challenges & Dunk Battles',
              desc: 'High-flying slam dunk showcase and precision 3-point shootout contests with cash prizes.',
              icon: '🎯',
            },
            {
              title: 'UGC & Creator Zone',
              desc: 'Student vloggers, fitness creators, and sports influencers capturing courtside moments.',
              icon: '📱',
            },
            {
              title: 'Scholarships & Player Awards',
              desc: 'Recognizing elite collegiate talent with equipment gear kits, awards, and scout visibility.',
              icon: '🏅',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-dball-card border border-dball-border hover:border-dball-red/40 transition-all flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-dball-surface border border-dball-border flex items-center justify-center text-2xl shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-heading mb-1">{item.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. BASKETBALL FOR ALL - CSR (PPT Slide 14) */}
      <section id="grassroots" className="py-20 bg-gradient-to-r from-red-950/40 via-dball-dark to-red-950/30 border-t border-b border-dball-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-red-400" /> Basketball For All Movement
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white font-heading uppercase tracking-tight">
            Basketball For All
          </h2>

          <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-dball-card/90 rounded-2xl border-2 border-dashed border-red-500/50">
            <p className="text-lg sm:text-2xl font-black text-white uppercase tracking-wide font-heading">
              WE ARE PROVIDING FREE TRAINING SESSIONS FOR UNDERPRIVILEGED KIDS
            </p>
            <p className="text-sm text-gray-300 mt-2">
              Sports empowers lives. Our founders and international coaches conduct regular free clinics, providing training jerseys, basketballs, and coaching for youth across Delhi-NCR.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FOR SPONSORS & PARTNERSHIPS (PPT Slide 8 & 15) */}
      <section id="sponsors" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/30">
            Collaborations
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-heading uppercase mt-3">
            Partnership Opportunities
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Associate your brand with youth, high-energy athleticism, and India’s premier collegiate basketball league.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {sponsorshipTiers.map((tier) => (
            <div
              key={tier.category}
              className={`rounded-2xl p-6 border ${tier.color} flex flex-col justify-between hover:scale-105 transition-all shadow-lg`}
            >
              <div>
                <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-lg ${tier.badgeColor}`}>
                  {tier.category}
                </span>
                <div className="mt-4 mb-4">
                  <span className="text-xs text-gray-400 block font-medium">Indicative Value</span>
                  <span className="text-2xl font-black text-white font-heading">{tier.value}</span>
                </div>
                <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-gray-300">
                  {tier.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <a
                  href="#contact"
                  className="block text-center w-full py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Partner With Us
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. TESTIMONIALS (PPT Slide 16) */}
      <section className="py-20 bg-dball-surface/40 border-t border-dball-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-dball-gold uppercase tracking-widest bg-dball-gold/10 px-3 py-1 rounded-md border border-dball-gold/30">
              Community Voices
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-heading uppercase mt-3">
              Testimonials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-dball-card border border-dball-border relative">
              <div className="text-dball-gold text-sm mb-3">★★★★★</div>
              <p className="text-base font-bold text-white italic">
                “A game changer for college sports in India.”
              </p>
              <div className="mt-6 pt-4 border-t border-dball-border">
                <p className="text-xs font-bold uppercase tracking-wider text-dball-red">
                  Sports Federation Member
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-dball-card border border-dball-border relative">
              <div className="text-dball-gold text-sm mb-3">★★★★★</div>
              <p className="text-base font-bold text-white italic">
                “The energy and audience engagement were unmatched.”
              </p>
              <div className="mt-6 pt-4 border-t border-dball-border">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Sponsor, Season 3
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-dball-card border border-dball-border relative">
              <div className="text-dball-gold text-sm mb-3">★★★★★</div>
              <p className="text-base font-bold text-white italic">
                “We discovered raw talent that deserves the national stage.”
              </p>
              <div className="mt-6 pt-4 border-t border-dball-border">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Coach, Season 2
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. REGISTRATION MODAL */}
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

export default Home;
