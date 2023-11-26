import React from 'react';
import styled from 'styled-components';
import colors from '@constants/Colors';
const SwitchWrap = styled.div`
    & .switch-button-control{
        display:flex;flex-direction:row;align-items:center;margin-top:4px;
        & .switch-button{
            background-color:${colors.black};height:1.6em;width:calc(1.6em * 2);border:2px solid ${colors.black};box-shadow:inset 0px 0px 2px 0px rgba(0, 0, 0, 0.33);border-radius:1.6em;transition:all 0.3s ease-in-out;cursor:pointer;flex-shrink:0;
            &.enabled{background-color:${colors.green};box-shadow:none;border-color:${colors.green};}
            & .button{height:calc(1.6em - (2 * 2px));width:calc(1.6em - (2 * 2px));border:2px solid ${colors.black};border-radius:calc(1.6em - (2 * 2px));background:${colors.white};transition:all 0.3s ease-in-out;}
            &.enabled{
                & .button{background:${colors.white};transform:translateX(calc(calc(1.6em - (2 * 2px)) + (2 * 2px)));border:2px solid ${colors.green};}
            }
        }
        & .switch-button-label{margin-left:10px;font-size:14px;color:${colors.black};font-weight:500;}
    }
`;
const SwitchButton = ({isEnabled,toggleButton,labelText = ""}) => {
    return (
        <SwitchWrap>
            <div className="switch-button-control">
                <div className={isEnabled ? "switch-button enabled" : "switch-button"} onClick={toggleButton}>
                    <div className="button"></div>
                </div>
                <div className="switch-button-label">{labelText}</div>
            </div>
        </SwitchWrap>
    );
}
export default SwitchButton;