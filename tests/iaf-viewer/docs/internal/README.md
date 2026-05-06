# IAF Viewer API Documentation

This directory contains JSON API documentation files for the IAF Viewer framework components.

## 📁 Documentation Structure

### Core Utilities
- **`IafUtils.api.json`** - Core utility functions and helper classes
  - IafUtils, IafObjectUtils, IafArrayUtils, IafMapUtils, IafStringUtils
  - IafStorageUtils, IafPerfLogger, IafTimerUtils, IafProjectUtils

### Database Management
- **`IafDatabaseManager.api.json`** - Database operations with queuing and auto-persistence
- **`IafFileManager.api.json`** - File management and blob storage operations
- **`iafPermissionManager.api.json`** - Permission management for graphics data resources

## 📋 Documentation Format

Each API documentation file follows a consistent JSON structure:

```json
{
  "class": "ClassName",
  "description": "Brief description of the class/module",
  "constructor": {
    "description": "Constructor description",
    "parameters": ["param1 - description", "param2 - description"]
  },
  "methods": {
    "methodName": "Brief description of what the method does"
  }
}
```

## 🎯 Usage

### For Developers
- **Quick Reference**: Use these files for quick API lookups during development
- **IDE Integration**: Can be used for autocomplete and documentation generation
- **Team Onboarding**: New team members can quickly understand available APIs

### For Documentation Generation
- **HTML Documentation**: Convert JSON to HTML documentation sites
- **Markdown Generation**: Generate markdown documentation from JSON
- **API Reference**: Create comprehensive API reference guides

## 🔧 Adding New Documentation

When adding documentation for new classes/modules:

1. Create a new `.api.json` file in this directory
2. Follow the established format and structure
3. Keep descriptions concise but informative
4. Include all public methods and properties
5. Update this README with the new entry

## 📚 Related Files

- Source files are located in `../core/` and subdirectories
- Test files are located in `../core/database/unittests/` and similar test directories
- Component files are located in `../ui/` directory

## 🚀 Future Enhancements

- [ ] Add TypeScript type definitions
- [ ] Generate interactive documentation website
- [ ] Add usage examples to documentation
- [ ] Create documentation validation scripts
