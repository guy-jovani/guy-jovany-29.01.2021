import * as actionTypes from '../actions/actionTypes';
import axios from 'axios';
import { refreshToken } from './utility';
const url = 'https://herolo-test-1.herokuapp.com/email/';
// const url = 'http://localhost:5000/email/';

const getMsgRes = payload => {
  return {
    type: actionTypes.MANAGE_GET, 
    payload
  }
}


export const getMessagesAttempt = payload => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.MANAGE_LOADING });
    axios.get(url + 'get?id=' + payload,
        { headers: {"Authorization" : `Bearer ${JSON.parse(localStorage.getItem('token'))}`}} 
    )
    .then(res => {
      dispatch(getMsgRes({
        success: true,
        sent: res.data.sent,
        received: res.data.received
      }));
    })
    .catch(err => {
      console.log(err)
      console.log(err.response)
      if (err.response.data.type === 'TokenExpiredError') {
        refreshToken(dispatch, getMessagesAttempt, getMsgRes, payload, getState().authReducer.timeoutId);
      } else {
        dispatch(getMsgRes({
          errorMessages: err.response.data.messages,
          success: false
        }));
      }
    });
  };
};

export const resetManage = () => {
  return { type: actionTypes.MANAGE_RESET };
}
const getDeleteRes = payload => {
  return {
    type: actionTypes.MANAGE_DELETE, 
    payload
  }
}

export const deleteManage = payload => {
  return (dispatch, getState) => {
    dispatch({ type: actionTypes.MANAGE_LOADING });
    axios.delete(url + 'delete', {
        data: { 
          ...payload
        },
        headers: {"Authorization" : `Bearer ${JSON.parse(localStorage.getItem('token'))}`}
      }
    )
    .then(res => {
      dispatch(getDeleteRes({
        success: true,
        sent: res.data.sent,
        received: res.data.received
      }));
    })
    .catch(err => {
      if (err.response.data.type === 'TokenExpiredError') {
        refreshToken(dispatch, deleteManage, getDeleteRes, payload, getState().authReducer.timeoutId);
      } else {
        dispatch(getDeleteRes({
          errorMessages: err.response.data.messages,
          success: false
        }));
      }
    });
  };
}