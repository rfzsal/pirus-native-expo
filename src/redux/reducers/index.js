import {
  SET_DAILY,
  SET_PROVINCE_DATA,
  SET_NEWS,
  SET_HOSPITALS,
} from '../constants';

let initialState = {daily: [], province: {}, news: [], hospitals: []};

export const covidData = (state = initialState, action) => {
  switch (action.type) {
    case SET_DAILY:
      return Object.assign({}, state, {daily: action.payload});
    case SET_PROVINCE_DATA:
      return Object.assign({}, state, {province: action.payload});
    case SET_NEWS:
      return Object.assign({}, state, {news: action.payload});
    case SET_HOSPITALS:
      return Object.assign({}, state, {hospitals: action.payload});
    default:
      return state;
  }
};
