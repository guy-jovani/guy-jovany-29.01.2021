import React from 'react';
import './App.css';

import { Route, Switch } from 'react-router-dom';

import Layout from './hoc/Layout/Layout';
import Manage from './containers/Manage/Manage';
import Compose from './containers/Compose/Compose';

const app = () => {
  return (
    <Layout>
      <Switch>
        <Route path="/compose" component={Compose} />
        <Route path="/" exact component={Manage} />
        <Route render={ () => <div>Page Not Found</div>} />
      </Switch>
    </Layout>
  );
}

export default app;
