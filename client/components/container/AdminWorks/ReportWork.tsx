import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/router';


import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getReport, handleBlockUser, handleDeleteReport } from '../../../api/admin';
import ReportBoardDetail from '../../molecules/reportDetail/reportBoardDetail/ReportBoardDetail';
import ReportChatDetail from '../../molecules/reportDetail/reportChatDetail/ReportChatDetail';
import { getChatDataset } from '../../../api/getChatDataset';
import { Pagination } from '@mui/material';
import { Stack } from '@mui/system';

interface reportType {
  reportType: string;
  reportId: number;
  reportedId: number;
  title: number
}

const ReportWork = () => {
  const router = useRouter();
  const [reports, setResports] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    size: 10,
    totalElements: 0,
    totalPages: 1
  });
  const {data, isSuccess, refetch} = useQuery(['reports'], () => getReport(pageInfo.page), {keepPreviousData : true});


  const reportMutation = useMutation(handleDeleteReport, {
    onSuccess: () => {
      refetch();
    }
  });
  

  useEffect(()=>{
    isSuccess && 
    setResports(data.data);
    isSuccess && 
    setPageInfo(data.pageInfo);
  }, [data])
  
  const handleDelete = async (reportId: number) => {
    await reportMutation.mutate(reportId);
  };


  return (
    <div className='flex flex-col text-center'>
      <p className='my-[16px] text-xs'>게시물은 해당 게시글로 이동하여 처리하실 수 있습니다.</p>
      <div className='h-[calc(100vh-350px)] overflow-x-hidden overflow-scroll'>
        <ul>
            {isSuccess 
            && reports?.map((report:reportType) => {
              return (
                <li key={report.reportId} className='mb-2'>
                  <Accordion >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>{`신고된 ${report.reportType === 'board' && '게시글' || '채팅방'} | ${report.title}`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {report.reportType === 'board' 
                      && <ReportBoardDetail 
                          handleNavigate={()=>router.push(`/nearby/${report.reportedId}`)}
                          handleDeleteReport={()=>handleDelete(report.reportId)}
                      />} 
                      {report.reportType === 'chat' 
                      && <ReportChatDetail
                          id={report.reportedId}
                          handleGetChatLog={getChatDataset}
                          handleBlockUser={handleBlockUser}
                          handleDeleteReport={()=>handleDelete(report.reportId)}
                      />} 
                    </AccordionDetails>
                  </Accordion>
                </li>
              )
            })}
        </ul>
      </div>
      <div className="flex justify-center">
        <Stack spacing={2}>
          <Pagination
            count={pageInfo.totalPages}
            page={pageInfo.page}
            color="primary"
            onChange={(event, value) => {
              setPageInfo((prevState) => {
                return {...prevState, page: value}
              });
              refetch()
            }}
          />
        </Stack>
      </div>
    </div>
  )
}

export default ReportWork;