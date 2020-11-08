import { Typography, Layout } from "antd";
const { Header, Footer, Content } = Layout;
import styled from "styled-components";


// backgroundImage: `url(${ 'https://api.xxx.com//1.jpg' })`;
export const HeaderStyle = styled(Header)`
    background: '#ffffff';
    justifyContent: 'center';
    alignItems: 'center';
    
    & p{
        margin-top:10px;
        font-weight: bold;
        font-size: 13px;
        line-height: 150%;        
    }
`
