const nodemailer = require("nodemailer");

const hasSmtpConfig = Boolean(
	process.env.SMTP_HOST &&
	process.env.SMTP_USER &&
	process.env.SMTP_PASSWORD
);

const transporter = hasSmtpConfig
	? nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT || 587),
			secure: process.env.SMTP_SECURE === "true",
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		})
	: null;

async function sendPasswordResetCode(email, code) {
	if (!transporter) {
		if (process.env.NODE_ENV !== "production") {
			console.log(`[recuperacao] Codigo para ${email}: ${code}`);
			return;
		}

		throw new Error("SMTP não configurado.");
	}

	await transporter.sendMail({
		from: process.env.EMAIL_FROM || process.env.SMTP_USER,
		to: email,
		subject: "Código para redefinir sua senha",
		text: `Seu código de recuperação é ${code}. Ele expira em 15 minutos.`,
	});
}

module.exports = { sendPasswordResetCode };