# Plaxora Links — Product Requirements Document (PRD)

### Version 1.0 | Prepared for: Google AI Studio + Firebase Development

\---

## 1\. Product Overview

**Product Name:** Plaxora Links
**Category:** URL Shortener + Link Management Platform (SaaS)
**Tech Stack:** Frontend — Google AI Studio (React/Web-based build) | Backend — Firebase (Auth, Firestore, Cloud Functions, Hosting, Analytics)

**One-line Positioning:**
Plaxora Links শুধু একটা URL Shortener না — এটা একটা দ্রুত, আধুনিক এবং প্রাইভেসি-ফোকাসড Link Management Platform, যেখানে যে কেউ বিনামূল্যে (Free Forever, Fair Usage সহ) লিংক শর্ট করতে পারবে, QR কোড পাবে, এবং একাউন্ট থাকলে ফুল ড্যাশবোর্ড দিয়ে লিংক ম্যানেজ করতে পারবে।

**Vision (৬-১২ মাস):** Free ইউজারবেস দিয়ে বড় ট্র্যাফিক আনা → Advanced Analytics, Custom Domain, Team Workspace, API Access-কে Pro Subscription-এর পেছনে রেখে monetize করা।

\---

## 2\. Business Goals

1. দ্রুত ইউজার একুইজিশন — No-login Guest Mode দিয়ে ফ্রিকশন কমানো।
2. Guest → Registered কনভার্শন বাড়ানো (dashboard, custom alias, analytics লক করে)।
3. Registered → Paid Subscriber কনভার্শন (Phase 2 রোডম্যাপ ফিচার দিয়ে)।
4. Brand trust তৈরি — clean UI, fast redirect, security-first ব্যবস্থা।
5. ভবিষ্যতে API/White-label revenue stream তৈরি করা।

### Success Metrics (KPI)

|Metric|Target (Month 3)|
|-|-|
|Daily Active Shorteners|500+|
|Guest → Signup Conversion|8-12%|
|Free → Paid Conversion (post-launch of Pro)|3-5%|
|Avg. Redirect Latency|< 150ms|
|Link Click-through Accuracy|99.9%|

\---

## 3\. Target Users

* **Casual users:** সোশ্যাল মিডিয়া/হোয়াটসঅ্যাপে লিংক শেয়ার করতে চান, দ্রুত ও ঝামেলাহীন।
* **Small business/marketers:** নিজেদের ব্র্যান্ডেড alias, QR কোড, ক্লিক ট্র্যাকিং চান।
* **Developers/Agencies (future):** API access, bulk shortening, custom domain চাইবেন — এটাই মূল monetization টার্গেট।

\---

## 4\. Information Architecture (Site Map)

```
/ (Home - Guest Shortener)
/login
/signup
/forgot-password
/dashboard
   /dashboard/links
   /dashboard/links/:id  (edit view)
   /dashboard/analytics
   /dashboard/settings
   /dashboard/billing (Phase 2)
/:shortcode  (redirect handler)
/404
```

\---

## 5\. Design System

### 5.1 Brand Personality

Modern, trustworthy, minimal, দ্রুত মনে হওয়া উচিত (speed-first branding)। "Plaxora" নামের সাথে মিলিয়ে সামান্য tech/futuristic কিন্তু friendly টোন রাখা।

### 5.2 Color Palette

**Light Mode**

|Token|Hex|Usage|
|-|-|-|
|Primary|`#4F46E5` (Indigo 600)|Buttons, links, active states|
|Primary Hover|`#4338CA`|Button hover|
|Secondary/Accent|`#06B6D4` (Cyan 500)|QR/highlight accents, badges|
|Background|`#F9FAFB`|Page background|
|Surface/Card|`#FFFFFF`|Cards, dashboard panels|
|Border|`#E5E7EB`|Card borders, dividers|
|Text Primary|`#111827`|Headings, main text|
|Text Secondary|`#6B7280`|Sub-text, captions|
|Success|`#16A34A`|Active link status|
|Warning|`#F59E0B`|Rate-limit / disabled alerts|
|Error|`#DC2626`|Invalid URL, errors|

**Dark Mode**

|Token|Hex|Usage|
|-|-|-|
|Background|`#0F1115`|Page background|
|Surface/Card|`#1A1D23`|Cards|
|Border|`#2A2D34`|Dividers|
|Text Primary|`#F3F4F6`|Headings|
|Text Secondary|`#9CA3AF`|Sub-text|
|Primary|`#6366F1` (Indigo 500)|Buttons/links (slightly lighter for contrast)|
|Accent|`#22D3EE`|Highlights|

> Dark/Light টগল top-navbar-এ রাখো, system preference অনুযায়ী default set হবে (`prefers-color-scheme`), user override localStorage/Firestore user-doc-এ সেভ হবে।

### 5.3 Typography

* **Font Family:** `Inter` (headings + body) — Google Fonts থেকে ফ্রি, ক্লিন, modern SaaS লুকের জন্য স্ট্যান্ডার্ড চয়েস। Bengali কন্টেন্টের জন্য fallback: `Noto Sans Bengali`।
* **Font Stack:** `'Inter', 'Noto Sans Bengali', sans-serif`

|Style|Size (desktop)|Size (mobile)|Weight|
|-|-|-|-|
|H1 (Hero)|48px|32px|700|
|H2 (Section)|32px|24px|700|
|H3 (Card title)|20px|18px|600|
|Body|16px|15px|400|
|Small/Caption|13px|12px|400|
|Button Text|15px|15px|600|

Line-height: headings 1.2, body 1.6। Letter-spacing: headings -0.02em।

### 5.4 Spacing \& Layout Grid

* Base spacing unit: `4px` (Tailwind-style scale: 4, 8, 12, 16, 24, 32, 48, 64)
* Container max-width: `1200px`, side padding 24px (desktop), 16px (mobile)
* Card padding: 24px desktop / 16px mobile
* Border-radius: Buttons `10px`, Cards `16px`, Input fields `10px`, QR image box `12px`

### 5.5 Components

**Buttons**

* Primary: solid Indigo bg, white text, radius 10px, hover darken 8%, active scale 0.98, transition 150ms
* Secondary: outline (1.5px border primary color), transparent bg, hover fills light tint
* Ghost/Icon button: for copy/QR download, no border, hover bg light gray/dark overlay
* Sizes: `sm` (32px height), `md` (40px height, default), `lg` (48px height, hero CTA)
* Disabled state: 40% opacity, cursor not-allowed

**Input Fields (URL input box - hero)**

* Height 52px (desktop hero), rounded-full or radius 12px, subtle border, focus ring in Primary color (2px), placeholder text secondary color
* Inline "Shorten" button embedded on the right (or below on mobile)

**Cards (Link Item Card in Dashboard)**

* White/dark surface, radius 16px, 1px border, subtle shadow (`0 1px 3px rgba(0,0,0,0.06)`)
* Layout: Short URL (bold, primary color, clickable-copy) + Original URL (truncated, secondary text) + Stats row (clicks icon + count, created date) + Actions (Edit/Disable/Delete/QR icons, right-aligned)
* Hover: shadow lifts slightly (`0 4px 12px rgba(0,0,0,0.08)`), transition 200ms
* Status badge: pill-shaped, green bg tint for Active, gray/red tint for Disabled

**Toast Notifications**

* Bottom-right (desktop) / bottom-center (mobile), radius 10px, auto-dismiss 3s, success = green accent bar, error = red accent bar, icon + short message ("Link copied!", "Short URL created")

**QR Code Block**

* White padded box even in dark mode (QR must stay scannable), radius 12px, "Download PNG" ghost button below

**Navbar**

* Sticky top, logo left, nav links center/right, Login/Signup buttons right (guest), Avatar dropdown (logged-in), Dark mode toggle icon

**Empty States**

* Dashboard-এ যখন কোনো লিংক নেই: friendly illustration + "এখনো কোনো লিংক তৈরি হয়নি" + CTA button

### 5.6 Responsive Breakpoints

|Breakpoint|Width|Behavior|
|-|-|-|
|Mobile|< 640px|Single column, stacked cards, bottom nav optional|
|Tablet|640–1024px|2-column dashboard grid|
|Desktop|> 1024px|Full sidebar + multi-column dashboard|

\---

## 6\. Feature-wise Functional Spec

### 6.1 Guest Mode (No Account)

* Homepage-এ বড় URL input + "Shorten" বাটন
* Firebase Cloud Function কল করে র‍্যান্ডম ৬-৭ ক্যারেক্টার shortcode জেনারেট (Firestore `links` কালেকশনে সেভ, `ownerId: null`, `isGuest: true`)
* সাথে সাথে QR কোড generate (client-side lib, e.g. `qrcode.react` বা server-side)
* Copy button, ছোট ডিসক্লেমার: "গেস্ট লিংক সংরক্ষিত থাকবে না, পরে এডিট করা যাবে না"
* Rate limiting: IP-ভিত্তিক (Cloud Function + Firestore counter অথবা Firebase App Check), যেমন প্রতি IP-তে ঘন্টায় সর্বোচ্চ N টি লিংক

### 6.2 Authentication

* Firebase Authentication: Google Sign-In + Email/Password
* Forgot Password → Firebase `sendPasswordResetEmail`
* Session persistence: Firebase default (local persistence)
* On first signup → Firestore-এ `users/{uid}` ডকুমেন্ট তৈরি (plan: "free", createdAt, displayName, email)

### 6.3 Personal Dashboard

* Summary cards (Total Links, Total Clicks, Active, Disabled) — Firestore query/aggregation (বড় স্কেলে Cloud Function দিয়ে aggregated counters রাখা ভালো, প্রতি রিড-এ COUNT() না করে)
* Recent Links list (last 5)
* Firestore structure নিচে সেকশন ৭-এ

### 6.4 Link Management

* CRUD: Create (custom বা auto alias), Read, Update (destination URL edit), Enable/Disable (soft toggle `isActive`), Delete (hard delete + Firestore doc remove)
* Search: client-side filter অথবা Firestore query `where('alias', '>=', ...)`
* সব actions শুধু owner (`request.auth.uid == resource.data.ownerId`) করতে পারবে — Firestore Security Rules দিয়ে enforce

### 6.5 Custom Alias

* Real-time availability check (Firestore doc read `links/{alias}` exists কিনা) — debounce input 400ms
* Alias validation: শুধু a-z, 0-9, hyphen, 3-30 ক্যারেক্টার, reserved words ব্লক (login, admin, dashboard ইত্যাদি)

### 6.6 Click Analytics (Basic)

* প্রতি রিডাইরেক্টে Cloud Function দিয়ে `clickCount` increment (Firestore transaction / `FieldValue.increment(1)`)
* Created/Updated timestamp দেখানো
* Future: country/device/browser analytics-এর জন্য এখন থেকেই raw click log আলাদা subcollection-এ রাখা ভালো (`links/{id}/clicks/{clickId}`) — future paid analytics ফিচারের ভিত্তি

### 6.7 Security

* URL validation (regex + safe protocol check `http/https` only)
* Malicious/spam domain blocklist check (Cloud Function, optionally Google Safe Browsing API)
* Rate limiting per IP/user (Firestore counter বা Firebase App Check + Cloud Functions quota)
* Firestore Security Rules: guest write শুধু নির্দিষ্ট ফিল্ডে সীমিত, owner-only edit/delete

\---

## 7\. Firestore Data Model (প্রস্তাবিত)

```
users/{uid}
  - email, displayName, photoURL
  - plan: "free" | "pro"
  - createdAt

links/{shortcode}
  - ownerId: string | null   (null = guest)
  - originalUrl: string
  - alias: string (== doc id)
  - isActive: boolean
  - isGuest: boolean
  - clickCount: number
  - createdAt, updatedAt

links/{shortcode}/clicks/{clickId}   (future analytics-এর জন্য, optional এখন)
  - timestamp, ip(hashed), country, device, browser
```

**Redirect Flow:** `go.plaxora.com/:shortcode` → Firebase Hosting rewrite → Cloud Function → Firestore lookup → `clickCount` increment → 301/302 redirect।

\---

## 8\. Free Plan vs Future Pro Plan (Monetization Blueprint)

|ফিচার|Free (Guest)|Free (Registered)|Pro (Future - Paid)|
|-|-|-|-|
|URL Shortening|✅ Unlimited\*|✅ Unlimited\*|✅ Unlimited|
|QR Code|✅|✅|✅ Custom-branded QR|
|Dashboard|❌|✅|✅ Advanced|
|Custom Alias|❌|✅|✅|
|Basic Analytics|❌|✅|✅|
|Country/Device/Browser Analytics|❌|❌|✅|
|Link Expiration / Password Protection|❌|❌|✅|
|Custom Domain|❌|❌|✅|
|Bulk Shortener / Bulk QR|❌|❌|✅|
|Team Workspace|❌|❌|✅|
|API Access|❌|❌|✅|
|UTM Builder / Campaign Labels|❌|❌|✅|

\*Fair Usage Policy প্রযোজ্য (Cloud Function-এ rate-limit)

**Subscription Implementation নোট (future):** Firestore `users/{uid}.plan` ফিল্ড + Stripe/Paddle-এর মতো payment gateway ইন্টিগ্রেশন (বাংলাদেশ থেকে হলে bKash/SSLCommerz বিবেচনা করা যায়), Cloud Function দিয়ে webhook হ্যান্ডল করে plan আপডেট। এখন থেকেই ডাটা মডেলে `plan` ফিল্ড রাখলে ভবিষ্যতে মাইগ্রেশন সহজ হবে।

\---

## 9\. Non-Functional Requirements

* **Performance:** Redirect < 150ms, homepage First Contentful Paint < 1.5s
* **Security:** Firebase App Check enable, Firestore Rules strict owner-check, HTTPS-only
* **SEO:** Homepage-এ meta tags, OG image, sitemap.xml, robots.txt
* **Accessibility:** Buttons/inputs proper contrast ratio (WCAG AA), keyboard navigable
* **Scalability:** Cloud Functions cold-start মিনিমাইজ করতে region nearest user-base অনুযায়ী সেট করা (e.g. `asia-south1`)

\---

## 10\. Launch Phases

**Phase 1 (MVP - এখনকার স্কোপ):** Guest shortener, Auth, Dashboard, Link Management, Custom Alias, Basic Analytics, QR, Dark/Light mode
**Phase 2:** Password-protected links, Link expiration, Scheduled links, Country/Device analytics
**Phase 3 (Monetization):** Subscription system, Custom domain, API access, Team workspace, Bulk tools

\---

*এই PRD Google AI Studio-তে ডিজাইন/কোড জেনারেশনের ইনপুট হিসেবে সরাসরি ব্যবহার করা যাবে — কালার টোকেন, টাইপোগ্রাফি স্কেল এবং কম্পোনেন্ট স্পেক প্রম্পটে রেফারেন্স করলে কনসিস্টেন্ট UI পাওয়া যাবে।*

