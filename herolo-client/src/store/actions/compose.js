import * as actionTypes from '../actions/actionTypes';
import axios from 'axios';

import { refreshToken } from './utility';

// const url = 'http://localhost:5000/email/';
const url = 'https://herolo-test-1.herokuapp.com/email/';

const postMsgRes = payload => {
  return {
    type: actionTypes.COMPOSE_RESULT, 
    payload
  }
}

export const postMsgAttempt = payload => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.COMPOSE_LOADING });
    axios.post(url + 'post', { 
        subject: payload.subject, 
        message: payload.content,
        receiver: payload.receiver 
      },
      { headers: {"Authorization" : `Bearer ${JSON.parse(localStorage.getItem('token'))}`} }
    )
    .then(res => {
      dispatch(postMsgRes({success: true}));
    })
    .catch(err => {
      if (err.response.data.type === 'TokenExpiredError') {
        refreshToken(dispatch, postMsgAttempt, postMsgRes, payload, getState().authReducer.timeoutId);
      } else {
        dispatch(postMsgRes({
          errorMessages: err.response.data.messages,
          success: false
        }));
      }
    });
  };
};

export const resetCompose = payload => {
  return async dispatch => {
    dispatch({ type: actionTypes.COMPOSE_RESET });
  };
}