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
		// toggle the visibility of slideout
		chrome.tabs.executeScript({ code: `(${ inContent })()` });
		function inContent() {
			const slideout = document.getElementById('slideout');
			const gmFrame = document.getElementById('GenderMagFrame');
  			if (slideout.style.display == 'none'){
				  slideout.style.display = '';
				  gmFrame.style.display = '';
  			}
  			// if the slider is not already open, hide the slideout
  			else if (!statusIsTrue("sliderIsOpen")){
				  slideout.style.display = 'none';
				  gmFrame.style.display = 'none';
  			}
		}
		/* Alternate option: link to the GitHub
		window.open("https://github.com/mendezc1/GenderMagRecordersAssistant");
		*/
		
		//TODO: Think about creating open/close function and call it here?
		/*OLD CODE HERE DON'T DELETE UNTIL TO DO IS RESOLVED*/
		//chrome.tabs.executeScript(null, { file: "./jquery-ui-1.12.1/jquery.js" }, function() {
			//chrome.tabs.getSelected(null, function(tab) {
			//chrome.runtime.sendMessage(tab.id, {callFunction: "toggleSidebar"}, function(response) {});
			
			//});
				/*
				chrome.tabs.sendRequest(
					//Selected tab id
					tab.id,
					//Params inside a object data
					{callFunction: "toggleSidebar"}, 
					//Optional callback function
					function(response) {
						//console.log(response);
					}*/
			//});
		/* END OLD CODE*/
		});
