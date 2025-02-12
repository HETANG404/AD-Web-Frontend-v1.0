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
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material';

// Define feedback data type
type Feedback = {
    time: string;
    context: string;
    username: string;
    feedbackId: string;
    userid: string;
};

const RecentTransactions = () => {
    const [transactions, setTransactions] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const formatTransactionTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();

        if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()) {
            return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        } else {
            return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
        }
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://47.130.87.217:9090/api/feedback/getAllFeedbacks');
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const handleDeleteClick = (feedbackId: string) => {
        setDeleteId(feedbackId);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;

        try {
            const response = await fetch(`http://47.130.87.217:9090/api/feedback/${deleteId}`, {
                method: 'DELETE',
            });

            if (response.status === 204) {
                setTransactions((prev) => prev.filter((item) => item.feedbackId !== deleteId));
                setSnackbar({ open: true, message: 'Successfully deleted', severity: 'success' });
            } else {
                setSnackbar({ open: true, message: 'Failed to delete, feedback not found', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Deletion failed, please try again later', severity: 'error' });
        } finally {
            setOpenConfirmDialog(false);
            setDeleteId(null);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    // @ts-ignore
    return (
        <DashboardCard title="Recent Feedback">
            <Timeline
                className="theme-timeline"
                sx={{
                    p: 0,
                    mb: '-40px',
                    maxHeight: '415px',
                    overflowY: 'auto',
                    height: '415px',
                    '& .MuiTimelineConnector-root': {
                        width: '1px',
                        backgroundColor: '#efefef',
                    },
                    [`& .${timelineOppositeContentClasses.root}`]: {
                        flex: 0.5,
                        paddingLeft: 0,
                    },
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none',
                }}
            >
                {transactions.map((transaction, index) => (
                    <TimelineItem key={index}>
                        <TimelineOppositeContent>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                {formatTransactionTime(transaction.time)}
                            </Typography>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleDeleteClick(transaction.feedbackId)}
                            >
                                Delete
                            </Button>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color="primary" variant="outlined" />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="body2">
                                <strong>{transaction.username}</strong>: {transaction.context}
                            </Typography>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>

            <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this feedback? This action cannot be undone.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </DashboardCard>
    );
};

export default RecentTransactions;