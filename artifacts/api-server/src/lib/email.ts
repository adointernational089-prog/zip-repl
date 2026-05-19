import nodemailer from "nodemailer";

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendReplyNotification({
  toEmail,
  toName,
  originalMessage,
  replyContent,
  replyFrom,
}: {
  toEmail: string;
  toName: string;
  originalMessage: string;
  replyContent: string;
  replyFrom: string;
}) {
  const transporter = createTransporter();
  if (!transporter) return;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin:0; padding:0; background:#06060f; font-family: 'Segoe UI', Arial, sans-serif; color:#e2e8f0; }
    .wrap { max-width:580px; margin:0 auto; padding:32px 16px; }
    .card { background:#0d0d1f; border:1px solid rgba(255,255,255,0.1); border-radius:16px; overflow:hidden; }
    .header { padding:24px 28px; background:linear-gradient(135deg,#0ea5e9,#2563eb); }
    .header h1 { margin:0; font-size:20px; font-weight:800; color:#fff; }
    .header p { margin:6px 0 0; font-size:13px; color:rgba(255,255,255,0.8); }
    .body { padding:28px; }
    .label { font-size:10px; font-weight:700; letter-spacing:.15em; text-transform:uppercase; color:#64748b; margin-bottom:8px; }
    .bubble { padding:16px; border-radius:12px; font-size:14px; line-height:1.6; margin-bottom:20px; }
    .bubble-user { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); color:#94a3b8; }
    .bubble-admin { background:rgba(14,165,233,0.12); border:1px solid rgba(14,165,233,0.3); color:#e2e8f0; }
    .from-badge { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; color:#38bdf8; margin-bottom:10px; }
    .cta { display:block; text-align:center; margin:24px 0 0; padding:14px 24px; background:linear-gradient(90deg,#0ea5e9,#2563eb); color:#fff; text-decoration:none; border-radius:10px; font-weight:700; font-size:14px; }
    .footer { padding:16px 28px; border-top:1px solid rgba(255,255,255,0.06); text-align:center; font-size:11px; color:#475569; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="header">
        <h1>💬 New Reply from Bishal's Hub</h1>
        <p>You have a new reply to your message</p>
      </div>
      <div class="body">
        <p>Hi <strong>${toName}</strong>,</p>
        <p style="font-size:14px;color:#94a3b8;margin-bottom:20px;">
          <strong style="color:#38bdf8">${replyFrom}</strong> has replied to your message on Bishal's Hub.
        </p>

        <div class="label">Your original message</div>
        <div class="bubble bubble-user">${originalMessage.replace(/\n/g, "<br/>")}</div>

        <div class="from-badge">⚡ Reply from ${replyFrom}</div>
        <div class="bubble bubble-admin">${replyContent.replace(/\n/g, "<br/>")}</div>

        <a class="cta" href="${process.env.SITE_URL || "https://bishalshub.replit.app"}/dashboard">
          View Full Conversation →
        </a>
      </div>
      <div class="footer">
        Bishal's Hub · bishalbishwokarma089@gmail.com
      </div>
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"Bishal's Hub" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `💬 New reply from ${replyFrom} — Bishal's Hub`,
      html,
      text: `Hi ${toName},\n\n${replyFrom} replied to your message:\n\n"${replyContent}"\n\nView the full conversation at: ${process.env.SITE_URL || "https://bishalshub.replit.app"}/dashboard`,
    });
  } catch (err) {
    console.error("Email send error (non-fatal):", err);
  }
}

export async function sendNewMessageAlert({
  senderName,
  senderEmail,
  messageContent,
}: {
  senderName: string;
  senderEmail: string;
  messageContent: string;
}) {
  const transporter = createTransporter();
  if (!transporter) return;

  const adminEmail = process.env.EMAIL_USER || "bishalbishwokarma089@gmail.com";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { margin:0; padding:0; background:#06060f; font-family: 'Segoe UI', Arial, sans-serif; color:#e2e8f0; }
    .wrap { max-width:580px; margin:0 auto; padding:32px 16px; }
    .card { background:#0d0d1f; border:1px solid rgba(255,255,255,0.1); border-radius:16px; overflow:hidden; }
    .header { padding:24px 28px; background:linear-gradient(135deg,#7c3aed,#0ea5e9); }
    .header h1 { margin:0; font-size:20px; font-weight:800; color:#fff; }
    .body { padding:28px; }
    .info-row { display:flex; gap:12px; padding:12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:10px; margin-bottom:10px; }
    .label { font-size:10px; font-weight:700; letter-spacing:.15em; text-transform:uppercase; color:#64748b; }
    .value { font-size:14px; font-weight:600; color:#e2e8f0; margin-top:2px; }
    .msg-box { padding:16px; border-radius:12px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); font-size:14px; line-height:1.6; color:#94a3b8; margin-top:16px; }
    .cta { display:block; text-align:center; margin:24px 0 0; padding:14px 24px; background:linear-gradient(90deg,#7c3aed,#0ea5e9); color:#fff; text-decoration:none; border-radius:10px; font-weight:700; font-size:14px; }
    .footer { padding:16px 28px; border-top:1px solid rgba(255,255,255,0.06); text-align:center; font-size:11px; color:#475569; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="header">
        <h1>📨 New Message on Bishal's Hub</h1>
      </div>
      <div class="body">
        <div class="info-row">
          <div><div class="label">From</div><div class="value">${senderName}</div></div>
        </div>
        <div class="info-row">
          <div><div class="label">Email</div><div class="value">${senderEmail}</div></div>
        </div>
        <div class="msg-box">${messageContent.replace(/\n/g, "<br/>")}</div>
        <a class="cta" href="${process.env.SITE_URL || "https://bishalshub.replit.app"}/admin/messages">
          Reply in Admin Panel →
        </a>
      </div>
      <div class="footer">Bishal's Hub Admin Alert</div>
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"Bishal's Hub" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `📨 New message from ${senderName} — Bishal's Hub`,
      html,
      text: `New message from ${senderName} (${senderEmail}):\n\n${messageContent}\n\nReply at: ${process.env.SITE_URL || "https://bishalshub.replit.app"}/admin/messages`,
    });
  } catch (err) {
    console.error("Admin email alert error (non-fatal):", err);
  }
}
