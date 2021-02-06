

import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  user: null,
  errors: [],
  token: null,
  rToken: null,
  loading: false,
  timeoutId: null
};


const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.AUTH_RESULT: {
      if (action.payload.success) {
        return updateObject(state, { 
          user: action.payload.user,
          loading: false,
          token: action.payload.token,
          rToken: action.payload.rToken,
          timeoutId: action.payload.timeoutId
         });
      }
      return updateObject(state, { 
        errors: [...action.payload.errorMessages],
        loading: false
      });
    }
    case actionTypes.AUTH_LOADING:
      return updateObject(state, { loading: true });
    case actionTypes.AUTH_NEW_TOKEN:
      return updateObject(state, { token: action.payload.token, timeoutId: action.payload.timeoutId });
    case actionTypes.AUTH_LOGOUT:
      if (action.payload.success) {
        return updateObject(state, 
          { loading: false, user: null, token: null, errors: [], rToken: null, timeoutId: null }
        );
      }
      return updateObject(state, 
        { loading: false, errors: [...action.payload.errorMessages] }
      );
    default:
      return state;
    }
};


export default reducer;
