// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 02-11-23    ATK        PLAT-3427   Created. Linked Models UX Testing out.                             
// -------------------------------------------------------------------------------------

import IafUtils, { IafArrayUtils } from "../../../core/IafUtils";

export class IafListUtils {

    static getTestTitle = () => {
        return "IafList Title";
    }

    static optionTestClickHandler = (data) => {
        IafUtils.devToolsIaf && console.log('IafListUtils.optionTestClickHandler'
            , '/this', this
            , '/data', data
        );
    }
    static testRenameHandler = (data) => {
        IafUtils.devToolsIaf && console.log('IafListUtils.testRenameHandler'
            , '/this', this
            , '/data', data
        );
    }
    
    static getTestItems = (optionOnClick, onRename) => {
        return [
            {
                id: 1,              // Unique identifier for the item
                title: 'Item 1',    // The title or name of the item
                onRename,
                element: {
                    type: 'checkbox', // Type of element, e.g., checkbox or ellipsis
                },
                description: {
                    content: 'Description 1', // The description content
                    enabled: false              // Boolean indicating whether to display the description
                }
            },
            {
                id: 2,
                title: 'Item 2',
                onRename,
                element: {
                    type: 'checkbox',
                },
                description: {
                    content: 'Description 2',
                    enabled: true
                }
            },
            {
                id: 3,
                title: 'Item 3',
                onRename,
                element: {
                    type: 'ellipsis',
                    option1: {
                        title: 'Option 1',   // Title of the first option in the ellipsis menu
                        onClick: optionOnClick, // Function to be called when the option is clicked
                        enabled: true
                    },
                    option2: {
                        title: 'Option 2',
                        onClick: optionOnClick,
                        enabled : false
                    },
                    option3: {
                        title: 'Option 3',
                        onClick: optionOnClick,
                        enabled : false
                    },
                    option4: {
                        title: 'Option 4',
                        onClick: optionOnClick,
                        enabled: true
                    },
                    option5: {
                        title: 'Rename',   // Title of the first option in the ellipsis menu
                        onClick: optionOnClick, // Function to be called when the option is clicked
                        enabled: true
                    }
                },
                description: {
                    content: 'Description 3',
                    enabled: true
                }
            },
            {
                id: 4,
                title: 'Item 4',
                onRename,
                element: {
                    type: 'ellipsis',
                    option1: {
                        title: 'Option 1',
                        onClick: optionOnClick,
                        enabled: true
                    },
                    option2: {
                        title: 'Option 2',
                        onClick: optionOnClick,
                        enabled: true
                    },
                    option3: {
                        title: 'Rename',   // Title of the first option in the ellipsis menu
                        onClick: optionOnClick, // Function to be called when the option is clicked
                        enabled: true
                    }
                },
                description: {
                    content: 'Description 4',
                    enabled: true
                }
            },
            {
              id: 5,
              title: 'Item 5',
              onRename,
              element: {
                  type: 'checkbox',
              },
              description: {
                  content: 'Description 5',
                  enabled: true
              }
            },
            {
              id: 6,
              title: 'Item 6',
              onRename,
              element: {
                  type: 'checkbox',
              },
              description: {
                  content: 'Description 6',
                  enabled: true
              }
            },
            {
              id: 7,
              title: 'Item 7',
              onRename,
              element: {
                  type: 'checkbox',
              },
              description: {
                  content: 'Description 7',
                  enabled: true
              }
            },
            {
              id: 8,
              title: 'Item 8',
              onRename,
              element: {
                  type: 'checkbox',
              },
              description: {
                  content: 'Description 8',
                  enabled: true
              }
            },
            {
              id: 9,
              title: 'Item 9',
              onRename,
              element: {
                  type: 'checkbox',
              },
              description: {
                  content: 'Description 9',
                  enabled: true
              }
            },
          ];
    }

    static getDisabledTestItems = () => {
        return [1];
    }
    
    static createItem = (items, id) => {
        if (IafArrayUtils.exists(items, id)) {
            IafUtils.devToolsIaf && console.log('IafListUtils.createItem', 'already exists');
            return undefined;
        }
        let item = {
            id,
            title: 'New Item',
            element: {
                type: 'ellipsis'
            },
            description: {
                content: 'Description',
                enabled: true
            }
        }
        return item;
    }

    static updateItemProperty = (items, id, prop, value) => {
        return IafArrayUtils.updateItemProperty (items, id, prop, value);
    }

    static addOption = (item, optionId, enabled, optionOnClick) => {
        // let optionKeys = Object.keys(item.element).map((optionKey) => {
        //     if (optionKey !== 'type' && optionKey !== 'enabled') return optionKey;
        // });
        // let count = optionKeys.length;
        // let optionId = Option + count + 1;
        
        item.element[optionId] = {
            optionId,
            parentId: item.id,
            type: 'option',
            title: optionId,
            onClick: optionOnClick,
            enabled
        };
    }

    static updateOption = (item, optionId, property, value) => {
        item.element[optionId][property] = value;
    }
}