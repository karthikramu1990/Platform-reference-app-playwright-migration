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
// 16-10-23    HSK                    Created IafList low component
// 27-10-23    HSK                    Used Custom pagination for navigation
// 07-11-23    ATK                    State update did not update items (prop.items)
// 25-Jan-24   ATK                    Introduced prop maxRows.
//                                    Removed minHeight to get rid of unwanted empty space 
// 29-02-24    HSK        PLAT-4340   IafList search styling
// -------------------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CustomPagination from './CustomPagination.jsx';
import IafTooltip from '../../component-low/Iaftooltip/IafTooltip.jsx';
import IafUtils from "../../../core/IafUtils.js";

const StyledListContainer = styled('div')({
  width: '100%',
  position: 'relative',
});

const StyledList = styled(List)(({ theme }) => ({
  width: '100%',
  padding: '0 !important',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0px 0px 0px 0px',
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  padding: '0px 0px 6px 0px',
}));

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  padding: '0px',
  color: '#dcdcdc',
  transform: 'scale(0.8)',
  '& span.MuiIconButton-label': {
    color: 'var(--app-accent-color)',
  },
}));

const StyledInput = styled('input')({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: 500,
  color: '#dcdcdc',
  backgroundColor: 'transparent',
  borderRight: 'none',
  borderTop: 'none',
  borderBottom: '0.5px solid var(--app-accent-color)',
  padding: '0px',
  width: '150px',
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: 500,
  color: '#dcdcdc',
  '&:hover': {
    color: 'var(--app-accent-color)', // Change the color on hover
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
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
const StyledEllipsis = styled('div')(({ theme }) => ({
  fontSize: '24px',
  color: '#dcdcdc',
  cursor: 'pointer',
  '&:hover': {
    color: 'var(--app-accent-color)',
  },
  pointerEvents: (props) => (props.disabledItems ? 'none' : 'auto'),
  opacity: (props) => (props.disabledItems ? 0.5 : 'auto'),
}));

const StyledSpan = styled('span')(({ theme }) => ({
  fontSize: '11px',
  fontStyle: 'normal',
  fontFamily: 'Inter',
  fontWeight: 500,
  lineHeight: '18px',
  color: '#dcdcdc',
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  color: 'var(--app-accent-color)',
  backgroundColor: '#333333',
  '&:hover': {
    backgroundColor: 'var(--app-accent-color)',
    color: '#333333',
  },
}));

function IafList(props) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedItemForMenu, setSelectedItemForMenu] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(props.maxRows || 8);
  const [editableItem, setEditableItem] = useState(null);
  const [items, setItems] = useState(props.items);

  useEffect(() => {
    props.onSelectionChange(selectedItems);
  }, [selectedItems]);

  // Handle when a checkbox is clicked
  const handleCheckboxClick = (value) => {
    if (selectedItems.includes(value)) {
      setSelectedItems(selectedItems.filter((item) => item !== value));
    } else {
      setSelectedItems([...selectedItems, value]);
    }
  };

  // Handle filter text input change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedItemForMenu(null);
  };

  const handleEllipsisClick = (item, event) => {
    setSelectedItemForMenu(item);
    setMenuAnchorEl(event.currentTarget);
  };

  // Filter the items based on the search filter
  const filteredItems = props.items.filter((item) =>
    item.title.toLowerCase().includes(filter.toLowerCase())
  );

  const indexOfLastItem = (page + 1) * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const slicedItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // console.log ('IafList rerendering'
  //   , '/items', items
  //   , '/slicedItems', slicedItems
  // );

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemDoubleClick = (item) => {
    setEditableItem(item);
  };

  const isItemEditable = (item) => editableItem && editableItem.id === item.id;

  const handleItemEdit = (event) => {
    const { name, value } = event.target;
    if (name === 'title') {
      setEditableItem((prevItem) => ({
        ...prevItem,
        title: value,
      }));
    } else if (name === 'description') {
      setEditableItem((prevItem) => ({
        ...prevItem,
        description: {
          ...prevItem.description,
          content: value,
        },
      }));
    }
  };

  const handleItemEditFinish = (event) => {
    if (event.key === 'Enter') {
      let activeItem;
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editableItem.id ? { ...item, ...editableItem } : item
        )
      );
      IafUtils.devToolsIaf && console.log(
        'IafList.handleItemEditFinish',
        '/editableItem',
        editableItem
      );
      props.onItemEdit && props.onItemEdit(editableItem);
      editableItem.onClick &&
        editableItem.onClick('optionRename', editableItem);
      setEditableItem(null);
    }
  };

  return (
    <StyledListContainer>
      {props.enableSearch && (
        <StyledTextField
          variant="standard"
          disabled={slicedItems.every(item => props.disabledItems.includes(item.id))}
          label={props.searchLabel || 'Search'}
          value={filter}
          onChange={handleFilterChange}
          fullWidth
        />
      )}
      <StyledList>
        {slicedItems.map((item, index) => (
          <IafTooltip
            title={item.tooltipText || ''}
            placement={item.tooltipPlacement || "bottom"}
            open={!!item.tooltipText}
            toolTipClass={item.toolTipClass}
            key={index}
          >
          <StyledListItem
            key={index}
            disabled={props.disabledItems.includes(item.id)}
          >
            <StyledListItemText>
              <StyledTypography
                disabled={props.disabledItems.includes(item.id)}
                sx={{
                  fontSize: '11px',
                  lineHeight: '15px',
                  pointerEvents: props.disabledItems.includes(item.id)
                    ? 'none'
                    : 'auto',
                }}
                onDoubleClick={() => handleItemDoubleClick(item)}
              >
                {isItemEditable(item) ? (
                  <StyledInput
                    type="text"
                    name="title"
                    value={editableItem.title}
                    onChange={handleItemEdit}
                    onKeyPress={handleItemEditFinish}
                    sx={{
                      fontSize: '11px',
                      lineHeight: '15px',
                    }}
                  />
                ) : (
                  item.title
                )}
              </StyledTypography>
              {item.description.enabled && (
                <StyledTypography
                  disabled={props.disabledItems.includes(item.id)}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                  sx={{
                    fontSize: '9px',
                    lineHeight: '10px',
                    pointerEvents: props.disabledItems.includes(item.id)
                      ? 'none'
                      : 'auto',
                  }}
                >
                  {isItemEditable(item) ? (
                    <StyledInput
                      type="text"
                      name="description"
                      value={editableItem.description.content}
                      onChange={handleItemEdit}
                      onKeyPress={handleItemEditFinish}
                      sx={{
                        fontSize: '9px',
                        lineHeight: '10px',
                      }}
                    />
                  ) : (
                    item.description.content
                  )}
                </StyledTypography>
              )}
            </StyledListItemText>
            {item.element && item.element.type === 'checkbox' &&
              <StyledCheckbox
                checked={selectedItems.includes(item.id)}
                onClick={() => handleCheckboxClick(item.id)}
                disabled={props.disabledItems.includes(item.id)}
              />
            }
            {item.element && item.element.type === 'ellipsis' && (
              <StyledEllipsis
                disabledItems={props.disabledItems}
                disabled={props.disabledItems.includes(item.id)}
               onClick={(event) => handleEllipsisClick(item, event)}
              >
                &#8942;
              </StyledEllipsis>
            )}
          </StyledListItem>
        </IafTooltip>
        ))}
      </StyledList>
        <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            //".MuiMenu-paper"?
            backgroundColor: '#333333',
          },
        }}
      >
        {selectedItemForMenu &&
          selectedItemForMenu.element &&
          selectedItemForMenu.element.type === 'ellipsis' &&(
            <div>
              {Object.keys(selectedItemForMenu.element).map((optionKey) => {
                // Skip 'type' and 'enabled' keys
                if (optionKey !== 'type' && optionKey !== 'enabled') {
                  return (
                    <StyledMenuItem
                      key={optionKey}
                      onClick={() => {
                        handleMenuClose();
                        if (selectedItemForMenu.element[optionKey].title.toLowerCase() === 'rename') {
                          handleItemDoubleClick(selectedItemForMenu);
                        }
                        else{
                          selectedItemForMenu.element[optionKey].onClick(optionKey, selectedItemForMenu);
                        }
                      }}
                      disabled={!selectedItemForMenu.element[optionKey].enabled}
                    >
                      <StyledSpan>
                        {selectedItemForMenu.element[optionKey].title}
                      </StyledSpan>
                    </StyledMenuItem>
                  );
                }
                return null;
              })}
            </div>
          )}
        </Menu>
        {filteredItems.length > (props.maxRows || 8) && (
          <CustomPagination
            count={filteredItems.length}
            page={page}
            onChangePage={handlePageChange}
            rowsPerPage={rowsPerPage}
          />
        )}
    </StyledListContainer>
  );
}

export default IafList;
