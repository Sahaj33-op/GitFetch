import React from 'react';
import { Briefcase, Search, Download, Shield, FileText, BookOpen, AlertCircle, HelpCircle } from 'lucide-react';

export function LandingContent() {
  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Extract Any GitHub Profile
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
          Instantly visualize, analyze, and export comprehensive GitHub profiles, repositories, top languages, and activity stats in beautifully formatted Markdown.
        </p>
      </section>

      {/* Use Cases */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Use Cases</h2>
          <p className="text-lg text-gray-600">Discover how developers and recruiters use GitHub Profile Extractor.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Portfolio Generation</h3>
            <p className="text-gray-600">Export your complete GitHub presence as Markdown and embed it in your personal website or Notion portfolio.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Candidate Screening</h3>
            <p className="text-gray-600">Recruiters can quickly evaluate a candidate's open-source contributions, tech stack, and organizations.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Profile Backup</h3>
            <p className="text-gray-600">Download and archive your open source work, achievements, and statistics for safe keeping or migration.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Team & Org Audits</h3>
            <p className="text-gray-600">Fetch SAML/SSO organization memberships to audit active contributors in enterprise GitHub environments.</p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 items-center justify-center flex gap-2">
              <HelpCircle className="w-8 h-8 text-gray-900" />
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">Everything you need to know about authentication and extraction.</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                What is a GitHub PAT (Personal Access Token)?
              </h3>
              <p className="text-gray-600">
                A PAT is a secure authorization token that allows applications to access the GitHub API on your behalf. Providing a PAT allows us to fetch data with much higher rate limits and retrieve your private repositories, organizations, and contributions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[100px] -z-10"></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Why do I need a 7-day PAT token for organizations?
              </h3>
              <p className="text-gray-600 mb-3">
                GitHub has strict policies for SAML/SSO enabled organizations. To view these organizations via the API:
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>You must create a Fine-grained PAT or a Classic PAT with the <code className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-sm font-mono">read:org</code> scope.</li>
                <li>You must explicitly authorize that Single Sign-On (SSO) organization on the token itself.</li>
                <li>For security reasons, we strongly recommend setting an expiration of <strong>7 days or less</strong>. We do not store your token.</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                Are there rate limits if I don't use a token?
              </h3>
              <p className="text-gray-600">
                Yes. Unauthenticated requests to the GitHub API are limited to 60 requests per hour per IP address. Extracting a rich profile easily takes 3-5 requests. Providing a token increases your limit to 5,000 requests per hour.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                Do you store my data or my PAT?
              </h3>
              <p className="text-gray-600">
                Absolutely not. All requests are made directly from your browser to the GitHub API. We have no backend database and do not store or persist your token in any capacity.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
