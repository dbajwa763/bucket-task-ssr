import React,{useState,useEffect} from 'react';
import Head from 'next/head';
import styled from "styled-components";
import c from '@constants/Common';
import axios from "axios";
import {toast} from 'react-toastify';
import {BALL,BUCKET} from '@constants/ApiConstant';
import colors from '@constants/Colors';
import Layout from '@components/Layout';
import {hasValidationError,validationError,handleUnauthorized} from "@helpers/Frontend";
const BucketWrap = styled.div`
    width:100%;background:${colors.white};box-sizing:border-box;
    & .inner{
        display:flex;flex-direction:column;row-gap:20px;
        & .head{
            padding:0 0 15px;border-bottom:2px solid ${colors.border};display:flex;justify-content:space-between;align-items:center;
            & h1{font-size:24px;font-weight:500;color:${colors.blue};margin:0;}
        }
        & .form-result-wrap{
            display:flex;align-items:flex-start;column-gap:30px;
            & .form{
                display:flex;flex-direction:column;row-gap:15px;box-sizing:border-box;max-width:350px;
                & .submit{
                    display:flex;justify-content:center;align-items:center;padding:7px 10px;border:1px solid ${colors.green};border-radius:2px;color:${colors.white};background:${colors.green};cursor:pointer;
                    &:hover{background:${colors.blue};border-color:${colors.blue};}
                }
            }
            & .bucket-ball-wrap{
                display:flex;flex-direction:column;row-gap:20px;
                & .bucket-data{
                    display:flex;flex-direction:column;row-gap:10px;
                    & h2{font-size:20px;margin:0;font-weight:500;color:${colors.black};}
                    & .bucket-wrap{
                        display:flex;flex-direction:column;row-gap:2px;
                        & .bucket-item{
                            display:flex;border:1px solid ${colors.border};
                            & .title{font-size:16px;font-weight:500;color:${colors.black};padding:8px 15px;width:210px;border-right:1px solid ${colors.border};}
                            & .balls{font-size:16px;font-weight:400;color:${colors.black};padding:8px 15px;}
                        }
                    }
                }
                & .ball-data{
                    display:flex;flex-direction:column;row-gap:10px;
                    & h2{font-size:20px;margin:0;font-weight:500;color:${colors.black};}
                    & .ball-wrap{
                        display:flex;flex-direction:column;row-gap:2px;
                        & .ball-item{
                            display:flex;border:1px solid ${colors.border};
                            & .title{font-size:16px;font-weight:500;color:${colors.black};padding:8px 15px;width:210px;border-right:1px solid ${colors.border};}
                            & .balls{font-size:16px;font-weight:400;color:${colors.black};padding:8px 15px;}
                        }
                    }
                }
            }
        }
    }
    @media(max-width:479px){
        & .inner{
            & .head{
                padding: 0 0 10px;
                & h1{font-size:17px;font-weight:500;}
            }
        }
    }
`;
const BucketSuggestion = (props) => {
    const toastOptions = {position:"bottom-center",autoClose:3000,hideProgressBar:true,closeOnClick:false,pauseOnHover:false,draggable:false,progress:0,theme:"colored"};
    const [balls,setBalls] = useState(props.balls);
    const [allBuckets,setAllBuckets] = useState([]);
    const [remainingBalls,setRemainingBalls] = useState([]);
    const [errors,setErrors] = useState([]);
    const [submitting,setSubmitting] = useState(false);
    useEffect(() => {
        window.scrollTo(0,0);
    },[]);
    const onChange = (name,value,index) => {
        let balObject = Object.assign([],balls);
        let newValue = value.replace(/[^0-9]/gi,'');
        if(newValue == "" || newValue <= 99999){
            balObject[index][name] = newValue;
            setBalls(balObject);
        }
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if(submitting){
            return;
        }
        handleSubmit();
    }
    const handleSubmit = async() => {
        try{
            setSubmitting(true);
            document.getElementById("custom-loader").style.display = "block";
            const {data} = await axios.post(BUCKET.addBalls,{balls: balls});
            if(data.status == c.API_STATUS.SUCCESS){
                document.getElementById("custom-loader").style.display = "none";
                toast.success(data.message,toastOptions);
                setAllBuckets(data.allBuckets);
                setRemainingBalls(data.remainingBalls);
                setSubmitting(false);
            }else if(data.status == c.API_STATUS.UNPROCESSABLE_ENTITY){
                setSubmitting(false);
                document.getElementById("custom-loader").style.display = "none";
                setErrors(data.errors);
            }else{
                setSubmitting(false);
                document.getElementById("custom-loader").style.display = "none";
                toast.error(data.message,toastOptions);
            }
        }catch(e){
            setSubmitting(false);
            document.getElementById("custom-loader").style.display = "none";
            if(e.response && e.response.data.message){
                toast.error(e.response.data.message,toastOptions);
            }
        }
    }
    const getBallData = (bucket) => {
        let renderHtml = [];
        bucket.balls.map((bucketBall) => {
            renderHtml.push(`${bucketBall.volume} ${bucketBall.name} Balls`);
        });
        return renderHtml.join(", ") + ((bucket.capacity > 0) ? ` and ${bucket.capacity} cubic inches remaining` : "");
    }
    return (
        <React.Fragment>
            <Head>
                <meta charset="utf-8"/>
                <title>{`Bucket Suggestions - ${c.APP_NAME}`}</title>
            </Head>
            <Layout page="suggestions">
                <BucketWrap>
                    <div className="inner">
                        <div className="head">
                            <h1>Bucket Suggestions</h1>
                        </div>
                        {balls.length > 0 ? (
                            <div className="form-result-wrap">
                                <form className="form" onSubmit={onSubmit}>
                                    {balls.map((ball,index) => (
                                        <div className="bi-form-group" key={index}>
                                            <label className="label">{ball.name} ({ball.capacity} inch)</label>
                                            <input className={hasValidationError(errors,`ball_${index}_volume`) ? "has-input-error" : ""} value={ball.volume || ""} onChange={(e) => onChange("volume",e.target.value,index)}/>
                                            {hasValidationError(errors,`ball_${index}_volume`) ? (<span className="has-cust-error">{validationError(errors,`ball_${index}_volume`)}</span>) : null}
                                        </div>
                                    ))}
                                    <button className="submit">Place Balls in Buckets</button>
                                </form>
                                {(allBuckets.length > 0 || remainingBalls.length > 0) ? (
                                    <div className='bucket-ball-wrap'>
                                        {allBuckets.length > 0 ? (
                                            <div className='bucket-data'>
                                                <h2>Balls in Buckets</h2>
                                                <div className='bucket-wrap'>
                                                    {allBuckets.map((bucket,index) => (
                                                        <div className='bucket-item' key={index}>
                                                            <div className='title'>{bucket.name} ({bucket.totalCapacity} cubic inches)</div>
                                                            <div className='balls' dangerouslySetInnerHTML={{__html: getBallData(bucket)}}></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                        {remainingBalls.length > 0 ? (
                                            <div className='ball-data'>
                                                <h2>Remaining Balls</h2>
                                                <div className='ball-wrap'>
                                                    {remainingBalls.map((remainingBall,index) => (
                                                        <div className='ball-item' key={index}>
                                                            <div className='title'>{remainingBall.name} ({remainingBall.capacity} cubic inches)</div>
                                                            <div className='balls'>{remainingBall.volume}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <div className="empty-balls"></div>
                        )}
                    </div>
                </BucketWrap>
            </Layout>
        </React.Fragment>
    );
}
export const getServerSideProps = async(context) => {
    let balls = [];
    try{
        const {data} = await axios.get(BALL.all);
        if(data.status == c.API_STATUS.SUCCESS){
            balls = data.balls;
        }
    }catch(e){
        handleUnauthorized(e,context.res);
        return;
    }
    return {props: {balls}};
}
export default BucketSuggestion;