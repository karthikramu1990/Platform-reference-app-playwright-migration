export const newMockCategories = [
    { id: 'tag-1', name: 'Structural', isSelected: false, isDeleted: false },
    { id: 'tag-2', name: 'Architectural', isSelected: false, isDeleted: false },
    { id: 'tag-3', name: 'MEP', isSelected: false, isDeleted: false },
    { id: 'tag-4', name: 'Phasing', isSelected: false, isDeleted: false },
    { id: 'tag-5', name: 'Reviewed', isSelected: false, isDeleted: false },
    { id: 'tag-6', name: 'Level 1', isSelected: false, isDeleted: false },
    { id: 'tag-7', name: 'Core', isSelected: false, isDeleted: false },
    { id: 'tag-8', name: 'Level 2', isSelected: false, isDeleted: false },
    { id: 'tag-9', name: 'Level 3', isSelected: false, isDeleted: false },
    { id: 'tag-10', name: 'Foundation', isSelected: false, isDeleted: false }
];

export const newMockItems = [
  {
    "id": "67c77f71e1fbee09252ef946",
    "title": "Federated",
    // "categories": [newMockCategories[4], newMockCategories[6]],
    "element": {
      "type": "ellipsis",
      "optionRename": {
        "optionId": "optionRename",
        "parentId": "67c77f71e1fbee09252ef946",
        "type": "option",
        "title": "Rename",
        "enabled": true
      },
      "optionConfigLoadFederated": {
        "optionId": "optionConfigLoadFederated",
        "parentId": "67c77f71e1fbee09252ef946_1",
        "type": "option",
        "title": "Switch to Load Everything",
        "enabled": true
      },
      "optionShowAll": {
        "optionId": "optionShowAll",
        "parentId": "67c77f71e1fbee09252ef946_2",
        "type": "option",
        "title": "Show All",
        "enabled": true
      },
      "optionHideAll": {
        "optionId": "optionHideAll",
        "parentId": "67c77f71e1fbee09252ef946_3",
        "type": "option",
        "title": "Hide All",
        "enabled": true
      }
    },
    "description": {
      "content": "Federated View",
      "enabled": true
    }
  },
  {
    "id": "67c77f78e1fbee09252ef94a",
    "title": "EX11034-INV-S-ZZ-M3-S(269070)",
    // "categories": [newMockCategories[0], newMockCategories[5]],
    "element": {
      "type": "ellipsis",
      "optionLoad": {
        "optionId": "optionLoad",
        "parentId": "67c77f78e1fbee09252ef94a_1",
        "type": "option",
        "title": "Load",
        "enabled": false
      },
      "optionShow": {
        "optionId": "optionShow",
        "parentId": "67c77f78e1fbee09252ef94a_2",
        "type": "option",
        "title": "Show",
        "enabled": false
      },
      "optionHide": {
        "optionId": "optionHide",
        "parentId": "67c77f78e1fbee09252ef94a_3",
        "type": "option",
        "title": "Hide",
        "enabled": true
      },
      "optionRename": {
        "optionId": "optionRename",
        "parentId": "67c77f78e1fbee09252ef94a_4",
        "type": "option",
        "title": "Rename",
        "enabled": true
      }
    },
    "description": {
      "content": "EX11034-INV-S-ZZ-M3-S",
      "enabled": true
    }
  },
  {
    "id": "67c77f7e2e0e2f37b2be5a2e",
    "title": "EX11034-INV-A-ZZ-M3-A(269073)",
    // "categories": [newMockCategories[1], newMockCategories[5]],
    "element": {
      "type": "ellipsis",
      "optionLoad": {
        "optionId": "optionLoad",
        "parentId": "67c77f7e2e0e2f37b2be5a2e_1",
        "type": "option",
        "title": "Load",
        "enabled": false
      },
      "optionShow": {
        "optionId": "optionShow",
        "parentId": "67c77f7e2e0e2f37b2be5a2e_2",
        "type": "option",
        "title": "Show",
        "enabled": false
      },
      "optionHide": {
        "optionId": "optionHide",
        "parentId": "67c77f7e2e0e2f37b2be5a2e_3",
        "type": "option",
        "title": "Hide",
        "enabled": true
      },
      "optionRename": {
        "optionId": "optionRename",
        "parentId": "67c77f7e2e0e2f37b2be5a2e_4",
        "type": "option",
        "title": "Rename",
        "enabled": true
      }
    },
    "description": {
      "content": "EX11034-INV-A-ZZ-M3-A",
      "enabled": true
    }
  },
  {
    "id": "67c77f852e0e2f37b2be5a32",
    "title": "EX11034-INV-E-ZZ-M3-E",
    // "categories": [newMockCategories[2]],
    "element": {
      "type": "ellipsis",
      "optionLoad": {
        "optionId": "optionLoad",
        "parentId": "67c77f852e0e2f37b2be5a32_1",
        "type": "option",
        "title": "Load",
        "enabled": true
      },
      "optionShow": {
        "optionId": "optionShow",
        "parentId": "67c77f852e0e2f37b2be5a32_2",
        "type": "option",
        "title": "Show",
        "enabled": false
      },
      "optionHide": {
        "optionId": "optionHide",
        "parentId": "67c77f852e0e2f37b2be5a32_3",
        "type": "option",
        "title": "Hide",
        "enabled": false
      },
      "optionRename": {
        "optionId": "optionRename",
        "parentId": "67c77f852e0e2f37b2be5a32_4",
        "type": "option",
        "title": "Rename",
        "enabled": true
      }
    },
    "description": {
      "content": "EX11034-INV-E-ZZ-M3-E (Unloaded)",
      "enabled": true
    }
  },
  {
    "id": "67c77f8b2e0e2f37b2be5a36",
    "title": "EX11034-INV-M-ZZ-M3-P",
    // "categories": [newMockCategories[2], newMockCategories[3]],
    "element": {
      "type": "ellipsis",
      "optionLoad": {
        "optionId": "optionLoad",
        "parentId": "67c77f8b2e0e2f37b2be5a36_1",
        "type": "option",
        "title": "Load",
        "enabled": true
      },
      "optionShow": {
        "optionId": "optionShow",
        "parentId": "67c77f8b2e0e2f37b2be5a36_2",
        "type": "option",
        "title": "Show",
        "enabled": false
      },
      "optionHide": {
        "optionId": "optionHide",
        "parentId": "67c77f8b2e0e2f37b2be5a36_3",
        "type": "option",
        "title": "Hide",
        "enabled": false
      },
      "optionRename": {
        "optionId": "optionRename",
        "parentId": "67c77f8b2e0e2f37b2be5a36_4",
        "type": "option",
        "title": "Rename",
        "enabled": true
      }
    },
    "description": {
      "content": "EX11034-INV-M-ZZ-M3-P (Unloaded)",
      "enabled": true
    }
  },
  // Additional mock items
  {
    "id": "67c77f912e0e2f37b2be5a40",
    "title": "EX11034-FND-S-ZZ-M3-F",
    // "categories": [newMockCategories[0], newMockCategories[9]],
    "element": {
      "type": "ellipsis",
      "optionLoad": {
        "optionId": "optionLoad",
        "parentId": "67c77f912e0e2f37b2be5a40_1",
        "type": "option",
        "title": "Load",
        "enabled": true
      },
      "optionShow": {
        "optionId": "optionShow",
        "parentId": "67c77f912e0e2f37b2be5a40_2",
        "type": "option",
        "title": "Show",
        "enabled": false
      },
      "optionHide": {
        "optionId": "optionHide",
        "parentId": "67c77f912e0e2f37b2be5a40_3",
        "type": "option",
        "title": "Hide",
        "enabled": false
      },
      "optionRename": {
        "optionId": "optionRename",
        "parentId": "67c77f912e0e2f37b2be5a40_4",
        "type": "option",
        "title": "Rename",
        "enabled": true
      }
    },
    "description": {
      "content": "EX11034-FND-S-ZZ-M3-F (Unloaded)",
      "enabled": true
    }
  },
  {
    "id": "67c77f972e0e2f37b2be5a44",
    "title": "EX11034-FND-A-ZZ-M3-F",
    // "categories": [newMockCategories[1], newMockCategories[9]],
    "element": {
      "type": "ellipsis",
      "optionLoad": {
        "optionId": "optionLoad",
        "parentId": "67c77f972e0e2f37b2be5a44_1",
        "type": "option",
        "title": "Load",
        "enabled": true
      },
      "optionShow": {
        "optionId": "optionShow",
        "parentId": "67c77f972e0e2f37b2be5a44_2",
        "type": "option",
        "title": "Show",
        "enabled": false
      },
      "optionHide": {
        "optionId": "optionHide",
        "parentId": "67c77f972e0e2f37b2be5a44_3",
        "type": "option",
        "title": "Hide",
        "enabled": false
      },
      "optionRename": {
        "optionId": "optionRename",
        "parentId": "67c77f972e0e2f37b2be5a44_4",
        "type": "option",
        "title": "Rename",
        "enabled": true
      }
    },
    "description": {
      "content": "EX11034-FND-A-ZZ-M3-F (Unloaded)",
      "enabled": true
    }
  },
  {
    "id": "67c77f9d2e0e2f37b2be5a48",
    "title": "EX11034-FND-E-ZZ-M3-F",
    // "categories": [newMockCategories[2], newMockCategories[9]],
    "element": {
      "type": "ellipsis",
      "optionLoad": {
        "optionId": "optionLoad",
        "parentId": "67c77f9d2e0e2f37b2be5a48_1",
        "type": "option",
        "title": "Load",
        "enabled": true
      },
      "optionShow": {
        "optionId": "optionShow",
        "parentId": "67c77f9d2e0e2f37b2be5a48_2",
        "type": "option",
        "title": "Show",
        "enabled": false
      },
      "optionHide": {
        "optionId": "optionHide",
        "parentId": "67c77f9d2e0e2f37b2be5a48_3",
        "type": "option",
        "title": "Hide",
        "enabled": false
      },
      "optionRename": {
        "optionId": "optionRename",
        "parentId": "67c77f9d2e0e2f37b2be5a48_4",
        "type": "option",
        "title": "Rename",
        "enabled": true
      }
    },
    "description": {
      "content": "EX11034-FND-E-ZZ-M3-F (Unloaded)",
      "enabled": true
    }
  },
  {
    "id": "67c77fa32e0e2f37b2be5a52",
    "title": "EX11034-FND-M-ZZ-M3-F",
    // "categories": [newMockCategories[2], newMockCategories[3], newMockCategories[9]],
    "element": {
      "type": "ellipsis",
      "optionLoad": {
        "optionId": "optionLoad",
        "parentId": "67c77fa32e0e2f37b2be5a52_1",
        "type": "option",
        "title": "Load",
        "enabled": true
      },
      "optionShow": {
        "optionId": "optionShow",
        "parentId": "67c77fa32e0e2f37b2be5a52_2",
        "type": "option",
        "title": "Show",
        "enabled": false
      },
      "optionHide": {
        "optionId": "optionHide",
        "parentId": "67c77fa32e0e2f37b2be5a52_3",
        "type": "option",
        "title": "Hide",
        "enabled": false
      },
      "optionRename": {
        "optionId": "optionRename",
        "parentId": "67c77fa32e0e2f37b2be5a52_4",
        "type": "option",
        "title": "Rename",
        "enabled": true
      }
    },
    "description": {
      "content": "EX11034-FND-M-ZZ-M3-F (Unloaded)",
      "enabled": true
    }
  },
  {
    "id": "67c77fa92e0e2f37b2be5a56",
    "title": "EX11034-L2-S-ZZ-M3-S",
    // "categories": [newMockCategories[0], newMockCategories[7]],
    "element": {
      "type": "ellipsis",
      "optionLoad": {
        "optionId": "optionLoad",
        "parentId": "67c77fa92e0e2f37b2be5a56_1",
        "type": "option",
        "title": "Load",
        "enabled": true
      },
      "optionShow": {
        "optionId": "optionShow",
        "parentId": "67c77fa92e0e2f37b2be5a56_2",
        "type": "option",
        "title": "Show",
        "enabled": false
      },
      "optionHide": {
        "optionId": "optionHide",
        "parentId": "67c77fa92e0e2f37b2be5a56_3",
        "type": "option",
        "title": "Hide",
        "enabled": false
      },
      "optionRename": {
        "optionId": "optionRename",
        "parentId": "67c77fa92e0e2f37b2be5a56_4",
        "type": "option",
        "title": "Rename",
        "enabled": true
      }
    },
    "description": {
      "content": "EX11034-L2-S-ZZ-M3-S (Unloaded)",
      "enabled": true
    }
  },
  {
    "id": "67c77faf2e0e2f37b2be5a60",
    "title": "EX11034-L2-A-ZZ-M3-A",
    // "categories": [newMockCategories[1], newMockCategories[7]],
    "element": {
      "type": "ellipsis",
      "optionLoad": {
        "optionId": "optionLoad",
        "parentId": "67c77faf2e0e2f37b2be5a60_1",
        "type": "option",
        "title": "Load",
        "enabled": true
      },
      "optionShow": {
        "optionId": "optionShow",
        "parentId": "67c77faf2e0e2f37b2be5a60_2",
        "type": "option",
        "title": "Show",
        "enabled": false
      },
      "optionHide": {
        "optionId": "optionHide",
        "parentId": "67c77faf2e0e2f37b2be5a60_3",
        "type": "option",
        "title": "Hide",
        "enabled": false
      },
      "optionRename": {
        "optionId": "optionRename",
        "parentId": "67c77faf2e0e2f37b2be5a60_4",
        "type": "option",
        "title": "Rename",
        "enabled": true
      }
    },
    "description": {
      "content": "EX11034-L2-A-ZZ-M3-A (Unloaded)",
      "enabled": true
    }
  },
  {
    "id": "67c77fb52e0e2f37b2be5a64",
    "title": "EX11034-L2-E-ZZ-M3-E",
    // "categories": [newMockCategories[2], newMockCategories[7]],
    "element": {
      "type": "ellipsis",
      "optionLoad": {
        "optionId": "optionLoad",
        "parentId": "67c77fb52e0e2f37b2be5a64_1",
        "type": "option",
        "title": "Load",
        "enabled": true
      },
      "optionShow": {
        "optionId": "optionShow",
        "parentId": "67c77fb52e0e2f37b2be5a64_2",
        "type": "option",
        "title": "Show",
        "enabled": false
      },
      "optionHide": {
        "optionId": "optionHide",
        "parentId": "67c77fb52e0e2f37b2be5a64_3",
        "type": "option",
        "title": "Hide",
        "enabled": false
      },
      "optionRename": {
        "optionId": "optionRename",
        "parentId": "67c77fb52e0e2f37b2be5a64_4",
        "type": "option",
        "title": "Rename",
        "enabled": true
      }
    },
    "description": {
      "content": "EX11034-L2-E-ZZ-M3-E (Unloaded)",
      "enabled": true
    }
  }
]; 