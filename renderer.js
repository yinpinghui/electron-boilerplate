const { ipcRenderer } = require('electron')
let webview = document.getElementById("cashier");
webview.addEventListener("dom-ready", function(){
    webview.executeJavaScript('injectJS.domreadyFunction()');
    webview.openDevTools()
})
webview.addEventListener('ipc-message', (e)=>{
    console.log(e)
    console.log(e.args[0])
    let {evt,value} = e.args[0];
    ipcRenderer.send(evt,value)
});

// webview.addEventListener('crashed', ()=>{
//     webview.reload();
//     console.error("webview is crashed and reload,process")
// });
// webview.addEventListener('plugin-crashed',()=>{
//     webview.reload();
//     console.error("plugin is crashed and reload,plugin")
// })
// webview.addEventListener('gpu-crashed',()=>{
//     webview.reload();
//     console.error("gpu is crashed and reload,gpu")
// })
