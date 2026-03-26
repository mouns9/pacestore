import type { Metadata } from "next";
import "./globals.css";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "PaceStore — Équipement Running Expert",
  description:
    "Sélection expert de chaussures trail, compétition et montres GPS pour coureurs sérieux. Drop, stack, carbone — on parle votre langue.",
  keywords: ["running", "trail", "chaussures", "Garmin", "Nike", "HOKA", "compétition"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-[#0A0A0A] text-white antialiased">

        {/* ── Navigation ────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5" style={{ animation: "slideDown 0.5s ease both" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">

            {/* Logo */}
            <a href="/" className="flex items-center gap-0.5 flex-shrink-0">
              <span className="text-[#FF5C00] font-black text-xl tracking-tight uppercase">Pace</span>
              <span className="font-black text-xl tracking-tight uppercase text-white">Store</span>
            </a>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
              {["Trail", "Route", "GPS", "Nutrition", "Conseils"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="relative py-1 hover:text-white transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#FF5C00] after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button className="hidden sm:flex items-center gap-1.5 text-white/30 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                Recherche
              </button>
              <div className="w-px h-5 bg-white/10 hidden sm:block" />
              <button className="flex items-center gap-2 bg-[#FF5C00] hover:bg-white hover:text-[#0A0A0A] transition-all duration-300 text-white text-xs font-black uppercase tracking-[0.15em] px-4 py-2">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                </svg>
                Panier (0)
              </button>
            </div>
          </div>
        </header>

        <main>{children}</main>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="bg-[#080808] border-t border-white/5 mt-0">

          {/* Newsletter band */}
          <div className="border-b border-white/5 bg-[#0F0F0F]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-md">
                  <p className="text-[#FF5C00] text-xs font-bold uppercase tracking-[0.3em] mb-3">Newsletter</p>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight mb-2">
                    Restez dans la course.
                  </h3>
                  <p className="text-white/35 text-sm leading-relaxed">
                    Nouveautés, tests terrain, promotions exclusives. Une sélection pointue, sans spam.
                  </p>
                </div>
                <NewsletterForm />
              </div>
            </div>
          </div>

          {/* Links grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">

              {/* Brand */}
              <div className="col-span-2 sm:col-span-1">
                <div className="flex items-center gap-0.5 mb-4">
                  <span className="text-[#FF5C00] font-black text-xl tracking-tight uppercase">Pace</span>
                  <span className="font-black text-xl tracking-tight uppercase text-white">Store</span>
                </div>
                <p className="text-white/30 text-sm leading-relaxed">
                  Équipement running sélectionné par des experts pour les coureurs sérieux.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  {/* Instagram */}
                  <a href="#" className="text-white/20 hover:text-[#FF5C00] transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  {/* Strava */}
                  <a href="#" className="text-white/20 hover:text-[#FF5C00] transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h7l-2 8 10-12h-7l2-8z" />
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a href="#" className="text-white/20 hover:text-[#FF5C00] transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Shop */}
              <div>
                <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-5">Boutique</h4>
                <ul className="space-y-3">
                  {["Trail", "Route & compétition", "GPS & montres", "Nutrition", "Accessoires"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/30 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-5">Ressources</h4>
                <ul className="space-y-3">
                  {["Guide de sélection", "Comment choisir son drop", "Carbone ou mousse ?", "Avis & tests", "Blog running"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/30 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-5">Support</h4>
                <ul className="space-y-3">
                  {["Livraison & retours", "Tailles & guides", "FAQ", "Contact", "Mentions légales"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/30 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/20">
              <span>© 2026 PaceStore. Équipement sélectionné par des coureurs, pour des coureurs.</span>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
                <a href="#" className="hover:text-white transition-colors">CGV</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
