import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Stack, Typography, Avatar, Fab } from '@mui/material';
import { IconArrowUpRight, IconArrowDownRight, IconTrafficLights } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { useTheme } from "@mui/material/styles";

const TodayTraffic = () => {
    const [todayLogin, setTodayLogin] = useState<number | null>(null);
    const [yesterdayLogin, setYesterdayLogin] = useState<number | null>(null);
    const [growthPercentage, setGrowthPercentage] = useState<number | null>(null);
    const [trafficData7Days, setTrafficData7Days] = useState<{ date: string, value: number }[]>([]);

    const fetchTrafficData = async () => {
        try {
            const response = await fetch('http://47.130.87.217:9090/api/loginStats');
            const data = await response.json();

            setTodayLogin(data.todayLogin);
            setYesterdayLogin(data.yesterdayLogin);
            setGrowthPercentage(
                parseFloat(
                    (((data.todayLogin - data.yesterdayLogin) / data.yesterdayLogin) * 100).toFixed(1)
                )
            );

            const today = new Date();
            const past7Days = data.past7DaysLogin.map((value: number, index: number) => {
                const date = new Date();
                date.setDate(today.getDate() - (6 - index));
                return { date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value };
            });
            setTrafficData7Days(past7Days);
        } catch (error) {
            console.error("Error fetching traffic data:", error);
        }
    };

    useEffect(() => {
        fetchTrafficData();
    }, []);

    if (
        todayLogin === null ||
        yesterdayLogin === null ||
        growthPercentage === null ||
        trafficData7Days.length === 0
    ) {
        return <div>Loading...</div>;
    }

    const theme = useTheme();
    const secondary = theme.palette.secondary.main;
    const secondarylight = '#f5fcff';
    const successlight = '#e1f5e0';
    const errorlight = '#ffebee';

    const optionscolumnchart: any = {
        chart: {
            type: 'area',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: { show: false },
            height: 60,
            sparkline: { enabled: true },
            group: 'sparklines',
        },
        xaxis: {
            categories: trafficData7Days.map(data => data.date),
            labels: { style: { colors: '#adb0bb' } }
        },
        stroke: { curve: 'smooth', width: 2 },
        fill: { colors: [secondarylight], type: 'solid', opacity: 0.05 },
        markers: { size: 0 },
        tooltip: { theme: theme.palette.mode === 'dark' ? 'dark' : 'light' },
    };

    const seriescolumnchart: any = [
        {
            name: 'Logins',
            color: secondary,
            data: trafficData7Days.map(data => data.value),
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
                    {todayLogin}
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
                        {growthPercentage}%
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
