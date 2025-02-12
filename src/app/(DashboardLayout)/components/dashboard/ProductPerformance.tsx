import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Link
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)//components/shared/DashboardCard';

interface Product {
    id: number;
    placeId: string;
    name: string;
    address: string;
    rating: number | null;
    userRatingsTotal: number | null;
    phone: string;
    website: string | null;
    predictedScore: number | null;
    adjustedScore: number | null;
    openingHours: string;
}

const ProductPerformance = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://47.130.87.217:9090/api/restaurants/getTop5');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data: Product[] = await response.json();
                setProducts(data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <DashboardCard title="Restaurant Collection Rank">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="h6">Loading...</Typography>
                </Box>
            </DashboardCard>
        );
    }

    if (error) {
        return (
            <DashboardCard title="Restaurant Collection Rank">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="h6" color="error">{error}</Typography>
                </Box>
            </DashboardCard>
        );
    }

    return (
        <DashboardCard title="Restaurant Collection Rank">
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' }, height: '377px', '&::-webkit-scrollbar': { display: 'none' } }}>
                <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap', mt: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>Id</Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography variant="subtitle2" fontWeight={600}>Name</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>Rating</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>RatingCount</Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography variant="subtitle2" fontWeight={600}>Phone</Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ width: '200px', whiteSpace: 'normal', wordBreak: 'break-all' }}>
                                <Typography variant="subtitle2" fontWeight={600} align="center">Website</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ maxHeight: '250px', overflowY: 'auto' }}>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell align="center">
                                    <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>{product.id}</Typography>
                                </TableCell>
                                <TableCell align="center" sx={{
                                    maxWidth: '150px',  // 限制最大宽度
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    display: 'block'
                                }}>
                                    <Box sx={{
                                        overflowX: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        maxWidth: '100%',
                                        whiteSpace: 'nowrap',
                                        '&::-webkit-scrollbar': { display: 'none' }, // 隐藏滚动条
                                        '-ms-overflow-style': 'none',  // 兼容 IE/Edge
                                        'scrollbar-width': 'none'  // 兼容 Firefox
                                    }}>
                                        <Typography variant="subtitle2" fontWeight={600}>{product.name}</Typography>
                                        {/* 将地址变成点击链接，跳转到 Google Maps */}
                                        <Link
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(product.address)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            color="textSecondary"
                                            sx={{ fontSize: '13px' }}
                                        >
                                            {product.address}
                                        </Link>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                        {product.rating ?? 'N/A'}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                        {product.userRatingsTotal ?? 'N/A'}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                        {product.phone}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center" sx={{ width: '200px', whiteSpace: 'normal', wordBreak: 'break-all' }}>
                                    {product.website ? (
                                        <Link href={product.website} target="_blank" rel="noopener noreferrer">
                                            Link
                                        </Link>
                                    ) : (
                                        <Typography color="textSecondary" variant="subtitle2" fontWeight={400} align="center">
                                            N/A
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </DashboardCard>
    );
};

export default ProductPerformance;
