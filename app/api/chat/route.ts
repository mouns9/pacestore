import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// ── Fallback responses (no API key needed) ─────────────────────────────────
const FALLBACK_RULES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['bonjour', 'salut', 'hello', 'bonsoir', 'hey'],
    response:
      'Bonjour ! Je suis l\'assistant PaceStore. Je peux vous conseiller sur nos chaussures trail, compétition, montres GPS, et répondre à vos questions sur la livraison et les retours. Que cherchez-vous ?',
  },
  {
    keywords: ['hoka', 'speedgoat'],
    response:
      'La HOKA Speedgoat 5 est notre référence trail à 165 €. Drop 4 mm, stack 37/33 mm, semelle Vibram Megagrip. Idéale pour le trail technique et les longues distances en montagne. Poids 298 g en 42.',
  },
  {
    keywords: ['nike', 'vaporfly', 'carbone', 'marathon', 'compétition', 'competition', 'sub-3', 'sub3'],
    response:
      'La Nike Vaporfly 3 est à 275 €. Plaque carbone ZoomX, mousse à 85 % de restitution d\'énergie, poids 198 g. C\'est la chaussure des marathoniens sub-3h. Drop 8 mm, stack 40/32 mm.',
  },
  {
    keywords: ['garmin', 'forerunner', '965', 'montre', 'gps', 'watch'],
    response:
      'La Garmin Forerunner 965 est à 599 €. Écran AMOLED 1.4", GPS multi-bandes L1/L5, 31h d\'autonomie en mode GPS. Inclut HRV Status, Training Readiness et cartographie. Compatible Stryd.',
  },
  {
    keywords: ['on running', 'cloudmonster', 'on cloud', 'route', 'quotidien', 'daily'],
    response:
      'La On Running Cloudmonster 2 est à 189 €. Amorti CloudTec Phase XXL, drop 6 mm, stack 38/32 mm, poids 279 g. Parfaite pour les sorties longues et les tempos sur bitume.',
  },
  {
    keywords: ['livraison', 'délai', 'expédition', 'délais', 'combien de temps', 'quand'],
    response:
      'Livraison express 48h en France et en Europe. Livraison offerte dès 150 € de commande, sinon 4,99 €. Vous recevrez un email de confirmation avec votre numéro de suivi.',
  },
  {
    keywords: ['retour', 'retours', 'échange', 'remboursement', 'rembourser', 'renvoyer'],
    response:
      'Retours gratuits acceptés sous 60 jours, sans condition. Si la chaussure ne convient pas à votre foulée, on échange ou on rembourse. Contactez support@pacestore.fr pour initier un retour.',
  },
  {
    keywords: ['taille', 'pointure', 'sizing', 'quelle taille', 'comment choisir ma taille'],
    response:
      'En règle générale, prenez une taille au-dessus de votre pointure habituelle pour les chaussures de running (espace d\'un doigt en bout de pied). Pour les montres, une seule taille. Nos fiches produit indiquent le poids par pointure de référence.',
  },
  {
    keywords: ['drop', 'différence de drop', 'pronation', 'foulée'],
    response:
      'Le drop, c\'est la différence de hauteur talon/avant-pied. Drop bas (0–4 mm) : avant-pied, trail technique. Drop moyen (6–8 mm) : polyvalent. Drop élevé (>8 mm) : confort, longues distances. Consultez notre guide complet sur /guide.',
  },
  {
    keywords: ['stack', 'amorti', 'semelle', 'épaisseur'],
    response:
      'Le stack, c\'est l\'épaisseur totale de la semelle. Stack élevé (>35 mm) = amorti maximaliste pour l\'ultra. Stack bas (<25 mm) = réactivité et feedback sol pour la piste. Retrouvez tout sur /guide.',
  },
  {
    keywords: ['prix', 'cher', 'budget', 'moins cher', 'promotion', 'promo', 'solde'],
    response:
      'Notre gamme va de 165 € (HOKA Speedgoat 5) à 599 € (Garmin Forerunner 965). Livraison offerte dès 150 €. Pas de soldes permanentes, mais des promotions ponctuelles par newsletter.',
  },
  {
    keywords: ['paiement', 'carte', 'visa', 'stripe', 'sécurisé', 'securise'],
    response:
      'Paiement 100 % sécurisé via Stripe. Cartes Visa, Mastercard, American Express acceptées. Vos données bancaires ne transitent jamais par nos serveurs.',
  },
  {
    keywords: ['contact', 'email', 'support', 'aide', 'problème', 'probleme'],
    response:
      'Pour toute question, contactez-nous à support@pacestore.fr. Réponse sous 24h ouvrées. Pour un retour, mentionnez votre numéro de commande (PACE-XXXXXX).',
  },
  {
    keywords: ['trail', 'montagne', 'sentier', 'boue'],
    response:
      'Pour le trail, la HOKA Speedgoat 5 (165 €) est notre référence : semelle Vibram Megagrip, amorti maximaliste CMEVA. Idéale pour les terrains rocheux et humides, de 10 km à l\'ultra.',
  },
  {
    keywords: ['merci', 'thanks', 'parfait', 'super', 'génial'],
    response:
      'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions sur nos produits ou votre commande. Bonne course ! 🏃',
  },
];

function fallbackResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  for (const rule of FALLBACK_RULES) {
    if (rule.keywords.some((kw) => msg.includes(kw))) {
      return rule.response;
    }
  }
  return 'Je suis l\'assistant PaceStore. Posez-moi vos questions sur nos chaussures trail (HOKA Speedgoat 5), compétition (Nike Vaporfly 3), GPS (Garmin Forerunner 965), la livraison (48h, gratuite dès 150€) ou les retours (60 jours).';
}

// ── System prompt for Anthropic ────────────────────────────────────────────
const SYSTEM = `Tu es l'assistant expert de PaceStore, une boutique running premium en ligne.
Réponds en français, avec un ton technique, direct et enthousiaste.
Sois concis (2-4 phrases maximum par réponse).

CATALOGUE :
- HOKA Speedgoat 5 — 165 € — Trail technique, drop 4mm, stack 37/33mm, poids 298g, Vibram Megagrip
- Nike Vaporfly 3 — 275 € — Compétition route, drop 8mm, plaque carbone ZoomX, poids 198g
- Garmin Forerunner 965 — 599 € — Montre GPS AMOLED 1.4", 31h autonomie, multi-bandes L1/L5, HRV, Training Readiness
- On Running Cloudmonster 2 — 189 € — Route quotidien, drop 6mm, stack 38/32mm, CloudTec Phase XXL

LIVRAISON & RETOURS :
- Livraison 48h express France & Europe
- Livraison gratuite dès 150€ de commande
- Retours gratuits sous 60 jours, sans condition`;

type MessageParam = { role: 'user' | 'assistant'; content: string };

export async function POST(req: Request) {
  const { messages } = await req.json() as { messages: MessageParam[] };
  const lastUserMessage = messages.filter((m) => m.role === 'user').at(-1)?.content ?? '';

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const hasValidKey = apiKey && apiKey !== 'REMPLACE_QUAND_CONSOLE_REVIENT' && apiKey.startsWith('sk-ant-');

  // Use fallback if no valid API key
  if (!hasValidKey) {
    return NextResponse.json({ content: fallbackResponse(lastUserMessage) });
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ content });
  } catch {
    // API call failed — fall back to local responses
    return NextResponse.json({ content: fallbackResponse(lastUserMessage) });
  }
}
