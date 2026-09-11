

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Form from "../components/Form";
import Input from "../components/Input";
import Label from "../components/Label";
import authService from "../services/authService";

function RedefinirSenha() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState(() => sessionStorage.getItem("emailRecuperacao") || "");
    const [code, setCode] = React.useState("");
    const [novaSenha, setNovaSenha] = React.useState("");
    const [confirmarSenha, setConfirmarSenha] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [carregando, setCarregando] = React.useState(false);

    async function redefinir(event) {
        event.preventDefault();
        setErrorMessage("");

        if (novaSenha !== confirmarSenha) {
            setErrorMessage("As senhas não coincidem.");
            return;
        }

        setCarregando(true);
        const erro = await authService.redefinirSenha({ email, code, novaSenha });
        setCarregando(false);

        if (erro) {
            setErrorMessage(erro);
            return;
        }

        sessionStorage.removeItem("emailRecuperacao");
        navigate("/login");
    }

    return (
        <main className="page">
            <section className="page__card">
                <h1 className="page__title">Redefinir senha</h1>
                <p className="page__description">Informe o código recebido e sua nova senha.</p>
                {errorMessage && <p role="alert">{errorMessage}</p>}
                <Form action="/redefinir-senha" method="post" onSubmit={redefinir}>
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" type="email" placeholder="Digite seu email" value={email} setState={setEmail} />
                    <Label htmlFor="code">Código</Label>
                    <Input name="code" type="text" placeholder="Digite o código recebido" value={code} setState={setCode} />
                    <Label htmlFor="nova-senha">Nova senha</Label>
                    <Input name="nova-senha" type="password" placeholder="Digite sua nova senha" value={novaSenha} setState={setNovaSenha} />
                    <Label htmlFor="confirmar-senha">Confirmar nova senha</Label>
                    <Input name="confirmar-senha" type="password" placeholder="Confirme sua nova senha" value={confirmarSenha} setState={setConfirmarSenha} />
                    <Button type="submit" loading={carregando}>Redefinir senha</Button>
                </Form>
                <Link to="/login">Voltar para o login</Link>
            </section>
        </main>
    );
}

export default RedefinirSenha;