const bcrypt = require("bcrypt");
const pool = require("../config/database");

async function createUser({ nome, email, senha }) {
	const normalizedEmail = email.trim().toLowerCase();
	const passwordHash = await bcrypt.hash(senha, 12);

	try {
		const result = await pool.query(
			`INSERT INTO usuarios (nome, email, senha_hash)
			 VALUES ($1, $2, $3)
			 RETURNING id, nome, email, criado_em`,
			[nome.trim(), normalizedEmail, passwordHash]
		);

		return result.rows[0];
	} catch (error) {
		if (error.code === "23505") {
			const duplicateEmailError = new Error("Este email já está cadastrado.");
			duplicateEmailError.code = "EMAIL_ALREADY_EXISTS";
			throw duplicateEmailError;
		}

		throw error;
	}
}

module.exports = { createUser };

async function authenticateUser({ email, senha }) {
	const normalizedEmail = email.trim().toLowerCase();
	const result = await pool.query(
		`SELECT id, nome, email, senha_hash
		 FROM usuarios
		 WHERE email = $1`,
		[normalizedEmail]
	);

	const user = result.rows[0];
	if (!user || !(await bcrypt.compare(senha, user.senha_hash))) {
		return null;
	}

	return {
		id: user.id,
		nome: user.nome,
		email: user.email,
	};
}

module.exports.authenticateUser = authenticateUser;
