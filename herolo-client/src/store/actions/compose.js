import * as actionTypes from '../actions/actionTypes';
import axios from 'axios';

const url = 'http://localhost:5000/manage/';

const postMsgRes = payload => {
  return {
    type: actionTypes.COMPOSE_RESULT, 
    payload
  }
}

export const postMsgAttempt = payload => {
  return async dispatch => {
    dispatch({ type: actionTypes.COMPOSE_LOADING });
    axios.post(url + 'post', { 
      subject: payload.subject, 
      message: payload.content, 
      sender: +payload.sender, 
      receiver: +payload.receiver 
    })
    .then(res => {
      dispatch(postMsgRes({success: true}));
    })
    .catch(err => {
      dispatch(postMsgRes({
        errorMessages: err.response.data.messages,
        success: false
      }));
    });
  };
};

export const resetCompose = payload => {
  return async dispatch => {
    dispatch({ type: actionTypes.COMPOSE_RESET });
  };
}