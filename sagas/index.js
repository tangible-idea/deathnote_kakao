import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import conversationSaga from './conversation';

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = 'https://www.xxx.com';


export default function* rootSaga() {
    yield all([
        fork(conversationSaga),
    ]);
}
