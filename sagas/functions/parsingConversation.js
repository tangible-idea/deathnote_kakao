import { message } from 'antd';

var tag = "parsingGroupConversation";

export function parsingGroupConversationWindow(data) {

    var reader = new FileReader();
    reader.onload = function () {
        console.log(tag,"data.result:",reader.result);
    };
    reader.readAsText(data.file, /* optional */"utf8");



    // return "parsing done";
}
