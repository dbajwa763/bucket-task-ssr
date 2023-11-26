import React from "react";
import styled from 'styled-components';
import colors from "@constants/Colors";
const ErrorWrap = styled.div`
    display:flex;align-items:center;justify-content:center;flex-direction:column;min-height:100vh;
    & h2{margin:0 0 20px;font-weight:500;font-size:22px;color:${colors.black};}
    & button{font-size:16px;color:${colors.white};background:${colors.green};padding:8px;width:140px;border:none;border-radius:5px;cursor:pointer;transition:.2s;}
`;
class ErrorBoundary extends React.Component
{
	constructor(props){
		super(props)
		this.state = {
			hasError: false
		}
	}
	static getDerivedStateFromError(error){
		return {hasError: true}
	}
	componentDidCatch(error,errorInfo){
		console.log({error,errorInfo})
	}
	handlerButton = () => {
		this.setState({hasError: false});
	}
	render(){
		const {hasError} = this.state;
		if(hasError){
			return (
				<ErrorWrap>
					<h2>Oops, something went wrong!</h2>
					<button type="button" onClick={this.handlerButton}>Try again?</button>
				</ErrorWrap>
			)
		}
		return this.props.children
	}
}
export default ErrorBoundary