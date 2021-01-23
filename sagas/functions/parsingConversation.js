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
                var today;

                var splitResult = lines[i].split(/\s\[\d{2}:\d{2}\]\s/);
                if (i < 10) {
                    console.log(splitResult)
                }
            }

            /** return promise result */
            // resolve(parseResult);
        };
        reader.readAsText(data.file, /* optional */"utf8");
    });

    return parseResult;
}
