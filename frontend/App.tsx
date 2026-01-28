
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { AppProvider } from './src/context/AppContext';
import { AppRoutes } from './src/routes/AppRoutes';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}
