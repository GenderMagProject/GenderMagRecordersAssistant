/*
* File Name: setup.js
* Functions: setup(), initialize()
* Description: Sets up the initial state of the GenderMag bar and initializes the application
*/

var currentGenderMagTabId = null;
var isInactiveSessionMirror = false;

// Initialization logic to run when the DOM is fully loaded
// Last Modified: 2025-03-05 by Bhavika Madhwani (madhwanb@oregonstate.edu)
function initialize() {
    document.addEventListener('DOMContentLoaded', function () {
        console.log("1");
        init();
    });
}

/* Function Name: init
 * Description: Initializes the status object, imports necessary stylesheets, appends the slider template to the body, and sets up event listeners.
 * Parameters: None
 */
function init() {
    console.log("2");

    initStatusObject(function () {
        requestCurrentTabContext(function () {
            registerTabOwnershipHandlers();
            maybeClaimSessionOwnership("init");

            importStylesheet("body", "./styles/slider.css");

            appendTemplateToElement("body", "./templates/slider.html", (error, data) => {
                if (error) {
                    console.error("Error appending slider template:", error);
                    return;
                }

                console.log("Slider template appended successfully.");
                const head = $("#slideout").contents().find("head");
                importStylesheet(head, "/styles/sliderbody.css");
                importStylesheet(head, "/styles/styles.css");
                importStylesheet(head, "/jquery-ui-1.12.1/jquery-ui.css");
                importStylesheet(head, "font-awesome-4.6.1/css/font-awesome.min.css");

                $("#slideout").contents().find("body").append("GenderMag");
                setupSliderToggleClick();
                initializeWalkthroughBar("#GenderMagFrame", "./templates/firstState.html");
                reloadSandwich();
		        console.log("Utilities init execution completed");
            });
        });
    });
}

function requestCurrentTabContext(onReady) {
    if (!chrome.runtime || !chrome.runtime.sendMessage) {
        if (typeof onReady === "function") {
            onReady();
        }
        return;
    }

    chrome.runtime.sendMessage({ type: "gm:getTabContext" }, function (response) {
        if (chrome.runtime.lastError) {
            console.error("Failed to get current tab context:", chrome.runtime.lastError);
        } else if (response && response.tabId !== null && response.tabId !== undefined) {
            currentGenderMagTabId = response.tabId;
        }

        if (typeof onReady === "function") {
            onReady(response);
        }
    });
}

function currentTabOwnsSession(sessionState) {
    if (!sessionState || !sessionState.ui || !sessionState.ui.activeTabId || currentGenderMagTabId === null) {
        return true;
    }

    return sessionState.ui.activeTabId === currentGenderMagTabId;
}

function maybeClaimSessionOwnership(reason) {
    var sessionState = typeof getSessionState === "function" ? getSessionState() : null;
    if (!sessionState || !hasStartedSession(sessionState) || currentGenderMagTabId === null) {
        return;
    }

    if (!sessionState.ui) {
        sessionState.ui = {};
    }

    if (sessionState.ui.activeTabId === currentGenderMagTabId) {
        return;
    }

    if (document.visibilityState !== "visible") {
        return;
    }

    updateSessionState(function (state) {
        if (!state.ui) {
            state.ui = {};
        }
        state.ui.activeTabId = currentGenderMagTabId;
    }, "Claimed session ownership for visible tab.");
}

function registerTabOwnershipHandlers() {
    if (window.__genderMagOwnershipHandlersRegistered) {
        return;
    }

    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") {
            maybeClaimSessionOwnership("visibilitychange");
        }
    });

    window.addEventListener("focus", function () {
        maybeClaimSessionOwnership("focus");
    });

    window.__genderMagOwnershipHandlersRegistered = true;
}

/* Function Name: initializeWalkthroughBar
 * Description: Sets up the initial state of the GenderMag bar with a the passed-in template (which should
 *		be "firstState.html" at this point. Adds onclicks to the two buttons.
 * Parameters: Takes 2 arguments:
 * 		id: the id of the element to which the template will be appended (e.g. '#GenderMargFrame')
 * 		file: the LOCAL path of the template to use (e.g., "/templates/firstState.html")
 * Last Modified: 2025-03-05  by Bhavika Madhwani (madhwanb@oregonstate.edu)
 */
 function initializeWalkthroughBar(targetIframeSelector, templatePath) {
	const hasStarted = hasStartedSession();

	if (hasStarted) {
		restoreWalkthroughState();
	} else {
		renderStartScreen(targetIframeSelector, templatePath);
	}
}

function restoreWalkthroughState() {
	if (!currentTabOwnsSession(getSessionState())) {
		hideInactiveSessionUi();
		return;
	}

	isSliderOpenInSession() ? openSlider() : closeSlider();
	preWalkthrough("#GenderMagFrame", "./templates/popup.html");

	var sessionState = typeof getSessionState === "function" ? getSessionState() : null;
	if (sessionState && sessionState.currentStep) {
		console.log("[sessionState] Attempting walkthrough recovery from currentStep:", sessionState.currentStep);

		if (sessionState.currentStep === "subgoalQuestions" && sessionState.currentSubgoalId) {
			drawSubgoal(sessionState.currentSubgoalId);
			return;
		}

		if (sessionState.currentStep === "actionPrompt" && sessionState.currentSubgoalId && sessionState.currentActionId) {
			drawAction(sessionState.currentActionId, sessionState.currentSubgoalId);
			return;
		}
	}

	if (sessionState && isTooltipStep(sessionState)) {
		reloadToolTipState();
	}
}

function removeFloatingSessionUi() {
	const toolTip = document.getElementById("myToolTip");
	if (toolTip) {
		toolTip.remove();
	}

	const annotation = document.getElementById("imageAnnotation");
	if (annotation) {
		annotation.remove();
	}

	const canvasContainer = document.getElementById("genderMagCanvasContainer");
	if (canvasContainer) {
		canvasContainer.remove();
	}
}

function hideInactiveSessionUi() {
	removeFloatingSessionUi();
	closeSlider();
	const body = $("#GenderMagFrame").contents().find("body");
	if (body && body.length) {
		body.empty();
	}
	isInactiveSessionMirror = true;
}

function handleSessionStateSync(sessionState) {
	if (!document.getElementById("GenderMagFrame")) {
		return;
	}

	if (!hasStartedSession(sessionState)) {
		removeFloatingSessionUi();
		closeSlider();
		isInactiveSessionMirror = false;
		renderStartScreen("#GenderMagFrame", "./templates/firstState.html");
		reloadSandwich();
		return;
	}

	if (!currentTabOwnsSession(sessionState)) {
		hideInactiveSessionUi();
		return;
	}

	if (isInactiveSessionMirror) {
		isInactiveSessionMirror = false;
		restoreWalkthroughState();
		reloadSandwich();
	}
}

function renderStartScreen(iframeSelector, templatePath) {
	const el = $(iframeSelector).contents().find("body");
	el.empty();

	appendTemplateToElement(el, templatePath, function (error) {
		if (error) {
			console.error("Error loading body:", error);
			return;
		}
		console.log("Body appended in setup.");
		attachStartWalkthroughHandler(el);
	});
}

function attachStartWalkthroughHandler(el) {
	el.children("#startGenderMagButton")
		.off("click")
		.on("click", function () {
			if (typeof updateSessionState === "function") {
				updateSessionState(function (state) {
					state.currentStep = "prewalkthrough";
                    if (!state.ui) {
                        state.ui = {};
                    }
                    state.ui.activeTabId = currentGenderMagTabId;
				}, "Started walkthrough and entered prewalkthrough.");
			}
			preWalkthrough("#GenderMagFrame", "./templates/popup.html");
		});
}


// Call the initialize function to set up the event listener
initialize();
