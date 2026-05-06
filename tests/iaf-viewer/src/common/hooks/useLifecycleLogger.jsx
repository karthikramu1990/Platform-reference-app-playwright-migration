import { useEffect } from 'react';
import { Colors } from './colors';
import IafUtils from "../../core/IafUtils.js";

const useLifecycleLogger = (title, componentName) => {
  useEffect(() => {
    IafUtils.devToolsIaf && console.log(Colors.yellow, title, `${componentName} is created`); // Log when component is created

    return () => {
      IafUtils.devToolsIaf && console.log(Colors.yellow, title, `${componentName} is destroyed`); // Log when component is destroyed
    };
  }, [componentName]); // Runs on mount and unmount
};

export default useLifecycleLogger;
