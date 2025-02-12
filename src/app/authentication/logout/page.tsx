'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        // 删除 sessionStorage 中的 session 信息
        sessionStorage.removeItem('adminSession');
        // 跳转到登录页面
        router.push('/authentication/login');
    }, [router]);

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Typography variant="h6">Logging out...</Typography>
        </Box>
    );
};

export default Logout;