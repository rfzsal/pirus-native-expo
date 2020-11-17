import {createStore} from 'redux';

import {covidData} from './reducers';

export default createStore(covidData);
