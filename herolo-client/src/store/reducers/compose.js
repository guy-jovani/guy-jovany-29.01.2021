

import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility.js';

const initialState = {
  errors: [],
  loading: false,
  operationType: 'pending'
};


const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.COMPOSE_RESULT: {
      if (action.payload.success) {
        return updateObject(state, { 
          errors: [],
          loading: false,
          operationType: 'success'
         });
      }
      return updateObject(state, { 
        errors: action.payload.errorMessages,
        loading: false,
        operationType: 'failure'
      });
    }
    case actionTypes.COMPOSE_LOADING:
      return updateObject(state, { 
        loading: true, 
        errors: [],
        operationType: 'pending'
      });
    case actionTypes.COMPOSE_RESET:
      return updateObject(state, { 
        loading: false, 
        errors: [],
        operationType: 'pending'
      });
    default:
      return state;
    }
};


export default reducer;
