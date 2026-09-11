
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Form from "../components/Form";
import Input from "../components/Input";
import Label from "../components/Label";
import authService from "../services/authService";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [senha, setSenha] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [carregando, setCarregando] = React.useState(false);

    async function entrar(event) {
        event.preventDefault();
        setErrorMessage("");
        setCarregando(true);

        const erro = await authService.login({ email, senha });
        setCarregando(false);

        if (erro) {
            setErrorMessage(erro);
            return;
        }

        navigate("/home");
    }

    return (
        <main className="page">
            <section className="page__card">
                <h1 className="page__title">Login</h1>
                <p className="page__description">Entre com seu email e senha.</p>
                {errorMessage && <p role="alert">{errorMessage}</p>}
                <Form action="/login" method="post" onSubmit={entrar}>
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
                    <Button type="submit" loading={carregando}>
                        Entrar
                    </Button>
                </Form>
                <Link to="/recuperar-senha">Esqueci minha senha</Link>
            </section>
        </main>
    );
}

export default Login;