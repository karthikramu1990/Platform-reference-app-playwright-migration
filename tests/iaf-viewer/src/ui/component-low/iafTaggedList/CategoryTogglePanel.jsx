import React from 'react';
import {  Box } from '@mui/material';
import { StyledTitle, StyledFormControlLabel, StyledSwitch } from './CategoryTogglePanel.styles';

const CategoryTogglePanel = ({ 
    categories = [], 
    onCategoryToggle, 
    title = "Categories" 
}) => {
    const handleToggle = (categoryId) => {
        if (onCategoryToggle) {
            onCategoryToggle(categoryId);
        }
    };

    return (
        <Box width={"100%"}>
            <StyledTitle>
                {title}
            </StyledTitle>
            <Box>
                {categories
                    .filter(category => !category.isDeleted)
                    .map((category) => (
                    <StyledFormControlLabel
                        key={category.id}
                        control={
                            <StyledSwitch
                                checked={category.isSelected || false}
                                onChange={() => handleToggle(category.id)}
                                size="small"
                            />
                        }
                        label={category.name}
                        labelPlacement="start"
                    />
                ))}
            </Box>
        </Box>
    );
};

export default CategoryTogglePanel; 