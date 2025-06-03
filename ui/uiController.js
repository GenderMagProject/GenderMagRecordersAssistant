/* Function Name: openSlider
 * Description: Opens the slider by adding the "clicked" class at the bottom of the html page.
 * Parameters: None
 */
function openSlider() {
    if (!$("#slideout").hasClass("clicked")) {
        $("#slideout").addClass("clicked");
        $("#GenderMagFrame").addClass("clicked");
        setStatusToTrue("sliderIsOpen");
    }
}

/* Function Name: closeSlider
 * Description: Closes the slider by removing the "clicked" class  at the bottom of the html page.
 * Parameters: None
 */
function closeSlider() {
    if ($("#slideout").hasClass("clicked")) {
        $("#slideout").toggleClass("clicked");
        $("#GenderMagFrame").toggleClass("clicked");
        setStatusToFalse("sliderIsOpen");
    }
}

/*
 * Function: addToSandwich
 * Description: This function handles display of subgoals and actions in the expandable sidebar
 * Params: type - either subgoal or idealAction, item - the object (either subgoal or action)
 */
 // TODO: refactor to clarify logic and reduce duplicated code
function addToSandwich(type, item){
	console.log("Adding to sandwich:", type, item);
    if(!type.localeCompare("subgoal")){ 		
		var subArr = getSubgoalArrayFromLocal();
        var arrowSRC=chrome.runtime.getURL("images/arrow_collapsed.png");
		var sideSubgoal = ('<div stateVar=0 superCoolAttr=' + item.id 
				   + ' style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:blue;text-decoration:underline;margin:5px;" id="sideSubgoal'
				   + item.id + '"> <img id="sideSubgoalImg' + item.id + '" src="'
				   + arrowSRC + '"></img> Subgoal ' + item.id + ': ' + item.name + '</div>');
		// checking to see if the subgoal has already been created (?)
		if (item.id >= subArr.length) {
            var foundIt = false;
            sidebarBody().find('#subgoalList').children().each(function () {
                var currId = Number(this.getAttribute('supercoolattr'));
                if (item.id == currId) {
                    foundIt = true;
                    // if the subgoal already exists, make sure it has the correct name
                    var match = "#sideSubgoal" + currId
                    sidebarBody().find("#subgoalList").children(match).html(sideSubgoal);
                }
            });
            // add the new subgoal to the sidebar
            if (!foundIt) {
                sidebarBody().find("#subgoalList").append(sideSubgoal);
				sidebarBody().find("#treeInfo").show();
            }
            
        }
		sidebarBody().find("#sideSubgoal" + item.id).unbind( "click" ).click(function(){
			subArr = getSubgoalArrayFromLocal(); // in case something changes before the button is clicked
			// do not enter drawSubgoal with a different id until the current subgoal is saved
			if (statusIsTrue("gotSubgoalQuestions") || item.id == subArr.length){
				drawSubgoal(item.id);
			}
            sideSubgoalExpandy(item.id, 0);
		});
	}
	else if(!type.localeCompare("idealAction") && item.name){ 	
		var sideAction = ('<div superCoolAttr="' + item.subgoalId + '-' + item.actionId 
		+ '" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-indent:25px;color:blue;text-decoration:underline;margin:5px;" id="sideAction'
		+ item.subgoalId + '-' + item.actionId + '">Action ' + item.actionId + ': ' + item.name + '</div>');
		var sideActionIdToFind = item.subgoalId + "-" + item.actionId;
        var sideActionIdForClick = "#sideAction" + item.subgoalId + "-" + item.actionId;
		var foundIt = false;
		// update an existing action?
		sidebarBody().find('#subgoalList').children().each(function () {
			var currId = this.getAttribute('supercoolattr');
			if (!sideActionIdToFind.localeCompare(currId)) {
				foundIt = true;
			}
		});
		// add the action (which already exists?)
		if (!foundIt) {
			sidebarBody().find("#subgoalList").append(sideAction);
			sideSubgoalExpandy(item.subgoalId, "expand");
            var actionNum = localStorage.getItem("numActions");
            actionNum++;
            localStorage.setItem("numActions", actionNum);
		}
		// simple display
        else {
            sidebarBody().find(sideActionIdForClick).html('Action ' + item.actionId + ': ' + item.name);
            var currArray = getSubgoalArrayFromLocal();
        }
		
		
		sidebarBody().find(sideActionIdForClick).unbind( "click" ).click(function(){
			drawAction(item.actionId, item.subgoalId);
		});
	}
	// create a new action object and add to the list
	else if(!type.localeCompare("idealAction") && !item){ 	
		var subgoalId = localStorage.getItem("numSubgoals");
		var actionId = localStorage.getItem("numActions");
		var actionName = localStorage.getItem("currActionName");
		var sideAction = ('<div superCoolAttr="' + subgoalId + '-' + actionId
		+ '"style=white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-indent:25px;color:blue;text-decoration:underline;margin:5px;" id="sideAction'
		+ subgoalId + '-' + actionId + '">Action ' + actionId + ': ' + actionName + '</div>');
		sidebarBody().find("#subgoalList").append(sideAction);
		var actionNum = localStorage.getItem("numActions");
		actionNum++;
		localStorage.setItem("numActions", actionNum);
        var sideActionIdToFind = "#sideAction" + subgoalId + "-" + actionId;
		sidebarBody().find(sideActionIdToFind).unbind( "click" ).click(function(){
			drawAction(actionId, subgoalId);
		
		});
	}
    
    else {
        console.log("Something went wrong in addToSandwich OH GOD PANIC", type, item);
    }
	
}

//Happens after refresh
//confused about when this happens exactly

// TODO: Refactoring. This function contains code that exists elsewhere (see addToSandwich). Is it wise to have
// buttons within an each() loop?
function reloadSandwich () {
	console.log("Reloading sandwich menu...");
	var sidebarHTML = localStorage.getItem('sidebarHTML');
	//console.log(sidebarHTML);
	var subgoalDiv = sidebarBody().find('#subgoalList');
	//check to see if user is on subgoals before refresh
	if (subgoalDiv && statusIsTrue('finishedPrewalkthrough')) {
		subgoalDiv.html(sidebarHTML);
		sidebarBody().find('#subgoalList').children().each(function () {
			var currId = this.getAttribute('supercoolattr');
			//console.log(currId);
			if (currId.length == 1) {
				//It's a subgoal
				//console.log("subgoal");
			sidebarBody().find("#sideSubgoal" + currId).unbind( "click" ).click(function(){
				var subArr = getSubgoalArrayFromLocal(); // in case something changes before the button is clicked
				// do not enter drawSubgoal with a different id until the current subgoal is saved
				if (statusIsTrue("gotSubgoalQuestions") || currId == subArr.length){
					drawSubgoal(currId);
				}
            	sideSubgoalExpandy(currId, 0);
			});
                //todo: add collapse onclick function here.
			}
            
			else {
				//User was not on subgoal--was on an action before refresh
				//console.log("action", currId);
				//get which action under which subgoal
				var thisActionNum = Number(currId[currId.length-1]);
                var thisSubNum = Number(currId[0]);
				var subgoals = getSubgoalArrayFromLocal();
				if (subgoals[ thisSubNum-1 ].actions[ thisActionNum-1 ]) {
					//console.log("binding to answers...");
					sidebarBody().find("#sideAction" + currId).unbind( "click" ).click(function(){
						loadActionAnswersTemplate(thisActionNum, thisSubNum);
					});
				}
				else {				
					sidebarBody().find("#sideAction" + currId).unbind( "click" ).click(function(){
						drawAction(thisActionNum, thisSubNum);
						var subgoals = getSubgoalArrayFromLocal();
						var actionName = "";
						if (subgoals[ thisSubNum-1 ].actions[ thisActionNum-1 ]) {
							actionName = subgoals[ thisSubNum-1 ].actions[ thisActionNum-1 ].name;
						}
						else {
							//they name the function for the user?
							actionName = "Lights, Camera";
						}
						sidebarBody().find('#actionNameInput').html(actionName);
						//sidebarBody().find('#submitActionName').click();
					});
				}
				
			}
		});
		console.log("Sandwich menu loaded");
	}
	else {
	}
    
}


//Called when a sideSubgoal is clicked. 
//Expands or collapses the actions under that subgoal, but not the subgoal itself.
//Call with sideSubgoalExpandy(id, 0) to toggle. 
//Call with sideSubgoalExpandy(id, "expand") or sideSubgoalExpandy(id, "collapse") to do that specifically
function sideSubgoalExpandy (subgoalId, whatToDo) {
    
    //Get the subgoal list
    var sideList = sidebarBody().find('#subgoalList');
    
    if (whatToDo == "expand") {     //Just expand
		//Change the arrow pic
		var arrowSRC=chrome.runtime.getURL("images/arrow_expanded.png");
		sideList.find('#sideSubgoalImg' + subgoalId).attr("src", arrowSRC);
        sideList.children().each(function () {
            var currId = (this.getAttribute('supercoolattr'));
            /*If the first part of the ID matches the subgoal number and the length of the ID
	    	is longer than 1, it's an action to expand*/
            if ( Number(currId[0]) == Number(subgoalId)  &&  currId.length > 1 ) {      
                //console.log("showing ", currId);
                $(this).show();
            }
        });
		sidebarBody().find('#sideSubgoal' + subgoalId).attr("stateVar", 1);
    }
    
    
    else if (whatToDo == "collapse") {      //Just collapse
		//Change the arrow pic
		var arrowSRC=chrome.runtime.getURL("images/arrow_collapsed.png");
		sideList.find('#sideSubgoalImg' + subgoalId).attr("src", arrowSRC);
        sideList.children().each(function () {
            var currId = (this.getAttribute('supercoolattr'));
            /*If the first part of the ID matches the subgoal number and the length of the ID
	    	is longer than 1, it's an action to collapse*/
            if ( Number(currId[0]) == Number(subgoalId)  &&  currId.length > 1 ) {      
                //console.log("hiding ", currId);
                $(this).hide();
            }
        });
		sidebarBody().find('#sideSubgoal' + subgoalId).attr("stateVar", 0);
    }
    
    
    else {          //Toggle based on stateVar
    
        //Find the stateVar
        var stateVar = Number(sidebarBody().find('#sideSubgoal' + subgoalId).attr("stateVar"));
        //console.log('stateVar', stateVar);
        
        //If it's collapsed (stateVar == 0), expand and set the stateVar to 1
        if (stateVar == 0) {
			//Change the arrow pic
			var arrowSRC=chrome.runtime.getURL("images/arrow_expanded.png");
			sideList.find('#sideSubgoalImg' + subgoalId).attr("src", arrowSRC);
            sideList.children().each(function () {
                var currId = (this.getAttribute('supercoolattr'));
                /*If the first part of the ID matches the subgoal number and the length of the ID
			is longer than 1, it's an action to expand*/
                if ( Number(currId[0]) == Number(subgoalId)  &&  currId.length > 1 ) {      
                    //console.log("showing ", currId);
                    $(this).show();
                }
            });
            sidebarBody().find('#sideSubgoal' + subgoalId).attr("stateVar", 1);
        }
        
        //If it's expanded (stateVar == 1), collapse and set the stateVar to 0
        else if (stateVar == 1) {
			//Change the arrow pic
			var arrowSRC=chrome.runtime.getURL("images/arrow_collapsed.png");
			sideList.find('#sideSubgoalImg' + subgoalId).attr("src", arrowSRC);
            sideList.children().each(function () {
                var currId = (this.getAttribute('supercoolattr'));
                /*If the first part of the ID matches the subgoal number and the length of the ID
			is longer than 1, it's an action to collapse*/
                if ( Number(currId[0]) == Number(subgoalId)  &&  currId.length > 1 ) {      
                    //console.log("hiding ", currId);
                    $(this).hide();
                }
            });
            sidebarBody().find('#sideSubgoal' + subgoalId).attr("stateVar", 0);
        }
        
        else {
        
        }
        
    }
    
}


//Loads the actionAnswers template with information about the passed in action, and puts it on the screen.
function loadActionAnswersTemplate (actionId, subgoalId) {
	
	var subArr = getSubgoalArrayFromLocal();
	
	if (subgoalId > subArr.length) {
		//console.log("Can't draw those answers - the subgoal doesn't exist");
	}
	else if (subArr[subgoalId-1].actions.length == 0) {
		//console.log("Can't draw those answers - the actions array is empty");
	}
	else if (actionId > subArr[subgoalId-1].actions.length) {
		//console.log("Can't draw those answers - that action doesn't exist");
	}
	
	else{		//All should be good for drawing if you got this far
		
		var el = sidebarBody().find('#containeryo');
		file = "/templates/actionAnswers.html";
		el.empty();
		//ToElement(el,file);
		appendTemplateToElement(el, file, function (error) {
			if (error) {
				console.error("Error loading action answers template:", error);
				return;
			}
			console.log("Action answers template appended successfully in loadActionAnswersTemplate.");
	
			// Add any additional logic here if needed after appending the template
			var targetAction = subArr[subgoalId-1].actions[actionId-1];
		//console.log("In loadAnswers", actionId, subgoalId, targetAction);
		
		sidebarBody().find('#answersActionNum').html(targetAction.id);
		sidebarBody().find('#answersActionName').html(targetAction.name);
		
		//Image stuff goes here
		
		showMeTheStringYNM('#answersPreActionYNM', targetAction.preAction.ynm);
		sidebarBody().find('#answersPreActionWhy').html(targetAction.preAction.why);
		showMeTheStringFacets('#answersPreActionFacets', targetAction.preAction.facetValues);
		
		showMeTheStringYNM('#answersPostActionYNM', targetAction.postAction.ynm);
		sidebarBody().find('#answersPostActionWhy').html(targetAction.postAction.why);
		showMeTheStringFacets('#answersPostActionFacets', targetAction.postAction.facetValues);
		});
		
		
	}
	
}


/* Iterates through the passed YNM object to see which values are true
and puts the right string on the answers template in the passed id. */
function showMeTheStringYNM (targetId, targetObj) {
	
	var myString = "";
	var propsFound = 0;
	for (var prop in targetObj) {
		if (targetObj[prop] == true) {
			//adds the first string in targetObj to myString
			if (propsFound == 0) {
				myString = myString.concat(prop);
			}
			//concatenates the strings after the first string separated by a comma
			else {
				myString = myString.concat(", ", prop);
			}
			propsFound++;
		}
	}	
	sidebarBody().find(targetId).html(myString);
	
}

/*Iterates through the passed facets object to see which values are true
 and puts the right string on the answers template in the passed id. */
function showMeTheStringFacets (targetId, targetObj) {
	
	var myString = "";
	var propsFound = 0;
	var foundFacet = "";
	for (var prop in targetObj) {
		if (targetObj[prop] == true) {
			foundFacet = prop;
			propsFound++;
		
			//Switch statement-ish on the facet
			//If it is the first prop found, add the true value without comma.
			//Concatenates the rest of the true values with commas afterwards.
			if (foundFacet == "info") {
				if (propsFound == 1) {
					myString = myString.concat("Information Processing Style");
				}
				else {
					myString = myString.concat(", Information Processing Style");
				}
			}
			else if (foundFacet == "motiv") {
				if (propsFound == 1) {
					myString = myString.concat("Motivation");
				}
				else {
					myString = myString.concat(", Motivation");
				}
			}
			else if (foundFacet == "risk") {
				if (propsFound == 1) {
					myString = myString.concat("Attitude towards Risk");
				}
				else {
					myString = myString.concat(", Attitude towards Risk");
				}
			}
			else if (foundFacet == "self") {
				if (propsFound == 1) {
					myString = myString.concat("Computer Self-efficacies");
				}
				else {
					myString = myString.concat(", Computer Self-efficacies");
				}
			}
			else if (foundFacet == "tinker") {
				if (propsFound == 1) {
					myString = myString.concat("Learning: by Process vs. by Tinkering");
				}
				else {
					myString = myString.concat(", Learning: by Process vs. by Tinkering");
				}
			}
		}
		
	}
	if (propsFound == 0) {
		myString = "none";
	}
	
	
	sidebarBody().find(targetId).html(myString);
	
}

// Add the unload event handler to save the sidebar HTML before refresh
$(window).unload(function() {
    var sidebarHTML = sidebarBody().find('#subgoalList').html();
    localStorage.setItem('sidebarHTML', sidebarHTML);
});

// after setting up persona, subgoal the walkthrough functions start here

//helper function to remove onclick = not used anywhere in the code atm 
function toggleTextbox(checkboxId, textboxId) {
    const checkbox = document.getElementById(checkboxId);
    const textbox = document.getElementById(textboxId);

    if (checkbox.checked) {
        textbox.style.display = "block";
    } else {
        textbox.style.display = "none";
    }
}

