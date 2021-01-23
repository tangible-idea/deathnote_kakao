import { message } from 'antd';

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

                /**
                 * 날짜 구분하기
                 */
                // var currentDate = lines[i].indexOf("--------------- ") && lines[i].indexOf(" ---------------");
                var isDate = lines[i].indexOf("--------------- ") && lines[i].indexOf(" ---------------");
                if (i < 20)
                {
                    console.log(i,"isDate:",isDate);
                }

                /**
                 * 대화 데이터 parsing 하기
                 */
                else
                {
                    /** (var splitResult = split 'name [00:00] message')
                     * ' [00:00] ' 좌측 형식을 기준으로 split 하기
                     * 0번 인덱스 데이터를 이름으로,
                     * 1번 인덱스 이후의 데이터들을 대화 내용으로 분류하기
                     */
                    var splitResult = lines[i].split(/\s\[\d{2}:\d{2}\]\s/);

                    var name = splitResult[0];
                    var message = splitResult[1];

/*                    if (i < 10)
                    {
                        console.log(splitResult)
                    }*/
                }
            }

            /** return promise result */
            // resolve(parseResult);
        };
        reader.readAsText(data.file, /* optional */"utf8");
    });

    return parseResult;
}
