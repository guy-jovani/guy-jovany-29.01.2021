

import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility.js';

const initialState = {
  errors: [],
  loading: false,
  received: [],
  sent: []
};


const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.MANAGE_DELETE:
    case actionTypes.MANAGE_GET: {
      if (action.payload.success) {
        return updateObject(state, { 
          errors: [],
          loading: false,
          sent: action.payload.sent,
          received: action.payload.received
         });
      }
      return updateObject(state, { 
        errors: action.payload.errorMessages,
        loading: false
      });
    }
    case actionTypes.MANAGE_LOADING:
      return updateObject(state, { 
        loading: true, 
        errors: []
      });
    case actionTypes.MANAGE_RESET:
      return updateObject(state, { 
        loading: false, 
        errors: [],
        received: [],
        sent: []
      });
    default:
      return state;
    }
};


export default reducer;
