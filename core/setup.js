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

/* Function Name: setup
 * Description: Sets up the initial state of the GenderMag bar with a the passed-in template (which should
 *		be "firstState.html" at this point. Adds onclicks to the two buttons.
 * Parameters: Takes 2 arguments:
 * 		id: the id of the element to which the template will be appended (e.g. '#GenderMargFrame')
 * 		file: the LOCAL path of the template to use (e.g., "/templates/firstState.html")
 * Last Modified: 2025-03-05  by Bhavika Madhwani (madhwanb@oregonstate.edu)
 */
function setup(id, file) {
    // Restore the state of the HTML if it exists, and otherwise draw the normal starting state
    var hasStartedWalkthrough = statusIsTrue("startedGM");
    if (hasStartedWalkthrough) {
        if (statusIsTrue("sliderIsOpen")) {
            openSlider();
        } else {
            closeSlider();
        }
        preWalkthrough("#GenderMagFrame", "./templates/popup.html");
        if (statusIsTrue('drewToolTip')) {
            reloadToolTipState();
        }
    } else {
        // Put the text and buttons on the screen
        var el = $(id).contents().find('body');
        appendTemplateToElement(el, file, function (error) {
            if (error) {
                console.error("Error loading body:", error);
                return;
            }
            console.log("Body appended in setup.");
            
            // Add the onclick to the "Start Walkthrough" button AFTER the template is appended
            el.children('#startGenderMagButton').off('click').on('click', function () {
                setStatusToTrue("startedGM");
                preWalkthrough("#GenderMagFrame", "./templates/popup.html");
            });
        });
    }
}

// Call the initialize function to set up the event listener
initialize();
