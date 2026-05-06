export default class IafSavedViews {
    constructor() {
      this.savedViews = [];
    }
  
    // Save the current camera view
    saveView(camera) {
      const view = camera.toJson();
      this.savedViews.push(view);
      return view;
    }
  
    // Restore a previously saved camera view
    restoreView(camera, index) {
      this.savedViews[index] = camera.toJson();
    }
  
    // Clear all saved views
    clearViews() {
      this.savedViews = [];
    }
    
    // get all views or view on provided index
    getViews(index){
        if (index) return this.savedViews[index];
        else return this.savedViews
    }
  }
  
  