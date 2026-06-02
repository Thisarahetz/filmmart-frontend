import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Age Disclaimer | Filmmart',
  description: 'Age Disclaimer for Filmmart. This site is intended for adults 18 and older.',
  alternates: { canonical: '/age-disclaimer' },
};

export default function AgeDisclaimerPage() {
  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle size={28} className="text-yellow-400 shrink-0" aria-hidden="true" />
          <h1 className="text-yellow-400 text-3xl font-bold">Age Disclaimer</h1>
        </div>
        <p className="text-zinc-500 text-sm mb-8">Last updated: June 1, 2026</p>

        <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-5 mb-8">
          <p className="text-red-200 text-sm font-semibold">
            IMPORTANT NOTICE: This website contains content intended for adults only (18+).
          </p>
          <p className="text-red-300/80 text-xs mt-2">
            If you are under 18 years of age, or the legal age of majority in your jurisdiction,
            you are prohibited from accessing this website. Please exit immediately.
          </p>
        </div>

        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Adult Content Notice</h2>
            <p>
              Filmmart is an adult-oriented film discovery and information platform. The website contains
              references to, descriptions of, and images from films and content that may include:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Explicit sexual content and nudity</li>
              <li>Graphic violence and disturbing imagery</li>
              <li>Strong language and mature themes</li>
              <li>Content that may be offensive or unsuitable for sensitive viewers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Age Verification</h2>
            <p>
              By accessing this website, you confirm and declare that:
            </p>
            <ol className="list-decimal pl-5 space-y-2 mt-2">
              <li>You are at least 18 years of age, or the legal age of majority in your jurisdiction, whichever is greater.</li>
              <li>You are not accessing the website from a jurisdiction where adult content is prohibited.</li>
              <li>You understand the nature of the content on this website and voluntarily choose to access it.</li>
              <li>You will not allow minors to access this website using your device or account.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Parental Controls</h2>
            <p>
              We strongly encourage parents and guardians to use parental control software to prevent minors
              from accessing adult content online. The following services can help:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-zinc-400">
              <li>Net Nanny</li>
              <li>Qustodio</li>
              <li>Circle Parental Controls</li>
              <li>Built-in device parental controls (iOS Screen Time, Android Family Link)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Responsibility</h2>
            <p>
              Filmmart takes reasonable steps to prevent access by minors, including the age verification
              gate displayed on each visit. However, it remains the responsibility of parents and guardians
              to supervise their children&apos;s internet usage and implement appropriate parental controls.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Jurisdiction</h2>
            <p>
              Access to this website may be restricted by local laws. It is your responsibility to ensure
              that your access to this website complies with the laws of your country or jurisdiction.
              If it is illegal for you to view this content in your location, exit the website immediately.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Content Ratings</h2>
            <p>
              Movie and content ratings (such as R, NC-17, 18+) displayed on this website are provided for
              informational purposes. Ratings may vary by country and region. The presence of a content rating
              does not imply endorsement of any particular content.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-wrap gap-4 text-xs text-zinc-500">
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
          <Link href="/dmca" className="hover:text-zinc-400 transition-colors">DMCA Policy</Link>
          <Link href="/cookie-policy" className="hover:text-zinc-400 transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </div>
  );
}
