/**
 * ****************************************************************************
 *
 * INVICARA INC CONFIDENTIAL __________________
 *
 * Copyright (C) [2012] - [2023] INVICARA INC, INVICARA Pte Ltd, INVICARA INDIA
 * PVT LTD All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains the property of
 * Invicara Inc and its suppliers, if any. The intellectual and technical
 * concepts contained herein are proprietary to Invicara Inc and its suppliers
 * and may be covered by U.S. and Foreign Patents, patents in process, and are
 * protected by trade secret or copyright law. Dissemination of this information
 * or reproduction of this material is strictly forbidden unless prior written
 * permission is obtained from Invicara Inc.
 */

// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 27-10-23    HSK                    Created custom pagination component
// -------------------------------------------------------------------------------------
import React from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { styled } from '@mui/system';

const PaginationContainer = styled('div')({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'center',
  bottom: '0px',
});

const PaginationIconButton = styled(IconButton)(({ theme }) => ({
  padding: '4px',
  color: '#dcdcdc',
  fontSize: '24px',
  '&:hover': {
    color:  'var(--app-accent-color)',
  },
}));

const PageNumberText = styled('span')(({ theme }) => ({
  color: '#dcdcdc',
  fontSize: '11px',
  fontStyle: 'normal',
  fontFamily: 'Inter',
  fontWeight: 500,
  lineHeight: '15px',
  '&:hover': {
    color:  'var(--app-accent-color)',
  },
}));

const CustomPagination = ({ count, page, onChangePage, rowsPerPage }) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  const handlePrevClick = () => {
    if (page > 0) {
      onChangePage(page - 1);
    }
  };

  const handleNextClick = () => {
    if (page < totalPages - 1) {
      onChangePage(page + 1);
    }
  };

  return (<PaginationContainer>
    <PaginationIconButton
      onClick={handlePrevClick}
      disabled={page === 0}
      sx={{
        opacity: page === 0 ? 0.5 : 1,
        pointerEvents: page === 0 ? 'none' : 'auto',
      }}
    >
      <ArrowLeftIcon style={{ height: '18px', width: '18px' }} />
    </PaginationIconButton>
    <PageNumberText>
      {/* Page {page + 1} */}
    </PageNumberText>
    <PaginationIconButton
      onClick={handleNextClick}
      disabled={page >= totalPages - 1}
      sx={{
        opacity: page >= totalPages - 1 ? 0.5 : 1,
        pointerEvents: page >= totalPages - 1 ? 'none' : 'auto',
      }}
    >
      <ArrowRightIcon style={{ height: '18px', width: '18px' }} />
    </PaginationIconButton>
  </PaginationContainer>
  );
};

export default CustomPagination;