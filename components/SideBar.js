import React from 'react';
import styled from "styled-components";
import colors from '@constants/Colors';
const SidebarWrap = styled.div`
    flex:0 0 230px;max-width:100%;background:${colors.white};border-right:1px solid ${colors.border};display:flex;flex-direction:column;justify-content:space-between;row-gap:10px;background:${colors.white};
    & .sidebar-inner{
        display:flex;flex-direction:column;row-gap:20px;
        & .info-wrap{
            display:flex;flex-direction:column;row-gap:20px;padding:15px 15px 0;
            & .logo-wrap{font-size:22px;color:${colors.blue};text-decoration:none;font-weight:600;text-transform:uppercase;}
        }
        & .menu-wrap{
            display:flex;flex-direction:column;padding:0 15px 15px;row-gap:5px;
            & .menu-item{
                display:flex;align-items:center;column-gap:10px;padding:12px 12px 12px 15px;text-decoration:none;font-size:15px;font-weight:500;color:${colors.blue};transition:.2s;border-radius:5px;cursor:pointer;
                &:hover,
                &.active{background:${colors.blue};color:${colors.white};}
            }
        }
    }
`;
const SideBar = ({page}) => {
    return (
        <React.Fragment>
            <SidebarWrap>
                <div className="sidebar-inner">
                    <div className="info-wrap">
                        <a href="/" className="logo-wrap">Bucket Task</a>
                    </div>
                    <div className="menu-wrap">
                        <a href='/' className={`menu-item ${((page == "dashboard") ? "active" : "")}`}>Dashboard</a>
                        <a href='/buckets' className={`menu-item ${((page == "buckets") ? "active" : "")}`}>Buckets</a>
                        <a href='/balls' className={`menu-item ${((page == "balls") ? "active" : "")}`}>Balls</a>
                        <a href='/bucket-suggestions' className={`menu-item ${((page == "suggestions") ? "active" : "")}`}>Bucket Suggestions</a>
                    </div>
                </div>
            </SidebarWrap>
        </React.Fragment>
    );
}
export default SideBar;