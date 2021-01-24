import { message } from 'antd';
import moment from 'moment';

var tag = "parsingGroupConversation";

export function parsingGroupConversationWindow(data)
{
    var users = new Map();

    var currentDate;

    var beforeUser;
    var beforeDate;

    var parseResult = new Promise((resolve, reject) =>
    {
        var reader = new FileReader();

        reader.onload = function ()
        {
            var lines = reader.result.split('\n');

            // 필요 없는 맨 위 text line 3행 제거
            lines.shift();
            lines.shift();
            lines.shift();

            // 대화 데이터 1행 씩 parsing 하기
            for (let i = 0; i < lines.length; i++)
            {

                // 현재(i) 행의 날짜
                var currentDate;

                // 날짜인지 검사하기
                var isDate = lines[i].indexOf("--------------- ") && lines[i].indexOf(" ---------------");

                // 테스트용 반복문
                if (i < 20)
                {

                    /**
                     * 새로운 날짜로 갱신하기
                     */
                    if (isDate === 0)
                    {
                        currentDate = getCurrentDate(lines[i]);
                    }

                    /**
                     * 대화 데이터 parsing 하기
                     */
                    else
                    {
                        /**
                         * 0번 인덱스에 담긴 데이터를 이름으로,
                         * 1번 인덱스 이후의 데이터들을 대화 내용으로 분류하기
                         */
                        var currentMessageData = lines[i].split(/\s\[\d{2}:\d{2}\]\s/);

                        var name = getName(currentMessageData[0]);
                        var message = getMessage(currentMessageData[1]);

                        console.log("date:", currentDate,"/ name:",name,"/ message:",message);
                    }
                    // console.log("currentDate:",currentDate);
                } // 테스트용 반복문 끝
            }

            /** return promise result */
            // resolve(parseResult);
        };
        reader.readAsText(data.file, /* optional */"utf8");
    });

    return parseResult;
}


/**
 * --------------- 0000년 0월 00일 수요일 ---------------
 * 위 형식의 날짜를 파싱하기
 */
function getCurrentDate(date)
{
    date = date.replace("--------------- ", '');
    date = date.replace(" ---------------", '');

    // 'YYYY년 MM월 DD일 E요일' 좌측 형식을 Date 로 읽기
    date = moment(date, 'YYYY년 MM월 DD일 E요일');

    // Date 가 된 문자열을 우측 형식으로 다시 저장하기 'YYYY-MM-DD'
    return date.format('YYYY-MM-DD');
}

/**
 * [김성훈] 좌측 형식의 좌 우 대괄호 지우기
 */
function getName(name) {
    name = name.substr(0, name.length - 1);
    name = name.substr(1);
    return name;
}


/**
 *  혹시라도 1번 인덱스(메시지) 이후의 데이터 행이 또 있을 경우 '메시지'로 간주하도록 처리하기
 */
function getMessage(massage) {
    return massage;
}
