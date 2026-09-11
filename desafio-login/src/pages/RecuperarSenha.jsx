
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Form from "../components/Form";
import Input from "../components/Input";
import Label from "../components/Label";
import authService from "../services/authService";

function RecuperarSenha() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [carregando, setCarregando] = React.useState(false);

    async function solicitarCodigo(event) {
        event.preventDefault();
        setMessage("");
        setErrorMessage("");
        setCarregando(true);

        const erro = await authService.solicitarRecuperacao(email);
        setCarregando(false);

        if (erro) {
            setErrorMessage(erro);
            return;
        }

        sessionStorage.setItem("emailRecuperacao", email);
        setMessage("Se o email estiver cadastrado, o código foi enviado.");
        navigate("/redefinir-senha");
    }

    return (
        <main className="page">
            <section className="page__card">
                <h1 className="page__title">Recuperar senha</h1>
                <p className="page__description">Informe seu email para receber um código.</p>
                {errorMessage && <p role="alert">{errorMessage}</p>}
                {message && <p role="status">{message}</p>}
                <Form action="/recuperar-senha" method="post" onSubmit={solicitarCodigo}>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        name="email"
                        type="email"
                        placeholder="Digite seu email"
                        value={email}
                        setState={setEmail}
                    />
                    <Button type="submit" loading={carregando}>Enviar código</Button>
                </Form>
                <Link to="/login">Voltar para o login</Link>
            </section>
        </main>
    );
}

export default RecuperarSenha;