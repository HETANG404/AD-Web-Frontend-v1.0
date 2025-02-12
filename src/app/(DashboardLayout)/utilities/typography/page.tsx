'use client';

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  CardContent,
  Button,
  Stack,
  TextField
} from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';

// 定义用户类型
interface User {
  id: number;
  name: string;
  email: string;
}

const TypographyPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 模拟获取所有用户数据的接口
  useEffect(() => {
    const fetchUsers = async () => {
      // 模拟接口返回数据
      const data: User[] = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com' },
      ];
      // 模拟延迟
      setTimeout(() => {
        setUsers(data);
      }, 500);
    };

    fetchUsers();
  }, []);

  // 删除用户操作
  const handleDelete = (userId: number) => {
    // 此处可以调用 API 删除用户，当前直接从 state 中移除
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    console.log(`User ${userId} deleted`);
  };

  // 修改密码操作
  const handleChangePassword = (userId: number) => {
    // 此处可以打开对话框或跳转页面进行密码修改，当前仅模拟提示
    console.log(`Change password for user ${userId}`);
    alert(`Change password for user ${userId}`);
  };

  // 根据搜索条件过滤用户列表
  const filteredUsers = searchQuery.trim()
      ? users.filter((user) => user.id === Number(searchQuery))
      : users;

  return (
      <PageContainer title="Users" description="Manage all users">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* 添加搜索框 */}
            <TextField
                label="Search by User ID"
                variant="outlined"
                type="number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <DashboardCard title="Users">
              <Grid container spacing={3}>
                {filteredUsers.length === 0 ? (
                    <Grid item xs={12}>
                      <Typography variant="body1">No users found.</Typography>
                    </Grid>
                ) : (
                    filteredUsers.map((user) => (
                        <Grid item xs={12} md={6} key={user.id}>
                          <BlankCard>
                            <CardContent>
                              <Typography variant="h6">{user.name}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {user.email}
                              </Typography>
                              <Stack direction="row" spacing={2} mt={2}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleDelete(user.id)}
                                >
                                  Delete
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleChangePassword(user.id)}
                                >
                                  Reset Password
                                </Button>
                              </Stack>
                            </CardContent>
                          </BlankCard>
                        </Grid>
                    ))
                )}
              </Grid>
            </DashboardCard>
          </Grid>
        </Grid>
      </PageContainer>
  );
};

export default TypographyPage;
