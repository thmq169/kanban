/* eslint-disable react/prop-types */
// import React from 'react'
import { Box, CircularProgress } from '@mui/material'

const Loading = ({ fullHeight }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: fullHeight ? '100vh' : '100%'
            }}
        >
            <CircularProgress />
        </Box>
    )
}

export default Loading