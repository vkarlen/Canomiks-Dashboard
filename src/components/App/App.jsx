import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';

import CustomerDashboard from '../CustomerDashboard/CustomerDashboard';
import LabDashboard from '../LabDashboard/LabDashboard';
import Manage from '../ManageCustomers/Manage';

import './App.css';

function App() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          <Redirect exact from="/" to="/home" />

          <ProtectedRoute exact path="/home" authRedirect="/dashboard">
            <LandingPage />
          </ProtectedRoute>

          <Route exact path="/dashboard">
            {user.authLevel === 'lab' || user.authLevel === 'admin' ? (
              <LabDashboard />
            ) : (
              <CustomerDashboard />
            )}
          </Route>

          <ProtectedRoute exact path="/login" authRedirect="/user">
            <LoginPage />
          </ProtectedRoute>

          <ProtectedRoute exact path="/registration" authRedirect="/user">
            <RegisterPage />
          </ProtectedRoute>

          <ProtectedRoute exact path="/manage" authRedirect="/admin">
            <Manage />
          </ProtectedRoute>

          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
