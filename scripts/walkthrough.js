// /*
//  * File Name: walkthrough.js
//  * Functions: editSubgoal, drawSubgoal, drawAction
//  * Description: This file contains functions to handle the walkthrough from subgoal entry and action setup
//  */

// /*
//  * Function: editSubgoal
//  * Description: This function handles editing the name of the current subgoal. Should only be called when user is
//  *   creating the current subgoal and should not be called on any subgoal that is not the current subgoal.
//  * Params: subgoalNum - number of the subgoal to edit (should be the current subgoal)
//  */
// function editSubgoal(subgoalNum){
// 	//Show subgoal name field, hide subgoal questions
// 	//sidebarBody function is from file utilities.js
// 	sidebarBody().find("#getSubgoal").show();
// 	sidebarBody().find("#subgoalQuestions").hide();
// 	sidebarBody().find("#subgoalFacets").hide();
// 	sidebarBody().find("#subgoalButtons").hide();
// 	sidebarBody().find("#editTeam").hide();
// 	sidebarBody().find("#editPersona").hide();
// 	sidebarBody().find("#editScenario").hide();

// 	function displayMainSubgoalInfo(subName) {
// 		sidebarBody().find('#subgoalHeading').html("Subgoal: " + subName);
// 		sidebarBody().find('#goalQuestion').html("Will " + personaName + 
// 							 " have formed this subgoal as a step to " + possessive +" overall goal?");
// 		sidebarBody().find('#goalFacets').html("Which (if any) of " + personaName + 
// 						       "'s facets did you use to answer the previous question?");
// 		sidebarBody().find("#getSubgoal").hide();
// 		sidebarBody().find("#subgoalQuestions").show();
// 		sidebarBody().find("#subgoalFacets").show();
// 		sidebarBody().find("#subgoalButtons").show();
// 	}

// 	//retrieve persona name from local storage, if it's not there somethings wrong
// 	var personaName = getVarFromLocal("personaName");
//     var pronoun = getVarFromLocal("personaPronoun");
//     var possessive = getVarFromLocal("personaPossessive");
// 	if (!personaName) {
// 		console.log("persona name was null. Check your save");
// 	}
// 	//prompt subgoal rename
// 	sidebarBody().find("#subgoalPrompt").html("Rename subgoal \"" + localStorage.getItem("currSubgoalName") + "\":");
// 	var subgoals = getSubgoalArrayFromLocal();
// 	//fill the input box with existing subgoal name
// 	sidebarBody().find("#subgoalInput").val(subgoals[subgoalNum-1].name);

// 	//double check that user entered text before trying to submit
// 	sidebarBody().find('body').off('click', '#submitSubgoal').on('click', '#submitSubgoal', function() {
// 		if (sidebarBody().find("#subgoalInput").val() === "") {
// 			alert("Please name your subgoal before continuing");
// 		}
// 		else {
// 			//change the name in storage
// 			//var subgoalId = subgoalNum;
// 			setStatusToTrue("gotSubgoalName");
// 			var subName = sidebarBody().find("#subgoalInput").val();
// 			localStorage.setItem("currSubgoalName", subName);

// 			//Display subgoal questions again
//        displayMainSubgoalInfo(subName);

// 			//update the subgoal
// 			var subgoal = subgoals[subgoalNum-1];
// 			saveSubgoal(subgoalNum, subName, subgoal.ynm, subgoal.why, subgoal.facetValues, subgoal.actions);
// 		}
// 	});

// 	//cancels editing the subgoal
// 	sidebarBody().find('body').off('click', '#cancelSubgoal').on('click', '#cancelSubgoal', function() {
// 			//changes the name to the current subgoal name
// 			setStatusToTrue("gotSubgoalName");
	
		
// 			//Display subgoal questions again
// 			displayMainSubgoalInfo(localStorage.getItem("currSubgoalName"));
// 	});

// }

// // I have doubts about how useful this function is. ATM it exists just to avoid duplicate code
// function refreshSubgoalInfo(subgoalId){
// 	var subgoals = getSubgoalArrayFromLocal();
// 	//get current subgoal name and pronoun/possessive
// 	var subName = localStorage.getItem("currSubgoalName");
// 	var subgoal;

// 	if(subgoals[subgoalId - 1] !== undefined && subgoals[subgoalId - 1].name !== subName){
// 		subName = subgoals[subgoalId - 1].name;
// 		sidebarBody().find('#editSubName').hide();
//         subgoal = subgoals[subgoalId - 1];
// 	} else{
// 	    subgoal =  subgoals[subgoals.length-1];
//     }
//     return subgoal;
// }

// // Gathers the user's responses and saves them to the subgoal
// // Assumes subgoalArray already exists
// function storeSubgoalInfo(subgoalId){
// 	var subgoal = refreshSubgoalInfo(subgoalId);
// 	console.log("subgoal from refreshSubgoal in storeSubgoal is",subgoal);
//     var yesNoMaybe = {"yes": sidebarBody().find("#yes").is(":checked"),
// 		"no": sidebarBody().find("#no").is(":checked"),
// 		"maybe": sidebarBody().find("#maybe").is(":checked")};
//     var whyText = sidebarBody().find('#A0Q0whyYes').val();
//     if (whyText === "") {
//         whyText = sidebarBody().find('#A0Q0Response').html();
//     }
//     var facets = {"motiv": sidebarBody().find("#A0Q0motiv").is(":checked"),
// 		"info": sidebarBody().find("#A0Q0info").is(":checked"),
// 		"selfE": sidebarBody().find("#A0Q0selfE").is(":checked"),
// 		"risk": sidebarBody().find("#A0Q0risk").is(":checked"),
// 		"tinker": sidebarBody().find("#A0Q0tinker").is(":checked"),
// 		"none": sidebarBody().find("#A0Q0none").is(":checked")
// 	};
//     saveSubgoal(subgoalId, subgoal.name, yesNoMaybe, whyText, facets, subgoal.actions);

//     //change key for subgoal questions
//     setStatusToTrue("gotSubgoalQuestions");
// }

// // Helper function: draws actions in the right place
// function preDrawAction(subgoalId){
// 	//increase number of actions and draw action
//     var numActions = localStorage.getItem("numActions");
//     if(numActions > 0){
//         drawAction(numActions, subgoalId);
//     }
//     else{
//         localStorage.setItem("numActions", 1);
//         drawAction(1, subgoalId);
//     }	
// }

// /*
//  * Function: drawSubgoal
//  * Description: This function handles displaying information for a given subgoal including displaying previously saved
//  *   information and saving newly entered information.
//  * Params: subgoalId - id of the subgoal to display (may or may not be the current subgoal).
//  *
//  * TODO: This function needs refactoring. A number of problems are arising because of state changes 
//  * that happen in the middle of execution.
//  */
// function drawSubgoal(subgoalId) {
//     var id = "#GenderMagFrame";
//     var file = "/templates/subgoal.html";

//     // Check if subgoal questions are already set
//     var isSetSubgoalQuestions = statusIsTrue("gotSubgoalQuestions");

//     // Get current subgoal, empty the question container, and add in subgoal questions
//     var personaName = getVarFromLocal("personaName");
//     var pronoun = getVarFromLocal("personaPronoun");
//     var possessive = getVarFromLocal("personaPossessive");
//     var subName = localStorage.getItem("currSubgoalName");

//     var el = $(id).contents().find('#containeryo');
//     el.empty();

//     // Append the template to the element
//     appendTemplateToElement(el, file, function (error) {
//         if (error) {
//             console.error("Error appending template in drawSubgoal:", error);
//             return;
//         }

//         sidebarBody().find('#subgoalHeading').html("Subgoal: " + subName);
//         sidebarBody().find('#goalQuestion').html(
//             "Will " + personaName + " have formed this subgoal as a step to " + possessive + " overall goal?"
//         );
//         sidebarBody().find('#goalFacets').html(
//             "Which (if any) of " + personaName + "'s facets did you use to answer the previous question?"
//         );

//         // If subgoal questions are already answered
//         if (isSetSubgoalQuestions) {
//             // Retrieve and populate the subgoal information
//             var subgoal = refreshSubgoalInfo(subgoalId);
//             var subgoals = getSubgoalArrayFromLocal();
//             console.log("subgoal is",subgoal);
//             console.log("subgoals are",subgoals);

//             sidebarBody().find('#editSubName').hide();
//             sidebarBody().find('#addAction').hide();

//             sidebarBody().find('#A0Q0Response').html(subgoal.why);
//             sidebarBody().find('#A0Q0whyYes').hide();

//             sidebarBody().find('#yes').prop("checked", subgoal.ynm.yes);
//             sidebarBody().find('#no').prop("checked", subgoal.ynm.no);
//             sidebarBody().find('#maybe').prop("checked", subgoal.ynm.maybe);

//             sidebarBody().find('#A0Q0motiv').prop("checked", subgoal.facetValues.motiv);
//             sidebarBody().find('#A0Q0info').prop("checked", subgoal.facetValues.info);
//             sidebarBody().find('#A0Q0selfE').prop("checked", subgoal.facetValues.selfE);
//             sidebarBody().find('#A0Q0risk').prop("checked", subgoal.facetValues.risk);
//             sidebarBody().find('#A0Q0tinker').prop("checked", subgoal.facetValues.tinker);
//             sidebarBody().find('#A0Q0none').prop("checked", subgoal.facetValues.none);

//             sidebarBody().find('#editSubgoal').show();

//             // Button to edit 'why' text
//             sidebarBody().find('#editSubgoal').unbind("click").click(function () {
//                 sidebarBody().find("#editSubgoal").hide();
//                 sidebarBody().find('#addAction').hide();
//                 sidebarBody().find("#A0Q0whyYes").show();
//                 sidebarBody().find("#A0Q0whyYes").html(subgoal.why);
//                 sidebarBody().find('#submitWhy').show();
//             });

//             // Button to submit 'why' text
//             sidebarBody().find('#submitWhy').unbind("click").click(function () {
//                 sidebarBody().find('#submitWhy').hide();
//                 sidebarBody().find("#editSubgoal").show();
//                 storeSubgoalInfo(subgoalId);
//                 subgoal = refreshSubgoalInfo(subgoalId);
//                 sidebarBody().find('#A0Q0Response').html(subgoal.why);
//                 sidebarBody().find('#A0Q0whyYes').hide();
//             });

//             // Only allow editing or continuing the latest subgoal
//             if (subgoalId == subgoals.length) {
//                 sidebarBody().find('#editSubName').show();
//                 sidebarBody().find('body')
//                     .off('click', '#editSubName')
//                     .on('click', '#editSubName', function () {
//                         editSubgoal(subgoalId);
//                     });

//                 sidebarBody().find('#addAction').show();
//                 sidebarBody().find('#editSubgoal').show();

//                 // "Save and Continue" button to save the subgoal and call draw action function
//                 sidebarBody().find('body')
//                     .off('click', '#addAction')
//                     .on('click', '#addAction', function () {
//                         storeSubgoalInfo(subgoalId);
//                         preDrawAction(subgoalId);
//                     });
//             }
//         } 
//         // If subgoal questions haven't been answered yet
//         else {
//             sidebarBody().find('body')
//                 .off('click', '#editSubName')
//                 .on('click', '#editSubName', function () {
//                     editSubgoal(subgoalId);
//                 });

//             sidebarBody().find('#editSubgoal').hide();

//             sidebarBody().find('body')
//                 .off('click', '#addAction')
//                 .on('click', '#addAction', function () {
//                     storeSubgoalInfo(subgoalId);
//                     preDrawAction(subgoalId);
//                 });
//         }
//     });
// }

// //helper function to remove onclick = not used anywhere in the code atm 
// function toggleTextbox(checkboxId, textboxId) {
//     const checkbox = document.getElementById(checkboxId);
//     const textbox = document.getElementById(textboxId);

//     if (checkbox.checked) {
//         textbox.style.display = "block";
//     } else {
//         textbox.style.display = "none";
//     }
// }


// /*
//  * Function: drawAction
//  * Description: This function handles getting the action name from the user and getting ready for the
//  *   screen capture as well as calling the function for the screen capture.
//  * Params: actionNum - number of the action to draw, subgoalId - id of the subgoal corresponding to
//  *   the action
//  */
// //refactored mv3 update
// function drawAction(actionNum, subgoalId) {
//     var id = "#GenderMagFrame";
//     var file = "/templates/actionPrompt.html";

//     // Empty the question container and put in the action questions
//     var el = $(id).contents().find('#containeryo');
//     el.empty();
    
//     appendTemplateToElement(el, file, function (error) {
//         if (error) {
//             console.error("Error appending template in drawAction:", error);
//             return;
//         }

//         console.log("Template appended successfully in drawAction.");

//         var actionName = "THE ACTION NAME";

//         // Retrieve subgoal array from local storage
//         var currArray = getSubgoalArrayFromLocal();

//         // If already got action name
//         if (statusIsTrue("gotActionName")) {
//             if (actionNum > currArray[subgoalId - 1].actions.length) {
//                 actionName = localStorage.getItem("currActionName");
//             } else {
//                 actionName = currArray[subgoalId - 1].actions[actionNum - 1].name;
//             }
//             sidebarBody().find('#getActionName').hide();
//             sidebarBody().find('#actionNameGot').html("<b> Action: " + actionName + "</b>");
//             sidebarBody().find('#actionNameGot').show();
//             sidebarBody().find("#promptAction").show();
//             setStatusToTrue("actionPromptOnScreen");
//         }

//         // Add onclicks
//         sidebarBody().find('#submitActionName').unbind("click").click(function () {
//             actionName = sidebarBody().find("#actionNameInput").val();
//             if (actionName === "" && !(statusIsTrue('gotActionName'))) {
//                 alert("Please name your action before continuing");
//             } else {
//                 var actionItem = {
//                     name: actionName,
//                     actionId: actionNum,
//                     subgoalId: subgoalId
//                 };
//                 saveVarToLocal("currActionName", actionName);

//                 var yesNoMaybe = { "yes": false, "no": false, "maybe": false };
//                 var whyText = "";
//                 var facets = {
//                     "motiv": false,
//                     "info": false,
//                     "self": false,
//                     "risk": false,
//                     "tinker": false,
//                     "none": false
//                 };
//                 saveIdealAction(actionName, yesNoMaybe, whyText, facets, yesNoMaybe, whyText, facets);

//                 setStatusToTrue("gotActionName");
//                 sidebarBody().find('#getActionName').hide();
//                 sidebarBody().find('#actionNameGot').html("<b> Action: " + actionName + "</b>");
//                 sidebarBody().find('#actionNameGot').show();
//                 sidebarBody().find("#promptAction").show();
//                 setStatusToTrue("actionPromptOnScreen");

//                 if (actionNum > currArray[subgoalId - 1].actions.length) {
//                     addToSandwich("idealAction", actionItem);
//                 }

//                 // Attach toggle functionality here
//             // document.getElementById("yes").addEventListener("change", () => toggleTextbox("yes", "BwhyYes"));
//             // document.getElementById("no").addEventListener("change", () => toggleTextbox("no", "BwhyNo"));
//             // document.getElementById("maybe").addEventListener("change", () => toggleTextbox("maybe", "BwhyMaybe"));
            
//                 sidebarBody().find("#editAction").show();
//                 sidebarBody().find("#editAction").unbind("click").click(function () {
//                     sidebarBody().find('#editAction').hide();
//                     sidebarBody().find('#getActionName').show();
//                     sidebarBody().find('#actionNamePrompt').hide();
//                     sidebarBody().find("#promptAction").hide();
//                     setStatusToFalse("actionPromptOnScreen");
//                 });
//             }
//         });

//         // User can press enter instead of clicking submit
//         sidebarBody().find("#actionNameInput").keyup(function (event) {
//             if (event.keyCode === 13) {
//                 sidebarBody().find("#submitActionName").click();
//             }
//         });

//         // Call overlay screen function when user is ready for screen capture
//         sidebarBody().find('body').off('click', '#overlayTrigger').on('click', '#overlayTrigger', function () {
//             if (statusIsTrue('drewToolTip')) {
//                 var justTheToolTip = document.getElementById("myToolTip");
//                 $(justTheToolTip).remove();
//             }
//             overlayScreen();
//         });

//         // When back button is clicked, get rid of the action stuff and go back to subgoal
//         sidebarBody().find("#promptActionBack").unbind("click").click(function () {
//             el.empty();
//             var subgoalId = localStorage.getItem("numSubgoals");
//             drawSubgoal(subgoalId);
//         });
//     });
// }

