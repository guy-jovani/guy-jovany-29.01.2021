

import React, { useState } from 'react';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

import classes from './Layout.module.scss';

const Layout = props => { 

  const [openDrawer, toggleDrawerState] = useState({ open: false });


  const toggleDrawer = () => {
    toggleDrawerState({ open: !openDrawer.open });
  }

  return (
    <React.Fragment>
      <Toolbar toggleDrawer={toggleDrawer}/>
      <SideDrawer openDrawer={openDrawer.open} toggleDrawer={toggleDrawer}/>
      <main className={classes.Layout}>
        { props.children }
      </main>
    </React.Fragment>
  );
};

export default Layout;