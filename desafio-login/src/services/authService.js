import { validarNome, validarEmail, validarSenha } from "../utils/validadores";
const authService = {
  cadastrarUsuario: async (usuario) => {
    const erroNome = validarNome(usuario.nome);
    if (erroNome) return erroNome;

    const erroEmail = validarEmail(usuario.email);
    if (erroEmail) return erroEmail;

    const erroSenha = validarSenha(usuario.senha);
    if (erroSenha) return erroSenha;

    if (usuario.senha !== usuario.confirmarSenha) {
      return "As senhas não coincidem.";
    }

    try {
      const response = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: usuario.nome,
          email: usuario.email,
          senha: usuario.senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return data.error || "Não foi possível cadastrar o usuário.";
      }

      return null;
    } catch (error) {
      return "Não foi possível conectar ao servidor.";
    }
  },

  login: async ({ email, senha }) => {
    if (!email || !senha) return "Email e senha são obrigatórios.";

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();

      if (!response.ok) {
        return data.error || "Não foi possível fazer login.";
      }

      sessionStorage.setItem("usuario", JSON.stringify(data.user));
      return null;
    } catch (error) {
      return "Não foi possível conectar ao servidor.";
    }
  },

  solicitarRecuperacao: async (email) => {
    try {
      const response = await fetch("http://localhost:3001/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) return data.error || "Não foi possível enviar o código.";
      return null;
    } catch (error) {
      return "Não foi possível conectar ao servidor.";
    }
  },

  redefinirSenha: async ({ email, code, novaSenha }) => {
    try {
      const response = await fetch("http://localhost:3001/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, novaSenha }),
      });
      const data = await response.json();

      if (!response.ok) return data.error || "Não foi possível redefinir a senha.";
      return null;
    } catch (error) {
      return "Não foi possível conectar ao servidor.";
    }
  }
};

export default authService;
