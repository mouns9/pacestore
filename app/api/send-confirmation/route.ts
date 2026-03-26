import { NextResponse } from 'next/server';
import { Resend } from 'resend';

type OrderItem = { name: string; quantity: number; price: number };

export async function POST(req: Request) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: 'Resend not configured' }, { status: 500 });
  }

  const { name, email, orderId, items, total } = await req.json() as {
    name: string;
    email: string;
    orderId: string;
    items: OrderItem[];
    total: number;
  };

  const resend = new Resend(resendKey);
  const shipping = total < 150 ? 4.99 : 0;

  const itemRows = items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #1A1A1A;color:#fff;font-size:13px">${i.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #1A1A1A;color:#888;text-align:center">×${i.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #1A1A1A;color:#FF5C00;text-align:right;font-weight:700">${(i.price * i.quantity).toLocaleString('fr-FR')} €</td>
        </tr>`
    )
    .join('');

  await resend.emails.send({
    from: 'PaceStore <commandes@pacestore.fr>',
    to: email,
    subject: `Confirmation de commande ${orderId} — PaceStore`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:system-ui,sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#111111;border:1px solid rgba(255,255,255,0.05)">

    <!-- Header -->
    <div style="background:#FF5C00;padding:24px 32px">
      <span style="color:#fff;font-size:20px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em">Pace</span><span style="color:#fff;font-size:20px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;opacity:0.6">Store</span>
    </div>

    <!-- Body -->
    <div style="padding:32px">
      <p style="color:#FF5C00;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.3em;margin:0 0 12px">Commande confirmée</p>
      <h1 style="color:#fff;font-size:24px;font-weight:900;text-transform:uppercase;margin:0 0 8px">${orderId}</h1>
      <p style="color:rgba(255,255,255,0.4);font-size:14px;margin:0 0 32px">Merci ${name}, votre commande est confirmée. Livraison sous 48h.</p>

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse">
        ${itemRows}
      </table>

      <!-- Totals -->
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08)">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="color:rgba(255,255,255,0.3);font-size:12px">Livraison</span>
          <span style="color:${shipping === 0 ? '#34d399' : 'rgba(255,255,255,0.5)'};font-size:12px">${shipping === 0 ? 'Offerte' : shipping.toFixed(2) + ' €'}</span>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span style="color:#fff;font-size:16px;font-weight:900;text-transform:uppercase">Total</span>
          <span style="color:#fff;font-size:22px;font-weight:900">${(total + shipping).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
        </div>
      </div>

      <!-- Tracking CTA -->
      <div style="margin-top:32px;text-align:center">
        <a href="https://pacestore.fr/tracking?id=${orderId}" style="display:inline-block;background:#FF5C00;color:#fff;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;padding:14px 32px;text-decoration:none">
          Suivre ma commande →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.05)">
      <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0">Retours acceptés sous 60 jours — questions : support@pacestore.fr</p>
    </div>
  </div>
</body>
</html>`,
  });

  return NextResponse.json({ success: true });
}
