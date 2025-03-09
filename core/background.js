/*
 * File Name: background.js
 * Description: Handles background functionality of the Chrome extension using the Chrome API.
 * Last Modified: 2025-03-05 by Bhavika Madhwani (madhwanb@oregonstate.edu)
 */

/* Function Name: takeScreenShot
 * Description: Takes a screenshot of the current tab and renders it in the content script.
 * Parameters: None
 * Returns: Promise that resolves when the screenshot is successfully taken and rendered.
 * Last Modified: 2025-03-05 by Bhavika Madhwani (madhwanb@oregonstate.edu)
 */
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
                    } else {
                        console.error("No active tabs found.");
                        reject(new Error("No active tabs found."));
                    }
                });
            });
        });
    });
}

/* Function Name: chrome.runtime.onMessage.addListener
 * Description: Listens for messages to trigger the screenshot process.
 * Parameters: 
 *      request - the message sent
 *      sender - the sender of the message
 *      sendResponse - function to send a response back to the sender
 * Last Modified: 2025-03-05 by Bhavika Madhwani (madhwanb@oregonstate.edu)
 */
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

/* Function Name: chrome.action.onClicked.addListener
 * Description: Toggles the visibility of the 'slideout' and 'GenderMagFrame' elements in the content script
 *              when the page action icon is clicked.
 * Parameters: 
 *      tab - the tab where the page action was clicked
 * Last Modified: 2025-03-05 by Bhavika Madhwani (madhwanb@oregonstate.edu)
 */
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
