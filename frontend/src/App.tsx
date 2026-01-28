
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}
