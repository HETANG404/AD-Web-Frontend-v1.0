import React, { useEffect, useState } from 'react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import {
    Timeline,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
    TimelineDot,
    TimelineConnector,
    TimelineContent,
    timelineOppositeContentClasses,
} from '@mui/lab';
import { Typography } from '@mui/material';

// 定义接口返回的数据类型
type Transaction = {
    time: string;
    context: string;
    username: string;
};

const RecentTransactions = () => {
    // 用于保存获取的交易数据
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);  // 加载状态

    // 辅助函数：格式化时间
    // 如果是当天的时间，仅显示 HH:mm:ss，否则仅显示 YYYY/MM/DD
    const formatTransactionTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();

        // 判断年份、月份和日期是否相同
        if (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate()
        ) {
            // 返回时间部分
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        } else {
            // 返回日期部分，格式为 YYYY/MM/DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}/${month}/${day}`;
        }
    };

    // 请求后端接口并获取数据
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/feedback/getAllFeedbacks'); // 替换成你的实际 API 地址
                const data = await response.json();
                setTransactions(data);  // 将数据存入 state
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
            } finally {
                setLoading(false);  // 请求完成，更新加载状态
            }
        };

        fetchTransactions();  // 调用请求函数
    }, []);

    if (loading) {
        return <div>Loading...</div>;  // 数据加载时显示 Loading
    }

    return (
        <DashboardCard title="Recent Feedback">
            <Timeline
                className="theme-timeline"
                nonce={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
                sx={{
                    p: 0,
                    mb: '-40px',
                    maxHeight: '415px',  // 限制最大高度
                    overflowY: 'auto',  // 启用垂直滚动
                    height: '415px',
                    '& .MuiTimelineConnector-root': {
                        width: '1px',
                        backgroundColor: '#efefef',
                    },
                    [`& .${timelineOppositeContentClasses.root}`]: {
                        flex: 0.5,
                        paddingLeft: 0,
                    },
                    // 隐藏滚动条
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    // 对非Webkit浏览器的兼容
                    '-ms-overflow-style': 'none', // Internet Explorer 10+
                    'scrollbar-width': 'none', // Firefox
                }}
            >
                {transactions.map((transaction, index) => (
                    <TimelineItem key={index}>
                        <TimelineOppositeContent>
                            {formatTransactionTime(transaction.time)}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color="primary" variant="outlined" />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent
                            sx={{
                                maxHeight: '100px',  // 限制最大高度
                                overflowY: 'auto',   // 启用垂直滚动
                                '&::-webkit-scrollbar': {
                                    display: 'none',  // 隐藏滚动条
                                },
                                '-ms-overflow-style': 'none', // 对 IE 10+ 兼容
                                'scrollbar-width': 'none',  // 对 Firefox 兼容
                            }}
                        >
                            <Typography variant="body2">
                                <strong>{transaction.username}</strong>: {transaction.context}
                            </Typography>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </DashboardCard>
    );
};

export default RecentTransactions;
