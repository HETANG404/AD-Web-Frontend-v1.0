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
import axios from "axios";

// 定义用户类型
interface User {
  id: number;
  username: string;
  email: string;
  age: number;
  isNew: boolean;
  isCancelled: boolean;  // Fixed this to match the type
}

const API_BASE_URL = "http://47.130.87.217:9090/api/user";
// const API_BASE_URL = "http://localhost:8080/api/user";

const TypographyPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 获取所有用户数据
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllUsers2`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (!searchQuery.trim()) {
      fetchUsers();
    }
  }, [searchQuery]); // 监听 searchQuery，清空时加载所有用户

  // 获取特定用户数据
  useEffect(() => {
    const fetchUserById = async () => {
      if (!searchQuery.trim()) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/${searchQuery}`);
        setUsers(response.data ? [response.data] : []);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUsers([]); // 避免错误时数据残留
      }
    };

    fetchUserById();
  }, [searchQuery]); // 监听 searchQuery 变化

  // 删除用户操作
  const handleDelete = async (userId: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${userId}`);
      if (response.status === 200) {
        // Update the user's isCancelled field in the state
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, isCancelled: true } : user
            )
        );
      } else {
        console.error('Error deleting user:', response.data);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // 修改密码操作
  // 修改密码操作
  const handleChangePassword = async (userId: number) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password/${userId}`);

      if (response.status === 200) {
        alert(`Password reset successfully. Check the user's email for the new password.`);
      } else {
        alert(`Failed to reset password: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("An error occurred while resetting the password. Please try again.");
    }
  };


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
                {users.length === 0 ? (
                    <Grid item xs={12}>
                      <Typography variant="body1">No users found.</Typography>
                    </Grid>
                ) : (
                    users.map((user) => (
                        <Grid item xs={12} md={4} key={user.id}> {/* Changed from md={6} to md={4} */}
                          <BlankCard>
                            <CardContent>
                              <Typography variant="h6">{user.username}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                Email: {user.email}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Age: {user.age}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Is New: {user.isNew ? 'Yes' : 'No'}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Is Cancelled: {user.isCancelled ? 'Yes' : 'No'}
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
