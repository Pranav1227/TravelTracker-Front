import { Link } from 'react-router-dom';
import {
  Mail,
  Globe,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-950 text-white shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 text-white"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </div>
              <span className="text-base font-bold text-zinc-900 tracking-tight">
                TravelTracker
              </span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
              Track your world adventures, collect achievements, and share hidden gems.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/explore', label: 'Explore Places' },
                { to: '/badges', label: 'Badges & Level' },
                { to: '/hidden-gems', label: 'Hidden Gems' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Destinations
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['Countries', 'States', 'Cities', '7 Wonders', 'Historic Forts'].map(
                (cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-50 text-zinc-600 border border-zinc-200"
                  >
                    {cat}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Get exploration inspiration and weekly updates in your inbox.
            </p>
            <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter email address"
                className="input-field !py-2 !pr-10 text-xs rounded-lg"
              />
              <button
                type="submit"
                className="absolute right-2 p-1.5 rounded-md bg-zinc-900 text-white hover:bg-zinc-700 transition-colors duration-200"
              >
                <Mail className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} TravelTracker. Built for adventurers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
