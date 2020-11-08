import React, { useState } from "react";
import {
    Modal,
    Button,
    Steps,
    Divider,
} from "antd";

const { Step } = Steps;


let tag = "HowToUse:"


const HowToUse = () => {

    // modal 실행 여부
    const [visibleAddressModal, setVisibleAddressModal] = useState(false);


    // modal open
    const modalOpen = () => {
        setVisibleAddressModal(true);
    };

    // modal 꺼짐 표시하기
    const modalCancel = () => {
        setVisibleAddressModal(false);
    };

    return (
        <>
            <Button onClick={modalOpen}>How to use?</Button> <br/>

            <Modal
                title="How to use?"
                centered
                visible={visibleAddressModal}
                onCancel={modalCancel}
                width={900}
                footer={[
                    <Button key="뒤로가기" onClick={modalCancel}>
                        뒤로가기
                    </Button>,
                ]}>
                <Steps progressDot current={5} direction="vertical">
                    <Step title="Kakao Death Note 사용 방법" description="PC 카카오톡만 읽을 수 있습니다. PC 카카오톡을 실행하세요." />
                    <Step title="(클릭) 단체 대화방 메뉴버튼." description="메뉴 버튼은 우측 상단에 있습니다." />
                    <Step title="(클릭) 메뉴 목록에서 대화내용 -> 대화 내보내기." description="대화 내용을 파일로 저장합니다. 윈도우 PC는 .txt / 맥북 PC는 .csv 파일을 저장합니다. " />
                    <Step title="(업로드) Kakao Death Note에 파일을 업로드 해주세요." description="파일은 하나만 업로드 할 수 있습니다." />
                    <Step title="(대화 분석) 분석 방법을 설정 후 제거 대상을 찾아냅니다." description="설정을 입력 후 '분석 시작' 버튼을 눌러주세요. " />
                </Steps>
            </Modal>

        </>
    );
}

export default HowToUse;