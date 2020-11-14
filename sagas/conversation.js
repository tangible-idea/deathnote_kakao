import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import {
    DATA_READ_REQUEST,
    DATA_READ_DONE,
    DATA_READ_ERROR,
} from '../reducers/conversation';

const tag = "sagas/conversation: "

class MyUser {
    bubblecount= 0;
    textcount= 0;
    firstchat= 0;
    latestchat= 0;
    constructor(name) {
      this.name = name;
    }
  }


/**
 * 1. 카카오톡 대화내용 분석 Parsing 요청을 전달 받는다.
 * 2. Parsing 된 데이터를 전달한다.
 */
function parsingGroupConversation(data) {
    let parsingResult;

    console.log(data.file);
    console.log(data.file.name);
    let ext= "unknown"

    if(data.file.name.endsWith(".csv")){
        alert("This is a csv file.");
        ext= "csv"
    }
    else if(data.file.name.endsWith(".txt")){
        alert("This is a txt file.");
        ext= "txt"
    }

    // 분석 Map 데이터
    let users = new Map();
    var recent_user;
    var recent_username;

    var reader = new FileReader();
    reader.onload = function () {
        //console.log(reader.result);
        parsingResult= reader.result;
        //console.log(output.innerText);
        // By lines
        var lines = this.result.split('\n');
        for(var i = 0; i < lines.length; i++){
            //console.log(lines[i]);
            var splitedLine= '';
            if(ext === 'csv') // 맥용 카카오톡
            {
                splitedLine= lines[i].split(',');
            }
            else{   // PC용 카카오톡

            }
            
            if(splitedLine.length >= 3)
            {
                var thisname= splitedLine[1];
                recent_username= thisname;
                // 이미 있는 이름의 경우 데이터 갱신.
                if(users.has(thisname))
                {
                    var currData= users.get(thisname);
                    console.log("old user: "+ thisname+", added to: " + currData.bubblecount);
                    ++currData.bubblecount;
                    currData.textcount += splitedLine[2].length;
                    users.set(thisname, currData);
                    recent_user= currData;  // 마지막 유저
                }
                else
                {// map에 데이터 없으면 새로 만든다.
                    const thisuser= new MyUser(thisname);
                    ++thisuser.bubblecount;
                    thisuser.textcount += splitedLine[2].length;
                    users.set(thisname, thisuser);
                    console.log("new user: " + thisname +", added to: " + thisuser.bubblecount);
                    recent_user= thisuser;  // 마지막 유저
                }
                //

                //console.log(users);
            }
            else{
                currData= users.get(recent_username)
                currData.textcount += splitedLine[0].length;
                console.log("connected line, new text lines: "+ splitedLine[0].length +", " + recent_username +"'s total texts count is now: " + currData.textcount);
                users.set(thisname, currData);
                
            }

        }
    };
    reader.readAsText(data.file, /* optional */ "euc-kr");

    //data.days: 일수
    //data.file: 파일내용인데 이걸 읽어서 txt로 반환.
    // 테이블에서 볼 수 있도록 json으로 변환.
    
    // 리턴 텍스트데이터
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
