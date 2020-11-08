import React from 'react';
import 'antd/dist/antd.css';
import withReduxSaga from 'next-redux-saga';
import Head from 'next/head';
import wrapper from '../store/configureStore';

const DeathNoteKakaoApp = ({Component}) => {
    return (
        <>
            <Head>
                {
                    // 브라우저 페이지 탭에 아이콘 띄우기
                    <link rel="icon" href="../resource/favicon.ico"/> }
                <title>Kakao Death Note</title>
            </Head>

            <Component />
        </>
    );
}

export default wrapper.withRedux(withReduxSaga(DeathNoteKakaoApp));