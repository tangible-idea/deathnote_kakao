import React from "react";
import { Typography, Layout } from "antd";

const { Header, Footer, Content } = Layout;
const { Title, Text } = Typography;

import PageContents from "../pageContents";
// import { HeaderStyle } from "../style";


const StyleHeader = {
    background: 'white',
    textAlign: 'center',
    padding: 50,
}

const StyleContent = {
    textAlign: 'center',
    padding: 50,
}

const StyleFooter = {
    padding: 50,
    background: 'white',
    textAlign: 'center',
}

const AppLayout = ({ children }) => {

    return (
        <>
            <Header style={ StyleHeader }>
                <Title level={ 1 }>숙청숙청</Title>
            </Header>

            <Content style={ StyleContent }>
                <PageContents/>
            </Content>

            <Footer style={ StyleFooter }>
                <Text type="secondary">Copyrightⓒ<br/>Mark Choi & Sam Kim</Text>
            </Footer>
        </>
    );
}

export default AppLayout;