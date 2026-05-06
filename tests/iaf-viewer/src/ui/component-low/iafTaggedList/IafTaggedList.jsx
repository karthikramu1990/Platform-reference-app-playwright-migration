import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Menu,
    ClickAwayListener,
    Popper,
    Fade,
    Chip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Add as AddIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import IafTaggedListItem from './IafTaggedListItem.jsx';
import CustomPagination from './CustomPagination.jsx';
import {
  StyledContainer,
  StyledList,
  StyledPaginationContainer,
  StyledTextField,
  StyledTypography,
  StyledPopperPaper,
  StyledPopperSearchBox,
  StyledPopperSearchTextField,
  StyledPopperCategoriesListContainer,
  StyledPopperCategoryItem,
  StyledPopperCategoryItemEditInput,
  StyledPopperCategoryItemEditIcon,
  StyledPopperNoCategories,
  StyledPopperCreateCategory,
  StyledContextMenuPaper,
  StyledMenuItem,
  StyledCategoryChip
} from './IafTaggedList.styles.js';
import IafUtils from '../../../core/IafUtils.js';

const IafTaggedList = (props) => {
    const {
         initialItems = [],
        initialCategories = [],
        hideTagsForIds = [],
        showCategoryHeader = false,
        showCategoryIcon = false,
        onItemUpdate,
        onCategoriesUpdated,
        onNotification,
        maxDisplayedCategories = 2,
        maxRows = 8,
        isModelComposerProgress = false,
        onOperationNotification,
        canAccess,
        canDeleteAccess,
        disableContextMenu = false
    } = props;
    
    // Internal state management
    const [items, setItems] = useState(initialItems.map(item => ({
        ...item,
        categories: item.categories || []
    })));
    const [categories, setCategories] = useState(initialCategories);
    const [searchQuery, setSearchQuery] = useState('');
    const [categorySearchQuery, setCategorySearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(maxRows);

    // Menu and Popper states
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
    const [selectedFileId, setSelectedFileId] = useState(null);
    const [moreCategoriesAnchorEl, setMoreCategoriesAnchorEl] = useState(null);
    const [expandedFileId, setExpandedFileId] = useState(null);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');

    useEffect(() => {
        setItems(
            initialItems.map(item => ({
            ...item,
            categories: item.categories || []
            }))
        );
    }, [initialItems]);

    useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    // RRP:- This is not required as we are not using initialItems in the effect
    // Notify parent component of data changes
    // useEffect(() => {
    //     if (onCategoriesUpdated) {
    //         onCategoriesUpdated(categories);
    //     }
    // }, [categories, onCategoriesUpdated]);

    // Close category dropdown on 'Escape'
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') handleCloseCategoryDropdown();
        };
        if (categoryAnchorEl) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [categoryAnchorEl]);
    
    const getCategoryById = (id) => {
        return categories?.find(category => category.id === id);
    }
    
    const parseSearchQuery = (query) => {
        const filters = {
            text: '',
            is: [],
            tag: []
        };
        
        const parts = query.split(' ');
        
        parts.forEach(part => {
            if (part.startsWith('is:')) {
                filters.is.push(part.substring(3));
            } else if (part.startsWith('tag:')) {
                filters.tag.push(part.substring(4));
            } else if (part.trim()) {
                filters.text += part + ' ';
            }
        });
        
        filters.text = filters.text.trim();
        return filters;
    };

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        
        const filters = parseSearchQuery(searchQuery.toLowerCase());
        
        return items.filter(item => {
            let matches = true;
            
            if (filters.is.length > 0) {
                const isMatches = filters.is.every(filter => {
                    switch (filter) {
                        case 'tagged':
                            // Only count non-system categories as "tagged"
                            return (item.categories || []).some(id => {
                                const category = getCategoryById(id);
                                return category && !category.isDeleted && category.group !== 'system';
                            });
                        case 'untagged':
                            // Items with no non-system categories are considered "untagged"
                            return !(item.categories || []).some(id => {
                                const category = getCategoryById(id);
                                return category && !category.isDeleted && category.group !== 'system';
                            });
                        default:
                            return true;
                    }
                });
                matches = matches && isMatches;
            }
            
            if (filters.tag.length > 0) {
                const tagMatches = filters.tag.some(tagFilter => {
                    return (item.categories || []).some(id => {
                        const category = getCategoryById(id);
                        return category && !category.isDeleted && category.group !== 'system' && category.name?.toLowerCase().includes(tagFilter);
                    });
                });
                matches = matches && tagMatches;
            }
            
            if (filters.text) {
                const textMatches = 
                    item.title.toLowerCase().includes(filters.text) ||
                    (item.description?.content?.toLowerCase().includes(filters.text) || false) ||
                    (item.categories || []).some(id => {
                        const category = getCategoryById(id);
                        return category && !category.isDeleted && category.group !== 'system' && category.name?.toLowerCase().includes(filters.text);
                    });
                matches = matches && textMatches;
            }
            
            return matches;
        });
    }, [items, searchQuery]);

    const filteredCategoriesForDropdown = useMemo(() => {
        if (!categorySearchQuery) return categories.filter(category => !category.isDeleted && category.group !== 'system');
        const searchLower = categorySearchQuery.toLowerCase();
        return categories.filter(category => !category.isDeleted && category.group !== 'system' &&  category.name.toLowerCase().includes(searchLower));
    }, [categories, categorySearchQuery]);
    
    const handleCategorySelect = (categoryId) => {
        if (isModelComposerProgress) {
            if (onOperationNotification) onOperationNotification();
            return;
        }
        updateCategories(prevCategories => prevCategories.map(category =>
            category.id === categoryId ? { ...category, isSelected: !category.isSelected } : category
        ), categoryId);
    };

    const handleCategoryDelete = async (itemId, categoryId) => {
        if (isModelComposerProgress) {
            if (onOperationNotification) onOperationNotification();
            return;
        }
        for (const item of items) {
            if ((item.categories || []).includes(categoryId)) {
                const updatedCategories = (item.categories || []).filter(id => id !== categoryId);
                if (onItemUpdate) {
                    await onItemUpdate({ ...item, categories: addSystemCategoryIfEmpty(updatedCategories)}, item.id);
                }
            }
        }
        updateCategories(prevCategories => prevCategories.map(category =>
            category.id === categoryId ? { ...category, isDeleted: true, isSelected: false } : category
        ), categoryId)
            
        // updateCategories(prevCategories => prevCategories.map(category =>
        //     category.id === categoryId ? { ...category, isDeleted: true, isSelected: false } : category
        // ), categoryId).then(() => {
        //     updateItem(itemId, item => {
        //         const updatedCategories = (item.categories || []).filter(id => id !== categoryId);
        //         return {
        //             ...item,
        //             categories: addSystemCategoryIfEmpty(updatedCategories)
        //         };
        //     });
        // });
    };

    const handleCategoryRestore = (categoryId) => {
        if (isModelComposerProgress) {
            if (onOperationNotification) onOperationNotification();
            return;
        }
        updateCategories(prevCategories => prevCategories.map(category =>
            category.id === categoryId ? { ...category, isDeleted: false } : category
        ), categoryId);
    };

    const categoriesHeader = useMemo(() => {
        if (categories.filter(t => t.isSelected).length === 0) return null;
        return (
            <Box mb={2} mt={2} display="flex" flexWrap="wrap" gap={1}>
                {categories.filter(t => t.isSelected).map(category => {
                    if (!category) return null;
                    return (
                        <StyledCategoryChip
                            key={category.id}
                            label={category.name}
                            size="small"
                            onDelete={() => {
                                if (isModelComposerProgress) {
                                    if (onOperationNotification) onOperationNotification();
                                    return;
                                }
                                updateCategories(categories => categories.map(t => t.id === category.id ? { ...t, isSelected: false } : t), category.id);
                            }}
                            color="primary"
                        />
                    );
                })}
                <StyledCategoryChip
                    label="Clear All"
                    size="small"
                    onClick={() => {
                        if (isModelComposerProgress) {
                            if (onOperationNotification) onOperationNotification();
                            return;
                        }
                        updateCategories(categories => categories.map(t => ({ ...t, isSelected: false })), null);
                    }}
                    sx={{ bgcolor: '#444', color: '#ccc', '& .MuiChip-deleteIcon': { color: '#ccc' } }}
                />
            </Box>
        );
    }, [categories]);

    const handleItemCategoriesChange = (itemId, newCategories) => {
        if (isModelComposerProgress) {
            if (onOperationNotification) onOperationNotification();
            return;
        }
        updateItem(itemId, item => ({ ...item, categories: newCategories || [] }));
    };

    const handleCategoryUpdate = (categoryId, newName) => {
        if (isModelComposerProgress) {
            if (onOperationNotification) onOperationNotification();
            return;
        }
        // Update global categories
        updateCategories(prev =>
            prev.map(category =>
                category.id === categoryId ? { ...category, name: newName } : category
            ), categoryId
        );
        // No need to update items - they store category IDs and will automatically 
        // reflect the new name when looking up categories during rendering
    };
    
    // All other handlers from the original component
    const handleMenuOpen = (event, item) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedItem(item);
        onNotification && onNotification('onOpenContextMenu', item);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedItem(null);
    };
    
    //---- Utility methods for system tags ------//
    const isSystemCategory = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category?.group === 'system';
    };

    const getSystemCategoryId = () => {
        const systemCat = categories.find(cat => cat.group === 'system');
        return systemCat;
    };

    const removeSystemCategory = (categoryIds) => {
        return categoryIds.filter(id => !isSystemCategory(id));
    };

    const addSystemCategoryIfEmpty = (categoryIds) => {
        if (categoryIds.length === 0) {
            const systemId = getSystemCategoryId()?.id;
            return systemId ? [systemId] : [];
        }
        return categoryIds;
    };
    const syncWithSystemSelection = (categoryIds, prevCategories) => {
        const systemCat = prevCategories.find(c => c.group === 'system');
        if (!systemCat?.isSelected) return prevCategories;

        return prevCategories.map(c => {
            if (categoryIds.includes(c.id) && !c.isSelected) {
                return { ...c, isSelected: true };
            }
            return c;
        });
    };
    //---- Utility methods for system tags ------//
    
    const handleCategoryClick = (categoryId, itemId) => {
        if (isModelComposerProgress) {
            if (onOperationNotification) onOperationNotification();
            return;
        }
        const item = items.find(i => i.id === itemId);
        if (!item) return;

        const currentCategories = item.categories || [];
        const hasCategory = currentCategories.includes(categoryId);

        let newCategories;
        if (hasCategory) {
            // Remove the category ID
            newCategories = currentCategories.filter(id => id !== categoryId);
            newCategories = addSystemCategoryIfEmpty(newCategories);
            const system = getSystemCategoryId();
            if(newCategories?.length === 1 && system.isSelected){
                categoryId = newCategories[0]
            }
        } else {
            // Add the category ID
            const isValidCategory = categories.some(cat => cat.id === categoryId);
            if (!isValidCategory) return;
            newCategories = [...removeSystemCategory(currentCategories), categoryId];
        }
        
        let updateCategories = syncWithSystemSelection([categoryId], categories);
        const updatedItems = items.map(item => {
            if (item.id === itemId) {
                return {...item, categories: [...newCategories]};
            }
            return item;
        });
        const isStillAssigned = updatedItems.some(item =>
            item.id !== itemId && (item.categories || []).includes(categoryId)
        );
        if (!isStillAssigned) {
            updateCategories = updateCategories.map(c =>
                c.id === categoryId ? { ...c, isSelected: getSystemCategoryId().isSelected } : c
            );
        }
        setCategories(updateCategories);
        setItems(updatedItems);
        const updatedCategory = updateCategories.find(x=>x.id === categoryId);
        onCategoriesUpdated(updateCategories,updatedCategory).then(() => {
            const updatedItem = updatedItems.find(item => item.id === itemId);
            if (onItemUpdate && updatedItem) onItemUpdate(updatedItem, itemId);
        });
        setMoreCategoriesAnchorEl(null);
        setExpandedFileId(null);
    };

    const handleStartCategoryEdit = (category) => {
        setEditingCategoryId(category.id);
        setEditingCategoryName(category.name);
    };

    const handleCancelCategoryEdit = () => {
        setEditingCategoryId(null);
        setEditingCategoryName('');
    };

    const handleSaveCategoryEdit = () => {
        if (editingCategoryId && editingCategoryName.trim()) {
            handleCategoryUpdate(editingCategoryId, editingCategoryName.trim());
        }
        handleCancelCategoryEdit();
    };

    const handleCreateAndAddCategory = (categoryName, itemId) => {
        if (isModelComposerProgress) {
            if (onOperationNotification) onOperationNotification();
            return;
        }
        const name = categoryName.trim()
        if (!name) return;
        const newCategory = { id: `${name.toLowerCase()}-${IafUtils.generateShortId()}`, name: name, group: 'custom', isSelected: false, isDeleted: false };
        const updateCategories = syncWithSystemSelection([newCategory.id], [...categories, newCategory]);
        const updatedItems = items.map(item => {
            if (item.id === itemId) {
                const updatedCategories = removeSystemCategory(item.categories || []);
                return {...item, categories: [...updatedCategories, newCategory.id]};
            }
            return item;
        });
        setCategories(updateCategories);
        setItems(updatedItems);
        
        onCategoriesUpdated(updateCategories, newCategory, true).then(() => {
            const updatedItem = updatedItems.find(item => item.id === itemId);
            if (onItemUpdate && updatedItem) onItemUpdate(updatedItem, itemId);
            handleCloseCategoryDropdown()
        });
        setCategorySearchQuery('');
    };

    const handleMoreCategoriesClick = (event, itemId) => {
        event.preventDefault();
        event.stopPropagation();
        setMoreCategoriesAnchorEl(event.currentTarget);
        setExpandedFileId(itemId);
    };

    const handleMoreCategoriesClose = () => {
        setMoreCategoriesAnchorEl(null);
        setExpandedFileId(null);
    };

    const handleStartItemEdit = (item) => {
        setEditingItem({
            id: item.id,
            title: item.title,
            description: {
                ...item.description,
                content: item.description.content,
            }
        });
    };
    
    const handleChangeItemEdit = (e) => {
        const { name, value } = e.target;
        if (name === 'title') {
          setEditingItem((prevItem) => ({
            ...prevItem,
            title: value,
          }));
        } else if (name === 'description') {
          setEditingItem((prevItem) => ({
            ...prevItem,
            description: {
              ...prevItem.description,
              content: value,
            },
          }));
        }
    }

    const handleSaveItemEdit = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!editingItem) return;
            if (isModelComposerProgress) {
                if (onOperationNotification) onOperationNotification();
                return;
            }
            updateItem(editingItem.id, item => ({
                ...item,
                title: editingItem.title,
                description: {
                    ...item.description,
                    content: editingItem.description.content
                }
            }));
            const itemToEdit = items.find(i => i.id === editingItem.id);
            if (itemToEdit && itemToEdit.onClick) {
                itemToEdit.onClick('optionRename', {
                ...itemToEdit,
                 title: editingItem.title,
                description: {
                    ...itemToEdit.description,
                    content: editingItem.description.content
                }
            });
            }
            setEditingItem(null);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setEditingItem(null);
        }
    };

    const handleOpenCategoryDropdown = (event, itemId) => {
        setCategoryAnchorEl(event.current);
        setSelectedFileId(itemId);
    };

    const handleCloseCategoryDropdown = () => {
        setCategoryAnchorEl(null);
        setCategorySearchQuery('');
        handleCancelCategoryEdit();
    };

    const handleToggleCategoryDropdown = (event, itemId) => {
        if (categoryAnchorEl && selectedFileId === itemId) {
            handleCloseCategoryDropdown();
        } else {
            handleOpenCategoryDropdown(event, itemId);
            onNotification && onNotification("onOpenTag")
        }
    };
    
    const handleMenuItemClickInternal = (option, selectedItem) => {
        if (option.optionId === 'optionRename') {
            handleStartItemEdit(selectedItem);
        } else {
            selectedItem.element[option.optionId].onClick(option.optionId, selectedItem);
        }
        handleMenuClose();
    };
    
    const isFiltered = searchQuery.trim().length > 0;

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const paginatedItems = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return filteredItems.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredItems, page, rowsPerPage]);

    // Whenever categories are updated, call onCategoriesUpdated
    const updateCategories = (updater, categoryId, isNewCategory = false) => {
        return new Promise(async (resolve) => {
            setCategories(prevCategories => {
            const newCategories = typeof updater === 'function' ? updater(prevCategories) : updater;
            const updatedCategory = categoryId ? newCategories.find(c => c.id === categoryId) : null;
            if (onCategoriesUpdated) {
                onCategoriesUpdated(newCategories, updatedCategory, isNewCategory)
                .then(() => resolve())
                .catch(() => resolve());
            } else {
                resolve();
            }
            return newCategories;
            });
        });
    };

    // Whenever an item is updated, call onItemUpdate
    const updateItem = (itemId, updater) => {
        return new Promise((resolve) => {
            setItems((prevItems) => {
            const newItems = prevItems.map((item) => {
                if (item.id === itemId) {
                    const updatedItem = typeof updater === 'function' ? updater(item) : updater;
                    if (onItemUpdate) {
                        Promise.resolve(onItemUpdate(updatedItem, itemId)).then(() => {
                        resolve(updatedItem);
                        });
                    } else {
                        resolve(updatedItem);
                    }
                    return updatedItem;
                }
                return item;
            });
            return newItems;
            });
        });
    };

    // Add handler to unassign a category from an item
    const handleUnassignCategory = (itemId, categoryId) => {
        if (isModelComposerProgress) {
            if (onOperationNotification) onOperationNotification();
            return;
        }
        updateItem(itemId, item => {
            const updatedCategories = (item.categories || []).filter(id => id !== categoryId);
            return {
                ...item,
                categories: addSystemCategoryIfEmpty(updatedCategories)
            };
        }).then(()=>{
            // After unassigning, check if the category is still assigned to any item
             const isStillAssigned = items.some(item =>
                item.id !== itemId && (item.categories || []).includes(categoryId)
            );
            if (!isStillAssigned) {
                updateCategories(categories => categories.map(c => c.id === categoryId ? { ...c, isSelected: getSystemCategoryId().isSelected } : c), categoryId);
            }
        });
    };

    return (
        <>
            <StyledContainer>
               {props.enableSearch && <StyledTextField
                    variant="standard"
                    // disabled={paginatedItems.every(item => props.disabledItems.includes(item.id))}
                    label={props.searchLabel || 'Search'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    placeholder={showCategoryIcon? "Try: is:tagged is:untagged tag:MEP" : ""}
                />}
                {showCategoryHeader && categoriesHeader}
                <StyledList>
                    {paginatedItems.map((item) => {
                        // Merge isSelected and isDeleted from global categories into item.categories
                        const mergedCategories = (item.categories || []).map(id => {
                            const globalCategory = categories.find(t => t.id === id);
                            return globalCategory ? { ...globalCategory } : null;
                        }).filter(category => category !== null);
                        
                        // Check if item should be highlighted based on selected categories
                        const shouldHighlightItem = categories.some(cat => cat.isSelected) && 
                            (item.categories || []).some(id => {
                                const globalCat = categories.find(cat => cat.id === id);
                                return globalCat?.isSelected;
                            });
                        
                        return (
                            <IafTaggedListItem
                                key={item.id}
                                item={{
                                    ...item,
                                    categories: mergedCategories,
                                    isSelected: shouldHighlightItem
                                }}
                                shouldHideTags={hideTagsForIds.includes(item.id)}
                                isCategoryDropdownOpen={categoryAnchorEl && selectedFileId === item.id}
                                maxDisplayedCategories={maxDisplayedCategories}
                                showCategoryIcon={showCategoryIcon}
                                onMenuOpen={handleMenuOpen}
                                onCategorySelect={handleCategorySelect}
                                onMoreCategoriesClick={handleMoreCategoriesClick}
                                onToggleCategoryDropdown={handleToggleCategoryDropdown}
                                onUnassignCategory={categoryId => handleUnassignCategory(item.id, categoryId)}
                                isItemEditable={((editingItem && editingItem.id === item.id) && canAccess )}
                                editingItem={editingItem}
                                onStartItemEdit={handleStartItemEdit}
                                onSaveItemEdit={handleSaveItemEdit}
                                onChangeItemEdit={handleChangeItemEdit}
                                canAccess={canAccess}
                            />
                        );
                    })}
                </StyledList>

                {filteredItems.length > maxRows && (
                    <StyledPaginationContainer>
                        <CustomPagination
                            count={filteredItems.length}
                            page={page}
                            onChangePage={handlePageChange}
                            rowsPerPage={rowsPerPage}
                        />
                    </StyledPaginationContainer>
                )}
                {filteredItems.length === 0 && isFiltered && (
                    <StyledTypography
                        sx={{
                        fontSize: '11px',
                        lineHeight: '15px',
                        }} > 
                        No files found matching "{searchQuery}"
                    </StyledTypography>
                )}
            </StyledContainer>

            {canAccess && <Popper
                open={Boolean(categoryAnchorEl)}
                anchorEl={categoryAnchorEl}
                placement="bottom-end"
                transition
                disablePortal={false}
                sx={{ 
                    zIndex: 1201, 
                    minWidth: 250,
                    width: categoryAnchorEl ? 
                        (categoryAnchorEl.clientWidth < 200 ? 250 : categoryAnchorEl.clientWidth) : 250 
                }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={250}>
                        <div>
                            <StyledPopperPaper>
                                <ClickAwayListener onClickAway={handleCloseCategoryDropdown} mouseEvent="onMouseUp">
                                    <div>
                                        <StyledPopperSearchBox>
                                            <StyledPopperSearchTextField
                                                value={categorySearchQuery}
                                                onChange={(e) => setCategorySearchQuery(e.target.value)}
                                                placeholder="Search or assign tags..."
                                                size="small"
                                                fullWidth
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && selectedFileId && categorySearchQuery.trim() && !categories.some(t => t.name.toLowerCase() === categorySearchQuery.toLowerCase())) {
                                                        e.preventDefault();
                                                        handleCreateAndAddCategory(categorySearchQuery, selectedFileId);
                                                    }
                                                }}
                                            />
                                        </StyledPopperSearchBox>
                                        <StyledPopperCategoriesListContainer>
                                            {filteredCategoriesForDropdown.length > 0 && selectedFileId && items.find(i => i.id === selectedFileId) ? (
                                                filteredCategoriesForDropdown.map(category => {
                                                    const item = items.find(i => i.id === selectedFileId);
                                                    const isAssigned = item.categories.some(t => t === category.id);
                                                    return (
                                                        <StyledPopperCategoryItem
                                                            key={category.id}
                                                            assigned={isAssigned}
                                                            display="flex"
                                                            alignItems="center"
                                                            onClick={() =>{
                                                                if (editingCategoryId !== category.id) {
                                                                    handleCategoryClick(category.id, item.id)
                                                                }
                                                            }}
                                                        >
                                                            {editingCategoryId === category.id ? (
                                                                <StyledPopperCategoryItemEditInput
                                                                    value={editingCategoryName}
                                                                    onChange={(e) => setEditingCategoryName(e.target.value)}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    onBlur={handleSaveCategoryEdit}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') { e.preventDefault(); handleSaveCategoryEdit(); }
                                                                        else if (e.key === 'Escape') { e.preventDefault(); handleCancelCategoryEdit(); }
                                                                    }}
                                                                    variant="standard" size="small" autoFocus fullWidth
                                                                />
                                                            ) : (
                                                                <Box flex={1} display="flex" alignItems="center">
                                                                    <Box flex={1}>{category.name}</Box>
                                                                </Box>
                                                            )}
                                                            {editingCategoryId !== category.id && !category.isDeleted && (
                                                                <>
                                                                    <StyledPopperCategoryItemEditIcon size="small" onClick={(e) => { e.stopPropagation(); handleStartCategoryEdit(category); }}>
                                                                        <EditIcon fontSize="small" />
                                                                    </StyledPopperCategoryItemEditIcon>
                                                                    {category.id !== "default" && canDeleteAccess  &&<StyledPopperCategoryItemEditIcon size="small" onClick={(e) => { e.stopPropagation(); handleCategoryDelete(item.id, category.id); }}>
                                                                        <ClearIcon fontSize="small" />
                                                                    </StyledPopperCategoryItemEditIcon>}
                                                                </>
                                                            )}
                                                            {editingCategoryId !== category.id && category.isDeleted && (
                                                                <StyledPopperCategoryItemEditIcon size="small" onClick={(e) => { e.stopPropagation(); handleCategoryRestore(category.id); }}>
                                                                    <AddIcon fontSize="small" />
                                                                </StyledPopperCategoryItemEditIcon>
                                                            )}
                                                        </StyledPopperCategoryItem>
                                                    );
                                                })
                                            ) : (
                                                <StyledPopperNoCategories variant="body2">No tags found.</StyledPopperNoCategories>
                                            )}
                                        </StyledPopperCategoriesListContainer>
                                        {selectedFileId && categorySearchQuery && !categories.some(t => t.name.toLowerCase() === categorySearchQuery.toLowerCase()) && (
                                            <StyledPopperCreateCategory onClick={() => handleCreateAndAddCategory(categorySearchQuery, selectedFileId)}>
                                                <AddIcon fontSize="small" sx={{ mr: 1 }} />
                                                Create "{categorySearchQuery}"
                                            </StyledPopperCreateCategory>
                                        )}
                                    </div>
                                </ClickAwayListener>
                            </StyledPopperPaper>
                        </div>
                    </Fade>
                )}
            </Popper>}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{ sx: { py: '4px' } }}
                PaperProps={{ component: StyledContextMenuPaper }}
            >
                {selectedItem && Object.values(selectedItem.element).filter(option => option.type === 'option').map(option => {
                  if (option.optionId !== 'type' && option.optionId !== 'enabled') {
                        return (
                            <StyledMenuItem
                                key={option.optionId}
                                onClick={() => handleMenuItemClickInternal(option, selectedItem)}
                                disabled={!option.enabled || (disableContextMenu && option.optionId !== 'optionRename')}
                            >
                                {option.title}
                            </StyledMenuItem>
                        );
                    }
                    return null;
                 })}
            </Menu>

            <Menu
                anchorEl={moreCategoriesAnchorEl}
                open={Boolean(moreCategoriesAnchorEl)}
                onClose={handleMoreCategoriesClose}
                PaperProps={{ component: StyledContextMenuPaper }}
            >
                {expandedFileId && items.find(item => item.id === expandedFileId)?.categories.map(id => (
                    <StyledMenuItem
                        key={id}
                        selected={categories.some(t => t.id === id && t.isSelected)}
                         {...(canAccess && {
                            onClick:() => {
                                if (isModelComposerProgress) {
                                    if (onOperationNotification) onOperationNotification();
                                    return;
                                }
                                updateCategories(categories => categories.map(t => t.id === id ? { ...t, isSelected: !t.isSelected } : t), id);
                                handleMoreCategoriesClose();
                            }
                        })}
                    >
                        {getCategoryById(id).name}
                    </StyledMenuItem>
                ))}
            </Menu>
       </>
    );
    
};

export default IafTaggedList; 