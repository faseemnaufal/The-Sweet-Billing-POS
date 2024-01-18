import { combineReducers, applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import {thunk }from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import { rootReducer } from './rootReducer';

const reducer = combineReducers({
  rootReducer,
});

const initialState = {
  rootReducer: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};

const middleware = [thunk];

const store = configureStore(
  {reducer:reducer},
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
