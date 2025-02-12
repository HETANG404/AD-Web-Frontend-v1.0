import React, { useEffect, useState } from 'react';
import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)//components/shared/DashboardCard';

// Define the product data interface based on the new API response
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
    const [products, setProducts] = useState<Product[]>([]);  // Use interface to specify type
    const [loading, setLoading] = useState<boolean>(true);  // Loading state
    const [error, setError] = useState<string | null>(null);  // Error state

    useEffect(() => {
        // Simulate an API call
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/restaurants/getTop5');  // Replace with the actual API URL
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data: Product[] = await response.json();
                setProducts(data);
            } catch (error: unknown) {  // Explicitly type the error as `unknown`
                if (error instanceof Error) {
                    setError(error.message);  // Now TypeScript knows that `error` is an instance of `Error`
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
        // If loading, display loading state
        return (
            <DashboardCard title="Restaurant Collection Rank">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="h6">Loading...</Typography>
                </Box>
            </DashboardCard>
        );
    }

    if (error) {
        // If an error occurred, display error message
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
                <Table
                    aria-label="simple table"
                    sx={{ whiteSpace: 'nowrap', mt: 2 }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Id
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Name
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Rating
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    RatingCount
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Phone
                                </Typography>
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ width: '200px', whiteSpace: 'normal', wordBreak: 'break-all' }}
                            >
                                <Typography variant="subtitle2" fontWeight={600} align="center">
                                    Website
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ maxHeight: '250px', overflowY: 'auto' }}>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell align="center">
                                    <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>
                                        {product.id}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {product.name}
                                            </Typography>
                                            <Typography color="textSecondary" sx={{ fontSize: '13px' }}>
                                                {product.address}
                                            </Typography>
                                        </Box>
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
                                <TableCell
                                    align="center"
                                    sx={{ width: '200px', whiteSpace: 'normal', wordBreak: 'break-all' }}
                                >
                                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400} align="center">
                                        {product.website ?? 'N/A'}
                                    </Typography>
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
