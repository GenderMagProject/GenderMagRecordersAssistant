/*
 * Filename: status.js
 * Functions: 
 *    initStatusObject, getStatusObject, saveStatusObject, statusIsTrue,
 *    setStatusToTrue, setStatusToFalse, setStatusToStop
 * 
 * Description: Manages the status object and its properties. The status object
 *              tracks various stages and states within the application. Which 
 *              enables information storing about the progress and interactions 
 *              of the user.
 */
//add error handling?

var statusObject = {							
	sliderIsOpen: "",                           //set for first time in utilities.js
	startedGM: "",                              //set in setup.js
	gotTeamName: "",                            //set in prewalkthrough.js
	gotPersonaName: "",                         //set in prewalkthrough.js
	gotScenarioName: "",                        //set in prewalkthrough.js
	finishedPrewalkthrough: "",                 //set in prewalkthrough.js
	gotSubgoalName: "",                         //set in prewalkthrough.js
	gotSubgoalQuestions: "",                    //set in walkthrough.js
	gotActionName: "",                          //set in walkthrough.js
    actionPromptOnScreen: "",                   //set in walkthrough.js
    drewToolTip: "",                            //set in overlayScreen.js
    highlightedAction: "",                      //set in overlayScreen.js
    gotScreenshot: "",                          //set in overlayScreen.js
	gotPreActionQuestions: "",                  //set in action.js
    idealActionPerformed: "",                   //set in action.js
	gotPostActionQuestions: "",                 //set in action.js
	finishedGM: ""                              //set in action.js
}

/*
 * Function: initStatusObject
 * Description: Initializes the status object in local storage if it is not already present.
 * Params: None
 */
function initStatusObject () {
    var obj = JSON.parse(localStorage.getItem("statusObject"));
    if (obj) {
        //console.log("statusObject found");
    }
    else {
        localStorage.setItem("statusObject", JSON.stringify(statusObject));  
        //console.log("Initializing status object...");
    }
}

/*
 * Function: getStatusObject
 * Description: Retrieves the status object from local storage.
 * Params: None
 */
function getStatusObject () {
	var obj = JSON.parse(localStorage.getItem("statusObject"));
	return obj;
}

/*
 * Function: saveStatusObject
 * Description: Saves the provided status object to local storage.
 * Params:
 *   obj (Object): The status object to be saved.
 */
function saveStatusObject (obj) {
	localStorage.setItem("statusObject", JSON.stringify(obj));
}

/*
 * Function: statusIsTrue
 * Description: Checks if the value of the specified key in the status object is "true".
 * Params:
 *   keyToCheck (string): The key to check the value for.
 * Returns:
 *   boolean: True if the value is "true", otherwise false.
 */
function statusIsTrue(keyToCheck) {
    var obj = getStatusObject();
	if (obj) {
		if (obj[keyToCheck] == "true") {
            		return true;
        	}
        	else {
            		return false;
        	}
	}
	else {
		//console.log("statusObject doesn't exist in local");
	} 
}

/*
 * Function: setStatusToTrue
 * Description: Sets the value of the specified key in the status object to "true".
 * Params:
 *   keyToChange (string): The key whose value needs to be set to "true".
 */
function setStatusToTrue (keyToChange) {
	var obj = getStatusObject();
	if (obj) {
		obj[keyToChange] = "true";
		saveStatusObject(obj);
        //console.log("set " + keyToChange + " to true");
	}
	else {
		//console.log("statusObject doesn't exist in local");
	} 
}

/*
 * Function: setStatusToFalse
 * Description: Sets the value of the specified key in the status object to "false".
 * Params:
 *   keyToChange (string): The key whose value needs to be set to "false".
 */
function setStatusToFalse (keyToChange) {
	var obj = getStatusObject();
	if (obj) {
		obj[keyToChange] = "false";
		saveStatusObject(obj);
        //console.log("set " + keyToChange + " to false");
	}
	else {
		//console.log("statusObject doesn't exist in local");
	} 
}

/*
 * Function: setStatusToStop
 * Description: Sets the value of the specified key in the status object to an empty string.
 * Params:
 *   keyToChange (string): The key whose value needs to be set to an empty string.
 */
//when is stop used?
function setStatusToStop (keyToChange) {			
	var obj = getStatusObject();
	if (obj) {
		obj[keyToChange] = "";
		saveStatusObject(obj);
 	}
	else {
		//console.log("statusObject doesn't exist in local");
	} 
}
