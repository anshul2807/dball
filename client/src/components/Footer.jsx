import React from 'react';
import { Mail, Phone, MapPin, Award, Users, Heart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact" className="bg-dball-darker border-t border-dball-border relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-dball-green/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-dball-red/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-dball-red rounded-xl flex items-center justify-center text-xl shadow-lg shadow-dball-red/30">
                🏀
              </div>
              <div>
                <span className="text-xl font-extrabold text-white font-heading tracking-wider">
                  D-BALL LEAGUE <span className="text-dball-red">2026</span>
                </span>
                <p className="text-[11px] text-dball-gold font-semibold uppercase tracking-wider">
                  Where Passion Meets Power
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              India's fastest-growing collegiate basketball revolution. From a small dream in Delhi University to one of India's most anticipated collegiate leagues.
            </p>
            <div className="p-3.5 rounded-xl bg-dball-card border border-dball-border">
              <p className="text-xs text-gray-400 font-medium">Core League Motto</p>
              <p className="text-sm font-bold text-white italic">
                “Play With Pride. Rise With Purpose.”
              </p>
            </div>
          </div>

          {/* Contact Details from PPT Slide 20 & Prompt */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-dball-red"></span>
              Official Contacts
            </h4>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-dball-surface border border-dball-border hover:border-dball-red/40 transition-colors">
                <p className="text-xs text-gray-400 font-medium mb-1">Direct League Phone & WhatsApp</p>
                <div className="space-y-1">
                  <a
                    href="tel:9810001399"
                    className="flex items-center gap-2 text-white font-bold hover:text-dball-red transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-dball-red" />
                    Rishab Sarvaria: <span className="font-mono">9810001399</span>
                  </a>
                  <a
                    href="tel:9999192193"
                    className="flex items-center gap-2 text-white font-bold hover:text-dball-red transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-dball-gold" />
                    Shamshul: <span className="font-mono">9999192193</span>
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href="mailto:schooldball@gmail.com"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-dball-red" />
                  <span>schooldball@gmail.com</span>
                </a>
                <a
                  href="mailto:dballleague@gmail.com"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-dball-gold" />
                  <span>dballleague@gmail.com</span>
                </a>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Delhi University, New Delhi, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* The Team Behind D-Ball (PPT Slide 17) */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-dball-gold"></span>
              The Team Behind D-BALL
            </h4>
            
            <div className="p-3 bg-dball-surface/70 border border-dball-border rounded-xl">
              <span className="text-[10px] text-dball-gold font-bold uppercase tracking-wider block">Proprietor</span>
              <p className="text-sm font-bold text-white">Sunita Sarvaria</p>
              <p className="text-xs text-gray-400">Visionary Leader & Sports Promoter</p>
            </div>

            <div className="p-3 bg-dball-surface/70 border border-dball-border rounded-xl">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Founders (International DU Players)</span>
              <p className="text-xs text-gray-300 leading-snug mt-1 font-medium">
                Nitin Verma • Sachin Sharma • Shamshul • Rishab Sarvaria • Pravin Dovan
              </p>
            </div>
          </div>

          {/* Quick Links & Movement */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Join The Movement
            </h4>
            <p className="text-xs text-gray-400">
              Partner. Play. Power Up. Let's shape the future of Indian basketball together.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-dball-card border border-dball-border rounded-md font-mono text-gray-300">
                #PLAYWITHPRIDE
              </span>
              <span className="px-2.5 py-1 bg-dball-card border border-dball-border rounded-md font-mono text-gray-300">
                #DBALL2026
              </span>
              <span className="px-2.5 py-1 bg-dball-card border border-dball-border rounded-md font-mono text-gray-300">
                #BASKETBALLFORALL
              </span>
            </div>

            <div className="pt-2">
              <Link
                to="/events"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold text-white bg-dball-red hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-900/30"
              >
                Register for Upcoming Events <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-dball-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} D-BALL LEAGUE. All Rights Reserved. Delhi University Collegiate Basketball Movement.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors">Instagram</span>
            <span className="hover:text-white transition-colors">YouTube</span>
            <span className="hover:text-white transition-colors">LinkedIn</span>
            <span className="hover:text-white transition-colors">PR & Press</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
