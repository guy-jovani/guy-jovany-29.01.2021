import * as actionTypes from '../actions/actionTypes';
import axios from 'axios';

const url = 'http://localhost:5000/manage/';

const getMsgRes = payload => {
  return {
    type: actionTypes.MANAGE_GET, 
    payload
  }
}


export const getMessagesAttempt = payload => {
  return async dispatch => {
    dispatch({ type: actionTypes.MANAGE_LOADING });
    axios.get(url + 'get?id=' + payload)
    .then(res => {
      dispatch(getMsgRes({
        success: true,
        sent: res.data.sent,
        received: res.data.received
      }));
    })
    .catch(err => {
      dispatch(getMsgRes({
        errorMessages: err.response.data.messages,
        success: false
      }));
    });
  };
};

export const resetManage = payload => {
  return dispatch => {
    dispatch({ type: actionTypes.MANAGE_RESET });
  };
}
const getDeleteRes = payload => {
  return {
    type: actionTypes.MANAGE_DELETE, 
    payload
  }
}

export const deleteManage = payload => {
  return dispatch => {
    dispatch({ type: actionTypes.MANAGE_LOADING });
    axios.delete(url + 'delete', {
      data: { 
        ...payload
      }
    })
    .then(res => {
      dispatch(getDeleteRes({
        success: true,
        sent: res.data.sent,
        received: res.data.received
      }));
    })
    .catch(err => {
      dispatch(getDeleteRes({
        errorMessages: ['There was an unexpected error, please notify the admins and try again later.'],
        success: false
      }));
    });
  };
}