import React, { useContext } from 'react';
import Login from './components/Login';
import Home from './components/Home';
import { UserProvider, UserContext } from './context/UserContext';

function MainApp() {
  const { user, login } = useContext(UserContext);
  return user ? <Home user={user} /> : <Login onLogin={login} />;
}

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
