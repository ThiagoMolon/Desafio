const { authenticateUser, createUser } = require("../services/userService");
const {
	requestPasswordReset,
	resetPassword,
} = require("../services/passwordResetService");

async function createUserController(req, res) {
	const { nome, email, senha } = req.body;

	if (!nome || !email || !senha) {
		return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
	}

	try {
		const user = await createUser({ nome, email, senha });
		return res.status(201).json({ user });
	} catch (error) {
		if (error.code === "EMAIL_ALREADY_EXISTS") {
			return res.status(409).json({ error: error.message });
		}

		console.error("Erro ao cadastrar usuário:", error);
		return res.status(500).json({ error: "Não foi possível cadastrar o usuário." });
	}
}

module.exports = { createUserController };

async function loginController(req, res) {
	const { email, senha } = req.body;

	if (!email || !senha) {
		return res.status(400).json({ error: "Email e senha são obrigatórios." });
	}

	try {
		const user = await authenticateUser({ email, senha });
		if (!user) {
			return res.status(401).json({ error: "Email ou senha inválidos." });
		}

		return res.status(200).json({ user });
	} catch (error) {
		console.error("Erro ao fazer login:", error);
		return res.status(500).json({ error: "Não foi possível fazer login." });
	}
}

module.exports.loginController = loginController;

async function requestPasswordResetController(req, res) {
	const { email } = req.body;
	if (!email) {
		return res.status(400).json({ error: "Email é obrigatório." });
	}

	try {
		await requestPasswordReset(email);
		return res.status(200).json({
			message: "Se o email estiver cadastrado, um código será enviado.",
		});
	} catch (error) {
		console.error("Erro ao solicitar recuperação:", error);
		return res.status(500).json({ error: "Não foi possível enviar o código." });
	}
}

async function resetPasswordController(req, res) {
	const { email, code, novaSenha } = req.body;
	if (!email || !code || !novaSenha) {
		return res.status(400).json({ error: "Email, código e nova senha são obrigatórios." });
	}

	try {
		const reset = await resetPassword({ email, code, novaSenha });
		if (!reset) {
			return res.status(400).json({ error: "Código inválido ou expirado." });
		}

		return res.status(200).json({ message: "Senha redefinida com sucesso." });
	} catch (error) {
		console.error("Erro ao redefinir senha:", error);
		return res.status(500).json({ error: "Não foi possível redefinir a senha." });
	}
}

module.exports.requestPasswordResetController = requestPasswordResetController;
module.exports.resetPasswordController = resetPasswordController;
