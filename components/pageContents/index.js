import react from 'react'
import { Typography, Upload, message, Col, Row, Input, InputNumber , Space} from 'antd';

const { Dragger } = Upload;

import { InboxOutlined } from '@ant-design/icons';


import DeathNoteGroup from "./DeathNoteGroup";

const { Title, Text } = Typography;

import { Button } from 'antd';
import HowToUse from "./HowToUse";

const PageContents = () => {

    const props = {
        name: 'file',
        multiple: true,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`업로드 성공: ${ info.file.name }`);
            } else if (status === 'error') {
                message.error(`업로드 실패: ${ info.file.name }`);
            }
        },
    };

    return (
        <>
            content <br/>
            <HowToUse/>
            <br/>

            <Dragger
                accept={ '.txt, .csv' }
                { ...props }>
                <p className="ant-upload-text">파일 업로드<br/>클릭 or 드래그</p>
                <p className="ant-upload-hint">File: txt or .csv</p>
            </Dragger>

            <br/>

            {/* line start */ }

            <Row>
                <Space size={'middle'}>
                <Col flex="100px">
                    <InputNumber
                    placeholder="숫자"/>
                </Col>
                <Col flex="auto" style={{textAlign:'left'}}>
                    <Text>일간 대화가 없던 대상을 검색합니다</Text>
                </Col>
                </Space>
            </Row>
            {/* line end */ }

            <br/>

            <DeathNoteGroup/>
        </>
    );
}

export default PageContents;