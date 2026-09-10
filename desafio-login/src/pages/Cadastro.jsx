import React from 'react';
import Input from '../components/Input';
import Form from '../components/Form';
import Label from '../components/Label';
import Button from '../components/Button';

function Cadastro() {
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');

  return (
    <div>
      <div className="Cadastro__form-card">
        <Form action={"/"} method={"post"}>
          <Label htmlFor="nome">Nome</Label>
          <Input name="nome" type="text" placeholder="Digite seu nome" value={nome} setState={setNome} />
          <Label htmlFor="email">Email</Label>
          <Input name="email" type="email" placeholder="Digite seu email" value={email} setState={setEmail} />
          <Label htmlFor="senha">Senha</Label>
          <Input name="senha" type="password" placeholder="Digite sua senha" value={senha} setState={setSenha} />
          <Button type="submit">Cadastrar</Button>
        </Form>
      </div>
    </div>
  );
}

export default Cadastro;