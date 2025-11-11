import React from 'react';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">Thanos App</div>
        <div className="navbar-user-info">
          <span className="user-name">Usuário: {user?.nome || 'Convidado'}</span>
        </div>
        <div className="navbar-menu">
          <a href="#" onClick={() => console.log('Navegar para Home')}>Home</a>
          <a href="#" onClick={() => console.log('Navegar para Perfil')}>Perfil</a>
          <a href="#" onClick={onLogout || (() => console.log('Sair'))}>Sair</a>
        </div>
      </div>
    </nav>
  );
}
