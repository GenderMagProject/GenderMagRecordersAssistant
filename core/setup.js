/*
* File Name: setup.js
* Functions: setup(), initialize()
* Description: Sets up the initial state of the GenderMag bar and initializes the application
*/

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

    // Initialize the status object
    initStatusObject();

    // Import all necessary stylesheets
    importStylesheet("body", "./styles/slider.css");

    // Append the template asynchronously and handle dependent tasks in a callback
    appendTemplateToElement("body", "./templates/slider.html", (error, data) => {
        if (error) {
            console.error("Error appending slider template:", error);
            return;
        }

        // Perform tasks that depend on the slider being loaded
        console.log("Slider template appended successfully.");
        const head = $("#slideout").contents().find("head");
        // Import additional stylesheets for the slider content
        importStylesheet(head, "/styles/sliderbody.css");
        importStylesheet(head, "/styles/styles.css");
        importStylesheet(head, "/jquery-ui-1.12.1/jquery-ui.css");
        importStylesheet(head, "font-awesome-4.6.1/css/font-awesome.min.css");

        // Append text and setup event listeners
        $("#slideout").contents().find("body").append("GenderMag");
        setupSliderToggleClick();
        initializeWalkthroughBar("#GenderMagFrame", "./templates/firstState.html");
        reloadSandwich();
		console.log("Utilities init execution completed")

    });
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
	const hasStarted = statusIsTrue("startedGM");

	if (hasStarted) {
		restoreWalkthroughState();
	} else {
		renderStartScreen(targetIframeSelector, templatePath);
	}
}

function restoreWalkthroughState() {
	statusIsTrue("sliderIsOpen") ? openSlider() : closeSlider();
	preWalkthrough("#GenderMagFrame", "./templates/popup.html");

	if (statusIsTrue("drewToolTip")) {
		reloadToolTipState();
	}
}

function renderStartScreen(iframeSelector, templatePath) {
	const el = $(iframeSelector).contents().find("body");

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
			setStatusToTrue("startedGM");
			preWalkthrough("#GenderMagFrame", "./templates/popup.html");
		});
}


// Call the initialize function to set up the event listener
initialize();
