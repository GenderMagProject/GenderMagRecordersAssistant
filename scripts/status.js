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

function getStatusObject () {
	var obj = JSON.parse(localStorage.getItem("statusObject"));
	return obj;
}

function saveStatusObject (obj) {
	localStorage.setItem("statusObject", JSON.stringify(obj));
}

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