import React, { useState, useCallback } from 'react';
import { Box, Divider } from '@mui/material';
import IafTaggedList from '../IafTaggedList.jsx';
import CategoryTogglePanel from '../CategoryTogglePanel.jsx';
import { newMockItems, newMockCategories } from './IafNewMockData.js';
import IafUtils from "../../../../core/IafUtils.js";

const IafTaggedListDemo = () => {
    const [categories, setCategories] = useState(newMockCategories);
    const handleItemUpdate = useCallback((item, id) => {
        IafUtils.devToolsIaf && console.log(`Item updated: ${id}`, item);
    }, []);
    const handleCategoriesUpdated = useCallback((updatedCategories) => {
        setCategories(updatedCategories);
    }, []);
    const handleCategoryToggle = useCallback((categoryId) => {
        setCategories(prevCategories =>
            prevCategories.map(category =>
                category.id === categoryId
                    ? { ...category, isSelected: !category.isSelected }
                    : category
            )
        );
    }, []);

    return (
        <Box sx={{ width:"100%" }}>
            <CategoryTogglePanel
                categories={categories}
                onCategoryToggle={handleCategoryToggle}
                title="Disciplines"
            />
            <Divider sx={{
                backgroundColor: '#333',
                border: '1px solid #333',
                marginTop: '8px'
            }} />
            <IafTaggedList
                initialItems={newMockItems}
                initialCategories={categories}
                hideTagsForIds={[]}
                onItemUpdate={handleItemUpdate}
                onCategoriesUpdated={handleCategoriesUpdated}
                disabledItems={[]}
                searchLabel="Search logical layers"
                enableSearch={true}
            />
        </Box>
    );
};

export default IafTaggedListDemo; 