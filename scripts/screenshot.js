
function takeScreenShot() {
	//console.log("screen shot");
	chrome.windows.getCurrent(function (win) {    
    	chrome.tabs.captureVisibleTab(win.id,{"format": "png"}, function(imgUrl) {	
    	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {callFunction: "renderImage", imageUrl: imgUrl}, function(response) {
				console.log(response.farewell);
			});
		});
		});
		/*
        	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				//chrome.extension.getBackgroundPage().console.log("Rendering image", imgUrl);	
  				//chrome.tabs.sendMessage(tabs[0].id, {callFunction: "renderImage", imageUrl: imgUrl}, function(response) { });
				
				chrome.runtime.sendMessage(tabs[0].id, {callFunction: "renderImage", imageURL: imgUrl}, function(response) {});
				
				chrome.extension.getBackgroundPage().console.log("Image rendered");	
			});
        	//window.open(imgUrl);       	
        });    */
	});
};