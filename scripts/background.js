// /*
//  * File Name: background.js
//  * Functions : inContent
//  * Description : Behavior of the code as a chrome extension are through the chrome API.
// */

// var screenShotURL;
// 	/*Put page action icon on all tabs*/
// 	chrome.tabs.onUpdated.addListener(function(tabId) {
// 		chrome.pageAction.show(tabId);
// 	});

// 	// chrome.tabs.getSelected(null, function(tab) {
// 	// 	chrome.pageAction.show(tab.id);
// 	// });
// 	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     if (tabs.length > 0) {
//         chrome.pageAction.show(tabs[0].id);
//     }
// });


// 	chrome.runtime.onMessage.addListener(
// 		function(request, sender, sendResponse) {
// 			if (request.greeting == "takeScreenShot"){	
// 			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   			//	chrome.tabs.sendMessage(tabs[0].id, {callFunction: "renderImage"}, function(response) { });
// 			});
// 				takeScreenShot();
// 				//chrome.extension.getBackgroundPage().console.log("After image");		
// 				console.log("After image");
			
// 		}});
	
// 	/*Send request to current tab when page action is clicked*/
// 	chrome.pageAction.onClicked.addListener(function(tab) { // Handles the functionality of when the extension icon in the topbar is clicked.
// 		// toggle the visibility of slideout
// 		chrome.tabs.executeScript({ code: `(${ inContent })()` });
// /*
//  * Function Name: inContent
//  * Description : Hiding and showing the chrome extension when the button in the browser header is clicked.
//  * Params : none
// */
// 		function inContent() {
// 			const slideout = document.getElementById('slideout');
// 			const gmFrame = document.getElementById('GenderMagFrame');
//   			if (slideout.style.display == 'none'){
// 				  slideout.style.display = '';
// 				  gmFrame.style.display = '';
//   			}
//   			// if the slider is not already open, hide the slideout
//   			else if (!statusIsTrue("sliderIsOpen")){
// 				  slideout.style.display = 'none';
// 				  gmFrame.style.display = 'none';
//   			}
// 		}
// 		/* Alternate option: link to the GitHub
// 		window.open("https://github.com/mendezc1/GenderMagRecordersAssistant");
// 		*/
// 		});

/*
 * File Name: background.js
 * Description : Behavior of the code as a chrome extension is handled through the chrome API.
 */
//importScripts('scripts/screenshot.js');
/* Put page action icon on all tabs */
// chrome.tabs.onUpdated.addListener(function (tabId) {
//     chrome.action.show(tabId);
// });

// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     if (tabs  && tabs.length > 0) {
//         chrome.action.show(tabs[0].id);
//     }
// });
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if (request.greeting === "takeScreenShot") {
//         console.log("Screenshot request received in background.js");

//         takeScreenShot()
//             .then(() => {
//                 sendResponse({ status: "screenshot completed" });
//             })
//             .catch((error) => {
//                 console.error("Error during screenshot:", error);
//                 sendResponse({ status: "error", error: error.message });
//             });

//         return true; // Keeps the message channel open for asynchronous tasks
//     }
// });

//mv3 update -- correct working code
// Background script for handling messages and screenshot functionality

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.greeting === "takeScreenShot") {
//       console.log("Received request to take a screenshot");
  
//       takeScreenShot()
//         .then(() => {
//           console.log("Screenshot process completed successfully");
//           sendResponse({ status: "screenshot started" });
//         })
//         .catch((error) => {
//           console.error("Error taking screenshot:", error);
//           sendResponse({ status: "error", error: error.message });
//         });
  
//       // Return true to indicate asynchronous response
//       return true;
//     }
//   });
  

// Screenshot function

// function takeScreenShot() {
//     return new Promise((resolve, reject) => {
//       chrome.windows.getCurrent((win) => {
//         if (chrome.runtime.lastError) {
//           console.error("Error getting current window:", chrome.runtime.lastError);
//           reject(chrome.runtime.lastError);
//           return;
//         }
  
//         chrome.tabs.captureVisibleTab(win.id, { format: "png" }, (imgUrl) => {
//           if (chrome.runtime.lastError) {
//             console.error("Error capturing tab:", chrome.runtime.lastError);
//             reject(chrome.runtime.lastError);
//             return;
//           }
  
//           chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//             if (chrome.runtime.lastError) {
//               console.error("Error querying tabs:", chrome.runtime.lastError);
//               reject(chrome.runtime.lastError);
//               return;
//             }
  
//             if (tabs.length > 0) {
//               chrome.tabs.sendMessage(
//                 tabs[0].id,
//                 { callFunction: "renderImage", imageUrl: imgUrl },
//                 (response) => {
//                   if (chrome.runtime.lastError) {
//                     console.error("Error sending message to content script:", chrome.runtime.lastError);
//                     reject(chrome.runtime.lastError);
//                   } else {
//                     resolve();
//                   }
//                 }
//               );
//             } else {
//               reject(new Error("No active tabs found."));
//             }
//           });
//         });
//       });
//     });
//   }
// Function to take a screenshot and render it in the content script
function takeScreenShot() {
    return new Promise((resolve, reject) => {
        chrome.windows.getCurrent((win) => {
            if (chrome.runtime.lastError) {
                console.error("Error getting current window:", chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
                return;
            }

            chrome.tabs.captureVisibleTab(win.id, { format: "png" }, (imgUrl) => {
                if (chrome.runtime.lastError) {
                    console.error("Error capturing tab:", chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                    return;
                }
                console.log("Captured screenshot, sending to overlay.js");

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error querying tabs:", chrome.runtime.lastError);
                        reject(chrome.runtime.lastError);
                        return;
                    }

                    if (tabs.length > 0) {
                        // Inject the render logic into the active tab
                        chrome.scripting.executeScript(
                            {
                                target: { tabId: tabs[0].id },
                                func: (imageUrl) => {
                                    // This code runs in the content script context
                                    console.log("In background , checking wats imageURL",imageUrl)
                                    if (typeof renderImage === "function") {
                                        renderImage(imageUrl);
                                    } else {
                                        console.error("Render function not available.");
                                    }
                                },
                                args: [imgUrl], // Pass the image URL to the content script
                            },
                            (injectionResults) => {
                                if (chrome.runtime.lastError) {
                                    console.error("Error injecting script:", chrome.runtime.lastError);
                                    reject(chrome.runtime.lastError);
                                } else {
                                    console.log("Screenshot logic completed successfully.");
                                    resolve();
                                }
                            }
                        );

                        // Send message to overlay.js (content script) to store the image in localStorage
                        chrome.tabs.sendMessage(
                            tabs[0].id,
                            { callFunction: "renderImage", imageUrl: imgUrl },
                            (response) => {
                                if (chrome.runtime.lastError) {
                                    console.error("Error sending message to overlay.js:", chrome.runtime.lastError);
                                } else if (response && response.status === "success") {
                                    console.log("Message processed successfully in overlay.js.");
                                } else {
                                    console.error("Unexpected response from overlay.js.");
                                }
                            }
                        );
                        
                    } else {
                        console.error("No active tabs found.");
                        reject(new Error("No active tabs found."));
                    }
                });
            });
        });
    });
}

// Listener for messages to trigger the screenshot process
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.greeting === "takeScreenShot") {
        console.log("Received request to take a screenshot");

        takeScreenShot()
            .then(() => {
                sendResponse({ status: "success" });
            })
            .catch((error) => {
                sendResponse({ status: "error", error: error.message });
            });

        // Return true to indicate asynchronous response
        return true;
    }
});



/* Send request to current tab when page action is clicked */
chrome.action.onClicked.addListener(function (tab) {
    // Inject the content script
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: function () {
            const slideout = document.getElementById('slideout');
            const gmFrame = document.getElementById('GenderMagFrame');
            if (slideout.style.display === 'none') {
                slideout.style.display = '';
                gmFrame.style.display = '';
            } else if (!statusIsTrue("sliderIsOpen")) {
                slideout.style.display = 'none';
                gmFrame.style.display = 'none';
            }
        }
    });
});
