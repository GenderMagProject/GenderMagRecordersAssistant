/*
 * File Name: background.js
 * Description: Handles background functionality of the Chrome extension using the Chrome API.
 * Last Modified: 2025-03-05 by Bhavika Madhwani (madhwanb@oregonstate.edu)
 */

importScripts("errorHandler.js");

function buildBackgroundErrorPayload(code, userMessage, technicalMessage, error, details) {
    return {
        code: code,
        source: "core/background.js",
        userMessage: userMessage,
        technicalMessage: technicalMessage,
        error: error,
        details: details || {}
    };
}

function relayBackgroundError(payload, preferredTabId) {
    function sendToTab(tabId) {
        if (!tabId || !chrome.tabs || !chrome.tabs.sendMessage) {
            return;
        }

        chrome.tabs.sendMessage(tabId, {
            type: "gm:extensionError",
            payload: payload
        }, function () {
            if (chrome.runtime && chrome.runtime.lastError) {
                // No-op: some pages cannot receive extension UI messages.
            }
        });
    }

    if (preferredTabId) {
        sendToTab(preferredTabId);
        return;
    }

    if (!chrome.tabs || !chrome.tabs.query) {
        return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (chrome.runtime && chrome.runtime.lastError) {
            return;
        }

        if (tabs && tabs.length > 0) {
            sendToTab(tabs[0].id);
        }
    });
}

function rejectScreenshotFailure(reject, code, userMessage, technicalMessage, error, details) {
    reject({
        code: code,
        userMessage: userMessage,
        technicalMessage: technicalMessage,
        errorMessage: error && error.message ? error.message : String(error || ""),
        details: details || {}
    });
}

function exposeSessionStorageToContentScripts() {
    if (!chrome.storage || !chrome.storage.session || !chrome.storage.session.setAccessLevel) {
        return;
    }

    chrome.storage.session.setAccessLevel(
        { accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS" },
        () => {
            if (chrome.runtime.lastError) {
                relayBackgroundError(buildBackgroundErrorPayload(
                    "SESSION_STORAGE_ACCESS_FAILED",
                    "The extension could not enable session storage for this page. Session recovery may not work correctly until you refresh.",
                    "Failed to expose session storage to content scripts.",
                    chrome.runtime.lastError
                ));
            }
        }
    );
}

exposeSessionStorageToContentScripts();
chrome.runtime.onStartup.addListener(exposeSessionStorageToContentScripts);
chrome.runtime.onInstalled.addListener(exposeSessionStorageToContentScripts);

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
                rejectScreenshotFailure(
                    reject,
                    "SCREENSHOT_WINDOW_LOOKUP_FAILED",
                    "The extension could not determine which window to capture.",
                    "Failed to get the current window before taking a screenshot.",
                    chrome.runtime.lastError
                );
                return;
            }

            chrome.tabs.captureVisibleTab(win.id, { format: "png" }, (imgUrl) => {
                if (chrome.runtime.lastError) {
                    rejectScreenshotFailure(
                        reject,
                        "SCREENSHOT_CAPTURE_FAILED",
                        "The extension could not capture a screenshot on this page.",
                        "Failed to capture the active tab screenshot.",
                        chrome.runtime.lastError
                    );
                    return;
                }

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (chrome.runtime.lastError) {
                        rejectScreenshotFailure(
                            reject,
                            "SCREENSHOT_TAB_QUERY_FAILED",
                            "The extension could not locate the active tab after taking the screenshot.",
                            "Failed to locate the active tab for screenshot rendering.",
                            chrome.runtime.lastError
                        );
                        return;
                    }

                    if (tabs.length > 0) {
                        // Inject the render logic into the active tab
                        chrome.scripting.executeScript(
                            {
                                target: { tabId: tabs[0].id },
                                func: (imageUrl) => {
                                    if (typeof renderImage === "function") {
                                        renderImage(imageUrl);
                                        return { rendered: true };
                                    }

                                    return {
                                        rendered: false,
                                        reason: "renderImage function was not available in the page context."
                                    };
                                },
                                args: [imgUrl],
                            },
                            (injectionResults) => {
                                if (chrome.runtime.lastError) {
                                    rejectScreenshotFailure(
                                        reject,
                                        "SCREENSHOT_RENDER_INJECTION_FAILED",
                                        "The extension captured the screenshot but could not open the preview window.",
                                        "Failed to inject the screenshot preview into the active tab.",
                                        chrome.runtime.lastError
                                    );
                                    return;
                                }

                                var firstResult = injectionResults && injectionResults[0] && injectionResults[0].result
                                    ? injectionResults[0].result
                                    : null;

                                if (!firstResult || firstResult.rendered !== true) {
                                    rejectScreenshotFailure(
                                        reject,
                                        "SCREENSHOT_RENDER_FUNCTION_MISSING",
                                        "The extension captured the screenshot but could not display the preview window.",
                                        "The screenshot preview function was not available in the page context.",
                                        new Error(firstResult && firstResult.reason ? firstResult.reason : "renderImage function missing.")
                                    );
                                    return;
                                }

                                resolve();
                            }
                        );
                    } else {
                        rejectScreenshotFailure(
                            reject,
                            "SCREENSHOT_NO_ACTIVE_TAB",
                            "The extension could not find the active tab to display the screenshot preview.",
                            "No active tab was found for screenshot rendering.",
                            new Error("No active tabs found.")
                        );
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
    if (request && request.type === "gm:getTabContext") {
        sendResponse({
            tabId: sender.tab ? sender.tab.id : null,
            windowId: sender.tab ? sender.tab.windowId : null,
            active: sender.tab ? sender.tab.active : false
        });
        return false;
    }

    if (request && request.greeting === "takeScreenShot") {
        takeScreenShot()
            .then(() => {
                sendResponse({ status: "success" });
            })
            .catch((error) => {
                sendResponse({
                    status: "error",
                    code: error && error.code ? error.code : "SCREENSHOT_UNKNOWN_FAILURE",
                    userMessage: error && error.userMessage ? error.userMessage : "The extension could not capture a screenshot on this page.",
                    technicalMessage: error && error.technicalMessage ? error.technicalMessage : "Screenshot capture failed.",
                    error: error && error.errorMessage ? error.errorMessage : "",
                    details: error && error.details ? error.details : {}
                });
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
            } else if (!isSliderOpenInSession()) {
                slideout.style.display = 'none';
                gmFrame.style.display = 'none';
            }
        }
    }, function () {
        if (chrome.runtime.lastError) {
            relayBackgroundError(buildBackgroundErrorPayload(
                "ACTION_PANEL_TOGGLE_FAILED",
                "The extension could not open on this page.",
                "Failed to inject the panel toggle code into the active tab.",
                chrome.runtime.lastError,
                { tabId: tab && tab.id ? tab.id : null }
            ), tab && tab.id ? tab.id : null);
        }
    });
});
