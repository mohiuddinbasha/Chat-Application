import React from 'react';
// Importing required components
import Chat from './components/Chat/Chat';
import Join from './components/Join/Join';
import AdminLogin from './components/AdminLogin/AdminLogin';
import Admin from './components/Admin/Admin';
// Router library is used to define multiple routes
import { BrowserRouter as Router, Route } from "react-router-dom";
// Arrow Function Component
const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Join} />
      <Route path="/chat" component={Chat} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
    </Router>
  );
}

export default App;
