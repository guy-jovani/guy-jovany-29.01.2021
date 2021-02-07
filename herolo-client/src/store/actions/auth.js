import * as actionTypes from '../actions/actionTypes';
import axios from 'axios';

import { refreshToken, autoLogout, saveToLocalStorage } from './utility';
// const url = 'http://localhost:5000/auth/';
const url = 'https://herolo-test-1.herokuapp.com/auth/';
 

export const newToken = payload => {
  return {
    type: actionTypes.AUTH_NEW_TOKEN, 
    payload
  }
}

const authRes = payload => {
  return {
    type: actionTypes.AUTH_RESULT, 
    payload
  }
}

export const autoLoginAttempt = () => {
  if (localStorage.getItem('user')) {
    return {
      type: actionTypes.AUTH_RESULT, 
      payload: {
        success: true,
        token: JSON.parse(localStorage.getItem('token')),
        rToken: JSON.parse(localStorage.getItem('rToken')),
        user: JSON.parse(localStorage.getItem('user')),
        timeoutId: JSON.parse(localStorage.getItem('timeoutId')),
      }
    }
  }
  
  return {
    type: actionTypes.AUTH_LOGOUT, 
    payload: {
      success: true
    }
  }
}

const successAuth = (dispatch, data) => {
  const timeoutId = autoLogout(dispatch, data.expiresInSeconds, data.user.email);
  const resPayload = {
    user: data.user,
    token: data.token,
    rToken: data.rToken,
    timeoutId
  }
  saveToLocalStorage(resPayload);
  dispatch(authRes({ success: true, ...resPayload }));
};

export const loginAttempt = payload => {
  return async dispatch => {
    dispatch({ type: actionTypes.AUTH_LOADING });
    axios.post(url + 'login', { 
      ...payload 
    })
    .then(res => {
      successAuth(dispatch, res.data);
    })
    .catch(err => {
      dispatch(authRes({
        errorMessages: err.response.data.messages,
        success: false
      }));
    });
  }
};

export const signupAttempt = payload => {
  return async dispatch => {
    dispatch({ type: actionTypes.AUTH_LOADING });
    axios.post(url + 'signup', { 
      ...payload 
    })
    .then(res => {
      successAuth(dispatch, res.data);
    })
    .catch(err => {
      console.log(err)
      console.log(err.data)
      console.log(err.response)
      dispatch(authRes({
        errorMessages: err.response.data.messages,
        success: false
      }));
    });
  }
};

export const logoutAttempt = (payload) => {

  return async dispatch => {
    dispatch({ type: actionTypes.AUTH_LOADING });
    axios.post(url + 'logout', {email: payload.email})
      .then(res => {
        localStorage.removeItem('token');
        localStorage.removeItem('rToken');
        localStorage.removeItem('user');
        localStorage.removeItem('timeoutId');
        dispatch(logoutRes({success: true}));
      })
      .catch(err => {
        if (err.response.data.type === 'TokenExpiredError') {
          refreshToken(dispatch, logoutAttempt, logoutRes, {});
        } else {
          dispatch(logoutRes({
            errorMessages: err.response.data.messages,
            success: false
          }));
        }
      });
  }
}

const logoutRes = (payload) => {
  return {
    type: actionTypes.AUTH_LOGOUT,
    payload
  }
}