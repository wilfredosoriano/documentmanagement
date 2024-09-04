import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Toaster } from './components/ui/toaster.jsx'
import './index.css'
import { UserProvider } from './components/Contexts/UserProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
    <App />
    </UserProvider>
    <Toaster />
  </React.StrictMode>,
)
