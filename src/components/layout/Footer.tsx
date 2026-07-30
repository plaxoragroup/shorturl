import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-surface-nearblack text-slate-600 dark:text-slate-400 py-16 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          <div className="md:col-span-4">
            <a href="#" className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center text-white font-bold text-lg">
                <i className="fa-solid fa-link"></i>
              </div>
              <span className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">Plaxora Links</span>
            </a>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Plaxora Links is the premier free URL shortener and link management ecosystem engineered for ultimate SEO reach, instant QR generation, custom branded aliases, and privacy-first link analytics.
            </p>
          </div>

          <div className="md:col-span-2">
            <h5 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Tool Alternatives</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#pseo-hub" className="hover:text-brand-blue dark:hover:text-white transition-colors">Bitly Alternative</a></li>
              <li><a href="#pseo-hub" className="hover:text-brand-blue dark:hover:text-white transition-colors">TinyURL Alternative</a></li>
              <li><a href="#pseo-hub" className="hover:text-brand-blue dark:hover:text-white transition-colors">Free URL Shortener</a></li>
              <li><a href="#pseo-hub" className="hover:text-brand-blue dark:hover:text-white transition-colors">Custom Domain Tool</a></li>
              <li><a href="#pseo-hub" className="hover:text-brand-blue dark:hover:text-white transition-colors">QR Code Shortener</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h5 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Solutions</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#pseo-hub" className="hover:text-brand-blue dark:hover:text-white transition-colors">For Marketers</a></li>
              <li><a href="#shortener-tool" className="hover:text-brand-blue dark:hover:text-white transition-colors">For Agencies</a></li>
              <li><a href="#shortener-tool" className="hover:text-brand-blue dark:hover:text-white transition-colors">For Developers</a></li>
              <li><a href="#shortener-tool" className="hover:text-brand-blue dark:hover:text-white transition-colors">For Social Media</a></li>
              <li><a href="#shortener-tool" className="hover:text-brand-blue dark:hover:text-white transition-colors">For Ecommerce</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h5 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">SEO Clusters</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#blog-hub" className="hover:text-brand-blue dark:hover:text-white transition-colors">URL Shortening</a></li>
              <li><a href="#blog-hub" className="hover:text-brand-blue dark:hover:text-white transition-colors">Link Management</a></li>
              <li><a href="#blog-hub" className="hover:text-brand-blue dark:hover:text-white transition-colors">QR Code Guides</a></li>
              <li><a href="#blog-hub" className="hover:text-brand-blue dark:hover:text-white transition-colors">Analytics & CTR</a></li>
              <li><a href="#blog-hub" className="hover:text-brand-blue dark:hover:text-white transition-colors">API Documentation</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h5 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Ecosystem</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-brand-blue dark:hover:text-white transition-colors">Plaxora Home</a></li>
              <li><a href="#features" className="hover:text-brand-blue dark:hover:text-white transition-colors">Features Matrix</a></li>
              <li><a href="#faq" className="hover:text-brand-blue dark:hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-brand-blue dark:hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-blue dark:hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 transition-colors">
          <p>© 2026 Plaxora Links. All rights reserved.</p>
          <div className="text-center sm:text-right">
            <p className="mb-1">Engineered for high-speed performance and maximum topical authority.</p>
            <p>Developed and owned by <a href="https://plaxoragroup.com" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline font-semibold">Plaxora Group</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
