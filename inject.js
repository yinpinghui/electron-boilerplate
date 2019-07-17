const { ipcRenderer } = require('electron')
injectJS = {
  domreadyFunction: function () {
    console.log("webview dom is ready")
    ipcRenderer.on("printtest", (event,arg) =>{
        let data = arg
        console.log("msg from webview is ",data)
    });
    
    
    window.sendToElectron= function (data) {      
      console.log(encodeURIComponent(JSON.stringify(data)))  
      ipcRenderer.sendToHost("default_channel",encodeURIComponent(JSON.stringify(data)));
    }
  }
}