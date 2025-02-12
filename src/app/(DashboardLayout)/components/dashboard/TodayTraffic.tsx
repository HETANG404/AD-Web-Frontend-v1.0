import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Stack, Typography, Avatar, Fab } from '@mui/material';
import { IconArrowUpRight, IconArrowDownRight, IconTrafficLights } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { useTheme } from "@mui/material/styles";

// 你需要根据后端实际接口调整 URL
const TodayTraffic = () => {
    // 状态
    const [todayLogin, setTodayLogin] = useState<number | null>(null);
    const [yesterdayLogin, setYesterdayLogin] = useState<number | null>(null);
    const [growthPercentage, setGrowthPercentage] = useState<number | null>(null);
    const [trafficData7Days, setTrafficData7Days] = useState<number[]>([]);

    const theme = useTheme();

    // 获取数据的函数
    const fetchTrafficData = async () => {
        try {
            // 假设你后端接口返回的数据格式是这样的
            const response = await fetch('http://localhost:5000/api/loginStats');
            const data = await response.json();

            // 更新状态
            setTodayLogin(data.todayLogin);
            setYesterdayLogin(data.yesterdayLogin);
            setGrowthPercentage(
                parseFloat(
                    (((data.todayLogin - data.yesterdayLogin) / data.yesterdayLogin) * 100).toFixed(1)
                )
            );
            setTrafficData7Days(data.past7DaysLogin);
        } catch (error) {
            console.error("Error fetching traffic data:", error);
        }
    };

    // 在组件挂载时获取数据
    useEffect(() => {
        fetchTrafficData();
    }, []); // 只在组件加载时触发一次请求

    // 如果数据还在加载中，展示加载状态
    if (
        todayLogin === null ||
        yesterdayLogin === null ||
        growthPercentage === null ||
        trafficData7Days.length === 0
    ) {
        return <div>Loading...</div>;
    }

    // chart color

    const secondary = theme.palette.secondary.main;
    const secondarylight = '#f5fcff';
    const successlight = '#e1f5e0';
    // 如果增长为负，则使用错误色背景
    const errorlight = '#ffebee';

    // chart 配置
    const optionscolumnchart: any = {
        chart: {
            type: 'area',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: false,
            },
            height: 60,
            sparkline: {
                enabled: true,
            },
            group: 'sparklines',
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        fill: {
            colors: [secondarylight],
            type: 'solid',
            opacity: 0.05,
        },
        markers: {
            size: 0,
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
        },
    };

    const seriescolumnchart: any = [
        {
            name: '',
            color: secondary,
            data: trafficData7Days, // 使用从后端返回的近7日流量数据
        },
    ];

    return (
        <DashboardCard
            title="Daily Pageviews"
            action={
                <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }}>
                    <IconTrafficLights width={24} />
                </Fab>
            }
            footer={
                <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height={317} width={"100%"} />
            }
        >
            <>
                <Typography variant="h3" fontWeight="700" mt="-20px">
                    {todayLogin} {/* 显示今日登录量 */}
                </Typography>
                <Stack direction="row" spacing={1} my={1} alignItems="center">
                    <Avatar
                        sx={{
                            bgcolor: growthPercentage >= 0 ? successlight : errorlight,
                            width: 27,
                            height: 27
                        }}
                    >
                        {growthPercentage >= 0 ? (
                            <IconArrowUpRight width={20} color="#4CAF50" />
                        ) : (
                            <IconArrowDownRight width={20} color="#F44336" />
                        )}
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight="600">
                        {growthPercentage}% {/* 显示增长或下降的百分比 */}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                        compared to yesterday
                    </Typography>
                </Stack>
            </>
        </DashboardCard>
    );
};

export default TodayTraffic;
