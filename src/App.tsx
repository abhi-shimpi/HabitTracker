import React from 'react';
import { Toaster } from './components/ui/sonner';
import { HashRouter as Router } from 'react-router-dom';
import AppRouter from './AppRouting';
import appStore from './store/appStore';
import { Provider } from 'react-redux';
import GlobalLoader from './components/ui/GlobalLoader';
import AuthInitializer from './components/AuthInitializer';

export default function App() {
  return (
    <div className="dark min-h-screen bg-background">
      <Provider store={appStore}>
        <AuthInitializer>
          <Router>
            <Toaster position="top-right" />
            <AppRouter />
            <GlobalLoader />
          </Router>
        </AuthInitializer>
      </Provider>
    </div>
  );
}