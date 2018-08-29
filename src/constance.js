export const API_ROOT = 'https://around-75015.appspot.com/api/v1';
export const TOKEN_KEY = 'TOKEN_KEY';
export const GEO_OPTIONS = {
    enableHighAccuracy: true,
    maximumAge: 3600000,//表示要过多久需要重新load geolocation
    timeout: 27000 //表示多久时间可以load你当前的geolocation
};
export const POS_KEY = 'POS_KEY';
export const AUTH_PREFIX = 'bearer';
export const LOC_SHAKE = 0.02;