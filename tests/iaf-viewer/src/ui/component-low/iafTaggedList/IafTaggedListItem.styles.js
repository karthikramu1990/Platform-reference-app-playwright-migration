import {
    ListItem,
    Typography,
    Chip,
    TextField,
    Box
} from '@mui/material';
import { styled } from '@mui/system';

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

export const StyledMoreCategoriesChip = styled(Chip)({
    margin: '2px',
    height: '18px',
    fontSize: '11px',
});

export const StyledTypography = styled(Typography)(({ theme, isprimary, withsubtext }) => ({
    '&&': {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: isprimary ? 500 : 400,
    color: isprimary ? '#e0e0e0' : '#888',
    fontSize: isprimary ? '11px' : '9px',
    marginBottom: isprimary && withsubtext ? '4px' : 0,
    cursor: 'pointer',
    userSelect: 'none',
    '&&:hover': {
        color: isprimary ? '#fff' : '#bbb',
    },
   } 
}));

export const StyledTextField = styled(TextField)(({ isPrimary }) => ({
    '& .MuiInputBase-input': {
        color: isPrimary ? '#e0e0e0' : '#888',
        fontSize: isPrimary ? '11px' : '9px',
        fontWeight: isPrimary ? 500 : 400,
        padding: 0,
    },
    '& .MuiInput-underline:before': {
        borderBottomColor: '#555',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: isPrimary ? '#fff' : '#bbb',
    },
}));

export const StyledListItem = styled(ListItem)(({ theme, isLoaded, isSelected }) => ({
    '&&': {
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
        // gap: '8px',
        position: 'relative',
        transition: 'background-color 0.2s, border-color 0.2s',
        padding: isSelected ? '8px' : 0, // disablePadding
        opacity: isLoaded ? 1 : 0.7,
        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
        border: isSelected ? '1px solid #888' : '1px solid transparent',
        borderRadius: isSelected ? '4px' : '0px',
        marginBottom: '8px',
    }
  }));

export const StyledChipsArea = styled(Box)(({ theme, isOpen }) => ({
    cursor: 'pointer',
    borderRadius: 4,
    padding: '4px 6px',
    marginTop: '8px',
    marginBottom: '8px',
    minHeight: '32px',
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    transition: 'background 0.2s ease',
    '&:hover': {
        background: isOpen ? '#222' : '#232323',
        borderColor: '#555',
    },
}));