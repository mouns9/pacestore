import Link from 'next/link';

const SECTIONS = [
  {
    tag: 'Drop',
    title: 'Choisir son drop',
    body: "Le drop est la différence de hauteur entre le talon et l'avant-pied. Un drop bas (0–4 mm) sollicite davantage les mollets et convient aux coureurs avant-pied. Un drop moyen (6–8 mm) est polyvalent. Au-delà de 8 mm, le déroulé est assisté — idéal pour les longues distances ou les coureurs taloniers.",
    items: [
      { label: '0–4 mm', desc: 'Avant-pied, minimalisme, trail technique' },
      { label: '6–8 mm', desc: 'Polyvalent, transition naturelle' },
      { label: '10–12 mm', desc: 'Route longue distance, récupération' },
    ],
  },
  {
    tag: 'Stack',
    title: 'Comprendre le stack',
    body: "Le stack est l'épaisseur totale de la semelle intermédiaire. Un stack élevé (>35 mm) offre un amorti maximaliste adapté à l'ultra-trail ou aux sorties longues. Un stack bas (<25 mm) donne plus de feedback sol et de réactivité — à privilégier sur piste ou pour les séances de vitesse.",
    items: [
      { label: '< 25 mm', desc: 'Piste, compétition, réactivité maximale' },
      { label: '25–35 mm', desc: 'Route, trail modéré' },
      { label: '> 35 mm', desc: 'Ultra, longue distance, amorti maximaliste' },
    ],
  },
  {
    tag: 'Terrain',
    title: 'Trail vs Route vs Compétition',
    body: 'Le terrain dicte la chaussure. En trail, la semelle Vibram ou similaire avec crampons est indispensable sur terrain meuble ou humide. Sur route, une semelle lisse ou semi-structurée offre efficacité et légèreté. Pour la compétition, la plaque carbone amplifie la propulsion — mais nécessite une adaptation progressive.',
    items: [
      { label: 'Trail rocky', desc: 'Vibram Megagrip, protection renforcée' },
      { label: 'Route & bitume', desc: 'Semelle souple, légèreté, réactivité' },
      { label: 'Compétition', desc: 'Plaque carbone, ZoomX ou Pebax' },
    ],
  },
  {
    tag: 'Pronation',
    title: 'Comprendre sa foulée',
    body: "La pronation est le mouvement naturel du pied lors du déroulé. Une foulée neutre ne nécessite pas de correction. Une supination (pied qui s'inverse) demande plus d'amorti latéral. Une pronation excessive peut bénéficier d'un soutien médial — mais évitez le surcorrectif si ce n'est pas diagnostiqué.",
    items: [
      { label: 'Neutre', desc: 'Chaussure neutre, liberté de mouvement' },
      { label: 'Supinatoire', desc: 'Amorti renforcé côté externe' },
      { label: 'Pronatoire', desc: 'Soutien médial, anti-pronation' },
    ],
  },
];

const PICKS = [
  { name: 'HOKA Speedgoat 5', for: 'Trail technique & ultra', price: '165 €', drop: '4 mm', tag: 'Trail' },
  { name: 'Nike Vaporfly 3', for: 'Compétition & PB marathon', price: '275 €', drop: '8 mm', tag: 'Compétition' },
  { name: 'Garmin Forerunner 965', for: 'Suivi performance élite', price: '599 €', drop: '—', tag: 'GPS' },
  { name: 'On Running Cloudmonster 2', for: 'Entraînement quotidien', price: '189 €', drop: '6 mm', tag: 'Route' },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* Header */}
      <div className="border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-[#FF5C00] font-black text-lg tracking-tight uppercase">Pace</span>
            <span className="font-black text-lg tracking-tight uppercase text-white">Store</span>
          </Link>
          <Link href="/#catalogue" className="text-white/30 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
            ← Catalogue
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

        {/* Hero */}
        <div className="mb-16">
          <p className="text-[#FF5C00] text-xs font-bold uppercase tracking-[0.3em] mb-3">Expertise PaceStore</p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight mb-5">
            Guide de<br /><span className="text-white/15">sélection</span>
          </h1>
          <p className="text-white/40 text-base leading-relaxed max-w-xl">
            Drop, stack, pronation, terrain — les quatre variables qui définissent la chaussure de running idéale pour votre profil et vos objectifs.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12 mb-20">
          {SECTIONS.map((section) => (
            <div key={section.tag} className="bg-[#111111] border border-white/5">
              {/* Header */}
              <div className="px-6 pt-6 pb-5 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5C00] bg-[#FF5C00]/10 border border-[#FF5C00]/20 px-2.5 py-1 mb-3 inline-block">
                  {section.tag}
                </span>
                <h2 className="text-white font-black text-xl uppercase tracking-tight">{section.title}</h2>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-white/45 text-sm leading-relaxed">{section.body}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {section.items.map((item) => (
                    <div key={item.label} className="bg-[#0A0A0A] border border-white/5 p-3 hover:border-[#FF5C00]/20 transition-colors">
                      <div className="text-[#FF5C00] text-sm font-black mb-1">{item.label}</div>
                      <div className="text-white/35 text-xs leading-relaxed">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Our picks */}
        <div>
          <p className="text-[#FF5C00] text-xs font-bold uppercase tracking-[0.3em] mb-3">Sélection expert</p>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
            Nos recommandations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {PICKS.map((pick) => (
              <div key={pick.name} className="bg-[#111111] border border-white/5 p-5 hover:border-[#FF5C00]/30 transition-colors group">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30 bg-white/5 px-2 py-0.5 border border-white/5">
                    {pick.tag}
                  </span>
                  <span className="text-[#FF5C00] font-black">{pick.price}</span>
                </div>
                <h3 className="text-white font-black text-sm uppercase tracking-wide group-hover:text-[#FF5C00] transition-colors mb-1">
                  {pick.name}
                </h3>
                <p className="text-white/35 text-xs">{pick.for}</p>
                {pick.drop !== '—' && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <span className="text-white/20 text-[10px] uppercase tracking-wider">Drop {pick.drop}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Link
            href="/#catalogue"
            className="inline-flex items-center gap-2 bg-[#FF5C00] hover:bg-white hover:text-[#0A0A0A] text-white font-black text-xs uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300"
          >
            Voir le catalogue complet
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
