import { useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal';
import { Colors } from './colors';
import IafUtils from "../../core/IafUtils.js";

const _compareProperties = ({
    title = "", 
    prevObject, 
    newObject, 
    onAddedCb = null,
    onRemovedCb = null,
    onChangedCb = null,
    path = '', 
    hasChanged = false,
    enableLogs = true,
    excludeProps = []
  }
) => {
  let changesDetected = hasChanged;  // Flag to track if something has changed

  let added = [];
  let removed = [];
  let changed = [];

  try {
  newObject && Object.keys(newObject).forEach(key => {
      if (excludeProps.includes(key)) return;

      const currentPath = path ? `${path}[${key}]` : key;

      // Check if the key exists in the previous object
      if (!prevObject || !(key in prevObject)) {
        added.push(key);
      //   console.log(title, `New property added: ${currentPath}`, newObject[key]);
        enableLogs && IafUtils.devToolsIaf && console.log(title, ', New property added,', currentPath, '=', newObject[key]);
        onAddedCb && onAddedCb(currentPath, newObject[key]);
        changesDetected = true;
      } else if (!isEqual(prevObject[key], newObject[key])) {
        // If the property is an object or array, recurse
        if (typeof newObject[key] === 'object' && newObject[key] !== null) {
          changesDetected = _compareProperties({
            title, 
            prevObject: prevObject[key], 
            newObject: newObject[key], 
            onAddedCb,
            onRemovedCb,
            onChangedCb,
            path: currentPath, 
            hasChanged: changesDetected, 
            enableLogs,
            excludeProps
          });
        } else {
          // console.log(title, `Property changed: ${currentPath}, Old Value: ${prevObject[key]}, New Value: ${newObject[key]}`);
          enableLogs && IafUtils.devToolsIaf && console.log(title, ', Property changed from', currentPath, '=', prevObject[key], 'to', currentPath, '=', newObject[key]);
          onChangedCb && onAddedCb(currentPath, prevObject[key], newObject[key]);
          changed.push(key);
          changesDetected = true;
        }
      }
    });        
  } catch (error) {
    IafUtils.devToolsIaf && console.log(title, path, 'newObject', 'error', error);
  }

  // Check for properties that were removed
  try {
  prevObject && Object.keys(prevObject).forEach(key => {
  if (!newObject || !(key in newObject)) {
      const currentPath = path ? `${path}[${key}]` : key;
      removed.push(key);
      enableLogs && IafUtils.devToolsIaf && console.log(title, ', Property removed,', currentPath, '=', prevObject[key]);
      onRemovedCb && onRemovedCb(currentPath, prevObject[key]);
      changesDetected = true;
      // console.log(title, `Property removed: ${currentPath}`, prevObject[key]);
  }
  });
  } catch (error) {
  IafUtils.devToolsIaf && console.log(title, path, 'newObject', 'error', error);
  }

  return changesDetected;
};

export const useLogChangedProperties = (title, props, excludeProps = ['eventHandler', 'enqueue']) => {
  const prevProps = useRef(props);

  useEffect(() => {
    let hasChanges = _compareProperties({
      title, 
      prevObject: prevProps.current, 
      newObject: props, 
      excludeProps
    });
    hasChanges && IafUtils.devToolsIaf && console.log(Colors.red, title, 'changed from', prevProps.current, 'to', props);

    // Update the previous props after logging changes
    prevProps.current = props;
  }, [props]);
};

export const useLogChangedPropertiesForClass = (
  title, 
  props, 
  prevProps,
  excludeProps=[]
) => {
    let hasChanges = _compareProperties({
      title, 
      prevObject: prevProps, 
      newObject: props, 
      excludeProps
    });
    hasChanges && IafUtils.devToolsIaf && console.log(Colors.red, title, 'changed from', prevProps, 'to', props);
};

export const useFindChangedPropertiesForClass = (
  props, 
  prevProps, 
  onAddedCb ,
  onRemovedCb,
  onChangedCb,
  excludeProps = []
) => {
return _compareProperties({
  prevObject: prevProps, 
  newObject: props, 
  onAddedCb, 
  onRemovedCb, 
  onChangedCb, 
  enableLogs: false, 
  excludeProps
});
};