import Link from 'next/link';
import { Film, Facebook, Youtube, Twitter, Instagram, AlertTriangle } from 'lucide-react';

const legalLinks = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'DMCA Policy', href: '/dmca' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
  { label: 'Age Disclaimer', href: '/age-disclaimer' },
];

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: Twitter, label: 'Twitter / X', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
];

const browseLinks = [
  { label: 'Movies', href: '/movies' },
  { label: 'Series', href: '/series' },
  { label: 'Games', href: '/games' },
  { label: 'Erotic', href: '/genre/erotic' },
  { label: 'Thriller', href: '/genre/thriller' },
  { label: 'Horror', href: '/genre/horror' },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 mt-auto" role="contentinfo">
      {/* Age warning bar */}
      <div className="bg-red-950/60 border-b border-red-900/50 px-4 py-2.5">
        <div className="max-w-screen-xl mx-auto flex items-center justify-center gap-2">
          <AlertTriangle size={13} className="text-red-400 shrink-0" aria-hidden="true" />
          <p className="text-red-300 text-xs text-center">
            This site contains adult content (18+). Minors are strictly prohibited from accessing this website.{' '}
            <Link href="/age-disclaimer" className="underline hover:text-red-200 transition-colors">
              Learn more
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3 group" aria-label="Filmmart home">
              <div className="bg-yellow-400 rounded p-1">
                <Film size={18} className="text-black" aria-hidden="true" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">Filmmart</span>
            </Link>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Discover and explore films, TV series, and games. Curated collections of adult cinema and
              genre content for discerning viewers.
            </p>
            <p className="text-zinc-600 text-xs mt-3 font-medium">
              🔞 Adults Only (18+)
            </p>
          </div>

          {/* Browse */}
          <div>
            <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-3">Browse</h3>
            <ul className="space-y-2">
              {browseLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-zinc-500 hover:text-white text-xs transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-3">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-zinc-500 hover:text-white text-xs transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-3">Follow Us</h3>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-zinc-600 hover:text-white transition-colors"
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} Filmmart. All rights reserved.
          </p>
          <p className="text-zinc-700 text-xs text-center sm:text-right">
            For adults 18+ only. All content is for informational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
