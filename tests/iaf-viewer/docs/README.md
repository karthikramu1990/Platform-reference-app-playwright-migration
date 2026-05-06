# IAF Viewer Documentation

This directory contains comprehensive API documentation for the IAF Viewer framework.

## 📁 Documentation Structure

### Internal Documentation (`internal/`)
Documentation for **framework developers** working on the IAF Viewer itself.

- **`IafUtils.api.json`** - Core utility functions and helper classes
- **`IafDatabaseManager.api.json`** - Database operations with queuing and auto-persistence
- **`IafFileManager.api.json`** - File management and blob storage operations
- **`iafPermissionManager.api.json`** - Permission management for graphics data resources

### External Documentation (`external/`)
Documentation for **external consumers** integrating with the IAF Viewer framework.

- **`EvmUtils.api.json`** - External viewer management utilities
  - Command builders for graphics, layers, camera operations
  - DOM element ID management for EVM components
  - React hooks for ArcGIS integration
  - UUID generation and property comparison utilities

## 📋 Documentation Format

Each API documentation file follows a consistent JSON structure:

```json
{
  "class": "ClassName",
  "description": "Brief description of the class/module",
  "methods": {
    "methodName": "Brief description of what the method does"
  }
}
```

## 🎯 Usage

### For Framework Developers
- **Internal APIs**: Use `internal/` documentation for framework development
- **Quick Reference**: API lookups during development
- **Integration**: Understanding internal class relationships

### For External Consumers
- **External APIs**: Use `external/` documentation for integration
- **Command Building**: Learn how to build viewer commands
- **DOM Management**: Access viewer component IDs
- **React Integration**: Use provided hooks and utilities

### For Documentation Generation
- **HTML Documentation**: Convert JSON to HTML documentation sites
- **Markdown Generation**: Generate markdown documentation from JSON
- **API Reference**: Create comprehensive API reference guides

## 📚 Related Files

- **Source files**: Located in `../src/` directory
- **Package README**: `../README.md` for package overview
- **Package configuration**: `../package.json` for dependencies and scripts

## 🔧 Adding New Documentation

### For Internal APIs
1. Create a new `.api.json` file in `internal/` directory
2. Follow the established format and structure
3. Update `internal/index.json` with the new entry

### For External APIs
1. Create a new `.api.json` file in `external/` directory
2. Follow the established format and structure
3. Update `external/README.md` with the new entry
4. Ensure the API is stable and well-documented

## 🚀 Future Enhancements

- [ ] Add TypeScript type definitions
- [ ] Generate interactive documentation website
- [ ] Add usage examples to documentation
- [ ] Create documentation validation scripts
- [ ] Add search functionality to documentation
