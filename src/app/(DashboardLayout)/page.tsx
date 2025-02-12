'use client'
import { Grid, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/SalesOverview';
import YearlyBreakup from '@/app/(DashboardLayout)/components/dashboard/YearlyBreakup';
import RecentTransactions from '@/app/(DashboardLayout)/components/dashboard/RecentTransactions';
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';
import Blog from '@/app/(DashboardLayout)/components/dashboard/Blog';
import MonthlyEarnings from '@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings';
import TodayTraffic from '@/app/(DashboardLayout)/components/dashboard/TodayTraffic';
import {useEffect} from "react";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    // 检查 sessionStorage 中是否存在 "adminSession"
    const session = sessionStorage.getItem("adminSession");
    if (!session) {
      // 如果没有登录记录，则跳转到登录页面
      router.push("/authentication/login");
    }
  }, [router]);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            {/*1*/}
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              {/*<Grid item xs={12}>*/}
              {/*  /!*2*!/*/}
              {/*  /!*<YearlyBreakup />*!/*/}
              {/*</Grid>*/}
              <Grid item xs={12}>
                {/*3*/}
                <TodayTraffic />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            {/*4*/}
            <RecentTransactions />
          </Grid>
          <Grid item xs={12} lg={8}>
            {/*5*/}
            <ProductPerformance />
          </Grid>
          <Grid item xs={12}>
            {/*6*/}
            {/*<Blog />*/}
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}

export default Dashboard;
