

import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';


const Logout = props => { 

  useEffect(() => {
    props.onLogout({email: props.user.email});
  }, []);
  
  useEffect(() => {
    if (!props.user ||props.errorMessages.length) {
      props.history.push({pathname: '/'})
    }
  }, [props.user, props.errorMessages]);

  return (
    null
  );
};

const mapStateToProps = state => {
  return {
    user: state.authReducer.user,
    loading: state.authReducer.loading,
    errorMessages: state.authReducer.errors,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: payload => dispatch(actionCreators.logoutAttempt(payload))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);