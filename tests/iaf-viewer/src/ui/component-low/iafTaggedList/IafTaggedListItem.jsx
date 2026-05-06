import React,{useRef} from 'react';
import {
    Box,
    IconButton,
} from '@mui/material';
import { MoreVert as MoreVertIcon, LocalOffer as TagIcon } from '@mui/icons-material';
import {
    StyledCategoryChip,
    StyledTypography,
    StyledTextField,
    StyledListItem,
    StyledChipsArea
  } from './IafTaggedListItem.styles.js';

const   IafTaggedListItem = ({
    item,
    isCategoryDropdownOpen,
    maxDisplayedCategories,
    showCategoryIcon = true,
    shouldHideTags = false,
    canAccess = false,
    onMenuOpen,
    onCategorySelect,
    onMoreCategoriesClick,
    onToggleCategoryDropdown,
    onUnassignCategory,
    isItemEditable,
    editingItem,
    onStartItemEdit,
    onSaveItemEdit,
    onChangeItemEdit,
}) => {
    const tagRef = useRef(null);
    const renderEditableTypography = (
        field,
        text,
        isPrimary,
        isEnabled
    ) => {
        if (!isEnabled) {
             return (
                <StyledTypography
                    isprimary={isPrimary}
                    withsubtext={isPrimary && item.description?.content}
                >
                    {text}
                </StyledTypography>
            );
        }

        if (isItemEditable) {
            return (
                <StyledTextField
                    name={field}
                    value={field === 'title' ? editingItem.title : editingItem.description.content}
                    onChange={onChangeItemEdit}
                    onBlur={(e) => {
                        if (e.target.value.trim() !== text) {
                            onSaveItemEdit({key: 'Enter', preventDefault: e.preventDefault});
                        }
                    }}
                    onKeyDown={onSaveItemEdit}
                    variant="standard"
                    size="small"
                    autoFocus={field === 'title'}
                    fullWidth
                    onClick={(e) => e.stopPropagation()}
                    isPrimary={isPrimary}
                />
            );
        }
        return (
            <StyledTypography
                isprimary={isPrimary}
                withsubtext={isPrimary && item.description?.content}
                onClick={(e) => {
                    e.stopPropagation();
                    onStartItemEdit(item);
                }}
            >
                {text}
            </StyledTypography>
        );
    };

    const displayedCategories = (item.categories || []).filter(category => !category.isDeleted && category.group !== 'system').slice(0, maxDisplayedCategories);
    const hasMoreCategories = (item.categories || []).filter(category => !category.isDeleted && category.group !== 'system').length > maxDisplayedCategories;
    const hasCategories = (item.categories || []).filter(category => !category.isDeleted && category.group !== 'system').length > 0;

    return (
        <StyledListItem
            key={item.id}
            isLoaded={!item.description?.content?.includes('(Unloaded)')}
            isSelected={item.isSelected}
            disablePadding >
            <Box display="flex" flexDirection="row" alignItems="flex-start" width="100%">
                <Box flex={1} minWidth={0} display="flex" flexDirection="column" justifyContent="center">
                    {renderEditableTypography('title', item.title, true, true)}
                    {item.description?.content && renderEditableTypography('description', item.description.content, false, item.description?.enabled)}
                </Box>
                <Box display="flex" alignItems="center" gap="4px">
                    {showCategoryIcon && !shouldHideTags && canAccess && (
                        <IconButton 
                            ref={tagRef}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleCategoryDropdown(tagRef, item.id);
                            }}
                            sx={{
                                padding: '2px',
                                fontSize: '10px',
                                color: hasCategories ? '#666' : '#e0e0e0',
                                opacity: hasCategories ? 0.4 : 1,
                                minWidth: 'auto',
                                width: '18px',
                                height: '18px',
                                borderRadius: '3px',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    color: hasCategories ? '#888' : '#999',
                                    opacity: 1,
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                }
                            }}
                            title={hasCategories ? "Manage categories" : "Add categories"}
                        >
                            <TagIcon fontSize="small" />
                        </IconButton>
                    )}
                    <IconButton onClick={(e) => onMenuOpen(e, item)} disableRipple
                        sx={{
                            padding: 0,
                            color: '#e0e0e0',
                            cursor: 'pointer',
                            padding: '0px',
                            marginRight: '-10px',
                            transition: 'color 0.2s ease',
                            '&:hover' : {
                                color: '#888',
                            }
                        }}>
                        <MoreVertIcon />
                    </IconButton>
                </Box>
            </Box>
             {hasCategories && showCategoryIcon && !shouldHideTags && (
                <StyledChipsArea
                    className="chips-area"
                    isOpen={isCategoryDropdownOpen}
                    {...(canAccess && {
                        onClick: (e) => {
                            e.stopPropagation();
                            onToggleCategoryDropdown(tagRef, item.id);
                        }}
                    )}
                >
                    {displayedCategories.map((category) => (
                        <StyledCategoryChip
                            key={category.id}
                            label={category.name}
                            size="small"
                            selected={category.isSelected}
                            {...(canAccess && {
                                onClick: (e) => {
                                    e.stopPropagation();
                                    onCategorySelect(category.id);
                                },
                                onDelete: (e) => {
                                    e.stopPropagation();
                                    onUnassignCategory && onUnassignCategory(category.id);
                                }
                            })}
                        />
                    ))}
                    {hasMoreCategories && (
                        <StyledCategoryChip
                            label={`+${(item.categories || []).filter(category => !category.isDeleted && category.group !== 'system').length - maxDisplayedCategories}`}
                            size="small"
                            onClick={(e) => onMoreCategoriesClick(e, item.id)}
                        />
                    )}
                </StyledChipsArea>
            )}
        </StyledListItem>
    );
};

export default IafTaggedListItem; 