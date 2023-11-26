import React from 'react';
import Head from 'next/head';
import styled from "styled-components";
import colors from '@constants/Colors';
const NotFoundWrap = styled.div`
    width:100%;margin:0 auto;padding:40px 20px;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;box-sizing:border-box;overflow-y:auto;
    & p{margin:0;font-size:18px;color:${colors.black};}
`;
const NotFound = () => {
    return (
        <React.Fragment>
            <Head>
                <title>Page Not Found</title>
            </Head>
            <NotFoundWrap>
                <p>We are Sorry. The Page You're Looking for Can't be Found.</p>
            </NotFoundWrap>
        </React.Fragment>
    );
}
export default NotFound;