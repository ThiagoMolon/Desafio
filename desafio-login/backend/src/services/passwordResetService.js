const crypto = require("crypto");
const bcrypt = require("bcrypt");
const pool = require("../config/database");
const { sendPasswordResetCode } = require("./mailer");

function hashCode(code) {
	return crypto.createHash("sha256").update(code).digest("hex");
}

async function requestPasswordReset(email) {
	const normalizedEmail = email.trim().toLowerCase();
	const result = await pool.query(
		"SELECT id, email FROM usuarios WHERE email = $1",
		[normalizedEmail]
	);

	if (!result.rows[0]) return;

	const code = crypto.randomInt(100000, 1000000).toString();
	await pool.query(
		`UPDATE password_reset_tokens
		 SET used_at = CURRENT_TIMESTAMP
		 WHERE user_id = $1 AND used_at IS NULL`,
		[result.rows[0].id]
	);
	await pool.query(
		`INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
		 VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '15 minutes')`,
		[result.rows[0].id, hashCode(code)]
	);

	await sendPasswordResetCode(normalizedEmail, code);
}

async function resetPassword({ email, code, novaSenha }) {
	const normalizedEmail = email.trim().toLowerCase();
	const client = await pool.connect();

	try {
		await client.query("BEGIN");
		const userResult = await client.query(
			"SELECT id FROM usuarios WHERE email = $1",
			[normalizedEmail]
		);
		const user = userResult.rows[0];

		if (!user) return false;

		const tokenResult = await client.query(
			`SELECT id, token_hash
			 FROM password_reset_tokens
			 WHERE user_id = $1
			   AND used_at IS NULL
			   AND expires_at > CURRENT_TIMESTAMP
			 ORDER BY created_at DESC
			 LIMIT 1
			 FOR UPDATE`,
			[user.id]
		);
		const token = tokenResult.rows[0];
		const isValidCode = token && crypto.timingSafeEqual(
			Buffer.from(token.token_hash, "hex"),
			Buffer.from(hashCode(code), "hex")
		);

		if (!isValidCode) {
			await client.query("ROLLBACK");
			return false;
		}

		const passwordHash = await bcrypt.hash(novaSenha, 12);
		await client.query(
			"UPDATE usuarios SET senha_hash = $1 WHERE id = $2",
			[passwordHash, user.id]
		);
		await client.query(
			"UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = $1",
			[token.id]
		);
		await client.query("COMMIT");
		return true;
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
}

module.exports = { requestPasswordReset, resetPassword };