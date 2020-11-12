/*
 * File Name: background.js
 * Functions : inContent
 * Description : Behavior of the code as a chrome extension are through the chrome API.
*/

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
	chrome.pageAction.onClicked.addListener(function(tab) { // Handles the functionality of when the extension icon in the topbar is clicked.
		// toggle the visibility of slideout
		chrome.tabs.executeScript({ code: `(${ inContent })()` });
/*
 * Function Name: inContent
 * Description : Hiding and showing the chrome extension when the button in the browser header is clicked.
 * Params : none
*/
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
		});
