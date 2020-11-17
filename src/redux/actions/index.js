import {
  SET_DAILY,
  SET_PROVINCE_DATA,
  SET_NEWS,
  SET_HOSPITALS,
} from '../constants';

export const setDailyData = (data) => ({
  type: SET_DAILY,
  payload: data,
});

export const setProvinceData = (data) => ({
  type: SET_PROVINCE_DATA,
  payload: data,
});

export const setNews = (data) => ({
  type: SET_NEWS,
  payload: data,
});

export const setHospitals = (data) => ({
  type: SET_HOSPITALS,
  payload: data,
});
