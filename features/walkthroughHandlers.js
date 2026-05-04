// ****** General function used throughoout the walkthrough *******


/* Function Name: saveAndExit
 * Description: Handles the save and exit functionality, including appending a final warning template and binding events to buttons.
 * Parameters: 
 *      exitType - type of exit, e.g., "slider"
 */
function saveAndExit(exitType) {
    var el = sidebarBody().find('#sideBySide');
    console.log("Element for #sideBySide found:", el.length > 0);

    if (exitType === "slider") {
        el.contents().hide();
        appendTemplateToElement(el, '/templates/sliderFinalWarning.html', function (error) {
            if (error) {
                console.error("Error appending template:", error);
                return;
            }
            console.log("Template '/templates/sliderFinalWarning.html' appended successfully for slider exit.");
            sidebarBody().find('#saveAndExit').attr("hidden", true);
            sidebarBody().find('#justExit').attr("hidden", true);

            // Bind events after template is appended
            bindSliderFinalButtons(el, exitType);
        });
    } else {
        document.getElementById('myToolTip').style.display = "none";
        document.getElementById('genderMagCanvasContainer').style.display = "none";
        openSlider();
        el.contents().hide();
        appendTemplateToElement(el, '/templates/sliderFinalWarning.html', function (error) {
            if (error) {
                console.error("Error appending template:", error);
                return;
            }
            console.log("Template '/templates/sliderFinalWarning.html' appended successfully for non-slider exit.");
            sidebarBody().find('#saveAndExit').attr("hidden", true);
            sidebarBody().find('#justExit').attr("hidden", true);

            // Bind events after template is appended
            bindSliderFinalButtons(el, exitType);
        });
    }

    // Generate and download the CSV immediately
    var scurvy = createCSV();
    downloadCSV(scurvy);
}

/* Function Name: bindSliderFinalButtons
 * Description: Binds events to buttons inside the final warning template.
 * Parameters: 
 *      el - element containing the buttons
 *      exitType - type of exit
 */
//MAYBE move to UI Handler file if it gets too long
function bindSliderFinalButtons(el, exitType) {
    console.log("Binding events for buttons inside #sliderFinalWarning.");

    $(el).find("#sliderFinalDownload").off("click").on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        console.log("Download button clicked.");
        var scurvy = createCSV();
        downloadCSV(scurvy, false);
    });

    $(el).find("#oldFormat").off("click").on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        console.log("Old format download button clicked.");
        var scurvy = createOldCSV();
        downloadCSV(scurvy, true);
    });

    $(el).find("#sliderYesCheckbox").off("change").on("change", function (event) {
        event.stopPropagation();
        console.log("Yes checkbox clicked. Checked:", $(el).find('#sliderYesCheckbox').is(":checked"));
        if ($(el).find('#sliderYesCheckbox').is(":checked")) {
            $(el).find('#sliderFinalYes').prop('disabled', false);
            $(el).find("#sliderFinalYes").attr("style", "background-color:#7D1935;color:white;");
        } else {
            $(el).find('#sliderFinalYes').prop('disabled', true);
            $(el).find("#sliderFinalYes").attr("style", "background-color:#7D1935;color:white;opacity:0.5");
        }
    });

    $(el).find("#sliderFinalYes").off("click").on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        console.log("Quit GenderMag button clicked.");
        resetSessionState(function () {
            localStorage.clear();
            location.reload();
        });
    });

    $(el).find("#sliderFinalNo").off("click").on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        console.log("Take me back button clicked.");
        sidebarBody().find('#saveAndExit').attr("hidden", false);
        sidebarBody().find('#justExit').attr("hidden", false);
        $(el).find('#sliderFinalCountdown').remove();

        if (exitType === "slider") {
            console.log("Restoring slider elements.");
            $(el).find('#subgoalList').show();
            $(el).find('#containeryo').show();
            $(el).find('#personaInfo').show();
        } else {
            console.log("Restoring tooltips and canvas.");
            document.getElementById('myToolTip').style.display = "block";
            document.getElementById('genderMagCanvasContainer').style.display = "block";
            closeSlider();
            el.contents().show();
        }
    });

    console.log("Event bindings completed for #sliderFinalWarning.");
}

/* Function Name: justExit
 * Description: Handles the "just exit" functionality, similar to `saveAndExit`.
 * Parameters: 
 *      exitType - type of exit, e.g., "slider"
 */
function justExit(exitType) {
    var el = sidebarBody().find('#sideBySide');
    console.log("Element for #sideBySide found:", el.length > 0);

    if (exitType === "slider") {
        el.contents().hide();
        appendTemplateToElement(el, '/templates/sliderFinalWarning.html', function (error) {
            if (error) {
                console.error("Error appending template:", error);
                return;
            }
            console.log("Template '/templates/sliderFinalWarning.html' appended successfully for slider exit.");
            sidebarBody().find('#saveAndExit').attr("hidden", true);
            sidebarBody().find('#justExit').attr("hidden", true);

            // Bind events after template is appended
            bindSliderFinalButtons(el, exitType);
        });
    } else {
        document.getElementById('myToolTip').style.display = "none";
        document.getElementById('genderMagCanvasContainer').style.display = "none";
        openSlider();
        el.contents().hide();
        appendTemplateToElement(el, '/templates/sliderFinalWarning.html', function (error) {
            if (error) {
                console.error("Error appending template:", error);
                return;
            }
            console.log("Template '/templates/sliderFinalWarning.html' appended successfully for non-slider exit.");
            sidebarBody().find('#saveAndExit').attr("hidden", true);
            sidebarBody().find('#justExit').attr("hidden", true);

            // Bind events after template is appended
            bindSliderFinalButtons(el, exitType);
        });
    }
}

//  ******** main walkthrough functions start here ********

/*
 * Function: editSubgoal
 * Description: This function handles editing the name of the current subgoal. Should only be called when user is
 *   creating the current subgoal and should not be called on any subgoal that is not the current subgoal.
 * Params: subgoalNum - number of the subgoal to edit (should be the current subgoal)
 */
function editSubgoal(subgoalNum){
	//Show subgoal name field, hide subgoal questions
	//sidebarBody function is from file utilities.js
	sidebarBody().find("#getSubgoal").show();
	sidebarBody().find("#subgoalQuestions").hide();
	sidebarBody().find("#subgoalFacets").hide();
	sidebarBody().find("#subgoalButtons").hide();
	sidebarBody().find("#editTeam").hide();
	sidebarBody().find("#editPersona").hide();
	sidebarBody().find("#editScenario").hide();

	function displayMainSubgoalInfo(subName) {
		sidebarBody().find('#subgoalHeading').html("Subgoal: " + subName);
		sidebarBody().find('#goalQuestion').html("Will " + personaName + 
							 " have formed this subgoal as a step to " + possessive +" overall goal?");
		sidebarBody().find('#goalFacets').html("Which (if any) of " + personaName + 
						       "'s facets did you use to answer the previous question?");
		sidebarBody().find("#getSubgoal").hide();
		sidebarBody().find("#subgoalQuestions").show();
		sidebarBody().find("#subgoalFacets").show();
		sidebarBody().find("#subgoalButtons").show();
	}

	//retrieve persona name from local storage, if it's not there somethings wrong
	var personaName = typeof getSessionPersonaDisplayName === "function"
		? getSessionPersonaDisplayName()
		: getSessionPersonaName();
    var pronoun = getSessionPersonaPronoun();
    var possessive = getSessionPersonaPossessive();
	if (!personaName) {
		console.log("persona name was null. Check your save");
	}
	//prompt subgoal rename
	sidebarBody().find("#subgoalPrompt").html("Rename subgoal \"" + getSessionCurrentSubgoalName() + "\":");
	var subgoals = getSubgoalArrayFromLocal();
	//fill the input box with existing subgoal name
	sidebarBody().find("#subgoalInput").val(subgoals[subgoalNum-1].name);

	//double check that user entered text before trying to submit
	sidebarBody().find('body').off('click', '#submitSubgoal').on('click', '#submitSubgoal', function() {
		if (sidebarBody().find("#subgoalInput").val() === "") {
			alert("Please name your subgoal before continuing");
		}
		else {
			//change the name in storage
			//var subgoalId = subgoalNum;
			var subName = sidebarBody().find("#subgoalInput").val();

			//Display subgoal questions again
       displayMainSubgoalInfo(subName);

			//update the subgoal
			var subgoal = subgoals[subgoalNum-1];
			saveSubgoal(subgoalNum, subName, subgoal.ynm, subgoal.why, subgoal.facetValues, subgoal.actions);
		}
	});

	//cancels editing the subgoal
	sidebarBody().find('body').off('click', '#cancelSubgoal').on('click', '#cancelSubgoal', function() {
			//Display subgoal questions again
			displayMainSubgoalInfo(getSessionCurrentSubgoalName());
	});

}

// Gathers the user's responses and saves them to the subgoal
// Assumes subgoalArray already exists
function storeSubgoalInfo(subgoalId){
	var subgoal = refreshSubgoalInfo(subgoalId);
	console.log("subgoal from refreshSubgoal in storeSubgoal is",subgoal);
    var yesNoMaybe = {"yes": sidebarBody().find("#yes").is(":checked"),
		"no": sidebarBody().find("#no").is(":checked"),
		"maybe": sidebarBody().find("#maybe").is(":checked")};
    var whyText = sidebarBody().find('#A0Q0whyYes').val();
    if (whyText === "") {
        whyText = sidebarBody().find('#A0Q0Response').html();
    }
    var facets = collectFacetSelections(sidebarBody().find("#subgoalFacetOptions"));
    saveSubgoal(subgoalId, subgoal.name, yesNoMaybe, whyText, facets, subgoal.actions);
	updateSessionState(function (state) {
		state.currentStep = "subgoalQuestions";
		state.currentSubgoalId = Number(subgoalId);
	}, "Saved subgoal answers in sessionState.");
}

// Helper function: draws actions in the right place
function preDrawAction(subgoalId){
	//increase number of actions and draw action
    console.log("preDrawAction called with subgoalId:", subgoalId);
    drawAction(getSessionNextActionId(getSessionState(), subgoalId), subgoalId);
    console.log("preDrawAction completed for subgoalId:", subgoalId);
}

/*
 * Function: drawSubgoal
 * Description: This function handles displaying information for a given subgoal including displaying previously saved
 *   information and saving newly entered information.
 * Params: subgoalId - id of the subgoal to display (may or may not be the current subgoal).
 *
 * TODO: This function needs refactoring. A number of problems are arising because of state changes 
 * that happen in the middle of execution.
 */
function drawSubgoal(subgoalId) {
    var id = "#GenderMagFrame";
    var file = "/templates/subgoal.html";

    var sessionState = typeof getSessionState === "function" ? getSessionState() : null;
    var sessionSubgoal = getSessionSubgoalById(subgoalId, sessionState);
    var isSetSubgoalQuestions = Boolean(
        sessionSubgoal &&
        (
            sessionSubgoal.why ||
            (sessionSubgoal.ynm && (sessionSubgoal.ynm.yes || sessionSubgoal.ynm.no || sessionSubgoal.ynm.maybe)) ||
            (sessionSubgoal.actions && sessionSubgoal.actions.length > 0)
        )
    );

    // Get current subgoal, empty the question container, and add in subgoal questions
    var personaName = typeof getSessionPersonaDisplayName === "function"
        ? getSessionPersonaDisplayName(sessionState)
        : getSessionPersonaName(sessionState);
    var pronoun = getSessionPersonaPronoun(sessionState);
    var possessive = getSessionPersonaPossessive(sessionState);
    var subName = sessionSubgoal && sessionSubgoal.name ? sessionSubgoal.name : getSessionCurrentSubgoalName(sessionState);

    var el = $(id).contents().find('#containeryo');
    el.empty();

    // Append the template to the element
    appendTemplateToElement(el, file, function (error) {
        if (error) {
            console.error("Error appending template in drawSubgoal:", error);
            return;
        }

        sidebarBody().find('#subgoalHeading').html("Subgoal: " + subName);
        sidebarBody().find('#goalQuestion').html(
            "Will " + personaName + " have formed this subgoal as a step to " + possessive + " overall goal?"
        );
        sidebarBody().find('#goalFacets').html(
            "Which (if any) of " + personaName + "'s facets did you use to answer the previous question?"
        );
		renderFacetOptions(sidebarBody().find("#subgoalFacetOptions"), {
			idPrefix: "subgoalFacet",
			enableFacetTooltips: false
		});

        // If subgoal questions are already answered
        if (isSetSubgoalQuestions) {
            // Retrieve and populate the subgoal information
            var subgoal = refreshSubgoalInfo(subgoalId);
            var subgoals = getSubgoalArrayFromLocal();
            console.log("subgoal is",subgoal);
            console.log("subgoals are",subgoals);

            sidebarBody().find('#editSubName').hide();
            sidebarBody().find('#addAction').hide();

            sidebarBody().find('#A0Q0Response').html(subgoal.why);
            sidebarBody().find('#A0Q0whyYes').hide();

            sidebarBody().find('#yes').prop("checked", subgoal.ynm.yes);
            sidebarBody().find('#no').prop("checked", subgoal.ynm.no);
            sidebarBody().find('#maybe').prop("checked", subgoal.ynm.maybe);

            applyFacetSelections(sidebarBody().find("#subgoalFacetOptions"), subgoal.facetValues);

            sidebarBody().find('#editSubgoal').show();

            // Button to edit 'why' text
            sidebarBody().find('#editSubgoal').unbind("click").click(function () {
                sidebarBody().find("#editSubgoal").hide();
                sidebarBody().find('#addAction').hide();
                sidebarBody().find("#A0Q0whyYes").show();
                sidebarBody().find("#A0Q0whyYes").html(subgoal.why);
                sidebarBody().find('#submitWhy').show();
            });

            // Button to submit 'why' text
            sidebarBody().find('#submitWhy').unbind("click").click(function () {
                sidebarBody().find('#submitWhy').hide();
                sidebarBody().find("#editSubgoal").show();
                storeSubgoalInfo(subgoalId);
                subgoal = refreshSubgoalInfo(subgoalId);
                sidebarBody().find('#A0Q0Response').html(subgoal.why);
                sidebarBody().find('#A0Q0whyYes').hide();
            });

            // Only allow editing or continuing the latest subgoal
            if (subgoalId == subgoals.length) {
                sidebarBody().find('#editSubName').show();
                sidebarBody().find('body')
                    .off('click', '#editSubName')
                    .on('click', '#editSubName', function () {
                        editSubgoal(subgoalId);
                    });

                sidebarBody().find('#addAction').show();
                sidebarBody().find('#editSubgoal').show();

                // "Save and Continue" button to save the subgoal and call draw action function
                sidebarBody().find('body')
                    .off('click', '#addAction')
                    .on('click', '#addAction', function () {
                        storeSubgoalInfo(subgoalId);
                        preDrawAction(subgoalId);
                    });
            }
        }
        else {
            sidebarBody().find('body').off('click', '#editSubName').on('click', '#editSubName', function () {
                    editSubgoal(subgoalId);
                });

            sidebarBody().find('#editSubgoal').hide();

            sidebarBody().find('body').off('click', '#addAction').on('click', '#addAction', function () {
                    storeSubgoalInfo(subgoalId);
                    console.log("preDrawAction called from drawSubgoal with subgoalId:", subgoalId);
                    preDrawAction(subgoalId);
                });
        }
    });
}

/*
 * Function: drawAction
 * Description: This function handles getting the action name from the user and getting ready for the
 *   screen capture as well as calling the function for the screen capture.
 * Params: actionNum - number of the action to draw, subgoalId - id of the subgoal corresponding to
 *   the action
 */
//refactored mv3 update
function drawAction(actionNum, subgoalId) {
    var id = "#GenderMagFrame";
    var file = "/templates/actionPrompt.html";

    // Empty the question container and put in the action questions
    var el = $(id).contents().find('#containeryo');
    el.empty();
    
    appendTemplateToElement(el, file, function (error) {
        if (error) {
            console.error("Error appending template in drawAction:", error);
            return;
        }

        console.log("Template appended successfully in drawAction.");

        var actionName = "THE ACTION NAME";
        var sessionState = typeof getSessionState === "function" ? getSessionState() : null;
        var isCurrentDraftAction = Boolean(
            sessionState &&
            sessionState.currentStep === "actionPrompt" &&
            Number(sessionState.currentSubgoalId) === Number(subgoalId) &&
            Number(sessionState.currentActionId) === Number(actionNum) &&
            sessionState.draftAction &&
            sessionState.draftAction.name
        );

        // Retrieve subgoal array from local storage
        var currArray = getSubgoalArrayFromLocal();

        if (isCurrentDraftAction) {
            console.log("Action name found in sessionState draftAction.");
            actionName = sessionState.draftAction.name;
            sidebarBody().find('#getActionName').hide();
            sidebarBody().find('#actionNameGot').html("<b> Action: " + actionName + "</b>");
            sidebarBody().find('#actionNameGot').show();
            sidebarBody().find("#promptAction").show();
        }
        else if (currArray && currArray[subgoalId - 1] && currArray[subgoalId - 1].actions && actionNum <= currArray[subgoalId - 1].actions.length) {
            console.log("Action already saved, retrieving from subgoalArray.");
            if (actionNum > currArray[subgoalId - 1].actions.length) {
                actionName = getSessionCurrentActionName(sessionState);
            } else {
                actionName = currArray[subgoalId - 1].actions[actionNum - 1].name;
            }
            sidebarBody().find('#getActionName').hide();
            sidebarBody().find('#actionNameGot').html("<b> Action: " + actionName + "</b>");
            sidebarBody().find('#actionNameGot').show();
            sidebarBody().find("#promptAction").show();
        }

        // Add onclicks
        sidebarBody().find('#submitActionName').unbind("click").click(function () {
            actionName = sidebarBody().find("#actionNameInput").val();
            console.log("Action name submitted:", actionName);
            if (actionName === "" && !isCurrentDraftAction) {
                alert("Please name your action before continuing");
            }
            else {
                var actionItem = {
                    name: actionName,
                    actionId: actionNum,
                    subgoalId: subgoalId
                };
                console.log("Saving action item:", actionItem);
                var yesNoMaybe = { "yes": false, "no": false, "maybe": false };
                var whyText = "";
                var facets = {
                    "motiv": false,
                    "info": false,
                    "self": false,
                    "risk": false,
                    "tinker": false,
                    "none": false
                };
                updateSessionState(function (state) {
                    state.currentStep = "actionPrompt";
                    state.currentSubgoalId = subgoalId;
                    state.currentActionId = actionNum;
                    state.screenshot.imageUrl = "";
                    state.screenshot.sourceX = 0;
                    state.screenshot.sourceY = 0;
                    state.draftAction = {
                        id: actionNum,
                        subgoalId: subgoalId,
                        name: actionName,
                        screenshot: {
                            imageUrl: "",
                            sourceX: 0,
                            sourceY: 0
                        },
                        preAction: {
                            ynm: { "yes": false, "no": false, "maybe": false },
                            why: "",
                            facetValues: {
                                "motiv": false,
                                "info": false,
                                "selfE": false,
                                "risk": false,
                                "tinker": false,
                                "none": false
                            }
                        },
                        postAction: {
                            ynm: { "yes": false, "no": false, "maybe": false },
                            why: "",
                            facetValues: {
                                "motiv": false,
                                "info": false,
                                "selfE": false,
                                "risk": false,
                                "tinker": false,
                                "none": false
                            }
                        },
                        status: "named"
                    };
                }, "Created draftAction after action name submission.");

                sidebarBody().find('#getActionName').hide();
                sidebarBody().find('#actionNameGot').html("<b> Action: " + actionName + "</b>");
                sidebarBody().find('#actionNameGot').show();
                sidebarBody().find("#promptAction").show();

                if (actionNum > currArray[subgoalId - 1].actions.length) {
                    addToSandwich("idealAction", actionItem);
                }

                // Attach toggle functionality here
                // document.getElementById("yes").addEventListener("change", () => toggleTextbox("yes", "BwhyYes"));
                // document.getElementById("no").addEventListener("change", () => toggleTextbox("no", "BwhyNo"));
                // document.getElementById("maybe").addEventListener("change", () => toggleTextbox("maybe", "BwhyMaybe"));
                
                sidebarBody().find("#editAction").show();
                sidebarBody().find("#editAction").unbind("click").click(function () {
                    sidebarBody().find('#editAction').hide();
                    sidebarBody().find('#getActionName').show();
                    sidebarBody().find('#actionNamePrompt').hide();
                    sidebarBody().find("#promptAction").hide();
                    updateSessionState(function (state) {
                        if (state.currentStep === "actionPrompt") {
                            state.currentStep = "subgoalQuestions";
                        }
                    }, "Returned from action prompt edit to subgoal questions.");
                });
            }
        });

        // User can press enter instead of clicking submit
        sidebarBody().find("#actionNameInput").keyup(function (event) {
            if (event.keyCode === 13) {
                sidebarBody().find("#submitActionName").click();
            }
        });

        // Call overlay screen function when user is ready for screen capture
        sidebarBody().find('body').off('click', '#overlayTrigger').on('click', '#overlayTrigger', function () {
            console.log("Overlay trigger clicked, preparing for screen capture.");
            console.log("checking sessionState for tooltip recovery:", sessionState && sessionState.currentStep);
            if (document.getElementById("myToolTip")) {
                var justTheToolTip = document.getElementById("myToolTip");
                $(justTheToolTip).remove();
            }
            overlayScreen();
        });

        // When back button is clicked, get rid of the action stuff and go back to subgoal
        sidebarBody().find("#promptActionBack").unbind("click").click(function () {
            el.empty();
            drawSubgoal(getSessionState().currentSubgoalId);
        });
    });
}

/*
 * Function: reloadToolTipState
 * Description: This function handles returning the tool to the correct location in the session when the page
 *	 is reloaded. It checks which flags are set starting with the finished flag and ending with the
 *	 screenshot flag.
 * Params: none
 */
 function reloadToolTipState () {
	//set up tool tip (skipping screenshot) and wait for the tooltip template
	//to finish loading before applying the recovered state.
	overlayScreen("onlyToolTip", function (toolTip) {
		var sessionState = typeof getSessionState === "function" ? getSessionState() : null;

		if (sessionState && sessionState.currentStep) {
			console.log("[sessionState] Attempting tooltip recovery from currentStep:", sessionState.currentStep);

			switch (sessionState.currentStep) {
				case "finished":
					$(toolTip).find("#imageCanvasTemplate").hide();
					actionLoop(toolTip);
					$("#saveAndExit").click();
					return;
				case "actionLoop":
					$(toolTip).find("#imageCanvasTemplate").hide();
					actionLoop(toolTip);
					return;
				case "postActionQuestions":
					$(toolTip).find("#imageCanvasTemplate").hide();
					postActionQuestions(toolTip);
					return;
				case "doActionPrompt":
					$(toolTip).find("#imageCanvasTemplate").hide();
					doActionPrompt(toolTip);
					return;
				case "preActionQuestions":
					$(toolTip).find("#imageCanvasTemplate").hide();
					preActionQuestions(toolTip);
					return;
				case "screenshotPreview":
					console.log("[sessionState] Restored screenshot preview from sessionState.");
					return;
				default:
					console.log("[sessionState] No direct tooltip recovery mapping for currentStep:", sessionState.currentStep);
					return;
			}
		}
	});
}
