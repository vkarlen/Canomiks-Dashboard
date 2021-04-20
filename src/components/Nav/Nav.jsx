import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LogOutButton from '../LogOutButton/LogOutButton';

import { AppBar, makeStyles, Toolbar, Typography } from '@material-ui/core';

import './Nav.css';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  offset: theme.mixins.toolbar,
}));

function Nav() {
  const classes = useStyles();

  /* Store Import */
  const user = useSelector((store) => store.user);

  let loginLinkData = {
    path: '/login',
    text: 'Login / Register',
  };

  if (user.id != null) {
    loginLinkData.path = '/samples';
    loginLinkData.text = 'Samples';
  }

  return (
    <AppBar position="static" style={{ marginBottom: 30 }}>
      <Toolbar
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#1e565c',
        }}
      >
        <Link style={{ textDecoration: 'none', color: 'white' }} to="/samples">
          <div className="header-brand-logo">
            <img src="../favicon.ico" alt="logo" />
            <Typography className={classes.title}>Canomiks</Typography>
          </div>
        </Link>

        <div>
          <Link className="navLink" to={loginLinkData.path}>
            {loginLinkData.text}
          </Link>

          {user.authLevel === 'admin' && (
            <Link className="navLink" to="/manage/customers">
              Manage Customers
            </Link>
          )}

          {user.authLevel === 'team' && (
            <>
              <a className="navLink" href="https://www.canomiks.com/contactus">
                Help
              </a>

              <a className="navLink" href="https://www.canomiks.com/about-us">
                About Us
              </a>
            </>
          )}

          {user.id && <LogOutButton className="navLink" />}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Nav;
