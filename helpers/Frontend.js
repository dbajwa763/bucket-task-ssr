import {useMemo} from 'react';
import c from "@constants/Common";

const range = (start,end) => {
    let length = end - start + 1;
    return Array.from({length},(_,idx) => idx + start);
}
export const DOTS = '';
export const focusOnFeild = (name) => {
    if(document.getElementsByName(name)){
        let textbox = document.getElementsByName(name)[0];
        if(textbox){
            textbox.focus();
        }
    }
}
export function hasValidationError(errors,field){
    if(errors.hasOwnProperty(field)){
        return errors[field] ? true : false;
    }
    return null;
}
export function validationError(errors,field){
    if(errors.hasOwnProperty(field)){
        if(!Array.isArray(errors[field])){
            return errors[field];
        }else{
            return errors[field].toString();
        }
    }
    return null;
}
export const handleUnauthorized = (e,response) => {
    if(e.response.data.status === c.API_STATUS.TOO_MANY_REQUESTS){
        response.writeHead(c.API_STATUS.FOUND,{location:'/many-request'});
        response.end();
        return;
    }
    return;
}
export const usePagination = ({totalCount,pageSize,siblingCount = 1,currentPage}) => {
    const paginationRange = useMemo(() => {
        const totalPageCount = Math.ceil(totalCount / pageSize);
        const totalPageNumbers = siblingCount + 5;
        if(totalPageNumbers >= totalPageCount){
            return range(1,totalPageCount);
        }
        const leftSiblingIndex = Math.max(currentPage - siblingCount,1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount,totalPageCount);
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;
        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;
        if(!shouldShowLeftDots && shouldShowRightDots){
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = range(1,leftItemCount);
            return [...leftRange,DOTS,totalPageCount];
        }
        if(shouldShowLeftDots && !shouldShowRightDots){
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = range(totalPageCount - rightItemCount + 1,totalPageCount);
            return [firstPageIndex,DOTS,...rightRange];
        }
        if(shouldShowLeftDots && shouldShowRightDots){
            let middleRange = range(leftSiblingIndex,rightSiblingIndex);
            return [firstPageIndex,DOTS,...middleRange,DOTS,lastPageIndex];
        }
    },[totalCount,pageSize,siblingCount,currentPage]);
    return paginationRange;
}