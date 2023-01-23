import React from 'react';
import {reportBoardDetailType} from './reportBoardDetail'
import { Button } from '@mui/material';

const ReportBoardDetail = ({handleNavigate}:reportBoardDetailType) => {
  return (
    <div className='flex'>
      <Button className='flex-1' onClick={handleNavigate}>신고당한 게시물로 이동하기</Button>
      <Button className='w-[100px]'>신고 처리완료</Button>
      <Button className='w-[100px]'>신고 반려</Button>
    </div>
  )
}

export default ReportBoardDetail;