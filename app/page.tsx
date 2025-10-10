"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      <header className="fixed inset-x-0 top-0 z-50 bg-white/60 backdrop-blur-md border-b border-[rgba(57,255,20,0.08)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Logo composed with divs (no emoji) */}
              <Link href="/" className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #39FF14 0%, #2ecc71 100%)",
                    boxShadow: "0 6px 20px rgba(57,255,20,0.12)",
                  }}
                >
                  <div className="w-6 h-6 bg-white/90 rounded-sm" />
                </div>
               <span
                  className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#39FF14] to-[#2ecc71]"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  Droply
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-gray-700 hover:text-[#39FF14] transition"
              >
                Features
              </a>
              <a
                href="#tech"
                className="text-sm font-medium text-gray-700 hover:text-[#39FF14] transition"
              >
                Technology
              </a>
              <a
                href="#how"
                className="text-sm font-medium text-gray-700 hover:text-[#39FF14] transition"
              >
                How it Works
              </a>

              <Link
                href="/sign-in"
                className="text-sm font-medium px-4 py-2 rounded-full border"
                style={{
                  borderColor: "rgba(57,255,20,0.18)",
                }}
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full text-white"
                style={{
                  background: "#39FF14",
                  boxShadow: "0 6px 30px rgba(57,255,20,0.12)",
                }}
              >
                Get Started Free
              </Link>
            </nav>

            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="p-2 rounded-md border"
                style={{ borderColor: "rgba(0,0,0,0.06)" }}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      mobileOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${mobileOpen ? "block" : "hidden"} md:hidden border-t`} style={{ borderColor: "rgba(57,255,20,0.06)" }}>
          <div className="px-4 py-4 space-y-2 bg-white">
            <a href="#features" className="block text-gray-700 font-medium py-2">
              Features
            </a>
            <a href="#tech" className="block text-gray-700 font-medium py-2">
              Technology
            </a>
            <a href="#how" className="block text-gray-700 font-medium py-2">
              How it Works
            </a>
            <Link href="/sign-in" className="block text-gray-700 font-medium py-2">
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="block text-white font-semibold py-2 px-4 rounded-full text-center"
              style={{ background: "#39FF14" }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 px-6">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="rounded-full opacity-60"
              style={{
                width: 600,
                height: 600,
                background: "radial-gradient(circle, rgba(57,255,20,0.12) 0%, transparent 70%)",
                animation: "pulse 4s ease-in-out infinite",
              }}
            />
          </div>

          <div className="relative max-w-5xl mx-auto text-center z-10">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
              style={{
                background: "linear-gradient(90deg, rgba(0,0,0,1) 0%, #39FF14 100%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Your Cloud Storage,
              <br />
              Supercharged
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Store, organize, and access your files with lightning speed. Built with modern tech for the modern web — no limits, just pure performance.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold transition-transform"
                style={{
                  background: "#39FF14",
                  boxShadow: "0 10px 40px rgba(57,255,20,0.12)",
                }}
              >
                Start Storing for Free
              </Link>

              <a
                href="#how"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border text-[#39FF14] font-medium"
                style={{ borderColor: "rgba(57,255,20,0.18)" }}
              >
                See How It Works
              </a>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-8 justify-center">
              <div className="text-center">
                <div className="text-3xl font-extrabold" style={{ color: "#39FF14" }}>
                  Unlimited
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide mt-2">Upload Limit</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-extrabold" style={{ color: "#39FF14" }}>
                  Fast
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide mt-2">Lightning Performance</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-extrabold" style={{ color: "#39FF14" }}>
                  Secure
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide mt-2">Privacy First</div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="px-6">
          <div className="max-w-6xl mx-auto rounded-xl overflow-hidden border" style={{ borderColor: "rgba(57,255,20,0.08)", boxShadow: "0 20px 80px rgba(57,255,20,0.06)" }}>
            <div className="w-full h-64 md:h-80 lg:h-96 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-500">
              [Dashboard preview — paste screenshot here]
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 rounded-full" style={{ background: "rgba(57,255,20,0.08)", color: "#39FF14", fontWeight: 600, textTransform: "uppercase", fontSize: 12 }}>
                Why Choose Droply
              </span>
              <h2 className="mt-6 text-3xl md:text-4xl font-extrabold">Features that make you smile</h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Everything you need to manage your files like a pro. Simple, powerful, and blazing fast.</p>
            </div>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-6 rounded-2xl border bg-white shadow-sm" style={{ borderColor: "rgba(57,255,20,0.06)" }}>
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden" />
                <h3 className="mt-4 font-semibold text-lg">Smart Organization</h3>
                <p className="mt-2 text-gray-600">Create unlimited folders, star your favorites, and find everything instantly.</p>
              </div>

              <div className="p-6 rounded-2xl border bg-white shadow-sm" style={{ borderColor: "rgba(57,255,20,0.06)" }}>
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden" />
                <h3 className="mt-4 font-semibold text-lg">Lightning Fast</h3>
                <p className="mt-2 text-gray-600">Powered by ImageKit CDN for instant uploads and downloads.</p>
              </div>

              <div className="p-6 rounded-2xl border bg-white shadow-sm" style={{ borderColor: "rgba(57,255,20,0.06)" }}>
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden" />
                <h3 className="mt-4 font-semibold text-lg">Safe Trash System</h3>
                <p className="mt-2 text-gray-600">Accidentally deleted? Restore files from trash or permanently delete when ready.</p>
              </div>

              <div className="p-6 rounded-2xl border bg-white shadow-sm" style={{ borderColor: "rgba(57,255,20,0.06)" }}>
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden" />
                <h3 className="mt-4 font-semibold text-lg">Star Your Favorites</h3>
                <p className="mt-2 text-gray-600">Quick access to your most important files.</p>
              </div>

              <div className="p-6 rounded-2xl border bg-white shadow-sm" style={{ borderColor: "rgba(57,255,20,0.06)" }}>
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden" />
                <h3 className="mt-4 font-semibold text-lg">Secure & Private</h3>
                <p className="mt-2 text-gray-600">Protected by Clerk authentication.</p>
              </div>

              <div className="p-6 rounded-2xl border bg-white shadow-sm" style={{ borderColor: "rgba(57,255,20,0.06)" }}>
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden" />
                <h3 className="mt-4 font-semibold text-lg">Responsive Design</h3>
                <p className="mt-2 text-gray-600">Access your files from any device — it just works beautifully.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech */}
        <section id="tech" className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 rounded-full" style={{ background: "rgba(57,255,20,0.08)", color: "#39FF14", fontWeight: 600, textTransform: "uppercase", fontSize: 12 }}>
                Powered By
              </span>
              <h2 className="mt-6 text-3xl md:text-4xl font-extrabold">Built with cutting-edge technology</h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Modern, scalable, and performant. The best tools in the ecosystem working together.</p>
            </div>

            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
              {[
                ["Next.js", "/images/tect-nextjs.png"],
                ["React", "/images/tect-react.png"],
                ["Tailwind CSS", "/images/tech-tailwind.png"],
                ["Drizzle ORM", "/images/tech-drizzleorm.png"],
                ["PostgreSQL", "/images/tech-postgresql.png"],
                ["Clerk", "/images/tech-clerk.png"],
                ["ImageKit", "/images/tech-imagekit.jpg"],
                ["TypeScript", "/images/tech-typescript.svg"],
              ].map(([name, src]) => (
                <div key={String(name)} className="p-6 rounded-lg border bg-white shadow-sm text-center" style={{ borderColor: "rgba(57,255,20,0.06)" }}>
                  <div className="mx-auto h-12 w-12 rounded-md  flex items-center justify-center overflow-hidden">
                    <img src={String(src)} alt={String(name)} className="h-8 w-auto object-contain" />
                  </div>
                  <div className="mt-4 font-semibold">{name}</div>
                  <div className="text-sm text-gray-500 mt-1">Category</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <span className="inline-block px-4 py-1 rounded-full" style={{ background: "rgba(57,255,20,0.08)", color: "#39FF14", fontWeight: 600, textTransform: "uppercase", fontSize: 12 }}>
              Simple Process
            </span>
            <h2 className="mt-6 text-3xl md:text-4xl font-extrabold">Get started in seconds</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">No credit card required. No setup fees. Just sign up and start uploading.</p>

            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
              {["Create Account", "Upload Files", "Access Anywhere"].map((title, i) => (
                <div key={title} className="p-6 text-center">
                  <div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full text-black font-bold text-2xl"
                    style={{ background: "#39FF14", boxShadow: "0 10px 40px rgba(57,255,20,0.18)" }}
                  >
                    {i + 1}
                  </div>
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-2 text-gray-600">
                    {i === 0
                      ? "Sign up with your email in seconds. Secure authentication powered by Clerk."
                      : i === 1
                      ? "Drag and drop your files or click to upload. Create folders to organize everything."
                      : "Your files are available on any device, anytime. Download, share, or organize on the go."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-[rgba(57,255,20,0.03)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold">Ready to supercharge your storage?</h2>
            <p className="mt-4 text-gray-600">Join thousands of users who trust Droply for their file management needs. Start storing your files in the cloud today — it&apos;s free!</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up" className="px-6 py-3 rounded-full text-white font-semibold" style={{ background: "#39FF14" }}>
                Get Started Free
              </Link>
              <Link href="/sign-in" className="px-6 py-3 rounded-full border text-[#39FF14] font-medium" style={{ borderColor: "rgba(57,255,20,0.12)" }}>
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t" style={{ borderColor: "rgba(57,255,20,0.06)" }}>
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div
                className="text-2xl font-extrabold bg-clip-text text-transparent"
                style={{
                  background: "linear-gradient(90deg,#39FF14 0%, #2ecc71 100%)",
                  WebkitBackgroundClip: "text",
                }}
              >                Droply
              </div>
              <p className="mt-4 text-gray-600">Modern cloud storage built for speed, security, and simplicity.</p>
            </div>

            <div>
              <h4 className="text-[#39FF14] font-semibold mb-4 uppercase text-sm">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#features" className="hover:text-[#39FF14]">Features</a></li>
                <li><a href="#tech" className="hover:text-[#39FF14]">Technology</a></li>
                <li><a href="#how" className="hover:text-[#39FF14]">How It Works</a></li>
                <li><a href="/pricing" className="hover:text-[#39FF14]">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#39FF14] font-semibold mb-4 uppercase text-sm">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/about" className="hover:text-[#39FF14]">About Us</a></li>
                <li><a href="/blog" className="hover:text-[#39FF14]">Blog</a></li>
                <li><a href="/careers" className="hover:text-[#39FF14]">Careers</a></li>
                <li><a href="/contact" className="hover:text-[#39FF14]">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#39FF14] font-semibold mb-4 uppercase text-sm">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/privacy" className="hover:text-[#39FF14]">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-[#39FF14]">Terms of Service</a></li>
                <li><a href="/security" className="hover:text-[#39FF14]">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t" style={{ borderColor: "rgba(57,255,20,0.06)" }}>
            <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-500">© 2025 Droply. Built with care using Next.js, React, and modern web technologies.</div>
          </div>
        </footer>
      </main>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
