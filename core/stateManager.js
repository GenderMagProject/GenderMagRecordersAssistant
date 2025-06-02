//State management for the overall interactions 
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
	highlightedAction: "",                      //set in walkthrough.js
    drewToolTip: "",                            //set in overlayScreen.js  
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
	console.log("3");
    var obj = getStatusObject();
    if (obj) {
        console.log("statusObject found",obj);
    }
    else {
        saveStatusObject(statusObject);  
        console.log("Initializing status object...");
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

//Subgoal state management starts here  
var subgoalArray = [];

/*	Saves the passed variable to HTML5 local storage.
*	Takes 2 arguments: what you want the item to be called, and the item to save.
*	Pre: item must exist
*	Post: item is in local storage.
*/
function saveVarToLocal (nameOfThingToSave, thingToSave) {
	localStorage.setItem(nameOfThingToSave, JSON.stringify(thingToSave));
	//console.log("Saved: " + nameOfThingToSave + " " + thingToSave);
}


/*	Gets the passed variable to HTML5 local storage, if it exists.
*	Takes 1 argument: the name of the item.
*	Pre: None
*	Post: If the item by that name is in local storage, it returns the item. If it's not, it returns null.
*/
function getVarFromLocal (nameOfThing) {
	var item = JSON.parse(localStorage.getItem(nameOfThing));
	if (item) {
		//console.log("Found: " + nameOfThing + " " + item);
		return item;
	}
	else {
		//console.log("Couldn't find variable " + nameOfThing + "in local storage");
		return "";
	}
}

/*	Gets the subgoal array object our of local storage and converts it to an array, then returns it.
*   If it doesn't exist, returns null.
*	Takes no args.
*/
function getSubgoalArrayFromLocal() {
    var currObj = JSON.parse(localStorage.getItem('subgoalArray'));
    if (!currObj) {
        //console.log("Couldn't find subgoalArray in local storage");
        return null;
    }
    else{
        var currArray = $.map(currObj, function(el) { return el });     //Turn it into an array
        return currArray;
    }
}

/*
 * Function: saveSubgoal
 * Description: Creates a new subgoal and saves it to local storage at the end of subgoalArray
 * Params: id, name, yesnomaybe, whyText, facets, actionList
 */
function saveSubgoal (id, name, yesnomaybe, whyText, facets, actionList = []) {
	var subgoal = {
		id: id,
		name: name,
		ynm: yesnomaybe,
		why: whyText,
		facetValues: facets,
		actions: actionList
	};
	var subArr = getSubgoalArrayFromLocal();
	if (!subArr){
		subArr = subgoalArray;
	}
	subArr[id-1] = subgoal;
	localStorage.setItem("subgoalArray", JSON.stringify(subArr));  //update subgoalArray in local storage
	console.log("Getting out from saveSubgoal successfully");
	addToSandwich("subgoal", subgoal);
}

//Action state management starts here
/*
 * Function: saveIdealAction
 * Description: Defines what a preIdealAction, postIdealAction, and idealAction are
 * Params: name, yesnomaybe, whyText, facets, yesnomaybePost, whyTextPost, facetsPost
 */
function saveIdealAction(name, yesnomaybe, whyText, facets, yesnomaybePost, whyTextPost, facetsPost) {
	var currArray = getSubgoalArrayFromLocal();
	var targetSubgoal = currArray[(currArray.length - 1)];
	var preIdealAction = {
		actionId: targetSubgoal.actions.length + 1,
		name: name,
		subgoalId: targetSubgoal.id,
		ynm: yesnomaybe,
		why: whyText,
		facetValues: facets
	};
	var postIdealAction = {
		actionId: preIdealAction.actionId,  //Check this when done
		name: name,
		subgoalId: preIdealAction.subgoalId,
		ynm: yesnomaybePost,
		why: whyTextPost,
		facetValues: facetsPost
	};
	var currImgURL = localStorage.getItem("currImgURL");
	var idealAction = {
		id: preIdealAction.actionId,
		name: preIdealAction.name,
		imgURL: currImgURL,
		preAction: preIdealAction,
		postAction: postIdealAction
	};
	
	localStorage.setItem("currPreAction", JSON.stringify(idealAction));
	localStorage.setItem("inMiddleOfAction", "true");
}

//Creates a new preIdealAction object and saves it to local storage on the current subgoal's actions
//Pre: subgoalArray isn't empty
function savePreIdealAction (name, yesnomaybe, whyText, facets) {
	
	//gets the current subgoal from the subgoal array
	var currArray = getSubgoalArrayFromLocal();
	var targetSubgoal = currArray[(currArray.length - 1)];
	var preIdealAction = {
		actionId: targetSubgoal.actions.length + 1, 
		name: name,
		subgoalId: targetSubgoal.id, 
		ynm: yesnomaybe,
		why: whyText,
		facetValues: facets
	};
	
   //Save to local so that we can get it later and stick it in the array with its corresponding postAction
    saveVarToLocal("currPreAction", preIdealAction);
	localStorage.setItem("inMiddleOfAction", "true");		//So we know to retrieve the in-between state
    
}

//Creates a new postIdealAction object and saves it to local storage on the current subgoal's actions
//Pre: subgoalArray isn't empty, and the current preAction isn't null
function savePostIdealAction (name, yesnomaybe, whyText, facets) {
    var currPreAction = getVarFromLocal("currPreAction");
	var postIdealAction = {
		actionId: currPreAction.actionId,  //Check this when done
		name: name,
		subgoalId: currPreAction.subgoalId, 
		ynm: yesnomaybe,
		why: whyText,
		facetValues: facets
	};
	
	//Put them together and save
    glueActionsAndSave(currPreAction, postIdealAction);
    //Clear state variables
    localStorage.setItem("currPreAction", "");
    localStorage.setItem("inMiddleOfAction", "false");		
}


/*	Puts the pre and post actions into an object and sticks it in the target subgoal's actions array.
*	Takes 2 arguments: preIdealAction, postIdealAction
*	Pre: both must exist
*	Post: target subgoal's actions array has an action object made of pre and post action objects.
*/
function glueActionsAndSave (action, postAction) {
    
    //Get the associated image's (screenshot of action) URL from local
    var currImgURL = localStorage.getItem("currImgURL"); 
    //Make the object
    var idealAction = {
        id: action.id,
        name: action.name,
        imgURL: currImgURL,
        preAction: action.preAction,
        postAction: postAction
    };    
    //Save it to local
    var currArray = getSubgoalArrayFromLocal();
    if (!currArray) {
        console.log("Something went wrong, can't find the subgoal array");
    }
    else {
        var targetSubgoal = currArray[(currArray.length - 1)];      //The last subgoal added
        targetSubgoal.actions.push(idealAction);
        //console.log("sub with action: ", targetSubgoal);
        currArray[(currArray.length - 1)] = targetSubgoal;
        localStorage.setItem("subgoalArray", JSON.stringify(currArray));   //Update the subgoal array
		
		//Rebind the onclick of the side list action to show the answers
		var sideActionIdToFind = "#sideAction" + targetSubgoal.id + "-" + idealAction.id;
		//console.log("Rebinding onclick to loadAnswers...");
		sidebarBody().find(sideActionIdToFind).unbind( "click" ).click(function(){
			loadActionAnswersTemplate(idealAction.id, targetSubgoal.id);
		});
    }
}


//Happens before refresh
$( window ).unload(function() {
	var sidebarHTML = sidebarBody().find('#subgoalList').html();
	//console.log(sidebarHTML);
	localStorage.setItem('sidebarHTML', sidebarHTML);
});

//walkthrough functions

// I have doubts about how useful this function is. ATM it exists just to avoid duplicate code
function refreshSubgoalInfo(subgoalId){
	var subgoals = getSubgoalArrayFromLocal();
	//get current subgoal name and pronoun/possessive
	var subName = localStorage.getItem("currSubgoalName");
	var subgoal;

	if(subgoals[subgoalId - 1] !== undefined && subgoals[subgoalId - 1].name !== subName){
		subName = subgoals[subgoalId - 1].name;
		sidebarBody().find('#editSubName').hide();
        subgoal = subgoals[subgoalId - 1];
	} else{
	    subgoal =  subgoals[subgoals.length-1];
    }
    return subgoal;
}

