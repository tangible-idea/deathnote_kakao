import produce from '../util/produce';
import { message } from 'antd';

export const initialState = {
    dataReadLoading: false, // 로그인 시도중
    dataReadDone: false,
    dataReadError: false,
    conversationData: {},
}

export const DATA_READ_REQUEST = 'DATA_READ_REQUEST';
export const DATA_READ_DONE = 'DATA_READ_DONE';
export const DATA_READ_ERROR = 'DATA_READ_ERROR';

const reducer = (state = initialState, action) => produce(state, (draft) => {
    switch (action.type) {

        case DATA_READ_REQUEST:

            draft.dataReadLoading = true; // 요청한 내용을 처리중일땐 Loading 표기하기
            draft.dataReadDone = false;
            draft.dataReadError = false;

            // request 보낼 대화내용 데이터를 redux에 담아두기
            draft.conversationData = action.data;
            break;

        case DATA_READ_DONE:
            draft.dataReadLoading = false; 
            draft.dataReadDone = true; // 요청한 내용을 처리중일땐 Loading 표기하기
            draft.dataReadError = false;

            // 완료 메시지 출력하기
            message.success("대화내용 분석 완료",6);

            break;

        case DATA_READ_ERROR:
            draft.dataReadLoading = false; 
            draft.dataReadDone = false; 
            draft.dataReadError = true; // 요청한 내용을 처리중일땐 Loading 표기하기

            // 에러 메시지 출력하기
            message.error("에러 발생. 다시 시도해주세요",6);

            break;

        default:
            break;
    }
});

export default reducer;
