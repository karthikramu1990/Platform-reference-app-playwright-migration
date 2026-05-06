/*
// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 16-08-24    ATK                    Revised Export/Save of Annotations
// -------------------------------------------------------------------------------------
*/

import React, { useState } from 'react';
import { IafButton } from '../iafButton/IafButton.jsx';
import IafUtils from '../../../core/IafUtils.js';

export function IafImportJson(props) {
  const { backgroundColor, textColor, width, height, disabled }= props;
  const styles = {
    background: backgroundColor,
    border: `1px solid ${backgroundColor}`,
    width:width?width:'100px',
    height:height?height:''
  };

  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);

  const uniqueId = `${IafUtils.generateUUID()}-file`;

  const handleImportJson = () => {
    document.getElementById(uniqueId).click();
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    IafUtils.importJSON(file)
      .then((data) => {
        setJsonData(data); // Set the imported JSON data in the state
        setError(null); // Clear any previous errors
        IafUtils.devToolsIaf && console.log("Imported JSON data:", data);
        if (props.onImport) {
          props.onImport(data); // Call the callback function with the imported data
        }
        return data; // Return the data as part of the promise chain
      })
      .catch((err) => {
        setError(err.message); // Set the error message in the state
        console.error(err);
        if (props.onImport) {
          props.onImport(null, err.message); // Call the callback function with the error
        }
        throw err; // Rethrow the error to propagate it
      });

      event.target.value = null;
  };

  return (
    <>
      <IafButton
            title={props.title} 
            placement={props.tooltipPlacement} 
            toolTipClass={props.tooltipClass}
            tooltipTitle={props.tooltipTitle}
            backgroundColor={props.backgroundColor}
            width={props.width}
            height={props.height}
            onClick={handleImportJson}        
      ></IafButton>
      <input 
        type="file" 
        id={uniqueId}
        accept=".json" 
        onChange={handleFileChange} 
        style={{ display: 'none' }} // Hide the default file input
      />
    </>
  );
}
export default IafImportJson;
