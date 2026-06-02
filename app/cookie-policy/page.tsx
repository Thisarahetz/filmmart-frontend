import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy | Filmmart',
  description: 'Cookie Policy for Filmmart. Learn how we use cookies on our website.',
  alternates: { canonical: '/cookie-policy' },
};

export default function CookiePolicyPage() {
  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <h1 className="text-yellow-400 text-3xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-zinc-500 text-sm mb-8">Last updated: June 1, 2026</p>

        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They help websites
              remember your preferences and improve your experience. Cookies cannot harm your device and do not
              contain any personally identifiable information unless you have explicitly provided it.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Cookies We Use</h2>
            <div className="space-y-4 mt-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white font-medium text-sm">age_verified</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Essential</p>
                  </div>
                  <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded shrink-0">Required</span>
                </div>
                <p className="text-zinc-400 text-xs mt-2">
                  Stores your age verification confirmation. Expires after 24 hours. Required to access the Site.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white font-medium text-sm">cookie_consent</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Essential</p>
                  </div>
                  <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded shrink-0">Required</span>
                </div>
                <p className="text-zinc-400 text-xs mt-2">
                  Stores your cookie consent preference (accepted/declined). Expires after 365 days.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white font-medium text-sm">Google Analytics (_ga, _gid)</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Analytics</p>
                  </div>
                  <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded shrink-0">Optional</span>
                </div>
                <p className="text-zinc-400 text-xs mt-2">
                  Used to distinguish users and track website usage statistics. Only set if you accept cookies.
                  Expires after 2 years.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white font-medium text-sm">Google AdSense</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Advertising</p>
                  </div>
                  <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded shrink-0">Optional</span>
                </div>
                <p className="text-zinc-400 text-xs mt-2">
                  Used to serve personalised advertisements. Set by Google. Refer to Google&apos;s privacy policy
                  for expiry details.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white font-medium text-sm">authToken</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Functional</p>
                  </div>
                  <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded shrink-0">Required (if logged in)</span>
                </div>
                <p className="text-zinc-400 text-xs mt-2">
                  Used to maintain your login session if you have an account. Expires with your session.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Managing Cookies</h2>
            <p>
              You can manage or delete cookies through your browser settings. Please note that disabling
              certain cookies may affect the functionality of the Site, including the age verification gate.
            </p>
            <p className="mt-2">
              Most browsers allow you to view, delete, or block cookies. For instructions, visit:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-zinc-400">
              <li>Chrome: Settings → Privacy and security → Cookies</li>
              <li>Firefox: Settings → Privacy &amp; Security → Cookies and Site Data</li>
              <li>Safari: Preferences → Privacy → Manage Website Data</li>
              <li>Edge: Settings → Cookies and site permissions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Third-Party Cookies</h2>
            <p>
              Some cookies are placed by third-party services (Google Analytics, Google AdSense, YouTube).
              These are governed by the respective third parties&apos; privacy policies. We have no control over
              these cookies.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">GDPR Compliance</h2>
            <p>
              For users in the European Economic Area, we request your consent before placing non-essential
              cookies. You can withdraw consent at any time by clearing your cookies or adjusting browser settings.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-wrap gap-4 text-xs text-zinc-500">
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
          <Link href="/dmca" className="hover:text-zinc-400 transition-colors">DMCA Policy</Link>
          <Link href="/age-disclaimer" className="hover:text-zinc-400 transition-colors">Age Disclaimer</Link>
        </div>
      </div>
    </div>
  );
}
