import React from 'react';
import AppLayout from "../components/appLayout";

/**
 * 페이지는 반드시 'pages' 폴더 내부에 배치 해야됨.
 * 왜냐하면 next는 pages 폴더 내부의 페이지 파일들을 code spliting 해주기 때문이다.
 */

const Home = () => {

    return(
        <>
            <AppLayout>

            </AppLayout>
        </>
    );
}

export default Home;