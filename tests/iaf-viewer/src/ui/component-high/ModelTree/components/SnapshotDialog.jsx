import React from 'react';

const SnapshotDialog = () => {
  return (
    <div id="snapshot-dialog" className="hoops-ui-window">
      <div className="hoops-ui-window-header">Snapshot</div>
      <div className="hoops-ui-window-body">
        <img id="snapshot-dialog-image" className="snapshot-image" alt="Snapshot" />
        <div className="snapshot-text">Right Click to Save image</div>
      </div>
      <div className="hoops-ui-window-footer">
        <div className="hoops-ui-footer-buttons">
          <button id="snapshot-dialog-cancel-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default SnapshotDialog; 