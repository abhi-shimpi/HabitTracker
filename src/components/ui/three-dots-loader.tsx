import React from 'react';
import { CircularProgress, Box } from '@mui/material';
import { cn } from './utils';

// Three Dots Loader Component using Material UI
interface ThreeDotsLoaderProps {
    size?: 'small' | 'medium' | 'large';
    color?: string;
    className?: string;
}

export function ThreeDotsLoader({
    size = 'medium',
    color = '#ff6b35', // orange color
    className
}: ThreeDotsLoaderProps) {
    const sizeMap = {
        small: 20,
        medium: 30,
        large: 40
    };

    return (
        <Box
            className={cn('flex items-center justify-center', className)}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <CircularProgress
                size={sizeMap[size]}
                sx={{
                    color: color,
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                    }
                }}
            />
        </Box>
    );
}