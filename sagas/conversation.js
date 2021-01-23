import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import {
    DATA_READ_REQUEST,
    DATA_READ_DONE,
    DATA_READ_ERROR,
} from '../reducers/conversation';
import { parsingGroupConversationWindow } from "./functions/parsingConversation";
import { message } from "antd";

const tag = "sagas/conversation: "

class MyUser {      // 유저 모델 클래스
    bubblecount= 0; // 채팅카운트
    textcount= 0;   // 총 글자수
    firstchat= "";
    latestchat= "";
    firstchat_date= new Date();  // 첫번째 채팅
    latestchat_date= new Date(); // 마지막 채팅
    subtracted_date= 0; // 오늘날짜 - 마지막 채팅.
    target= "false";  // 마지막 채팅이 유저가 설저한 데이터보다 적은지.

    constructor(name) {
      this.name = name; // 이름(id)
    }

    // 첫 대화를 설정한다.
    setFirstChat(date) {
        var date= new Date(date);
        //var msDate = Date.UTC(a.getFullYear(), a.getMonth()+1, a.getDate());
        this.firstchat_date = date;
        this.firstchat = this.firstchat_date.toDateString();
    }

    // 마지막 대화날짜를 설정한다.
    setLateDateAsLatestChat(date1, date2, maxDate){
        var a = new Date(date1);
        var b = new Date(date2);
        var msDateA = Date.UTC(a.getFullYear(), a.getMonth()+1, a.getDate());
        var msDateB = Date.UTC(b.getFullYear(), b.getMonth()+1, b.getDate());

        if (parseFloat(msDateA) < parseFloat(msDateB))
            this.latestchat_date= b; // lt
        else if (parseFloat(msDateA) == parseFloat(msDateB))
            this.latestchat_date= b;  // eq
        else if (parseFloat(msDateA) > parseFloat(msDateB))
            this.latestchat_date= a; // gt
        else
            return null;  // error

        this.calcTargetToBeLayOff(this.latestchat_date, maxDate);
    }

    // 마지막대화가 현재로부터 얼마나 지났는지 계산하고, 숙청대상인지 확인한다.
    calcTargetToBeLayOff(date, maxDate) {
        var today = new Date();
        var subtracted= date.getTime() - today.getTime();
        this.subtracted_date= Math.abs(Math.floor(subtracted / (1000*60*60*24)));

        this.latestchat = date.toDateString();


        //var subtracted= new Date(new Date()-target);
        //console.log("subtracted: "+subtracted+"days gap.");
        //this.subtracted_date= subtracted.getDay()
        if(this.subtracted_date > maxDate)  // 설정한 날보다 더 많은 일수동안 대화가 없었으면 숙청대상.
            this.target = "숙청대상";
        else
        {
            this.target= "숙청 " + Math.abs(maxDate - this.subtracted_date) + " 일 전";
        }
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
        //alert("This is a csv file.");
        ext= "csv"
    }
    else if(data.file.name.endsWith(".txt")){
        //alert("This is a txt file.");
        ext= "txt"
        var result = parsingGroupConversationWindow(data);
        console.log(".txt conversation parsing result:",result);
        // return window parsing result
        return result;
    }

    if (ext === "csv") {
        // Promise 리턴하여 대기하도록한다.
        return new Promise((resolve, reject) => {

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
                        // alert("현재는 MAC용 데이터만 지원. PC버전 개발중.");
                        return;
                    }

                    if(splitedLine.length >= 3)
                    {
                        var thisname= splitedLine[1];
                        if(!thisname.includes('"'))
                            continue;
                        recent_username= thisname;
                        // 이미 있는 이름의 경우 데이터 갱신.

                        if(users.has(thisname))
                        {
                            var currData= users.get(thisname);
                            //console.log("old user: "+ thisname+", added to: " + currData.bubblecount);
                            ++currData.bubblecount;
                            currData.textcount += splitedLine[2].length;
                            currData.setLateDateAsLatestChat(currData.latestchat, splitedLine[0], data.days);
                            users.set(thisname, currData);
                            recent_user= currData;  // 마지막 유저
                        }
                        else
                        {// map에 데이터 없으면 새로 만든다.
                            const thisuser= new MyUser(thisname);
                            ++thisuser.bubblecount;
                            thisuser.textcount += splitedLine[2].length;
                            thisuser.setFirstChat(splitedLine[0]);
                            thisuser.latestchat= splitedLine[0];
                            //var date_validation= thisuser.setLateDateAsLatestChat(splitedLine[0],splitedLine[0], data.days);
                            users.set(thisname, thisuser);
                            console.log("new user: " + thisname +", len: " +splitedLine.length);

                            // if(date_validation != null)
                            // {
                            // }
                            recent_user= thisuser;  // 마지막 유저
                        }
                    }
                    else{
                        currData= users.get(recent_username)
                        currData.textcount += splitedLine[0].length;
                        console.log("connected line, new text lines: "+ splitedLine[0].length +", " + recent_username +"'s total texts count is now: " + currData.textcount);
                        users.set(recent_username, currData);
                    }
                    console.log("users.size: " + users.size)
                }

                //const obj = Object.fromEntries(users);
                //const obj = Object.fromEntries(users);
                //const obj= JSON.stringify(users);
                //const obj= JSON.stringify(Array.from(users.entries()));

                // for (var prop in users) {
                //     if (obj.hasOwnProperty(prop) && prop[0] == letter){
                //         delete obj[prop];
                //     }
                // }

                // Object.keys(users).map(function(target, value) {
                //     if(users[key].target === false) {
                //         delete users[key];
                //     }
                //   });

                // Object.keys(users).forEach(function (target) {
                //     if(target === false) delete users[target];
                //    });

                console.log("ends up: ");
                var obj= [...users.values()]
                console.log(obj);
                parsingResult= obj;
                console.log("return parsingResult");
                resolve(parsingResult);
            };

            // 에러 핸들링..
            reader.onerror = function(e) {
                reject(e);
            };
            reader.readAsText(data.file, /* optional */ "euc-kr");
            console.log("end of parsingGroupConversation");
        });




        //data.days: 일수
        //data.file: 파일내용인데 이걸 읽어서 txt로 반환.
        // 테이블에서 볼 수 있도록 json으로 변환.

        // 리턴 텍스트데이터
        //return parsingResult;
    }
}


/**
 * 카카오톡 대화내용 분석 Parsing Request를 전송한다. (서버가 따로 없기 때문에 위의 메소드로 백엔드 API 흉내만 내자)
 * Parsing 결과를 Response 받고 DATA_READ_DONE에 전달한다.
 */
async function conversationDataReadAPI(data) {
    console.log(tag, "conversationDataReadAPI",data);
    var res= await parsingGroupConversation(data);     // 서버로 request 보낼 경우엔 axios를 사용한다 => return axios.post('/conversation/readGroupData', data);
    console.log("res of conversationDataReadAPI: " + res);
    return res;
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
