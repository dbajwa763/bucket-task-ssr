import React from 'react';
import styled from "styled-components";
import SideBar from '@components/SideBar';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const LayoutWrap = styled.div`
    height:100vh;max-height:100%;display:flex;
    & .layout-content{
        width:calc(100% - 220px);padding:40px;box-sizing:border-box;overflow-y:auto;
        & .menu{background:none;border:none;padding:0;cursor:pointer;display:none;position:relative;top:-15px;}
        & .overlay{background:#29384533;position:absolute;top:0;left:0;right:0;bottom:0;display:none;z-index:1;}
    }
    @media(max-width:991px){
        & .layout-content{
            width:calc(100% - 70px);padding:40px 30px;
            & .menu{display:block;}
            & .show-overlay{display:block;}
            & .hide-overlay{display:none;}
        }
        & .margin{margin-left:80px;}
    }
    @media(max-width:767px){
        & .layout-content{width:100%;padding:30px 20px;}
        & .margin{margin-left:0px;}
    }
`;
const Layout = (props) => {
    return (
        <React.Fragment>
            <LayoutWrap>
                <SideBar page={props.page}/>
                <div className="layout-content">{props.children}</div>
            </LayoutWrap>
            <ToastContainer/>
        </React.Fragment>
    );
}
export default Layout;