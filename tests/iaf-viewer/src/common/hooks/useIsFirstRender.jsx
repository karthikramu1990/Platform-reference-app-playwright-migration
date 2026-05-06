import { useRef, useEffect } from 'react';
import { Colors } from './colors';
import IafUtils from "../../core/IafUtils.js";

export const useIsFirstRender = (title, props) => {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      IafUtils.devToolsIaf && console.log(Colors.green, title, '- FIRST RENDER -', props);
    } else {
      // console.log(title, 'This is a subsequent render.');
    }

    // After the first render, set the ref to false
    isFirst.current = false;
  }, []);

  return isFirst.current;
};

// import { useRef, useEffect } from 'react';

// export const useIsFirstRender = (title, props) => {
//   const isFirst = useRef(true);

//   useEffect(() => {
//     // After the first render, set the ref to false
//     isFirst.current = false;
//     console.log(title, 'First render');
//   }, []);

//   useEffect(() => {
//     if (isFirst.current) {
//       console.log(title, 'First render');
//     } else {
//     console.log(title, 'Subsequent render');
//     }
//   }, [props]);  // Add dependencies here to check when props change

//   return isFirst.current;
// };
