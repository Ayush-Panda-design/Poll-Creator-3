import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import store from './store/store';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#1a1a2e',
                    color: '#f1f5f9',
                    border: '1px solid #2a2a45',
                    borderRadius: '12px',
                  },
                  success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
                  error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                }}
              />
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
