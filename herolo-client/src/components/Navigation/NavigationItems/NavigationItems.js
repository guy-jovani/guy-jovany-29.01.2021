

import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';
import classes from './NavigationItems.module.scss';

const navigationItems = props => { 


  return (
    <ul className={classes.NavigationItems}>
      <NavigationItem to="/" exact={true}>Home</NavigationItem>
      <NavigationItem to="/compose" exact={false}>Compose</NavigationItem>
    </ul>
  );
};

export default navigationItems;