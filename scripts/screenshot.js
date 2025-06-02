
// // function takeScreenShot() {
// // 	//console.log("screen shot");
	
// // 	/*Gets the current window, sets format of capture to be png, gets all tabs that are active and the current window
// // 	and sends a message to the content script(s) in the specified tab (tabs[0].id?)*/
// // 	chrome.windows.getCurrent(function (win) {    
// //     	chrome.tabs.captureVisibleTab(win.id,{"format": "png"}, function(imgUrl) {	
// //     	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
// // 			chrome.tabs.sendMessage(tabs[0].id, {callFunction: "renderImage", imageUrl: imgUrl}, function(response) {
// // 				//console.log(response.farewell);
// // 			});
// // 		});
// // 		});
// // 	});
// // };


// // Listen for messages from the background script
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.callFunction === "takeScreenShot") {
//         console.log("Received request to take screenshot in screenshot.js");

//         chrome.windows.getCurrent((win) => {
//             if (chrome.runtime.lastError) {
//                 console.error("Error getting current window:", chrome.runtime.lastError);
//                 sendResponse({ status: "error", error: chrome.runtime.lastError.message });
//                 return;
//             }

//             chrome.tabs.captureVisibleTab(win.id, { format: "png" }, (imgUrl) => {
//                 if (chrome.runtime.lastError) {
//                     console.error("Error capturing tab:", chrome.runtime.lastError);
//                     sendResponse({ status: "error", error: chrome.runtime.lastError.message });
//                     return;
//                 }

//                 chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//                     if (chrome.runtime.lastError) {
//                         console.error("Error querying tabs:", chrome.runtime.lastError);
//                         sendResponse({ status: "error", error: chrome.runtime.lastError.message });
//                         return;
//                     }

//                     if (tabs.length > 0) {
//                         chrome.tabs.sendMessage(
//                             tabs[0].id,
//                             { callFunction: "renderImage", imageUrl: imgUrl },
//                             (response) => {
//                                 if (chrome.runtime.lastError) {
//                                     console.error("Error sending message to content script:", chrome.runtime.lastError);
//                                     sendResponse({ status: "error", error: chrome.runtime.lastError.message });
//                                 } else {
//                                     console.log("Screenshot logic completed successfully.");
//                                     sendResponse({ status: "success" });
//                                 }
//                             }
//                         );
//                     } else {
//                         console.error("No active tabs found.");
//                         sendResponse({ status: "error", error: "No active tabs found." });
//                     }
//                 });
//             });
//         });

//         // Return true to indicate asynchronous response
//         return true;
//     }
// });




