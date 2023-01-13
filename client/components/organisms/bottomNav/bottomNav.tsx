import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Paper from '@mui/material/Paper';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

export default function Navigation() {
  const router = useRouter();

  const NAVIGATION_LIST = [
    {
      label: '홈',
      icon: <HomeOutlinedIcon />,
      path: '/main',
    },
    {
      label: '내 주변',
      icon: <LocationOnOutlinedIcon />,
      path: '/nearby',
    },
    {
      label: '채팅',
      icon: <ChatBubbleOutlineOutlinedIcon />,
      path: '/chatlist',
    },
    {
      label: '나의 N게더',
      icon: <PersonOutlineOutlinedIcon />,
      path: '/mypage',
    },
    {
      label: 'N게더 모집',
      icon: <AddOutlinedIcon />,
      path: '/addnew',
    },
  ];

  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={4}
      >
        <BottomNavigation
          showLabels
          value={router.pathname}
          sx={{
            height: 70,
          }}
        >
          {NAVIGATION_LIST.map(({ label, icon, path }: any) => {
            return (
              <BottomNavigationAction
                label={label}
                icon={icon}
                value={path}
                onClick={() => router.push(path)}
                sx={
                  path === '/addnew'
                    ? {
                        bgcolor: (theme) => theme.palette.primary.main,
                        color: (theme) => theme.palette.primary.contrastText,
                        '& .Mui-selected, svg': {
                          color: (theme) => theme.palette.primary.contrastText,
                        },
                      }
                    : null
                }
              />
            );
          })}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
