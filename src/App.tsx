import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { user } = useAppContext();

  return user ? <Dashboard /> : <Login />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;