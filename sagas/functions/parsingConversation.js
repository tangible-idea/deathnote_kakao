import { message } from 'antd';

var tag = "parsingGroupConversation";

export function parsingGroupConversationWindow(data)
{
    var users = new Map();

    var parseResult = new Promise((resolve, reject) => {

        var reader = new FileReader();

        reader.onload = function ()
        {
            var lines = reader.result.split('\n');

            // 필요없는 맨 위 text line 3줄 제거
            lines.shift();
            lines.shift();
            lines.shift();

            for (let i = 0; i < lines.length; i++)
            {

            }

            /** return promise result */
            // resolve(parseResult);
        };
        reader.readAsText(data.file, /* optional */"utf8");
    });

    return parseResult;
}
