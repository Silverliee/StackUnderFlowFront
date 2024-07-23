import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const UserDescription = ({ description }) => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" p={2}>
            <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', textAlign: 'center' }}>
                <Typography variant="h6" component="blockquote" gutterBottom>
                    {description}
                </Typography>
            </Paper>
        </Box>
    );
};

export default UserDescription;
