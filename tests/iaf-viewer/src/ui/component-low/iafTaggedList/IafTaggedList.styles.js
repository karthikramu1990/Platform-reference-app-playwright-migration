import { styled } from '@mui/system';
import { Chip, Box, List, TextField, Paper, Typography, MenuItem, IconButton } from '@mui/material';

export const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%'
}));

export const StyledList = styled(List)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto'
}));

export const StyledPaginationContainer = styled(Box)(({ theme }) => ({
  margin: '0 -16px',
  borderTop: '1px solid #333'
}));

export const StyledCategoryChip = styled(Chip)(({ theme, selected }) => ({
  '&&': {
      margin: '2px',
      height: '18px',
      fontSize: '11px',
      minWidth: '36px',
      backgroundColor: selected ? '#777' : '#555',
      border: selected ? '1px solid #888' : '1px solid transparent',
      color: selected ? '#fff' : '#e0e0e0',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 6px',
      transition: 'all 0.2s ease',
      '&:hover': {
          backgroundColor: selected ? '#888' : '#666',
      },
    }
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  paddingBottom: '8px',
  '& .MuiInputBase-root': {
    backgroundColor: "transparent !important",
  },
  "& label.Mui-focused": {
    color: '#dcdcdc',
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: '#dcdcdc'
  },
  '& .MuiInputBase-input': {
    color: '#dcdcdc',
    fontSize: '11px',
    fontStyle: 'normal',
    fontFamily: 'Inter',
    fontWeight: 500,
    lineHeight: '18px',
    borderBottom: '2px solid #dcdcdc',
  },
  '& .MuiInputLabel-root': {
    color: '#dcdcdc',
    fontSize: '11px',
    fontStyle: 'normal',
    fontFamily: 'Inter',
    fontWeight: 500,
    lineHeight: '18px',
  },
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: 500,
  color: '#dcdcdc',
  '&:hover': {
    color: 'var(--app-accent-color)', // Change the color on hover
  },
}));

export const StyledPopperPaper = styled(Paper)(({ theme }) => ({
  '&&': {
    background: '#262626',
    color: '#e0e0e0',
    border: '1px solid #555',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
    borderRadius: '6px',
    marginTop: '8px',
    fontSize: '11px'
  }
}));

export const StyledPopperSearchBox = styled(Box)(({ theme }) => ({
  padding: '8px',
  borderBottom: '1px solid #444'
}));

export const StyledPopperSearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: '#333',
    color: '#fff',
    fontSize: '11px',
    '& fieldset': {
      borderColor: '#666'
    },
    '&:hover fieldset': {
      borderColor: '#888'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#fff'
    }
  },
  '& .MuiInputBase-input': {
    padding: '8px 12px',
    color: '#fff',
    '&::placeholder': {
      color: '#888',
      opacity: 1
    }
  }
}));

export const StyledPopperCategoriesListContainer = styled(Box)(({ theme }) => ({
  maxHeight: '220px',
  overflowY: 'auto'
}));

export const StyledPopperCategoryItem = styled(Box)(({ theme, assigned }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '18px 12px',
  cursor: 'pointer',
  fontSize: '11px',
  transition: 'background-color 0.2s ease',
  backgroundColor: assigned ? '#555' : 'transparent',
  '&:hover': {
    backgroundColor: '#555',
    '& .popperCategoryItemEditIcon': {
      opacity: 0.7
    }
  }
}));

export const StyledPopperCategoryItemEditInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    padding: 0,
    fontSize: '11px',
    color: '#fff'
  }
}));

export const StyledPopperCategoryItemEditIcon = styled(IconButton)(({ theme }) => ({
  '&&':{
    color: '#888',
    opacity: 0.7,
    transition: 'opacity 0.2s',
    '&:hover': {
      color: '#fff',
      opacity: 1
    }
  }
}));

export const StyledPopperNoCategories = styled(Typography)(({ theme }) => ({
  color: '#888',
  padding: '16px',
  textAlign: 'center',
  fontSize: '11px'
}));

export const StyledPopperCreateCategory = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  cursor: 'pointer',
  fontSize: '11px',
  color: '#999',
  backgroundColor: 'transparent',
  borderTop: '1px solid #444',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#2a2a2a',
    color: '#fff'
  }
}));

export const StyledContextMenuPaper = styled(Paper)(({ theme }) => ({
  background: '#2a2a2a !important',
  color: '#e0e0e0 !important',
  border: '1px solid #444',
  borderRadius: '4px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
}));

export const StyledMenuItem = styled(MenuItem)(({ theme, selected }) => ({
  fontSize: '11px !important',
  padding: '6px 16px',
  fontWeight: selected ? 'bold' : 'normal',
  '&:hover, &.Mui-selected, &.Mui-selected:hover': {
    backgroundColor: '#444 !important',
    color: '#fff !important'
  }
})); 