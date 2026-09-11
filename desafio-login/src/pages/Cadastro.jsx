import React from "react";
import Input from "../components/Input";
import Form from "../components/Form";
import Label from "../components/Label";
import Button from "../components/Button";
import authService from "../services/authService";

function Cadastro() {
  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [confirmarSenha, setConfirmarSenha] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [carregando, setCarregando] = React.useState(false);

  async function Cadastrar(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setCarregando(true);

    try {
      const usuario = {
        nome,
        email,
        senha,
        confirmarSenha,
      };
      const erro = await authService.cadastrarUsuario(usuario);

      if (erro) {
        setErrorMessage(erro);
        return;
      }

      setSuccessMessage("Cadastro realizado com sucesso.");
    } finally {
      setCarregando(false);
    }
  }
   
  return (
    <div className="Cadastro">
      <div className="Cadastro__form-card">
        <div>
          <h1 className="Cadastro__form-title">Cadastro</h1>
          <p className="Cadastro__form-description">
            Preencha os campos abaixo para criar sua conta.
          </p>
          {errorMessage && <p role="alert">{errorMessage}</p>}
          {successMessage && <p role="status">{successMessage}</p>}
        </div>
        <Form action={"/cadastro"} method={"post"} onSubmit={Cadastrar}>
          <Label htmlFor="nome">Nome</Label>
          <Input
            name="nome"
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            setState={setNome}
          />
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="Digite seu email"
            value={email}
            setState={setEmail}
          />
          <Label htmlFor="senha">Senha</Label>
          <Input
            name="senha"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            setState={setSenha}
          />
          <Label htmlFor="confirmar-senha">Confirmar Senha</Label>
          <Input
            name="confirmar-senha"
            type="password"
            placeholder="Confirme sua senha"
            value={confirmarSenha}
            setState={setConfirmarSenha}
          />
          <Button type="submit" loading={carregando}>
            Cadastrar
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Cadastro;