import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'DMCA Policy | Filmmart',
  description: 'DMCA Policy for Filmmart. Report copyright infringement.',
  alternates: { canonical: '/dmca' },
};

export default function DmcaPage() {
  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <h1 className="text-yellow-400 text-3xl font-bold mb-2">DMCA Policy</h1>
        <p className="text-zinc-500 text-sm mb-8">Last updated: June 1, 2026</p>

        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Overview</h2>
            <p>
              Filmmart respects intellectual property rights and complies with the Digital Millennium
              Copyright Act (DMCA). We take copyright infringement seriously and will respond promptly
              to valid DMCA notices.
            </p>
            <p className="mt-2">
              Filmmart is an informational and discovery platform. We do not host, stream, upload, or
              distribute any video content. All movie and series listings are for editorial reference only.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Filing a DMCA Takedown Notice</h2>
            <p>
              If you believe that content on our Site infringes your copyright, please provide a written
              notice containing the following:
            </p>
            <ol className="list-decimal pl-5 space-y-2 mt-2">
              <li>
                <strong className="text-zinc-200">Identification of the copyrighted work</strong> — a description or
                URL of the original copyrighted material.
              </li>
              <li>
                <strong className="text-zinc-200">Identification of the infringing material</strong> — a specific URL
                or description of where the allegedly infringing content appears on our Site.
              </li>
              <li>
                <strong className="text-zinc-200">Your contact information</strong> — full name, address, telephone
                number, and email address.
              </li>
              <li>
                <strong className="text-zinc-200">Statement of good faith</strong> — a statement that you have a good
                faith belief that the use of the material is not authorised by the copyright owner, its agent,
                or the law.
              </li>
              <li>
                <strong className="text-zinc-200">Statement of accuracy</strong> — a statement that the information
                in the notification is accurate and, under penalty of perjury, that you are the copyright owner
                or authorised to act on the copyright owner&apos;s behalf.
              </li>
              <li>
                <strong className="text-zinc-200">Your signature</strong> — physical or electronic signature of the
                copyright owner or authorised representative.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Where to Send Notices</h2>
            <p>
              DMCA notices should be submitted via email. We aim to respond to all valid DMCA notices within
              72 business hours.
            </p>
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 mt-3">
              <p className="text-zinc-400 text-xs">DMCA Agent</p>
              <p className="text-white font-medium mt-1">Filmmart</p>
              <p className="text-zinc-400 text-xs mt-1">
                Please use the contact form at the bottom of the page or email us directly.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Counter-Notice Procedure</h2>
            <p>
              If you believe that content was removed in error, you may file a counter-notice. A valid
              counter-notice must include:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Identification of the removed content and its location before removal</li>
              <li>A statement under penalty of perjury that you have a good faith belief the content was removed by mistake</li>
              <li>Your name, address, phone number, and consent to jurisdiction of the relevant federal court</li>
              <li>Your physical or electronic signature</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">Repeat Infringers</h2>
            <p>
              In accordance with the DMCA, Filmmart will terminate accounts of users who are repeat copyright
              infringers.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">False Claims</h2>
            <p>
              Under 17 U.S.C. §512(f), any person who knowingly materially misrepresents that material is
              infringing may be liable for damages. Do not submit a DMCA notice if you are unsure whether
              the material is infringing.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-wrap gap-4 text-xs text-zinc-500">
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
          <Link href="/cookie-policy" className="hover:text-zinc-400 transition-colors">Cookie Policy</Link>
          <Link href="/age-disclaimer" className="hover:text-zinc-400 transition-colors">Age Disclaimer</Link>
        </div>
      </div>
    </div>
  );
}
