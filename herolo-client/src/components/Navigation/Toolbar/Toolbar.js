

import React from 'react';

import NavigationItems from '../../../containers/NavigationItems/NavigationItems';
import DrawerToggle from '../DrawerToggle/DrawerToggle';
import classes from './Toolbar.module.scss';


const toolbar = props => { 

  return (
    <header className={classes.Toolbar}>
      <div className={classes.Logo}>
        Email Service
      </div>
      <nav className={classes.DesktopOnly}>
        <NavigationItems />
      </nav>
      <DrawerToggle toggleDrawer={props.toggleDrawer}/>
    </header>
  );
};

export default toolbar;