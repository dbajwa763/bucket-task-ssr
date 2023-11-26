import App from "next/app";
import React from "react";
import ErrorBoundary from "@components/ErrorBoundary";
import {loaderIcon} from "@helpers/Icons";

class MyApp extends App
{
    constructor(props){
        super(props);
        this.state = {
            load: false
        }
    }
    componentDidMount(){
        this.setState({load: true});
    }
    render(){
        const {Component,pageProps} = this.props;
        const {load} = this.state;
        return (
            <>
                <div id="custom-loader">
                    <div className="inner">{loaderIcon({width:40,height:40,stroke:"#000"})}</div>
                </div>
                {load && (
                    <ErrorBoundary>
                        <Component {...pageProps}/>
                    </ErrorBoundary>)
                }
            </>
        );
    }
}
export default MyApp;