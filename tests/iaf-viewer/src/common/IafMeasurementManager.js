// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 19-01-24    HSK        PLAT-3446   Define and demonstrate reusable Measurement Json Object (3d and 2d)
// -------------------------------------------------------------------------------------


export default class IafMeasurementManager {
    constructor(viewer,storageKey, projectId){
      this._viewer = viewer;
      this._storageKey = storageKey;
      this._projectId = projectId
    }
  
    getExportKey = () => {
      return this._storageKey;
    }

    get() {
      return this._viewer.measureManager.exportMarkup();
    }

    // // Save measuremenets
    // saveMeasurement() {
    //   const measurements = this._viewer.measureManager.exportMarkup();
    //   const measureData = JSON.parse(localStorage.getItem(this._storageKey));
    //   localStorage.setItem(this._storageKey, JSON.stringify({[this._projectId]: measurements, ...measureData})); // add measurementss
    //   return this._storageKey;
    // }

    load(measureData) {
      this.reset();
      measureData && this._viewer.measureManager.loadData(measureData);
    }
    //Apply Measurements
    // applySavedMeasurement(){
    //   const savedMeasurementDetails = JSON.parse(localStorage.getItem(this._storageKey))
    //   const measureData = savedMeasurementDetails && savedMeasurementDetails[this._projectId];
    //   this.load(measureData);
    // }


    // Clear and Delete all Measurement
    reset(){
        this._viewer && this._viewer.measureManager.removeAllMeasurements();
    }

    // clearMeasurementsLocalStorage(){
    //   const measureData = JSON.parse(localStorage.getItem(this._storageKey));
    //   if(measureData){
    //     delete measureData[this._projectId];
    //   localStorage.setItem(this._storageKey, JSON.stringify({...measureData}));
    //   }
    // }
  }
  
  