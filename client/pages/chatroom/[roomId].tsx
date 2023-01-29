import ChatGroup from '../../components/organisms/chatGroup/ChatGroup';
import { ReactElement, useEffect, useRef, useState } from 'react';
import ChatForm from '../../components/organisms/chatForm/ChatForm';;
import useWebSocketClient from '../../hooks/useWebSocketClient';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Alert, AlertColor, Box, Snackbar } from '@mui/material';
import Link from 'next/link';
import ChatRoomLayout from '../../components/container/chatRoomLayout/ChatRoomLayout';
import ChatHeader from '../../components/organisms/headers/chatHedaer/ChatHeader';
import { useRouter } from 'next/router';
import ForbiddenMessage from '../../components/atoms/fobiddenMessage/ForbiddenMessage';
import { handleCompleteRecrutment } from '../../api/mySharing';
import { reportChat } from '../../api/detail';
import { getIsWriter } from '../../api/isWriter';
import ChatItemFC from '../../components/organisms/chatItemForChatroom/ChatItemFC';

// 채팅방 개설시 자동으로 채팅방 개설 및 닉네임 설정
// 게시물 상세에서 n게더 참여하기 시 게시물 id와 채팅방 id가 똑같습니다.
// 따라서 게시물 작성 시 리턴되는 게시물 아이디를 이용해 바로 채팅방 생성 api로 호출해주시면 될 것 같습니다.
// 그 후 /chatroom으로 이동하게 된다면 해당 id를 통해 웹소켓 연결을 시도합니다.

const Chatroom = () => { 
  let HEADER_TOKEN = {Authorization : Cookies.get('access_token')};
  const [isOwner, setIsOwner] = useState(false);
  const [input, setInput] = useState('')
  const {stompClient, messages, members, roomId, sharingData} = useWebSocketClient(HEADER_TOKEN);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [alertOption, setAlertOption] = useState<{
    severity: AlertColor;
    value: string;
  }>({ severity: 'error', value: '' });
  const [open, setOpen] = useState(false);

  const isMemeber = members.includes(Cookies.get('nickName'))
  
  useEffect(() => {
    if(roomId && typeof roomId === 'string') {
      getIsWriter(roomId)
      .then(res => setIsOwner(res.data))
    }
  }, [roomId]);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages])

  const onChangeInput =  (e: React.ChangeEvent<HTMLTextAreaElement>) => { 
    setInput(e.target.value);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(stompClient){
      stompClient.send(
        `/send/chat/${roomId}`, 
        HEADER_TOKEN,
        JSON.stringify({type:'TALK', message:input})
      );
      setInput('');
      console.log(sharingData)
    }
  }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  const checkDeclareStatus = async () => {
      const response = await axios.get(`https://ngether.site/chat/room/search/${roomId}`);
      const declareStatus = response.data.declareStatus;
      return declareStatus
  }

  const handleExitChatRoom = (): void => {
    if (!stompClient) return;

    if (stompClient && !checkDeclareStatus) {
      setOpen(true)
      setAlertOption({ severity: 'success', value: 'N게더 모집에서 퇴장하셨습니다' });
      stompClient.disconnect(() => {})
      axios.get(`https://ngether.site/chat/room/leave/${roomId}`, {headers : HEADER_TOKEN} )
      router.push('/chatlist')
    }
    else {
      setOpen(true)
      setAlertOption({ severity: 'error', value: '해당 N게더는 현재 신고된 상태로 퇴장하실 수 없습니다.' });
    }
    return
  }

  return (
    <div className='flex flex-col w-[100%]'>
      <ChatHeader
        isOwner={isOwner}
        members={members}
        declareStatus={sharingData.boardStatus}
        handleExitChat={handleExitChatRoom} 
        handleSendReport={() => reportChat(roomId)} 
        handleCompleteRecrutment={() => handleCompleteRecrutment(roomId)}
      />
      {!isMemeber && <ForbiddenMessage />}
      {isMemeber && (
        <>
          <div className='left-2/4 mt-16 translate-x-[-50%] w-auto fixed px-[1rem] rounded'>
            <Link href={`/nearby/${roomId}`}>
              <ChatItemFC 
                thumbnail = {sharingData.imageLink}
                title = {sharingData.title}
                address = {sharingData.address}
              />
            </Link>
          </div>
          <div className="bg-primary pt-[90px] h-[calc(100vh-138px)] box-border overflow-scroll overflow-x-hidden scroll-smooth max-w-[672px] w-full">
            <ChatGroup chatData={messages} />
            <div className="h-[32px]" ref={messagesEndRef} />
          </div>
          <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            className="bottom-[25%]"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity={alertOption?.severity}>{alertOption?.value}</Alert>
          </Snackbar>
          <div className="fixed bottom-0 left-2/4 translate-x-[-50%] max-w-2xl w-full bg-white">
            <ChatForm onSubmit={handleSubmit} onChange={onChangeInput} value={input}/>
          </div>
        </>
      )}
    </div>
  );
};

Chatroom.getLayout = function (page: ReactElement) {
  return <ChatRoomLayout>{page}</ChatRoomLayout>;
};

export default Chatroom;