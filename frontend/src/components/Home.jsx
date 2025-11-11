import React from 'react';
import Navbar from './Navbar';

export default function Home({ user }) {
  return (
    <div>
      <Navbar user={user} />
      <div>
        <h1>Bem-vindo, {user.nome}!</h1>
        <p>Perfil: {user.perfil}</p>
        <p>Cargo: {user.cargo}</p>
        <p>Email: {user.email}</p>
        <p>Último login: {user.ultimo_login}</p>
        <a href="/thanos">Ir para Thanos</a>
      </div>
    </div>
  );
}
