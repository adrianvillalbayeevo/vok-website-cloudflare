// Cloudflare Pages Function: POST /api/lead
//
// Receives the "Book a demo" form and sends two emails through Resend:
//   (1) an autoresponder to the prospect, with VOK branding;
//   (2) an internal notice with every field of the form.
//
// It replaces the old Supabase flow (insert into `leads` -> database webhook ->
// `notify-lead` edge function). Nothing is stored: the internal email IS the
// record of the lead. That is why a failure of (2) is an error the visitor
// sees, while a failure of (1) is only logged.
//
// Secrets and variables (Cloudflare Pages -> Settings -> Variables and Secrets):
//   RESEND_API_KEY  secret, a Resend key allowed to send from buildwithvok.com
//   NOTIFY_TO       where the internal notice goes. It is a variable and not a
//                   constant because this repository is public.

interface Env {
  RESEND_API_KEY?: string;
  NOTIFY_TO?: string;
}

interface Context {
  request: Request;
  env: Env;
}

const FROM = "VOK <contact@buildwithvok.com>";
const MAX_FIELD = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Form field -> label in the internal notice, in display order. The keys are
// the ones the old `leads` table used, so the notice reads the same as before.
const FIELDS: Array<[string, string]> = [
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["organization", "Organization"],
  ["website", "Website"],
  ["sport", "Sport"],
  ["athletes_count", "Athletes"],
  ["current_software", "Current software"],
  ["pain_points", "Pain points"],
  ["dream_platform", "Dream platform"],
];

function esc(v: unknown): string {
  return String(v ?? "-")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function sendEmail(
  apiKey: string,
  to: string,
  subject: string,
  html: string,
  replyTo?: string,
): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html, reply_to: replyTo }),
  });
  if (!res.ok) console.error("Resend error:", res.status, await res.text());
  return res.ok;
}

function autoresponderHtml(name: string, logo: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2F2;padding:28px 0;font-family:Arial,Helvetica,sans-serif">
        <tr><td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:14px;overflow:hidden">
            <tr><td style="background:#0C1330;padding:22px 28px">
              <img src="${logo}" alt="VOK" width="88" style="display:block;border:0;height:auto">
            </td></tr>
            <tr><td style="padding:32px 28px;color:#0C1330;line-height:1.6">
              <h1 style="margin:0 0 14px;font-size:22px;color:#0C1330">Thanks, ${name}.</h1>
              <p style="margin:0 0 14px;font-size:15px">We've received your message and we'll be in touch shortly — usually within 24 hours.</p>
              <p style="margin:0 0 26px;font-size:15px">In the meantime, we're already thinking about how your club could run on <b>its own platform</b>.</p>
              <p style="margin:0;font-size:15px">— The VOK team<br><span style="color:#FF5A1F;font-weight:bold">Build with VOK.</span></p>
            </td></tr>
            <tr><td style="padding:16px 28px;border-top:1px solid #EAEBEF;color:#8A93A6;font-size:12px">
              VOK — A brand of Okra USA LLC &nbsp;·&nbsp; <a href="https://buildwithvok.com" style="color:#8A93A6;text-decoration:underline">buildwithvok.com</a>
            </td></tr>
          </table>
        </td></tr>
      </table>`;
}

function noticeHtml(lead: Record<string, string>): string {
  const rows = FIELDS.map(
    ([key, label]) =>
      `<tr><td style="padding:2px 10px"><b>${label}</b></td><td>${esc(lead[key] || "-")}</td></tr>`,
  ).join("\n        ");
  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#0C1330;line-height:1.6">
      <h3 style="margin:0 0 12px">New lead from buildwithvok.com</h3>
      <table style="border-collapse:collapse">
        ${rows}
      </table>
    </div>`;
}

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO) {
    console.error("lead: RESEND_API_KEY or NOTIFY_TO is not configured");
    return json({ ok: false, error: "not_configured" }, 500);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  // Honeypot: a bot filled the hidden field. Answer as if it worked so the bot
  // learns nothing, and send nothing.
  if (typeof body.company_alt === "string" && body.company_alt.trim()) {
    return json({ ok: true });
  }

  const lead: Record<string, string> = {};
  for (const [key] of FIELDS) {
    const v = body[key];
    if (typeof v === "string" && v.trim()) lead[key] = v.trim().slice(0, MAX_FIELD);
  }

  if (!lead.name || !lead.email || !EMAIL_RE.test(lead.email)) {
    return json({ ok: false, error: "invalid" }, 422);
  }

  const name = esc(lead.name);
  // The logo is served by this same site, so it works on the custom domain and
  // on preview deployments alike.
  const logo = `${new URL(request.url).origin}/brand/vok_wordmark_white.png`;

  const autoresponderOk = await sendEmail(
    env.RESEND_API_KEY,
    lead.email,
    "Thanks for reaching out to VOK",
    autoresponderHtml(name, logo),
    env.NOTIFY_TO,
  );
  if (!autoresponderOk) console.error("lead: autoresponder failed");

  const noticeOk = await sendEmail(
    env.RESEND_API_KEY,
    env.NOTIFY_TO,
    `New VOK lead: ${lead.name}`,
    noticeHtml(lead),
    lead.email,
  );
  if (!noticeOk) return json({ ok: false, error: "send_failed" }, 502);

  return json({ ok: true });
}
