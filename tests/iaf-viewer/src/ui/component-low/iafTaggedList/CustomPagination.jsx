import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import styles from './CustomPagination.module.scss';

const CustomPagination = ({ count, page, onChangePage, rowsPerPage }) => {
    const totalPages = Math.ceil(count / rowsPerPage);
    const startItem = page * rowsPerPage + 1;
    const endItem = Math.min((page + 1) * rowsPerPage, count);

    return (
        <Box className={styles.pagination}>
            <Typography variant="caption" className={styles.paginationInfo}>
                {startItem}-{endItem} of {count}
            </Typography>
            <Box className={styles.paginationControls}>
                <IconButton
                    size="small"
                    onClick={() => onChangePage(null, page - 1)}
                    disabled={page === 0}
                    className={styles.paginationButton}
                >
                    <ChevronLeft fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => onChangePage(null, page + 1)}
                    disabled={page >= totalPages - 1}
                    className={styles.paginationButton}
                >
                    <ChevronRight fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
};

export default CustomPagination; 