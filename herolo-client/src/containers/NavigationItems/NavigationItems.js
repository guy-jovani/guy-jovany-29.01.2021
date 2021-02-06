

import React from 'react';
import { connect } from 'react-redux';

import NavigationItem from './NavigationItem/NavigationItem';
import classes from './NavigationItems.module.scss';

const NavigationItems = props => { 


  return (
    <ul className={classes.NavigationItems}>
      {
        props.user ? 
        <React.Fragment>
          <NavigationItem to="/" exact={true}>Home</NavigationItem>
          <NavigationItem to="/compose" exact={false}>Compose</NavigationItem>
        </React.Fragment> : null
      }
      <NavigationItem to={props.user ? '/logout' : "/"} exact={false}>{props.user ? 'Logout' : 'Auth'}</NavigationItem>
    </ul>
  );
};

const mapStateToProps = state => {
  return {
    user: state.authReducer.user,
  };
};

export default connect(mapStateToProps)(NavigationItems);