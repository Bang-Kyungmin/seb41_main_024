import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Fragment } from 'react';
import {reportChatDetailType} from './reportChatDetailType'
import { transDateFormatForAdmin } from '../../../../hooks/useWebSocketClient';

interface chatLogType {
  chatMessageId : number;
  chatRoomId : number;
  createDate : string;
  message : string;
  nickName : string;
  type : string;
  unreadCount : number;
}

const ReportChatDetail = ({id, token, handleGetChatLog, handleBlockUser}:reportChatDetailType) => {
  const [chatDataSet, setChatDataSet] = useState({chatLog: [], chatMembers: []})
  const [isLookUp, setIsLookUp] = useState(false);

  useEffect(() => {
    setChatDataSet(handleGetChatLog(id, token))
  },[])

  const handleRenderChatLog = () => {
    setIsLookUp(!isLookUp);
  }

  return (
    <Fragment>
      <div className='flex'>
        <Button className='flex-1' onClick={handleRenderChatLog}>조회하기</Button>
      </div>
      <div>
        {isLookUp && chatDataSet.chatMembers.map((nickName:string, index) => 
          <Button key={index} className='flex-1' onClick={() => handleBlockUser(nickName)}>
            {nickName}
          </Button>
        )}
      </div>
      <ul className='flex flex-col mt-2 max-h-[400px] overflow-auto'>
        {isLookUp && chatDataSet.chatLog.map((log:chatLogType) => 
          <li className='text-left text-s mb-2 border-b-2' key={log.chatMessageId}>
            <div><p>{log.nickName} : {log.message}</p></div>
            <p className='text-xs'>전송 시간:{transDateFormatForAdmin(log.createDate)}</p>
          </li>
        )}
      </ul>
    </Fragment>
  )
}

export default ReportChatDetail;