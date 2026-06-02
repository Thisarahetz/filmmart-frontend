import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Filmmart',
  description: 'Privacy Policy for Filmmart. Learn how we collect and use your data.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <h1 className="text-yellow-400 text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-zinc-500 text-sm mb-8">Last updated: June 1, 2026</p>

        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">1. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-zinc-200">Usage data:</strong> pages visited, time on site, referring URLs, browser type, and IP address</li>
              <li><strong className="text-zinc-200">Cookies:</strong> age verification status, cookie consent preferences, session data</li>
              <li><strong className="text-zinc-200">Account data:</strong> if you register, your username and email address</li>
              <li><strong className="text-zinc-200">Search queries:</strong> terms entered in our search box for improving recommendations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Operate and improve the Site</li>
              <li>Verify age compliance and manage legal obligations</li>
              <li>Personalise content recommendations</li>
              <li>Analyse traffic and usage patterns (via Google Analytics)</li>
              <li>Display relevant advertising (via Google AdSense)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">3. Cookies</h2>
            <p>
              We use cookies for age verification, session management, and analytics. You can manage cookie
              preferences through your browser settings. See our{' '}
              <Link href="/cookie-policy" className="text-yellow-400 underline hover:text-yellow-300">
                Cookie Policy
              </Link>{' '}
              for details.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">4. Third-Party Services</h2>
            <p>We use third-party services that may collect data independently:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-zinc-200">Google Analytics:</strong> website traffic analysis</li>
              <li><strong className="text-zinc-200">Google AdSense:</strong> personalised advertising</li>
              <li><strong className="text-zinc-200">YouTube:</strong> embedded trailers (subject to YouTube&apos;s privacy policy)</li>
            </ul>
            <p className="mt-2">These third parties have their own privacy policies independent of ours.</p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">5. Data Retention</h2>
            <p>
              We retain personal data only as long as necessary to fulfil the purposes outlined in this policy
              or as required by law. Anonymous analytics data may be retained indefinitely.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">6. Your Rights (GDPR)</h2>
            <p>If you are in the European Economic Area, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to or restrict certain processing</li>
              <li>Data portability</li>
              <li>Lodge a complaint with your local data protection authority</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">7. Children&apos;s Privacy</h2>
            <p>
              This Site is strictly for adults 18 and older. We do not knowingly collect personal information
              from individuals under 18. If we learn that we have inadvertently collected such information,
              we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will post the updated policy on this page
              with a revised date. Your continued use of the Site constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-wrap gap-4 text-xs text-zinc-500">
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms of Service</Link>
          <Link href="/dmca" className="hover:text-zinc-400 transition-colors">DMCA Policy</Link>
          <Link href="/cookie-policy" className="hover:text-zinc-400 transition-colors">Cookie Policy</Link>
          <Link href="/age-disclaimer" className="hover:text-zinc-400 transition-colors">Age Disclaimer</Link>
        </div>
      </div>
    </div>
  );
}
