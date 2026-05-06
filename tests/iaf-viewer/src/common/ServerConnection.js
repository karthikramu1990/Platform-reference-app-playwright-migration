
//retired, this idea is from Hoops Communicator tutorial to check if
//HC server connection works first and get websocket connection URI

export default class ServerConnection {
    constructor(endpoint) {
      this._endpoint = endpoint;
    }
    
    connect() {
      let _this = this;
      let request = new XMLHttpRequest();
      request.open("POST", this._endpoint + "/service");
      request.overrideMimeType("application/json");
      request.setRequestHeader("Content-Type", "application/json");
      request.timeout = 60000;
      let promise = new Promise(function (resolve, reject) {
        request.onreadystatechange = function () {
          if (request.readyState == 4) {
            if (request.status == 200) {
              resolve(_this.parseServerSuccessResponse(request.responseText));
            }
            else {
              reject(alert("Couldn't Connect"));
            }
          }
        };
        
        request.send('{"class":"csr_session","params":{}}');
      });
      
      return promise;
    }
    
    parseServerSuccessResponse(text) {
      this._jsonResponse = JSON.parse(text);
      this._endpointuri =  this._jsonResponse.endpoints["ws"];
    }
  }