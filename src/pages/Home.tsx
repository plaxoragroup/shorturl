import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createGuestLink, createAuthLink, ShortLink } from '../services/linkService';

const pseoPagesData = {
  'bitly-alternative': {
      title: "Best Free Bitly Alternative (No Signup Required)",
      subtitle: "Looking for an unlimited free Bitly alternative? Plaxora Links provides custom aliases, QR codes, and real-time analytics without monthly click limits.",
      badge: "COMPETITOR ALTERNATIVE",
      features: [
          "Unlimited links vs Bitly's 10 free link monthly cap",
          "No credit card or forced registration needed",
          "Custom domain aliases on free tier",
          "100% tracker-free privacy standards"
      ]
  },
  'tinyurl-alternative': {
      title: "Modern TinyURL Alternative with Deep Analytics",
      subtitle: "Upgrade from outdated 90s tools to a sleek link management platform featuring real-time click maps and custom brand slugs.",
      badge: "MODERN ALTERNATIVE",
      features: [
          "Sleek responsive SaaS dashboard",
          "Real-time geographic click locations",
          "Instant QR code generator with vector download",
          "Restful API access for batch shortening"
      ]
  },
  'free-url-shortener': {
      title: "100% Free URL Shortener Generator",
      subtitle: "Shorten long web links instantly. Enjoy unlimited link generation, custom slugs, and fast 15ms redirects forever.",
      badge: "FREE FOREVER TOOL",
      features: [
          "Zero cost, no hidden fees or paywalls",
          "Permanent short link expiration dates",
          "SSL encrypted secure HTTPS redirects",
          "High availability 99.99% server uptime"
      ]
  },
  'custom-url-shortener': {
      title: "Custom Domain & Alias URL Shortener",
      subtitle: "Boost click-through rates by up to 39% using branded custom short links tailored for your business or personal brand.",
      badge: "BRAND BUILDING",
      features: [
          "Choose custom domains like px.link or brand.link",
          "Create memorable slug keywords for marketing campaigns",
          "Edit destination URLs dynamically anytime",
          "Custom social media preview meta tags"
      ]
  },
  'qr-code-shortener': {
      title: "Free URL Shortener with Integrated QR Code Generator",
      subtitle: "Generate clean short links paired with downloadable SVG/PNG QR codes for instant offline-to-online marketing campaigns.",
      badge: "QR CODE ENGINE",
      features: [
          "Vector SVG & High-Res PNG download formats",
          "Print-ready 300 DPI resolution",
          "Dynamic destination updates without reprinting",
          "Custom color palette choices"
      ]
  },
  'marketers-shortener': {
      title: "Link Management Platform for Digital Marketers",
      subtitle: "Track multi-channel ad campaigns across Facebook, Google Ads, YouTube, and email with privacy-friendly click attribution.",
      badge: "MARKETING & CAMPAIGNS",
      features: [
          "UTM parameter builder integration",
          "Referrer source and channel categorization",
          "Bulk CSV export of link performance metrics",
          "Conversion funnel breakdown charts"
      ]
  }
};

const blogArticlesData = [
  { id: 1, cluster: "shortening", title: "How URL Shorteners Work: The Technical Guide to 301 Redirects", meta: "Learn the underlying HTTP status codes, DNS lookup speeds, and database key lookup mechanisms powering modern link shorteners.", intent: "Informational", keyword: "how url shorteners work", outline: ["1. Introduction to Link Redirection", "2. 301 vs 302 Redirect Status Codes", "3. Base62 Hash Algorithm Encoding", "4. Edge Server Caching for <15ms Latency"] },
  { id: 2, cluster: "shortening", title: "Best Free URL Shorteners in 2026: Complete Comparison", meta: "Discover the top 10 free link shortening tools evaluated for click caps, custom aliases, QR code support, and privacy.", intent: "Commercial Investigation", keyword: "best free url shortener", outline: ["1. What Makes a Great Link Shortener?", "2. Plaxora Links vs Competitors", "3. Feature Matrix Breakdown", "4. Final Recommendation"] },
  { id: 3, cluster: "management", title: "Why Custom Branded Short Links Increase CTR by 39%", meta: "Explore marketing psychology research proving why branded domains outperform generic bit.ly links across email and SMS campaigns.", intent: "Informational / Marketing", keyword: "custom branded short links", outline: ["1. Trust Factors in Link Mechanics", "2. Case Study: E-commerce CTR Spikes", "3. Configuring Custom Domain Aliases"] },
  { id: 4, cluster: "qrcodes", title: "How to Generate Free QR Codes with Custom Short URLs", meta: "Step-by-step tutorial on building print-ready QR codes linked to dynamic short URLs for events, packaging, and business cards.", intent: "How-To", keyword: "free url shortener with qr code", outline: ["1. Why Dynamic QR Codes Matter", "2. Choosing Vector Formats (SVG vs PNG)", "3. Tracking Offline Conversions"] },
  { id: 5, cluster: "analytics", title: "Understanding Link Click Analytics Without Cookies", meta: "How privacy-first analytics capture referrer domains, devices, and geographic metrics without violating GDPR or using tracking cookies.", intent: "Technical / Informational", keyword: "free link analytics platform", outline: ["1. The Death of Third-Party Cookies", "2. Server-side Anonymized Logging", "3. Evaluating Referrer Data"] },
  { id: 6, cluster: "developers", title: "Building a Link Shortener API Engine with Node.js & Redis", meta: "Developer guide explaining how to construct a fast URL shortener REST API with key-value database caching.", intent: "Developer / Tutorial", keyword: "url shortener for developers", outline: ["1. Architecture Overview", "2. Generating Short Keys", "3. Redis Caching Setup", "4. Rate Limiting Endpoints"] },
  { id: 7, cluster: "social", title: "Optimizing Your Instagram Bio Link with Custom Short URLs", meta: "Maximize social traffic by converting clutter into clean, trackable custom short links optimized for mobile bio profiles.", intent: "Social Media Marketing", keyword: "url shortener for instagram bio", outline: ["1. Instagram Bio Link Constraints", "2. Creating a Custom Slug", "3. Tracking Mobile Referrals"] },
  { id: 8, cluster: "marketing", title: "WhatsApp Marketing Strategy: Tracking Clicks with Short Links", meta: "Learn how ecommerce brands use custom WhatsApp short URLs to track direct message customer service sales.", intent: "E-commerce Marketing", keyword: "url shortener for whatsapp marketing", outline: ["1. The Rise of Conversational Commerce", "2. Generating Direct Chat Links", "3. Attribution Analysis"] }
];

const faqItems = [
  { q: "Is Plaxora Links 100% free to use?", a: "Yes! Plaxora Links allows you to shorten unlimited long URLs, create custom aliases, generate QR codes, and view basic click analytics completely free without creating an account." },
  { q: "Do short links created on Plaxora Links expire?", a: "No. All shortened URLs generated on Plaxora Links are permanent and remain active indefinitely unless they violate our anti-spam security policies." },
  { q: "Can I choose my own custom alias slug?", a: "Absolutely. You can specify custom word aliases (e.g. shorturlplx.vercel.app/my-brand-deal) directly in our tool provided the keyword is not already taken." },
  { q: "How does the built-in QR code generator work?", a: "Every link you shorten automatically generates a high-definition dynamic QR code that can be downloaded in vector SVG or PNG format for print and digital use." },
  { q: "Is registration or credit card required?", a: "No signup or payment details are ever required to use our primary link shortener tool." },
  { q: "How fast are the link redirects?", a: "Our globally distributed edge servers deliver sub-15 millisecond 301 redirects to ensure your traffic reaches destination pages instantly." },
  { q: "Can I edit the destination URL after creating a link?", a: "Yes, registered free account users can update destination targets dynamically without changing the shortened link or reprinting QR codes." }
];

export const Home: React.FC = () => {
  const { currentUser } = useAuth();
  
  // URL Shortener States
  const [longUrl, setLongUrl] = useState('');
  const [domain] = useState('shorturlplx.vercel.app');
  const [customAlias, setCustomAlias] = useState('');
  const [generatedLink, setGeneratedLink] = useState<ShortLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  

  // Layout States
  const [activePseo, setActivePseo] = useState<keyof typeof pseoPagesData>('bitly-alternative');
  const [activeCluster, setActiveCluster] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeArticle, setActiveArticle] = useState<typeof blogArticlesData[0] | null>(null);

  const handleShortenUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl) return;
    setIsSubmitting(true);
    
    try {
      let result;
      if (currentUser) {
        result = await createAuthLink(longUrl, customAlias, currentUser.uid);
      } else {
        result = await createGuestLink(longUrl);
      }
      setGeneratedLink(result);
    } catch (error: any) {
      alert(error.message || "Failed to create short link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    const fullUrl = `https://${domain}/${generatedLink.alias}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = async () => {
    if (!generatedLink) return;
    const fullUrl = `https://${domain}/${generatedLink.alias}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(fullUrl)}`;
    
    try {
      const response = await fetch(qrApiUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${generatedLink.alias}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      window.open(qrApiUrl, '_blank');
    }
  };

  const pseoData = pseoPagesData[activePseo];
  const filteredArticles = activeCluster === 'all' ? blogArticlesData : blogArticlesData.filter(a => a.cluster === activeCluster);

  return (
    <>
      {/* Hero Section */}
      <section id="shortener-tool" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 hero-gradient-light dark:hero-gradient-dark overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-brand-blue dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-xs">
            <i className="fa-solid fa-sparkles text-brand-purple"></i>
            <span>Best Free URL Shortener & Custom Link Management Platform</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-surface-nearblack dark:text-white tracking-tight leading-tight mb-6">
            Shorten Long URLs. Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-brand-cyan">Custom Branded Links.</span> Track Clicks.
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-surface-mediumgray dark:text-slate-300 font-normal leading-relaxed mb-10">
            Transform cluttered web addresses into memorable short links, custom aliases, and downloadable QR codes instantly. No credit card required. No signup limits. Fast, privacy-focused 99.99% redirect infrastructure.
          </p>

          <div className="max-w-3xl mx-auto bg-white dark:bg-surface-darkcard p-6 sm:p-8 rounded-3xl border border-surface-border dark:border-surface-darkborder shadow-xl shadow-blue-900/5 mb-10">
            <form onSubmit={handleShortenUrl} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-mediumgray dark:text-slate-400">
                  <i className="fa-solid fa-link text-base"></i>
                </div>
                <input 
                  type="url" 
                  required 
                  value={longUrl}
                  onChange={e => setLongUrl(e.target.value)}
                  placeholder="Paste your long destination URL here (e.g. https://yourbrand.com/campaign-page)..." 
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-surface-offwhite dark:bg-slate-900/80 border border-surface-border dark:border-surface-darkborder text-sm text-surface-nearblack dark:text-white placeholder-surface-mediumgray dark:placeholder-slate-500 focus:outline-none focus:border-brand-blue dark:focus:border-brand-cyan transition-all"
                />
              </div>

              <div className="flex items-center bg-surface-offwhite dark:bg-slate-900/80 rounded-2xl border border-surface-border dark:border-surface-darkborder px-4 py-3">
                <span className="text-xs font-mono font-semibold text-brand-blue dark:text-brand-cyan mr-1">shorturlplx.vercel.app/</span>
                <input 
                  type="text" 
                  value={customAlias}
                  onChange={e => setCustomAlias(e.target.value)}
                  placeholder="custom-alias (optional)" 
                  disabled={!currentUser}
                  title={!currentUser ? "Login to use custom aliases" : ""}
                  className="bg-transparent text-xs text-surface-nearblack dark:text-white placeholder-surface-mediumgray dark:placeholder-slate-500 focus:outline-none w-full disabled:opacity-50"
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-4 px-6 rounded-2xl bg-brand-blue hover:bg-brand-purple text-white font-bold text-sm transition-all duration-200 shadow-md hover:shadow-glow-purple flex items-center justify-center space-x-2">
                <i className="fa-solid fa-scissors text-base"></i>
                <span>{isSubmitting ? "Shortening..." : "Shorten URL Free Now"}</span>
              </button>
            </form>

            {generatedLink && (
              <div className="mt-6 pt-6 border-t border-surface-border dark:border-surface-darkborder text-left animate-fadeIn">
                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="overflow-hidden w-full sm:w-auto">
                    <div className="text-[11px] font-semibold text-brand-purple uppercase tracking-wider mb-1">Your Shortened URL:</div>
                    <a href={`https://${domain}/${generatedLink.alias}`} target="_blank" rel="noreferrer" className="font-heading font-extrabold text-lg sm:text-xl text-brand-blue dark:text-brand-cyan hover:underline truncate block">
                      https://{domain}/{generatedLink.alias}
                    </a>
                    <div className="text-xs text-surface-mediumgray dark:text-slate-400 truncate mt-0.5">Destination: {generatedLink.originalUrl}</div>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <button onClick={handleCopy} className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-purple text-white text-xs font-semibold transition-all shadow-xs flex items-center">
                      <i className="fa-regular fa-copy mr-1.5"></i> <span>{copied ? "Copied!" : "Copy Link"}</span>
                    </button>
                    <button onClick={handleDownloadQr} className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-surface-border dark:border-surface-darkborder text-surface-darkgray dark:text-slate-200 text-xs font-semibold hover:bg-surface-lightgray dark:hover:bg-slate-700 transition-colors flex items-center">
                      <i className="fa-solid fa-qrcode mr-1.5 text-brand-purple"></i> QR Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 rounded-2xl bg-white dark:bg-surface-darkcard border border-surface-border dark:border-surface-darkborder shadow-xs max-w-4xl mx-auto">
            <div className="text-center border-r border-surface-border dark:border-surface-darkborder last:border-0">
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-blue dark:text-brand-cyan mb-1">100M+</div>
              <div className="text-xs font-medium text-surface-mediumgray dark:text-slate-400 uppercase tracking-wider">Links Shortened</div>
            </div>
            <div className="text-center md:border-r border-surface-border dark:border-surface-darkborder">
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-blue dark:text-brand-cyan mb-1">500M+</div>
              <div className="text-xs font-medium text-surface-mediumgray dark:text-slate-400 uppercase tracking-wider">Monthly Redirects</div>
            </div>
            <div className="text-center border-r border-surface-border dark:border-surface-darkborder">
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-blue dark:text-brand-cyan mb-1">99.99%</div>
              <div className="text-xs font-medium text-surface-mediumgray dark:text-slate-400 uppercase tracking-wider">Uptime Reliability</div>
            </div>
            <div className="text-center">
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-blue dark:text-brand-cyan mb-1">&lt;15ms</div>
              <div className="text-xs font-medium text-surface-mediumgray dark:text-slate-400 uppercase tracking-wider">Redirect Speed</div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-surface-darkcard border-t border-surface-border dark:border-surface-darkborder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-purple uppercase tracking-wider mb-2">
              <i className="fa-solid fa-layer-group"></i>
              <span>Comprehensive Link Toolkit</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-surface-nearblack dark:text-white tracking-tight">
              Everything You Need From a Free Link Shortener
            </h2>
            <p className="text-sm sm:text-base text-surface-mediumgray dark:text-slate-400 mt-3">
              Built for digital marketers, content creators, ecommerce brands, agencies, and developers requiring high-performance link infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-surface-offwhite dark:bg-slate-900 border border-surface-border dark:border-surface-darkborder hover:border-brand-purple/40 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-brand-blue dark:text-brand-cyan flex items-center justify-center text-xl mb-5">
                <i className="fa-solid fa-infinity"></i>
              </div>
              <h3 className="font-heading font-bold text-xl text-surface-nearblack dark:text-white mb-2">Unlimited Free Links</h3>
              <p className="text-xs sm:text-sm text-surface-mediumgray dark:text-slate-400 leading-relaxed">
                Create as many short URLs as you need. No artificial paywalls, no link expiration dates, and no unexpected click caps.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-surface-offwhite dark:bg-slate-900 border border-surface-border dark:border-surface-darkborder hover:border-brand-purple/40 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center text-xl mb-5">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <h3 className="font-heading font-bold text-xl text-surface-nearblack dark:text-white mb-2">Deep Link Analytics</h3>
              <p className="text-xs sm:text-sm text-surface-mediumgray dark:text-slate-400 leading-relaxed">
                Monitor click locations, referrer domains, device types, browsers, and user activity timelines with privacy-friendly tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-offwhite dark:bg-slate-900 border border-surface-border dark:border-surface-darkborder hover:border-brand-purple/40 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 flex items-center justify-center text-xl mb-5">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3 className="font-heading font-bold text-xl text-surface-nearblack dark:text-white mb-2">No Signup Required</h3>
              <p className="text-xs sm:text-sm text-surface-mediumgray dark:text-slate-400 leading-relaxed">
                Shorten links without creating an account or giving away personal email addresses. Total privacy compliance (GDPR/CCPA ready).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-offwhite dark:bg-slate-900 border border-surface-border dark:border-surface-darkborder hover:border-brand-purple/40 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center text-xl mb-5">
                <i className="fa-solid fa-code"></i>
              </div>
              <h3 className="font-heading font-bold text-xl text-surface-nearblack dark:text-white mb-2">REST API for Developers</h3>
              <p className="text-xs sm:text-sm text-surface-mediumgray dark:text-slate-400 leading-relaxed">
                Automate link generation inside your Node.js, Python, or PHP apps using clean RESTful JSON endpoints and webhook notifications.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-surface-offwhite dark:bg-slate-900 border border-surface-border dark:border-surface-darkborder hover:border-brand-purple/40 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-brand-purple flex items-center justify-center text-xl mb-5">
                <i className="fa-solid fa-signature"></i>
              </div>
              <h3 className="font-heading font-bold text-xl text-surface-nearblack dark:text-white mb-2">Free Custom Aliases</h3>
              <p className="text-xs sm:text-sm text-surface-mediumgray dark:text-slate-400 leading-relaxed">
                Replace random strings with memorable slug keywords (e.g. <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-brand-blue">px.link/summer</code>) to boost click-through rates.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-surface-offwhite dark:bg-slate-900 border border-surface-border dark:border-surface-darkborder hover:border-brand-purple/40 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 text-brand-cyan flex items-center justify-center text-xl mb-5">
                <i className="fa-solid fa-qrcode"></i>
              </div>
              <h3 className="font-heading font-bold text-xl text-surface-nearblack dark:text-white mb-2">Instant QR Generator</h3>
              <p className="text-xs sm:text-sm text-surface-mediumgray dark:text-slate-400 leading-relaxed">
                Generate high-resolution SVG & PNG QR codes for print marketing, product packaging, and social media flyers automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Link Analytics Dashboard Sandbox */}
      <section id="analytics-preview" className="py-16 bg-surface-offwhite dark:bg-surface-darkbg border-t border-surface-border dark:border-surface-darkborder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                <div>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-purple uppercase tracking-wider mb-2">
                        <i className="fa-solid fa-chart-pie"></i>
                        <span>Real-Time Intelligence</span>
                    </div>
                    <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-surface-nearblack dark:text-white tracking-tight">
                        Interactive Link Analytics Dashboard
                    </h2>
                    <p className="text-sm sm:text-base text-surface-mediumgray dark:text-slate-400 mt-2">
                        See how Plaxora Links provides actionable marketing insights for every shortened link in real time.
                    </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-brand-green border border-emerald-300 dark:border-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-brand-green mr-2 animate-ping"></span> Live Analytics Feed
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-darkcard rounded-3xl p-6 sm:p-8 border border-surface-border dark:border-surface-darkborder shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-surface-border dark:border-surface-darkborder gap-4">
                    <div>
                        <div className="text-xs text-surface-mediumgray dark:text-slate-400 font-mono">LINK ANALYTICS REPORT</div>
                        <div className="font-heading font-bold text-xl text-surface-nearblack dark:text-white mt-0.5">shorturlplx.vercel.app/black-friday-2026</div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-lg bg-surface-offwhite dark:bg-slate-800 text-xs font-semibold text-surface-mediumgray dark:text-slate-300">Target: https://mybrand.com/store/promotions</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                    <div className="p-4 rounded-2xl bg-surface-offwhite dark:bg-slate-900 border border-surface-border dark:border-surface-darkborder">
                        <div className="text-xs text-surface-mediumgray dark:text-slate-400">Total Clicks</div>
                        <div className="font-heading font-extrabold text-2xl text-brand-blue dark:text-brand-cyan mt-1">48,290</div>
                        <div className="text-[10px] text-brand-green font-semibold mt-1"><i className="fa-solid fa-arrow-trend-up mr-1"></i>+24.5% vs last week</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface-offwhite dark:bg-slate-900 border border-surface-border dark:border-surface-darkborder">
                        <div className="text-xs text-surface-mediumgray dark:text-slate-400">Unique Visitors</div>
                        <div className="font-heading font-extrabold text-2xl text-brand-purple mt-1">36,812</div>
                        <div className="text-[10px] text-brand-green font-semibold mt-1"><i className="fa-solid fa-arrow-trend-up mr-1"></i>+18.2% new users</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface-offwhite dark:bg-slate-900 border border-surface-border dark:border-surface-darkborder">
                        <div className="text-xs text-surface-mediumgray dark:text-slate-400">Top Country</div>
                        <div className="font-heading font-extrabold text-2xl text-surface-nearblack dark:text-white mt-1">United States</div>
                        <div className="text-[10px] text-surface-mediumgray dark:text-slate-400 font-semibold mt-1">42% of total clicks</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface-offwhite dark:bg-slate-900 border border-surface-border dark:border-surface-darkborder">
                        <div className="text-xs text-surface-mediumgray dark:text-slate-400">Primary Channel</div>
                        <div className="font-heading font-extrabold text-2xl text-brand-cyan mt-1">YouTube</div>
                        <div className="text-[10px] text-surface-mediumgray dark:text-slate-400 font-semibold mt-1">Organic video links</div>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-surface-offwhite dark:bg-slate-900 border border-surface-border dark:border-surface-darkborder">
                    <div className="flex justify-between items-center text-xs font-semibold text-surface-mediumgray dark:text-slate-400 mb-4">
                        <span>HOURLY CLICK TIMELINE (LAST 24 HOURS)</span>
                        <span className="text-brand-blue dark:text-brand-cyan"><i className="fa-solid fa-circle text-[8px] mr-1"></i>Realtime sync</span>
                    </div>
                    <div className="h-32 flex items-end justify-between gap-1 sm:gap-2 pt-4 px-2">
                        <div className="w-full bg-blue-200 dark:bg-blue-900/60 hover:bg-brand-blue transition-all rounded-t h-[40%]" title="01:00 - 1,200 clicks"></div>
                        <div className="w-full bg-blue-200 dark:bg-blue-900/60 hover:bg-brand-blue transition-all rounded-t h-[30%]" title="03:00 - 800 clicks"></div>
                        <div className="w-full bg-blue-200 dark:bg-blue-900/60 hover:bg-brand-blue transition-all rounded-t h-[20%]" title="05:00 - 500 clicks"></div>
                        <div className="w-full bg-blue-300 dark:bg-blue-800 hover:bg-brand-blue transition-all rounded-t h-[55%]" title="07:00 - 2,100 clicks"></div>
                        <div className="w-full bg-brand-blue hover:bg-brand-purple transition-all rounded-t h-[85%]" title="09:00 - 4,800 clicks"></div>
                        <div className="w-full bg-brand-blue hover:bg-brand-purple transition-all rounded-t h-[95%]" title="11:00 - 5,400 clicks"></div>
                        <div className="w-full bg-brand-purple hover:bg-brand-blue transition-all rounded-t h-[100%]" title="13:00 - 6,100 clicks"></div>
                        <div className="w-full bg-brand-blue hover:bg-brand-purple transition-all rounded-t h-[75%]" title="15:00 - 3,900 clicks"></div>
                        <div className="w-full bg-blue-300 dark:bg-blue-800 hover:bg-brand-blue transition-all rounded-t h-[60%]" title="17:00 - 3,100 clicks"></div>
                        <div className="w-full bg-blue-200 dark:bg-blue-900/60 hover:bg-brand-blue transition-all rounded-t h-[45%]" title="19:00 - 2,000 clicks"></div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Comparisons Section */}
      <section id="comparisons" className="py-16 bg-white dark:bg-surface-darkcard border-t border-surface-border dark:border-surface-darkborder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-purple uppercase tracking-wider mb-2">
                <i className="fa-solid fa-code-compare"></i>
                <span>Marketplace Benchmarking</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-surface-nearblack dark:text-white tracking-tight">
              Why Marketers Switch to Plaxora Links
            </h2>
            <p className="text-sm sm:text-base text-surface-mediumgray dark:text-slate-400 mt-2">
                Compare Plaxora Links with traditional link shorteners. We offer unlimited free custom aliases, no signup barriers, and transparent privacy.
            </p>
          </div>
          <div className="overflow-x-auto rounded-3xl border border-surface-border dark:border-surface-darkborder bg-surface-offwhite dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-surface-nearblack dark:text-white border-b border-surface-border dark:border-surface-darkborder">
                  <th className="p-4 sm:p-5 font-heading font-bold">Feature Comparison</th>
                  <th className="p-4 sm:p-5 font-heading font-extrabold text-brand-blue dark:text-brand-cyan bg-blue-50/50 dark:bg-blue-950/30">Plaxora Links</th>
                  <th className="p-4 sm:p-5 font-heading font-bold text-surface-mediumgray">Bitly</th>
                  <th className="p-4 sm:p-5 font-heading font-bold text-surface-mediumgray">TinyURL</th>
                  <th className="p-4 sm:p-5 font-heading font-bold text-surface-mediumgray">Short.io</th>
                  <th className="p-4 sm:p-5 font-heading font-bold text-surface-mediumgray">Dub</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border dark:divide-surface-darkborder text-surface-darkgray dark:text-slate-300">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Free Monthly Links</td>
                  <td className="p-4 sm:p-5 font-bold text-brand-green bg-blue-50/30 dark:bg-blue-950/20"><i className="fa-solid fa-check mr-1.5"></i> Unlimited</td>
                  <td className="p-4 sm:p-5 text-brand-red">10 Links / mo</td>
                  <td className="p-4 sm:p-5 text-amber-600">Limited free</td>
                  <td className="p-4 sm:p-5 text-amber-600">1,000 Links</td>
                  <td className="p-4 sm:p-5 text-amber-600">250 Links</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">No Signup Required</td>
                  <td className="p-4 sm:p-5 font-bold text-brand-green bg-blue-50/30 dark:bg-blue-950/20"><i className="fa-solid fa-check mr-1.5"></i> Yes (Instant)</td>
                  <td className="p-4 sm:p-5 text-brand-red"><i className="fa-solid fa-xmark mr-1"></i> No</td>
                  <td className="p-4 sm:p-5 text-brand-green"><i className="fa-solid fa-check mr-1"></i> Yes</td>
                  <td className="p-4 sm:p-5 text-brand-red"><i className="fa-solid fa-xmark mr-1"></i> No</td>
                  <td className="p-4 sm:p-5 text-brand-red"><i className="fa-solid fa-xmark mr-1"></i> No</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Free Custom Alias</td>
                  <td className="p-4 sm:p-5 font-bold text-brand-green bg-blue-50/30 dark:bg-blue-950/20"><i className="fa-solid fa-check mr-1.5"></i> Unlimited Free</td>
                  <td className="p-4 sm:p-5 text-brand-red">Paid plans only</td>
                  <td className="p-4 sm:p-5 text-amber-600">Limited</td>
                  <td className="p-4 sm:p-5 text-brand-green"><i className="fa-solid fa-check mr-1"></i> Included</td>
                  <td className="p-4 sm:p-5 text-brand-green"><i className="fa-solid fa-check mr-1"></i> Included</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">QR Code Generator</td>
                  <td className="p-4 sm:p-5 font-bold text-brand-green bg-blue-50/30 dark:bg-blue-950/20"><i className="fa-solid fa-check mr-1.5"></i> SVG/PNG Free</td>
                  <td className="p-4 sm:p-5 text-amber-600">Watermarked</td>
                  <td className="p-4 sm:p-5 text-brand-red"><i className="fa-solid fa-xmark mr-1"></i> Basic only</td>
                  <td className="p-4 sm:p-5 text-brand-green"><i className="fa-solid fa-check mr-1"></i> Free tier</td>
                  <td className="p-4 sm:p-5 text-brand-green"><i className="fa-solid fa-check mr-1"></i> Free tier</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Link Expiration Controls</td>
                  <td className="p-4 sm:p-5 font-bold text-brand-green bg-blue-50/30 dark:bg-blue-950/20"><i className="fa-solid fa-check mr-1.5"></i> Permanent or Custom</td>
                  <td className="p-4 sm:p-5 text-brand-red">Requires Pro</td>
                  <td className="p-4 sm:p-5 text-brand-red">Requires Pro</td>
                  <td className="p-4 sm:p-5 text-brand-green"><i className="fa-solid fa-check mr-1"></i> Free</td>
                  <td className="p-4 sm:p-5 text-brand-green"><i className="fa-solid fa-check mr-1"></i> Free</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* pSEO Hub */}
      <section id="pseo-hub" className="py-16 bg-surface-offwhite dark:bg-surface-darkbg border-t border-surface-border dark:border-surface-darkborder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-surface-nearblack dark:text-white tracking-tight mb-8">
            Dedicated Solution Hubs
          </h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.keys(pseoPagesData).map(key => (
              <button 
                key={key} 
                onClick={() => setActivePseo(key as keyof typeof pseoPagesData)} 
                className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs ${activePseo === key ? 'bg-brand-blue text-white' : 'bg-white dark:bg-slate-800 border border-surface-border dark:border-surface-darkborder text-surface-mediumgray dark:text-slate-300 hover:text-brand-blue'}`}
              >
                {pseoPagesData[key as keyof typeof pseoPagesData].badge}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-surface-darkcard p-8 rounded-3xl border border-surface-border dark:border-surface-darkborder shadow-md">
            <div className="space-y-4 animate-fadeIn">
              <span className="inline-block px-3 py-1 rounded-md text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-brand-purple tracking-wider uppercase">{pseoData.badge}</span>
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-surface-nearblack dark:text-white">{pseoData.title}</h3>
              <p className="text-xs sm:text-sm text-surface-mediumgray dark:text-slate-300 leading-relaxed">{pseoData.subtitle}</p>
              
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pseoData.features.map((f, i) => (
                  <div key={i} className="flex items-center text-xs text-surface-darkgray dark:text-slate-300 bg-surface-offwhite dark:bg-slate-900 p-3 rounded-xl border border-surface-border dark:border-surface-darkborder">
                    <i className="fa-solid fa-circle-check text-brand-green mr-2 text-sm"></i> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Hub */}
      <section id="blog-hub" className="py-16 bg-white dark:bg-surface-darkcard border-t border-surface-border dark:border-surface-darkborder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-surface-nearblack dark:text-white tracking-tight mb-8">
            SEO Topical Authority Engine
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
            {['all', 'shortening', 'management', 'qrcodes', 'analytics', 'marketing'].map(cluster => (
              <button 
                key={cluster} 
                onClick={() => setActiveCluster(cluster)} 
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-center capitalize ${activeCluster === cluster ? 'bg-brand-blue text-white' : 'bg-surface-offwhite dark:bg-slate-800 border border-surface-border text-surface-mediumgray hover:text-brand-blue'}`}
              >
                {cluster}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <div key={article.id} className="bg-surface-offwhite dark:bg-slate-900 rounded-2xl p-6 border border-surface-border dark:border-surface-darkborder hover:border-brand-purple/40 transition-all flex flex-col justify-between hover:shadow-md group">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-brand-purple uppercase bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">Cluster: {article.cluster}</span>
                    <span className="text-[10px] text-surface-mediumgray dark:text-slate-400 font-semibold">{article.intent}</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-surface-nearblack dark:text-white group-hover:text-brand-blue transition-colors mb-2">{article.title}</h4>
                </div>
                <div className="pt-3 border-t border-surface-border dark:border-surface-darkborder flex items-center justify-between mt-4">
                  <span className="text-[11px] text-surface-mediumgray dark:text-slate-400">Target: <code className="text-brand-blue dark:text-brand-cyan font-mono">{article.keyword}</code></span>
                  <button onClick={() => setActiveArticle(article)} className="text-[11px] text-brand-blue font-semibold hover:underline">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white dark:bg-surface-darkcard border-t border-surface-border dark:border-surface-darkborder">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading font-extrabold text-3xl sm:text-4xl text-surface-nearblack dark:text-white tracking-tight mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-surface-offwhite dark:bg-slate-900 border border-surface-border dark:border-surface-darkborder rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)} className="w-full p-5 text-left font-heading font-bold text-sm sm:text-base text-surface-nearblack dark:text-white flex items-center justify-between hover:text-brand-blue transition-colors">
                  <span>{item.q}</span>
                  <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${openFaqIndex === index ? 'rotate-180' : ''}`}></i>
                </button>
                {openFaqIndex === index && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-surface-mediumgray dark:text-slate-400 leading-relaxed border-t border-surface-border/50 dark:border-surface-darkborder/50 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Article Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveArticle(null)}>
          <div className="bg-white dark:bg-surface-darkcard max-w-2xl w-full rounded-3xl p-8 border border-surface-border shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
              <span className="px-3 py-1 bg-purple-100 text-brand-purple text-xs font-bold rounded-full">{activeArticle.cluster}</span>
              <button onClick={() => setActiveArticle(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <h3 className="font-heading font-extrabold text-2xl">{activeArticle.title}</h3>
            <p className="my-4 text-xs text-surface-mediumgray">{activeArticle.meta}</p>
            <ul className="space-y-2 mt-4 text-xs">
              {activeArticle.outline.map((step, i) => (
                <li key={i} className="p-2 bg-surface-offwhite rounded-lg border border-surface-border">{step}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
