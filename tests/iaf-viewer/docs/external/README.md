# IAF Viewer External API Documentation

This directory contains JSON API documentation files for **external consumers** of the IAF Viewer framework.

## �� External APIs

### Main Components
- **`IafViewerDBM.api.json`** - Main entry point React component for IAF 2D/3D Viewer
  - Complete props, state, and callback documentation
  - View mode configurations (3D, 2D, ArcGIS, UE, Photosphere, GIS)
  - Toolbar and UI customization options
  - Element selection, isolation, and hiding callbacks
  - Model loading and graphics resource management

### Viewer Management
- **`EvmUtils.api.json`** - External viewer management utilities
  - Command builders for graphics, layers, camera operations
  - DOM element ID management for EVM components
  - React hooks for ArcGIS integration
  - UUID generation and property comparison utilities

## 📋 Documentation Format

Each external API documentation file follows a consistent JSON structure:

```json
{
  "class": "ClassName",
  "description": "Brief description of the external API",
  "props": {
    "propName": "Description of prop"
  },
  "callbacks": {
    "callbackName": "Description of callback"
  },
  "methods": {
    "methodName": "Brief description of what the method does"
  }
}
```

## 🎯 Usage for External Consumers

### For Developers
- **API Reference**: Quick lookup for external APIs
- **Integration Guide**: Understand available external utilities
- **Component Props**: Learn all available props and their purposes
- **Callback Events**: Understand when and how callbacks are triggered
- **View Modes**: Configure different viewer modes (3D, 2D, ArcGIS, etc.)

### For Documentation Generation
- **External API Docs**: Generate external-facing documentation
- **Integration Examples**: Create integration guides
- **SDK Documentation**: Build SDK documentation

## 🔧 Adding New External Documentation

When adding documentation for new external APIs:

1. Create a new `.api.json` file in this directory
2. Follow the established format and structure
3. Keep descriptions concise but informative
4. Include all public methods and properties
5. Update this README with the new entry

## 📚 Related Files

- Source files are located in `../../src/` directory
- Internal documentation is located in `../internal/` (parent directory)
- External APIs are exposed through the main package exports

## 🚀 External API Guidelines

- **Stability**: External APIs should be stable and well-documented
- **Backward Compatibility**: Changes should maintain backward compatibility
- **Clear Interfaces**: APIs should have clear, intuitive interfaces
- **Comprehensive Documentation**: All external methods should be documented

## 📖 External API Categories

- **Main Components**: Primary React components for integration
- **Viewer Management**: Utilities for managing viewer instances
- **Command Building**: Tools for building viewer commands
- **DOM Integration**: DOM element management and IDs
- **React Integration**: React hooks and utilities
