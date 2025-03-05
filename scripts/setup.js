/*
* File Name: setup.js
* Functions: setup()
* Description: Sets up the initial state of the GenderMag bar
*/



// function setup(id, file) {
// 	//Restore the state of the HTML if it exists, and otherwise draw the normal starting state
// 	var hasStartedWalkthrough = statusIsTrue("startedGM");
// 	if (hasStartedWalkthrough) {
// 		if (statusIsTrue("sliderIsOpen")) {
// 			openSlider();
// 		}
// 		else {
// 			closeSlider();
// 		}
// 		preWalkthrough("#GenderMagFrame", "./templates/popup.html");
// 		if (statusIsTrue('drewToolTip')) {
// 			reloadToolTipState();
// 		}
// 	}
// 	else {
// 		//Put the text and buttons on the screen
// 		var el = $(id).contents().find('body');
// 		//appendTemplateToElement(el, file);
// 		appendTemplateToElement(el, file, function (error) {
// 			if (error) {
// 				console.error("Error loading body:", error);
// 				return;
// 			}
// 			console.log("Body appended in setup.");
	
// 			// Add any additional logic here if needed after appending the template
// 		});
// 		//Add the onclick to the "Start Walkthrough" button	
// 		$(id).contents().find('body').children('#startGenderMagButton').off('click').on('click', function () {
// 			setStatusToTrue("startedGM");
// 			preWalkthrough("#GenderMagFrame", "./templates/popup.html");
// 		});
// 	}
// }
