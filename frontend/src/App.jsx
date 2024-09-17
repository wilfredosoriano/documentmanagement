import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DocumentManagement from './pages/DocumentManagement';
import UserManagement from './pages/UserManagement';
import Setting from './pages/Setting';
import Sidebar from './components/Sidebar';
import Appointment from './pages/Appointment';
import ViewDocuments from './pages/ViewDocuments';
import ClaimableDocuments from './pages/ClaimableDocuments';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import MobileDocuments from './mobile/MobileDocuments';
import MobileTransactions from './mobile/MobileTransactions';
import { UserProvider } from './components/Contexts/UserProvider';
import MobileRequestTicket from './mobile/MobileRequestTicket';
import MobileProfile from './mobile/MobileProfile';

function AppContent() {
  const location = useLocation();
  
  const hiddenPaths = [
    '/login', 
    '/changePassword', 
    '/mobileDocuments', 
    '/mobileTransactions', 
    '/mobileRequestTicket',
    '/mobileProfile',
  ];
  
  const hideSidebar = hiddenPaths.includes(location.pathname);
  

  return (
    <div className='min-h-screen flex bg-background text-primary'>
      {!hideSidebar && <Sidebar />}
      <div className={`${hideSidebar ? 'flex-1 bg-slate-50' : 'flex w-full my-6 mr-6 shadow-lg bg-background border border-border p-5 rounded-2xl'}`}>
        <Routes>
        <Route path='/' element={<Navigate to='/login'/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/changePassword' element={<ChangePassword/>} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/document' element={<DocumentManagement />} />
          <Route path='/appointment' element={<Appointment />} />
          <Route path='/user' element={<UserManagement />} /> 
          <Route path='/setting' element={<Setting />} />
          <Route path='/viewDocuments' element={<ViewDocuments />} />
          <Route path='/claimableDocuments' element={<ClaimableDocuments />} />
          <Route path='/mobileDocuments' element={<MobileDocuments />} />
          <Route path='/mobileTransactions' element={<MobileTransactions />} />
          <Route path='/mobileRequestTicket' element={<MobileRequestTicket />} />
          <Route path='/mobileProfile' element={<MobileProfile />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;
