import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import {
    DATA_READ_REQUEST,
    DATA_READ_DONE,
    DATA_READ_ERROR,
} from '../reducers/conversation';

const tag = "sagas/conversation: "

/**
 * 1. 카카오톡 대화내용 분석 Parsing 요청을 전달 받는다.
 * 2. Parsing 된 데이터를 전달한다.
 */
function parsingGroupConversation(data) {
    let parsingResult;

    console.log(tag, "parsingGroupConversation",data);
    return 'parsingResult';
}


/**
 * 카카오톡 대화내용 분석 Parsing Request를 전송한다. (서버가 따로 없기 때문에 위의 메소드로 백엔드 API 흉내만 내자)
 * Parsing 결과를 Response 받고 DATA_READ_DONE에 전달한다.
 */
function conversationDataReadAPI(data) {
    console.log(tag, "conversationDataReadAPI",data);
    return parsingGroupConversation(data);     // 서버로 request 보낼 경우엔 axios를 사용한다 => return axios.post('/conversation/readGroupData', data);
}

/**
 * request 요청을 보내기
 * response를 redux로 전달하기 (DONE or ERROR)
 */
function* reading(action) {

    try {
        // 요청 전 데이터
        console.log(tag,"reading: action:",action);
        const result = yield call(conversationDataReadAPI, action.data);
        
        // 응답 후 데이터
        console.log(tag,"reading: result:",result);
        yield put({
            type: DATA_READ_DONE,
            data: result,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: DATA_READ_ERROR,
            error: err.response,
        });
    }
}


/**
 * request에서 DATA_READ_REQUEST 사용이 감지되면 바로 위에 reading 메소드 실행
 */
function* watchReadingRequest() {
    console.log("watchReadingRequest");
    yield takeLatest(DATA_READ_REQUEST, reading);
}


/**
 * DATA_READ_REQUEST가 언제 사용될지 항상 지켜보기
 */
export default function* userSaga() {
    yield all([
        fork(watchReadingRequest),
    ]);
}
