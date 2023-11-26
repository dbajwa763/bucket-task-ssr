import React,{useState,useEffect} from 'react';
import Head from 'next/head';
import styled from "styled-components";
import c from '@constants/Common';
import axios from "axios";
import {toast} from 'react-toastify';
import {BALL} from '@constants/ApiConstant';
import colors from '@constants/Colors';
import Layout from '@components/Layout';
import BiDataTable from '@helpers/BiDataTable';
import {hasValidationError,validationError,focusOnFeild,handleUnauthorized,} from "@helpers/Frontend";
import {crossIcon,editIcon,deleteIcon} from "@helpers/Icons";
import SwitchButton from '@components/SwitchButton';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
const BallWrap = styled.div`
    width:100%;background:${colors.white};box-sizing:border-box;
    & .inner{
        display:flex;flex-direction:column;row-gap:20px;
        & .head{
            padding:0 0 15px;border-bottom:2px solid ${colors.border};display:flex;justify-content:space-between;align-items:center;
            & h1{font-size:24px;font-weight:500;color:${colors.blue};margin:0;}
            & .btn-wrap{
                background:${colors.green};font-size:16px;padding:8px 20px;border:2px solid ${colors.green};border-radius:5px;height:40px;display:flex;align-items:center;column-gap:8px;cursor:pointer;transition:.2s;color:${colors.white};box-sizing:border-box;text-decoration:none;
                &:hover{background:${colors.blue};border-color:${colors.blue};}
            }
        }
        & .bi-datatable-actions{
            display:flex;justify-content:center;column-gap:10px;
            & .box-button{
                display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;color:${colors.white};font-size:16px;text-decoration:underline;padding:0;background:${colors.green};text-decoration:none;border-radius:6px;width:40px;height:40px;
                &.delete{
                    background:${colors.red};
                    &:hover{background:${colors.red};}
                }
                &:hover{background:${colors.blue};}
            }
        }
    }
    @media(max-width:479px){
        & .inner{
            & .head{
                padding: 0 0 10px;
                & h1{font-size:17px;font-weight:500;}
                & .btn-wrap{
                    font-size:13px;padding:8px 10px;column-gap:5px;
                }
            }
        }
    }
`;
const PopupWrap = styled.div`
    position:fixed;top:0;bottom:0;left:0;right:0;z-index:999;display:flex;justify-content:flex-end;background:#0000002b;
    & .back{position:absolute;left:0;top:0;right:0;bottom:0;}
    & .inner{
        background:${colors.white};width:350px;z-index:1;box-sizing:border-box;
        & .bi-head{
            display:flex;align-items:center;justify-content:space-between;padding:20px 25px;background:${colors.background};
            & .heading{font-size:20px;font-weight:500;color:${colors.blue};}
            & .close-btn{background:none;border:none;padding:0;cursor:pointer;}
        }
        & .bi-content{
            display:flex;flex-direction:column;row-gap:15px;padding:20px 25px;height:calc(100vh - 129px);box-sizing:border-box;overflow-y:auto;
        }
        & .bi-footer{
            display:flex;align-items:center;justify-content:space-between;padding:15px 25px;background:${colors.background};
            & .btn-wrap{
                display:flex;justify-content:center;align-items:center;column-gap:10px;margin-left:auto;
                & .cancel{
                    display:flex;justify-content:center;align-items:center;padding:7px 10px;border:1px solid ${colors.green};border-radius:2px;color:${colors.green};background:transparent;cursor:pointer;
                    &:hover{background:${colors.blue};border-color:${colors.blue};color:${colors.white};}
                }
                & .apply{
                    display:flex;justify-content:center;align-items:center;padding:7px 10px;border:1px solid ${colors.green};border-radius:2px;color:${colors.white};background:${colors.green};cursor:pointer;
                    &:hover{background:${colors.blue};border-color:${colors.blue};}
                }
            }
        }
    }
`;
const Balls = (props) => {
    const toastOptions = {position:"bottom-center",autoClose:3000,hideProgressBar:true,closeOnClick:false,pauseOnHover:false,draggable:false,progress:0,theme:"colored"};
    const perPage = [10,25,50,75,100];
    const [tableData,setTableData] = useState(props.tableData);
    const [filters,setFilters] = useState(props.queryParams);
    const [sortOrders,setSortOrders] = useState({});
    const [isLoading,setIsLoading] = useState(false);
    const [form,setForm] = useState({name:"",capacity:"",status:true});
    const [errors,setErrors] = useState([]);
    const [submitting,setSubmitting] = useState(false);
    const [showPopup,setShowPopup] = useState(false);
    const sortColumns = ["name","capacity","status"];
    const capacityComponent = (row) => {
        return row.capacity ? `${row.capacity} cubic inches` : "";
    }
    const statusComponent = (row) => {
        if(row.status){
            return (
                <span className="bi-badge success">Active</span>
            );
        }else{
            return (
                <span className="bi-badge danger">Inactive</span>
            );
        }
    }
    const actionComponent = (row) => {
        return (
            <div className="bi-datatable-actions">
                <button className="box-button" onClick={() => actionHandler(row,'edit')}>{editIcon({width:16,height:16,fill:colors.white})}</button>
                <button className="box-button delete" onClick={() => actionHandler(row,'delete')}>{deleteIcon({width:18,height:18,fill:colors.white})}</button>
            </div>
        );
    }
    const actionHandler = (row,type) => {
        if(type == "edit"){
            setForm({name: row.name,slug: row.slug,capacity: row.capacity,status: row.status});
            setErrors([]);
            setShowPopup(true);
            document.body.classList.add("no-overflow");
        }else if(type == "delete"){
            MySwal.fire({title: 'Confirm',html: "Are you sure you want to delete this ball?",showCancelButton: true,cancelButtonText: "No",confirmButtonText: "Yes"}).then((result) => {
                if(result.isConfirmed){
                    deleteBall(row.slug);
                }
            });
        }
    }
    const columns = [
        {label:"Name",name:"name",orderable:true,classes:['text-capitalize']},
        {label:"Volume",name:"capacity",orderable:true,component:capacityComponent},
        {label:"Status",name:"status",orderable:true,component:statusComponent},
        {label:"Manage",name:"",component:actionComponent,classes:['w100','text-center']}
    ];
    useEffect(() => {
        window.scrollTo(0,0);
        updateSortOrder();
    },[]);
    const updateSortOrder = () => {
        let sortOrder = {};
        if(sortColumns.length > 0){
            sortColumns.forEach((column) => {
                if(filters.sort_column === column && filters.sort_by === 'desc'){
                    sortOrder[column] = 1;
                }else{
                    sortOrder[column] = -1;
                }
            });
        }else{
            columns.forEach((column) => {
                if(tableProps.sort_column === column.name && tableProps.sort_by === 'desc'){
                    sortOrder[column.name] = 1;
                }else{
                    sortOrder[column.name] = -1;
                }
            });
        }
        setSortOrders(sortOrder);
    }
    const getData = async(appliedFilters) => {
        try{
            setIsLoading(true);
            const {data} = await axios.get(BALL.lists,{params: appliedFilters});
            if(data.status == c.API_STATUS.SUCCESS){
                setIsLoading(false);
                setTableData(data.resData);
            }
            setIsLoading(false);
        }catch(e){
            console.log(e);
            setIsLoading(false);
        }
    }
    const sortBy = (column) => {
        if(column.orderable && (tableData && tableData.data && tableData.data.length > 0)){
            sortOrders[column.name] = sortOrders[column.name] * -1;
            filters.sort_column = column.columnName ? column.columnName : column.name;
            filters.sort_by = sortOrders[column.name] === 1 ? 'desc' : 'asc';
            filters.page = 1;
            setSortOrders(sortOrders);
            setFilters(filters);
            getData(filters);
        }
    }
    const searchText = async(e) => {
        const {value} = e.target;
        filters.query = value;
        filters.page = 1;
        setFilters(filters);
        getData(filters);
    }
    const resetSearch = async() => {
        filters.query = "";
        filters.page = 1;
        setFilters(filters);
        getData(filters);
    }
    const perPageHandler = async(e) => {
        const {value} = e.target;
        filters.page = 1;
        filters.limit = value;
        setFilters(filters);
        getData(filters);
    }
    const paginationHandler = (pageNo) => {
        filters.page = pageNo;
        setFilters(filters);
        getData(filters);
    }
    const onChange = (e) => {
        const {name,value} = e.target;
        if(name == "capacity"){
            let newValue = value.replace(/[^0-9.]/gi,'');
            newValue = (newValue.indexOf(".") >= 0) ? (newValue.substr(0,newValue.indexOf(".")) + newValue.substr(newValue.indexOf("."),2)) : newValue;
            if(newValue == "" || newValue <= 99999){
                handleCustom(name,newValue);
            }
        }else{
            handleCustom(name,value);
        }
    }
    const handleCustom = (name,value) => {
        setForm((prevState) => ({...prevState,[name]: value}));
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if(submitting){
            return;
        }
        if(!validate()){
            return;
        }
        handleSubmit();
    }
    const validate = () => {
        const newError = {};
        let positionFocus = "";
        if(!form.name || !form.name.trim()){
            newError['name'] = "Required";
            positionFocus = positionFocus || "name";
        }else if(form.name.length > 100){
            newError['name'] = "Maximum 100 characters allowed";
            positionFocus = positionFocus || "name";
        }
        if(!form.capacity){
            newError['capacity'] = "Required";
            positionFocus = positionFocus || "capacity";
        }
        setErrors(newError);
        if(positionFocus){
            focusOnFeild(positionFocus);
            return false;
        }
        return true;
    }
    const handleSubmit = async () => {
        try{
            setSubmitting(true);
            document.getElementById("custom-loader").style.display = "block";
            const apiUrl = (form.slug ? BALL.update : BALL.create);
            const {data} = await axios.post(apiUrl,form);
            if(data.status == c.API_STATUS.SUCCESS){
                document.getElementById("custom-loader").style.display = "none";
                toast.success(data.message,toastOptions);
                setShowPopup(false);
                setSubmitting(false);
                getData(filters);
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
    const handleClose = () => {
        setForm({name:"",capacity:"",status:false});
        setErrors([]);
        setShowPopup(false);
        document.body.classList.remove("no-overflow");
    }
    const addBall = () => {
        setForm({name:"",capacity:"",status:true});
        setErrors([]);
        setShowPopup(true);
        document.body.classList.add("no-overflow");
    }
    const toggleActive = () => {
        handleCustom("status",!form.status);
    }
    const deleteBall = async(slug) => {
        try{
            const {data} = await axios.delete(`${BALL.delete}/${slug}`);
            if(data.status == c.API_STATUS.SUCCESS){
                toast.success(data.message,toastOptions);
                getData(filters);
            }
        }catch(e){
            console.log(e);
        }
    }
    return (
        <React.Fragment>
            <Head>
                <meta charset="utf-8"/>
                <title>{`Balls - ${c.APP_NAME}`}</title>
            </Head>
            <Layout page="balls">
                {showPopup && (
                    <PopupWrap>
                        <div className="back" onClick={handleClose}></div>
                        <form className="inner" onSubmit={onSubmit}>
                            <div className="bi-head">
                                <div className="heading">{form.slug ? "Edit" : "Add"} Ball</div>
                                <button onClick={handleClose} type="button" className="close-btn">{crossIcon({width:22,height:22})}</button>
                            </div>
                            <div className="bi-content">
                                <div className="bi-form-group">
                                    <label className="label">Name</label>
                                    <input className={hasValidationError(errors,"name") ? "has-input-error" : ""} name='name' value={form.name} onChange={onChange}/>
                                    {hasValidationError(errors,"name") ? (<span className="has-cust-error">{validationError(errors,"name")}</span>) : null}
                                </div>
                                <div className="bi-form-group">
                                    <label className="label">Volume</label>
                                    <input className={hasValidationError(errors,"capacity") ? "has-input-error" : ""} name='capacity' value={form.capacity} onChange={onChange}/>
                                    {hasValidationError(errors,"capacity") ? (<span className="has-cust-error">{validationError(errors,"capacity")}</span>) : null}
                                </div>
                                <div className='bi-form-group'>
                                    <SwitchButton labelText={(form.status ? "Active" : "Inactive")} isEnabled={form.status} toggleButton={toggleActive}/>
                                </div>
                            </div>
                            <div className="bi-footer">
                                <div className="btn-wrap">
                                    <button type="button" className="cancel" onClick={handleClose}>Cancel</button>
                                    <button className="apply">{form.slug ? "Update" : "Save"}</button>
                                </div>
                            </div>
                        </form>
                    </PopupWrap>
                )}
                <BallWrap>
                    <div className="inner">
                        <div className="head">
                            <h1>Balls</h1>
                            <button className="btn-wrap" onClick={addBall}>Add Ball</button>
                        </div>
                        <BiDataTable tableData={tableData} columns={columns} isLoading={isLoading} filters={filters} perPage={perPage} showSearch={true} searchText={searchText} resetSearch={resetSearch} sortBy={sortBy} paginationHandler={paginationHandler} perPageHandler={perPageHandler}/>
                    </div>
                </BallWrap>
            </Layout>
        </React.Fragment>
    );
}
export const getServerSideProps = async(context) => {
    let tableData = {},queryParams = {page:1,limit:10,sort_column:"name",sort_by:"ASC",query:""};
    try{
        const {data} = await axios.get(BALL.lists,{params: queryParams});
        if(data.status == c.API_STATUS.SUCCESS){
            tableData = data.resData;
        }
    }catch(e){
        handleUnauthorized(e,context.res);
        return;
    }
    return {props: {tableData,queryParams}};
}
export default Balls;