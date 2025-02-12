import React from 'react';
import { Select, MenuItem, CircularProgress, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const getLast12Months = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        months.push({ value, label });
    }
    return months;
};

const monthOptions = getLast12Months();

const fetchChartData = async (selectedMonth: string): Promise<{ categories: string[]; series: any[] }> => {
    try {
        const [year, month] = selectedMonth.split('-');
        const response = await fetch(`http://47.130.87.217:9090/api/getLastSevenMonthsData/${year}/${month}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();

        // 反转从后端获取的 categories 和 series
        return {
            categories: data.categories.reverse(),  // 反转 categories
            series: data.series.map((seriesItem: any) => ({
                ...seriesItem,
                data: seriesItem.data.reverse(),  // 反转每个系列的数据
            })),
        };
    } catch (error) {
        console.error("Backend request failed, using simulated data:", error);
        return new Promise((resolve) => {
            setTimeout(() => {
                const categories: string[] = [];
                const loginsData: number[] = [];
                const searchingsData: number[] = [];
                const [yearStr, monthStr] = selectedMonth.split('-');
                const year = parseInt(yearStr, 10);
                const month = parseInt(monthStr, 10) - 1;
                for (let i = 6; i >= 0; i--) {
                    const d = new Date(year, month - i, 1);
                    const cat = `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                    categories.push(cat);
                    loginsData.push(Math.floor(Math.random() * 200 + 300));
                    searchingsData.push(Math.floor(Math.random() * 400 + 400));
                }
                // 反转模拟数据
                resolve({
                    categories: categories.reverse(),
                    series: [
                        { name: 'Logins', data: loginsData.reverse() },
                        { name: 'Searchings', data: searchingsData.reverse() },
                    ],
                });
            }, 1000);
        });
    }
};



const SalesOverview = () => {
    const [month, setMonth] = React.useState<string>(monthOptions[0].value);
    const [chartData, setChartData] = React.useState<{ categories: string[]; series: any[] } | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleChange = (event: any) => {
        setMonth(event.target.value);
    };

    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    const optionscolumnchart: any = {
        chart: { type: 'bar', fontFamily: "'Plus Jakarta Sans', sans-serif;", foreColor: '#adb0bb', toolbar: { show: true }, height: 370 },
        colors: [primary, secondary],
        plotOptions: { bar: { horizontal: false, barHeight: '60%', columnWidth: '42%', borderRadius: [6], borderRadiusApplication: 'end', borderRadiusWhenStacked: 'all' } },
        stroke: { show: true, width: 5, lineCap: "butt", colors: ["transparent"] },
        dataLabels: { enabled: false },
        legend: { show: false },
        grid: { borderColor: 'rgba(0,0,0,0.1)', strokeDashArray: 3, xaxis: { lines: { show: false } } },
        yaxis: { tickAmount: 4 },
        xaxis: { categories: chartData ? chartData.categories : [], axisBorder: { show: false } },
        tooltip: { theme: 'dark', fillSeriesColor: false },
    };

    React.useEffect(() => {
        setLoading(true);
        setChartData(null);
        fetchChartData(month).then((data) => {
            setChartData(data);
            setLoading(false);
        });
    }, [month]);

    return (
        <DashboardCard
            title="Monthly Active User"
            action={
                <Select labelId="month-dd" id="month-dd" value={month} size="small" onChange={handleChange}>
                    {monthOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                </Select>
            }
        >
            {loading || !chartData ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={370}>
                    <CircularProgress />
                </Box>
            ) : (
                <Chart options={optionscolumnchart} series={chartData.series} type="bar" height={370} width={"100%"} />
            )}
        </DashboardCard>
    );
};

export default SalesOverview;
