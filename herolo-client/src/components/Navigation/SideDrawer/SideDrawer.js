import React from 'react';

import NavigationItems from '../../../containers/NavigationItems/NavigationItems';
import DrawerToggle from '../DrawerToggle/DrawerToggle';
import classes from './SideDrawer.module.scss';

const sideDrawer = props => {
  let classNames = [classes.SideDrawer, classes.Close];
  if (props.openDrawer) {
    classNames = [classes.SideDrawer, classes.Open];
  }
  return ( 
    <div onClick={props.toggleDrawer} className={classNames.join(' ')}>
      <div className={classes.Header}>
        <div className={classes.Logo}>
          Email Service
        </div>
        <DrawerToggle toggleDrawer={props.toggleDrawer} />
      </div>
      <nav>
        <NavigationItems />
      </nav>
    </div>
  );
};

export default sideDrawer;
