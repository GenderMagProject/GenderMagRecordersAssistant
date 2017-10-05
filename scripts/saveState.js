var subgoalArray = [];

//Creates a new subgoal and saves it to local storage at the end of subgoalArray
function saveSubgoal (id, name, yesnomaybe, whyText, facets) {
	var subgoal = {
		id: id,
		name: name,
		ynm: yesnomaybe,
		why: whyText,
		facetValues: facets,
		actions: []
	};

	if(id > subgoalArray.length){
		var subArr = getSubgoalArrayFromLocal();
		if (!subArr) {
			subArr = subgoalArray;
		}
		subArr[id-1] = subgoal;
		localStorage.setItem("subgoalArray", JSON.stringify(subArr));	
        addToSandwich("subgoal",subgoal);
	}
	else{
		var subArr = getSubgoalArrayFromLocal();
		subArr[id-1] = subgoal;
		localStorage.setItem("subgoalArray", JSON.stringify(subArr));		
	}
}

function addToSandwich(type, item){
	
	if(!type.localeCompare("subgoal")){ 		
		var subArr = getSubgoalArrayFromLocal();
		drawSubgoal(item.id);
        var arrowSRC=chrome.extension.getURL("images/arrow_collapsed.png");
		var sideSubgoal = '<div stateVar=0 superCoolAttr=' + item.id + ' style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:blue;text-decoration:underline;margin:5px;" id="sideSubgoal' + item.id + '"> <img id="sideSubgoalImg' + item.id + '" src="' + arrowSRC + '"></img> Subgoal ' + item.id + ': ' + item.name + '</div>';
		if (item.id >= subArr.length) {
            var foundIt = false;
            sidebarBody().find('#subgoalList').children().each(function () {
                var currId = Number(this.getAttribute('supercoolattr'));
                if (item.id == currId) {
                    foundIt = true;
                }
            });
            if (!foundIt) {
                sidebarBody().find("#subgoalList").append(sideSubgoal);
            }
            
        }
		sidebarBody().find("#sideSubgoal" + item.id).unbind( "click" ).click(function(){
			drawSubgoal(item.id);
            sideSubgoalExpandy(item.id, 0);
		});

			
	}
	else if(!type.localeCompare("idealAction") && item.name){ 	
		var sideAction = '<div superCoolAttr="' + item.subgoalId + '-' + item.actionId + '" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-indent:25px;color:blue;text-decoration:underline;margin:5px;" id="sideAction' + item.subgoalId + '-' + item.actionId + '">Action ' + item.actionId + ': ' + item.name + '</div>';
		var sideActionIdToFind = item.subgoalId + "-" + item.actionId;
        var sideActionIdForClick = "#sideAction" + item.subgoalId + "-" + item.actionId;
		var foundIt = false;
		sidebarBody().find('#subgoalList').children().each(function () {
			var currId = this.getAttribute('supercoolattr');
			if (! sideActionIdToFind.localeCompare(currId)) {
				foundIt = true;
			}
		});
		if (!foundIt) {
			sidebarBody().find("#subgoalList").append(sideAction);
			sideSubgoalExpandy(item.subgoalId, "expand");
            var actionNum = localStorage.getItem("numActions");
            actionNum++;
            localStorage.setItem("numActions", actionNum);
		}
        else {
            sidebarBody().find(sideActionIdForClick).html('Action ' + item.actionId + ': ' + item.name);
            var currArray = getSubgoalArrayFromLocal();
        }
		
		
		sidebarBody().find(sideActionIdForClick).unbind( "click" ).click(function(){
			drawAction(item.actionId, item.subgoalId);
		});
	}
	else if(!type.localeCompare("idealAction") && !item){ 	
		var subgoalId = localStorage.getItem("numSubgoals");
		var actionId = localStorage.getItem("numActions");
		var actionName = localStorage.getItem("currActionName");
		var sideAction = '<div superCoolAttr="' + subgoalId + '-' + actionId + '"style=white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-indent:25px;color:blue;text-decoration:underline;margin:5px;" id="sideAction' + subgoalId + '-' + actionId + '">Action ' + actionId + ': ' + actionName + '</div>';
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


//Creates a new preIdealAction object and saves it to local storage on the current subgoal's actions
//Pre: subgoalArray isn't empty
function savePreIdealAction (name, yesnomaybe, whyText, facets) {
    
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
}


/*	Puts the pre and post actions into an object and sticks it in the target subgoal's actions array.
*	Takes 2 arguments: preIdealAction, postIdealAction
*	Pre: both must exist
*	Post: target subgoal's actions array has an action object made of pre and post action objects.
*/
function glueActionsAndSave (preAction, postAction) {
    
    //Get the associated image's URL from local
    var currImgURL = localStorage.getItem("currImgURL"); 
    //Make the object
    var idealAction = {
        id: preAction.actionId,
        name: preAction.name,
        imgURL: currImgURL,
        preAction: preAction,
        postAction: postAction
    }
    //console.log("incoming ideal action: ", idealAction);
    
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




//Test code for storing/retrieving/accessing arrays in local storage
	/*	var testArray = ["checked", 1, false];
		console.log(testArray);
		localStorage.setItem("testArray", JSON.stringify(testArray));
		var retrievedObject = JSON.parse(localStorage.getItem('testArray'));
		console.log(retrievedObject[1]);
	*/
	
	
//Happens before refresh
$( window ).unload(function() {
	var sidebarHTML = sidebarBody().find('#subgoalList').html();
	//console.log(sidebarHTML);
	localStorage.setItem('sidebarHTML', sidebarHTML);
});


//Happens after refresh
function reloadSandwich () {
	console.log("Reloading sandwich menu...");
	var sidebarHTML = localStorage.getItem('sidebarHTML');
	//console.log(sidebarHTML);
	var subgoalDiv = sidebarBody().find('#subgoalList');
	if (subgoalDiv && statusIsTrue('finishedPrewalkthrough')) {
		subgoalDiv.html(sidebarHTML);
		sidebarBody().find('#subgoalList').children().each(function () {
			var currId = this.getAttribute('supercoolattr');
			//console.log(currId);
			if (currId.length == 1) {
				//It's a subgoal
				//console.log("subgoal");
				sidebarBody().find("#sideSubgoal" + currId).unbind( "click" ).click(function(){
					drawSubgoal(currId);
				});
                //todo: add collapse onclick function here.
			}
            
			else {
				//It's an action
				//console.log("action", currId);
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


//Called when a sideSubgoal is clicked. Expands or collapses the actions under that subgoal, but not the subgoal itself.
//Call with sideSubgoalExpandy(id, 0) to toggle. 
//Call with sideSubgoalExpandy(id, "expand") or sideSubgoalExpandy(id, "collapse") to do that specifically
function sideSubgoalExpandy (subgoalId, whatToDo) {
    
    //Get the subgoal list
    var sideList = sidebarBody().find('#subgoalList');
    
    if (whatToDo == "expand") {     //Just expand
		//Change the arrow pic
		var arrowSRC=chrome.extension.getURL("images/arrow_expanded.png");
		sideList.find('#sideSubgoalImg' + subgoalId).attr("src", arrowSRC);
        sideList.children().each(function () {
            var currId = (this.getAttribute('supercoolattr'));
            //If the first part of the ID matches the subgoal number and the length of the ID is longer than 1, it's an action to expand
            if ( Number(currId[0]) == Number(subgoalId)  &&  currId.length > 1 ) {      
                //console.log("showing ", currId);
                $(this).show();
            }
        });
		sidebarBody().find('#sideSubgoal' + subgoalId).attr("stateVar", 1);
    }
    
    
    else if (whatToDo == "collapse") {      //Just collapse
		//Change the arrow pic
		var arrowSRC=chrome.extension.getURL("images/arrow_collapsed.png");
		sideList.find('#sideSubgoalImg' + subgoalId).attr("src", arrowSRC);
        sideList.children().each(function () {
            var currId = (this.getAttribute('supercoolattr'));
            //If the first part of the ID matches the subgoal number and the length of the ID is longer than 1, it's an action to collapse
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
			var arrowSRC=chrome.extension.getURL("images/arrow_expanded.png");
			sideList.find('#sideSubgoalImg' + subgoalId).attr("src", arrowSRC);
            sideList.children().each(function () {
                var currId = (this.getAttribute('supercoolattr'));
                //If the first part of the ID matches the subgoal number and the length of the ID is longer than 1, it's an action to expand
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
			var arrowSRC=chrome.extension.getURL("images/arrow_collapsed.png");
			sideList.find('#sideSubgoalImg' + subgoalId).attr("src", arrowSRC);
            sideList.children().each(function () {
                var currId = (this.getAttribute('supercoolattr'));
                //If the first part of the ID matches the subgoal number and the length of the ID is longer than 1, it's an action to collapse
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
		appendTemplateToElement(el,file);
		
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
		
	}
	
}



//Iterates through the passed YNM object to see which values are true and puts the right string on the answers template in the passed id.
function showMeTheStringYNM (targetId, targetObj) {
	
	var myString = "";
	var propsFound = 0;
	for (var prop in targetObj) {
		if (targetObj[prop] == true) {
			if (propsFound == 0) {
				myString = myString.concat(prop);
			}
			else {
				myString = myString.concat(", ", prop);
			}
			propsFound++;
		}
	}	
	sidebarBody().find(targetId).html(myString);
	
}

//Iterates through the passed facets object to see which values are true and puts the right string on the answers template in the passed id.
function showMeTheStringFacets (targetId, targetObj) {
	
	var myString = "";
	var propsFound = 0;
	var foundFacet = "";
	for (var prop in targetObj) {
		if (targetObj[prop] == true) {
			foundFacet = prop;
			propsFound++;
		
			//Switch statement-ish on the facet
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
					myString = myString.concat("Willingness to Tinker");
				}
				else {
					myString = myString.concat(", Wilingness To Tinker");
				}
			}
		}
		
	}
	if (propsFound == 0) {
		myString = "none";
	}
	
	
	sidebarBody().find(targetId).html(myString);
	
}






























