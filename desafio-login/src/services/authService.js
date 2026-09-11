import { validarNome, validarEmail, validarSenha } from "../utils/validadores";
const authService = {
  cadastrarUsuario: (usuario) => {
    const erroNome = validarNome(usuario.nome);
    if (erroNome) return erroNome;

    const erroEmail = validarEmail(usuario.email);
    if (erroEmail) return erroEmail;

    const erroSenha = validarSenha(usuario.senha);
    if (erroSenha) return erroSenha;

    if (usuario.senha !== usuario.confirmarSenha) {
      return "As senhas não coincidem.";
    }

    // const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    // const emailEmUso = usuarios.some((item) => item.email === usuario.email);

  //   if (emailEmUso) {
  //     return "Este email já está cadastrado.";
  //   }

  //   usuarios.push(usuario);
  //   localStorage.setItem("usuarios", JSON.stringify(usuarios));
  //   return null;
  }
};

export default authService;
