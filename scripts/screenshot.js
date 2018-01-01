
function takeScreenShot() {
	//console.log("screen shot");
	chrome.windows.getCurrent(function (win) {    
    	chrome.tabs.captureVisibleTab(win.id,{"format": "png"}, function(imgUrl) {	
    	
        	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.extension.getBackgroundPage().console.log("Rendering image");	
  				//chrome.tabs.sendMessage(tabs[0].id, {callFunction: "renderImage", imageUrl: imgUrl}, function(response) { });
				chrome.runtime.sendMessage(null, tabs[0].id, {callFunction: "renderImage", imageURL: imgURL}, function(response) {})
				
				chrome.extension.getBackgroundPage().console.log("Image rendered");	
			});
        	//window.open(imgUrl);       	
        });    
	});
};