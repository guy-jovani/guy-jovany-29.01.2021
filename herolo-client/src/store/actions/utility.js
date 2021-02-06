
import axios from 'axios';
import { newToken } from './auth';

import { logoutAttempt } from './auth';

const url = 'http://localhost:5000/auth/';
// const url = 'https://herolo-test-1.herokuapp.com/auth/';

export const refreshToken = (dispatch, methodOnSuccess, methodOnErr, payload, oldTimeout) => {
  axios.get(url + `rToken/?rToken=${localStorage.getItem('rToken')}`)
  .then(res => {
    clearTimeout(oldTimeout);
    const timeoutId = autoLogout(dispatch, res.data.expiresInSeconds);
    dispatch(newToken({token: res.data.newToken, timeoutId}));
    localStorage.setItem('token', res.data.newToken);
    dispatch(methodOnSuccess(payload));
  }).catch(err => {
    dispatch(methodOnErr({
      errorMessages: err.response.data.messages,
      success: false
    }));
  });
};


export const autoLogout = (dispatch, logoutSeconds, email) => {
  const timeoutId = setTimeout(() => {
    dispatch(logoutAttempt({email}));
  }, logoutSeconds * 1000 * 2);

  return timeoutId;
};

export const saveToLocalStorage = payload => {
  Object.keys(payload).forEach(key => {
    localStorage.setItem(key, JSON.stringify(payload[key]));
  });
};