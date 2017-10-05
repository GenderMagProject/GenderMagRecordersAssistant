//console.log( 'Background.html starting!' );
var screenShotURL;
	/*Put page action icon on all tabs*/
	chrome.tabs.onUpdated.addListener(function(tabId) {
		chrome.pageAction.show(tabId);
	});

	chrome.tabs.getSelected(null, function(tab) {
		chrome.pageAction.show(tab.id);
	});
	

	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.greeting == "takeScreenShot"){	
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  			//	chrome.tabs.sendMessage(tabs[0].id, {callFunction: "renderImage"}, function(response) { });
			});
				takeScreenShot();
				chrome.extension.getBackgroundPage().console.log("After image");		
			
		}});
	
	/*Send request to current tab when page action is clicked*/
	chrome.pageAction.onClicked.addListener(function(tab) {
		chrome.tabs.executeScript(null, { file: "./jquery-ui-1.11.4.custom/jquery.js" }, function() {
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendRequest(
					//Selected tab id
					tab.id,
					//Params inside a object data
					{callFunction: "toggleSidebar"}, 
					//Optional callback function
					function(response) {
						//console.log(response);
					}
				);
			});
		});
	});
//console.log( 'Background.html done.' );
