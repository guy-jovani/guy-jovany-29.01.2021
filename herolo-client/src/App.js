import React, { useEffect } from 'react';
import './App.css';

import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actionCreators from './store/actions/index';

import Layout from './hoc/Layout/Layout';
import Manage from './containers/Manage/Manage';
import Compose from './containers/Compose/Compose';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Logout/Logout';

const App = (props) => {

  useEffect(() => {
    props.onAutoLogin();
  }, []);

  return (
    <Layout>
      {
        props.user ? 
        <Switch>
          <Route path="/" exact component={Manage} />
          <Route path="/compose" component={Compose} />
          <Route path="/logout" component={Logout} />
          <Route render={ () => <div>Page Not Found</div>} />
        </Switch> : 
        <Switch>
          <Route path="/" exact component={Auth} />
          <Route path="/logout" component={Logout} />
          <Route render={ () => <div>Page Not Found</div>} />
        </Switch>
      }
    </Layout>
  );
}

const mapStateToProps = state => {
  return {
    user: state.authReducer.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAutoLogin: payload => dispatch(actionCreators.autoLoginAttempt(payload))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
