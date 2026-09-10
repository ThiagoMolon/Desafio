function validarNome(nome) {
    if (!nome) {
        return "O nome é obrigatório.";
    }
    if (nome.trim().length < 2) {
        return "O nome deve ter pelo menos 2 caracteres.";
    }
    return null;
}

function validarEmail(email) {
    if (!email) {
        return "O email é obrigatório.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Digite um email válido.";
    }
    return null;
}

function validarSenha(senha) {
  if (!senha) {
    return "A senha é obrigatória.";
  }
  if (senha.length < 6) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }
  return null;
}

export { validarNome, validarEmail, validarSenha };
