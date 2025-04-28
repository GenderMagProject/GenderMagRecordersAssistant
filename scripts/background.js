// /*
//  * File Name: background.js
//  * Functions : inContent
//  * Description : Behavior of the code as a chrome extension are through the chrome API.
// */

// // Function to take a screenshot and render it in the content script
// function takeScreenShot() {
//     return new Promise((resolve, reject) => {
//         chrome.windows.getCurrent((win) => {
//             if (chrome.runtime.lastError) {
//                 console.error("Error getting current window:", chrome.runtime.lastError);
//                 reject(chrome.runtime.lastError);
//                 return;
//             }

//             chrome.tabs.captureVisibleTab(win.id, { format: "png" }, (imgUrl) => {
//                 if (chrome.runtime.lastError) {
//                     console.error("Error capturing tab:", chrome.runtime.lastError);
//                     reject(chrome.runtime.lastError);
//                     return;
//                 }

//                 chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//                     if (chrome.runtime.lastError) {
//                         console.error("Error querying tabs:", chrome.runtime.lastError);
//                         reject(chrome.runtime.lastError);
//                         return;
//                     }

//                     if (tabs.length > 0) {
//                         // Inject the render logic into the active tab
//                         chrome.scripting.executeScript(
//                             {
//                                 target: { tabId: tabs[0].id },
//                                 func: (imageUrl) => {
//                                     // This code runs in the content script context
//                                     if (typeof renderImage === "function") {
//                                         renderImage(imageUrl);
//                                     } else {
//                                         console.error("Render function not available.");
//                                     }
//                                 },
//                                 args: [imgUrl], // Pass the image URL to the content script
//                             },
//                             (injectionResults) => {
//                                 if (chrome.runtime.lastError) {
//                                     console.error("Error injecting script:", chrome.runtime.lastError);
//                                     reject(chrome.runtime.lastError);
//                                 } else {
//                                     console.log("Screenshot logic completed successfully.");
//                                     resolve();
//                                 }
//                             }
//                         );
//                     } else {
//                         console.error("No active tabs found.");
//                         reject(new Error("No active tabs found."));
//                     }
//                 });
//             });
//         });
//     });
// }

// // Listener for messages to trigger the screenshot process
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.greeting === "takeScreenShot") {
//         console.log("Received request to take a screenshot");

//         takeScreenShot()
//             .then(() => {
//                 sendResponse({ status: "success" });
//             })
//             .catch((error) => {
//                 sendResponse({ status: "error", error: error.message });
//             });

//         // Return true to indicate asynchronous response
//         return true;
//     }
// });

// /* Send request to current tab when page action is clicked */
// chrome.action.onClicked.addListener(function (tab) {
//     // Inject the content script
//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         func: function () {
//             const slideout = document.getElementById('slideout');
//             const gmFrame = document.getElementById('GenderMagFrame');
//             if (slideout.style.display === 'none') {
//                 slideout.style.display = '';
//                 gmFrame.style.display = '';
//             } else if (!statusIsTrue("sliderIsOpen")) {
//                 slideout.style.display = 'none';
//                 gmFrame.style.display = 'none';
//             }
//         }
//     });
// });
