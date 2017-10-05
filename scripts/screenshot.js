
function takeScreenShot() {
	//console.log("screen shot");
	chrome.windows.getCurrent(function (win) {    
    	chrome.tabs.captureVisibleTab(win.id,{"format": "png"}, function(imgUrl) {	
    	
        	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  				chrome.tabs.sendMessage(tabs[0].id, {callFunction: "renderImage", imageUrl: imgUrl}, function(response) { });
			});
        	//window.open(imgUrl);       	
        });    
	});
};