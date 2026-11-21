// Cloudflare Pages Function: POST /api/lead
//
// Receives the "Book a demo" form and sends two emails through Resend:
//   (1) a short, plain reply to the prospect;
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

const FROM = "Build with VOK <contact@buildwithvok.com>";
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
  text?: string,
): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html, text, reply_to: replyTo }),
  });
  if (!res.ok) console.error("Resend error:", res.status, await res.text());
  return res.ok;
}

// The autoresponder reads like a short note from a person, not a newsletter:
// no card, no banner, no logo, no colors, plus a hand-written plain-text part.
// Gmail sent the branded version to Promotions, and a prospect who does not
// see the reply may think the form failed. The first name only, as a person
// would write it.
function autoresponderText(firstName: string): string {
  return `Hi ${firstName},

Thanks for reaching out. We got your message and we'll get back to you within 24 hours.

In the meantime, we're already thinking about how your club could run on its own platform. If anything comes to mind before then, just reply to this email.

The VOK team
Build with VOK
buildwithvok.com
`;
}

function autoresponderHtml(firstName: string): string {
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#222">
<p>Hi ${firstName},</p>
<p>Thanks for reaching out. We got your message and we'll get back to you within 24 hours.</p>
<p>In the meantime, we're already thinking about how your club could run on its own platform. If anything comes to mind before then, just reply to this email.</p>
<p>The VOK team<br>Build with VOK<br><a href="https://buildwithvok.com">buildwithvok.com</a></p>
</div>`;
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

  const firstName = lead.name.split(/\s+/)[0];

  const autoresponderOk = await sendEmail(
    env.RESEND_API_KEY,
    lead.email,
    "Thanks for reaching out to VOK",
    autoresponderHtml(esc(firstName)),
    env.NOTIFY_TO,
    autoresponderText(firstName),
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
