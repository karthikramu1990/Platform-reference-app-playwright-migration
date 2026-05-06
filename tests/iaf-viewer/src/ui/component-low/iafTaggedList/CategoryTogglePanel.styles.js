import React from 'react';
import {
    Typography,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledTitle = styled(Typography)(({ theme }) => ({
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 800,
    color: '#dcdcdc',
    fontSize: '11px',
    marginBottom: '12px',
    textAlign: 'left'
}));

export const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    '&&':{
        width: '100%',
        margin: '0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& .MuiFormControlLabel-label': {
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: 500,
            color: '#dcdcdc',
            fontSize: '11px',
            flex: 1,
            textAlign: 'left'
        }
    }
}));

export const StyledSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
        color: '#666',
        '&.Mui-checked': {
            color: '#dcdcdc',
            '& + .MuiSwitch-track': {
                backgroundColor: '#888',
                opacity: 0.7
            }
        }
    },
    '& .MuiSwitch-track': {
        backgroundColor: '#555',
        opacity: 0.7
    },
    '& .MuiSwitch-thumb': {
        width: 16,
        height: 16
    }
}));