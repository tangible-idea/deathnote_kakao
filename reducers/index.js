import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import Router from 'next/router';
import { message } from 'antd';

// 대화 데이터
import conversation from './conversation';

const rootReducer = combineReducers({
    index: (state = {}, action) => {

        switch (action.type) {
            case HYDRATE:
                console.log('HYDRATE: ', action);
                return { ...state, ...action.payload };
            case 'SET_CLIENT_STATE': {
                return {
                    ...state,
                    fromClient: action.payload,
                };
            }
            default:
                return state;
        }
    },
    conversation
});

export default rootReducer;