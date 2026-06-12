import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: process.env.MAILPIT_HOST || 'localhost',
  port: Number(process.env.MAILPIT_SMTP_PORT) || 1025,
  secure: false,
  ignoreTLS: true,
});

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  await transport.sendMail({
    from: '"Scrumboard" <noreply@scrumboard.local>',
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}
