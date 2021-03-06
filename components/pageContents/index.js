import react, { useCallback, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Typography, Upload, message, Col, Row, Input, InputNumber, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Dragger } = Upload;

import { DATA_READ_REQUEST } from "../../reducers/conversation"

import DeathNoteGroup from "./DeathNoteGroup";
import HowToUse from "./HowToUse";

const PageContents = () => {
    const dispatch = useDispatch();
    const [day, setDay] = useState(7);
    const [myfile, setMyFile] = useState('');
    const [upLoadDone, setUpLoadDone] = useState(false);

    // state.(파일명) 해당 const 변수들을 select함.
    const { dataReadLoading, dataReadDone, dataReadError, conversationData, conversationParsingResult } = useSelector((state) => state.conversation)

    useEffect(() => {

    }, [conversationData])

    const props = {
        name: 'file',
        multiple: true,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
                setUpLoadDone(false);
            }
            if (status === 'done') {
                message.success(`업로드 성공: ${ info.file.name }`);
                setMyFile(info.file.originFileObj);
                setUpLoadDone(true);
            } else if (status === 'error') {
                setUpLoadDone(false);
                message.error(`업로드 실패: ${ info.file.name }`);
            }
        },
    };

    // 숫자 입력받기
    function onChangeDay(value) {
        setDay(value);
    }

    const onClickConfirm = useCallback(() => {
        // redux호출: 사용type, 전달할data
        dispatch({
            type: DATA_READ_REQUEST,
            data: {
                days: day, // 키값: state값
                file: myfile
            }
        })
    })

    return (
        <>
            content <br/>
            <HowToUse/>
            <br/>

            {
                upLoadDone ?
                    null
                    : <Dragger
                        accept={ '.txt, .csv' }
                        { ...props }>
                        <p className="ant-upload-text">파일 업로드<br/>클릭 or 드래그</p>
                        <p className="ant-upload-hint">File: txt or .csv</p>
                    </Dragger>
            }

            <br/>

            {/* line start */ }

            <Row>
                <Space size={ 'middle' }>
                    <Col flex="100px">
                        <InputNumber onChange={ onChangeDay } value={ day }
                                     placeholder="숫자"/>
                    </Col>
                    <Col flex="auto" style={ { textAlign: 'left' } }>
                        <Text>일간 대화가 없던 대상을 검색.</Text>
                    </Col>
                </Space>
            </Row>
            {/* line end */ }

            <Button onClick={ onClickConfirm }>확인</Button>


            <br/>

            <DeathNoteGroup parsedData={conversationParsingResult}/>
        </>
    );
}

export default PageContents;