import React from 'react';
import styled from 'styled-components';
import colors from '@constants/Colors';
import {loaderIcon,crossIcon,searchIcon,previousIcon,nextIcon} from "@helpers/Icons";
import {usePagination} from "@helpers/Frontend";
const DatatableWrap = styled.div`
    width:100%;position:relative;display:flex;flex-direction:column;row-gap:20px;
    & .bi-datatable-header{
        display:flex;align-items:center;column-gap:15px;row-gap:15px;flex-wrap:wrap;
        & .bulk-wrap{
            display:flex;column-gap:10px;
            & select{width:170px;}
            & button{display:flex;align-items:center;justify-content:center;background:${colors.green};border-radius:5px;color:${colors.white};height:43px;border:none;padding:0 20px;cursor:pointer;}
        }
        & .bi-datatable-search{
            display:flex;position:relative;
            & .search-icon{fill:${colors.black};position:absolute;top:9px;left:9px;}
            & input{height:40px;padding:7px 40px 7px 35px;font-size:16px;margin:0;font-weight:400;line-height:1.5;color:${colors.black};background-color:${colors.white};background-clip:padding-box;border:1px solid ${colors.border};-webkit-appearance:none;-moz-appearance:none;appearance:none;border-radius:2px;transition:border-color 0.15s ease-in-out,box-shadow 0.15s ease-in-out;}
            & .btn{
                position:absolute;right:0;padding:0;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border:none;background:transparent;cursor:pointer;
                & svg{fill:${colors.black};}
            }
        }
    }
    & .bi-datatable-wrap{
        overflow:auto;
        &::-webkit-scrollbar{width:5px;height:8px;}
        &::-webkit-scrollbar-track{box-shadow:inset 0 0 1px grey;border-radius:5px;}
        &::-webkit-scrollbar-thumb{background:#bababa;border-radius:5px;}
        &::-webkit-scrollbar-thumb:hover{background:grey;}
        & .bi-datatable{
            width:100%;border-collapse:collapse;border:1px solid ${colors.border};
            & thead{
                display:table-header-group;vertical-align:middle;background:${colors.tableBg};
                & th{
                    padding:10px 15px;vertical-align:middle;font-size:14px;font-weight:600;white-space:nowrap;text-align:left;color:${colors.black};box-sizing:border-box;border-bottom:1px solid ${colors.border};background:${colors.tableBg};
                    &.w150{width:150px;}
                    &.w145{width:145px;}
                    &.w140{width:140px;}
                    &.w135{width:135px;}
                    &.w130{width:130px;}
                    &.w125{width:125px;}
                    &.w120{width:120px;}
                    &.w115{width:115px;}
                    &.w110{width:110px;}
                    &.w105{width:105px;}
                    &.w100{width:100px;}
                    &.w95{width:95px;}
                    &.w90{width:90px;}
                    &.w85{width:85px;}
                    &.w80{width:80px;}
                    &.w75{width:75px;}
                    &.w70{width:70px;}
                    &.text-center{text-align:center;}
                    &.sorting{cursor:pointer;}
                    & .sort-wrap{
                        display:inline-block;margin-right:6px;
                        & .sort-asc{
                            width:0px;height:0px;margin-bottom:1px;border-bottom:5px solid #c1c1c1;border-left:5px solid transparent;border-right:5px solid transparent;
                            &.active{border-bottom:5px solid ${colors.black};}
                        }
                        & .sort-desc{
                            width:0px;height:0px;margin-top:1px;border-top:5px solid #c1c1c1;border-left:5px solid transparent;border-right:5px solid transparent;
                            &.active{border-top:5px solid ${colors.black};}
                        }
                    }
                }
            }
            & tbody{
                & tr{
                    background:${colors.white};
                    &.expired{background:${colors.expiredBg};}
                }
                & td{
                    padding:10px 15px;vertical-align:middle;font-size:14px;font-weight:400;border-top:1px solid ${colors.border};white-space:nowrap;color:${colors.black};box-sizing:border-box;
                    &.w150{width:150px;}
                    &.w145{width:145px;}
                    &.w140{width:140px;}
                    &.w135{width:135px;}
                    &.w130{width:130px;}
                    &.w125{width:125px;}
                    &.w120{width:120px;}
                    &.w115{width:115px;}
                    &.w110{width:110px;}
                    &.w105{width:105px;}
                    &.w100{width:100px;}
                    &.w95{width:95px;}
                    &.w90{width:90px;}
                    &.w85{width:85px;}
                    &.w80{width:80px;}
                    &.w75{width:75px;}
                    &.w70{width:70px;}
                    &.text-center{text-align:center;}
                    &.text-capitalize{text-transform:capitalize;}
                    &.bottom-align{vertical-align:bottom;}
                    & .bi-datatable-loading{
                        display:flex;align-items:center;column-gap:15px;
                        & svg{stroke:${colors.black};}
                    }
                    & .bi-bulk-checkboxs{width:18px;height:18px;margin:0;}
                    & .link{
                        text-decoration:none;color:${colors.black};
                        &:hover{color:${colors.red};}
                    }
                    & .td-content{
                        white-space:inherit;overflow:hidden;text-overflow:ellipsis;cursor:pointer;max-width:180px;
                        &.show{white-space:normal;overflow:hidden;text-overflow:ellipsis;word-break:break-word;height:auto;}
                        &.text-capitalize{text-transform:capitalize;}
                    }
                    & .no-gap{column-gap:0px;}
                }
            }
        }
    }
    & .bi-datatable-footer{
        display:flex;align-items:center;column-gap:20px;row-gap:20px;flex-wrap:wrap;justify-content:space-between;
        & .bi-datatable-showing-text{
            font-size:14px;color:${colors.black};
            & .bi-datatable-length{width:75px;height:40px;padding:7px 15px;font-size:14px;font-weight:400;line-height:1.5;color:${colors.black};background-color:${colors.white};background-clip:padding-box;border:1px solid ${colors.border};margin-left:5px;-webkit-appearance:none;-moz-appearance:none;appearance:none;border-radius:2px;transition:border-color 0.15s ease-in-out,box-shadow 0.15s ease-in-out;cursor:pointer;background-repeat:no-repeat;background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:right 15px top 1em,right 10px top 1em;background-size:6px 5px,5px 6px;}
        }
        & .bi-datatable-pagination{
            display:flex;margin:0;padding:0;list-style:none;column-gap:10px;
            & .page-item{
                box-sizing:border-box;
                & button{
                    padding:0 10px;color:${colors.black};background:${colors.white};border:1px solid ${colors.border};display:flex;height:35px;min-width:35px;align-items:center;justify-content:center;font-size:14px;cursor:pointer;border-radius:2px;column-gap:5px;
                    & svg{stroke:${colors.black};}
                    &:disabled{
                        pointer-events:none;background:${colors.black};opacity:0.2;color:${colors.white};
                        & svg{stroke:${colors.white};}
                    }
                    &.active,
                    &:hover{
                        z-index:3;color:${colors.white};background:${colors.green};border-color:${colors.green};
                        & svg{stroke:${colors.white};}
                    }
                }
            }
        }
    }
    @media(max-width:991px){
        & .bi-datatable-footer{
            & .bi-datatable-pagination{
                & .page-item{
                    & button{
                        & span{display:none;}
                    }
                }
            }
        }
    }
    @media(max-width:767px){
        & .bi-datatable-footer{
            & .bi-datatable-pagination{
                column-gap:5px;
                & .page-item{
                    & button{padding:0 8px;height:30px;min-width:30px;}
                }
            }
        }
    }
    @media(max-width:399px){
        & .bi-datatable-header{
            & .bi-datatable-search{
                width:100%;
            }
        }
    }
`;
const BiDataTable = ({tableData,columns,isLoading,filters,perPage,showSearch = true,bulkIds = [],searchText,resetSearch,sortBy,updateBulkIds,paginationHandler,perPageHandler}) => {
    const paginationRanges = usePagination({currentPage: tableData.current,totalCount: tableData.totalData,siblingCount: 0,pageSize: filters.limit});
    return (
        <DatatableWrap>
            {showSearch ? (
                <div className="bi-datatable-header">
                    <div className="bi-datatable-search">
                        {searchIcon({width:22,height:20,className:"search-icon"})}
                        <input type="text" placeholder="Search" onChange={searchText} value={filters.query} autoComplete="off"/>
                        {filters.query && filters.query.length > 0 && (
                            <button type="button" className="btn btn-clear" onClick={resetSearch}>{crossIcon({width:20,height:20})}</button>
                        )}
                    </div>
                </div>
            ) : ("")}
            <div className="bi-datatable-wrap">
                <table className="bi-datatable">
                    <thead className="bi-datatable-head">
                        <tr className="bi-datatable-tr">
                            {columns && columns.length > 0 && columns.map((column,index) => (
                                <th className={`bi-datatable-th ${(column.orderable ? 'sorting' : '')} ${column.classes ? column.classes.join(' ') : ''}`} key={index} onClick={() => sortBy(column)}>
                                    {column.orderable && (
                                        <div className="sort-wrap">
                                            <div className={`sort-asc ${(column.name == filters.sort_column && filters.sort_by.toLowerCase() == 'asc') ? 'active' : ''}`}></div>
                                            <div className={`sort-desc ${(column.name == filters.sort_column && filters.sort_by.toLowerCase() == 'desc') ? 'active' : ''}`}></div>
                                        </div>
                                    )}
                                    <span>{column.label}</span>
                                    {(column.name == "checkbox" && column.countable && bulkIds.length > 0) && (
                                        <span>#{bulkIds.length}</span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bi-datatable-body">
                        {isLoading && (
                            <tr className="bi-datatable-tr">
                                <td className="bi-datatable-td" colSpan={columns.length}>
                                    <div className="bi-datatable-loading" colSpan={columns.length}>
                                        {loaderIcon({width:30,height:30,stroke:colors.black})}
                                        <span>Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {!isLoading && (!tableData || !tableData.data || !tableData.data.length) && (
                            <tr className="bi-datatable-tr">
                                <td className="bi-datatable-td" colSpan={columns.length}>No record found.</td>
                            </tr>
                        )}
                        {!isLoading && tableData && tableData.data && tableData.data.length > 0 && tableData.data.map((row,key) => (
                            <tr className="bi-datatable-tr" key={key}>
                                {columns && columns.length > 0 && columns.map((column,index) => (
                                    <td className={`bi-datatable-td ${column.classes ? column.classes.join(' ') : ''}`} key={index}>
                                        {column.name == 'checkbox' ? (
                                            <input type="checkbox" className="bi-bulk-checkboxs" value={row.id} checked={bulkIds.includes(row.id)} onChange={updateBulkIds}/>
                                        ) : column.component ? (
                                            <>{column.component(row,key)}</>
                                        ) : (
                                            <>{row[column.name]}</>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {!isLoading && tableData && tableData.data && tableData.data.length > 0 && (
                <div className="bi-datatable-footer">
                    <ul className="bi-datatable-pagination">
                        <li className="page-item">
                            <button className="button" type="button" onClick={() => paginationHandler(tableData.current - 1)} disabled={(tableData.current == 1)}>
                                {previousIcon({width:20,height:20})}
                                <span>Previous</span>
                            </button>
                        </li>
                        {paginationRanges.map((page,index) => (
                            <li key={index} className="page-item">
                                {page === "" ? (
                                    <button type="button">...</button>
                                ) : (
                                    <button className={`${(page == tableData.current) ? "active" : ''}`} type="button" onClick={() => paginationHandler(page)}>{page}</button>
                                )}
                            </li>
                        ))}
                        <li className="page-item">
                            <button type="button" onClick={() => paginationHandler(tableData.current + 1)} disabled={(tableData.totalPages == tableData.current)}>
                                <span>Next</span>
                                {nextIcon({width:20,height:20})}
                            </button>
                        </li>
                    </ul>
                    <div className="bi-datatable-showing-text">
                        <span>Record per page </span>
                        <select className="bi-datatable-length" name="length" onChange={perPageHandler} value={filters.limit}>
                            {perPage.length > 0 && perPage.map((page,index) => (
                                <option key={index} value={page}>{page}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </DatatableWrap>
    );
}
export default BiDataTable;