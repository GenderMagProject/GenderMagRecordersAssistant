/*
 * File Name: action.js
 * Functions: setFacetPopups, preActionQuestions, doActionPrompt, postActionQuestions, actionLoop, reloadToolTipState
 * Description: This file contains functions to handle the action part of the walkthrough starting right
 *   after the screenshot through the end and exit of the session
 */

function toSessionFacetValues(facets) {
    if (typeof toSessionFacets === "function") {
        return toSessionFacets(facets);
    }

    return facets || {};
}

function syncDraftActionState(mutatorFn, context) {
    if (typeof updateSessionState === "function") {
        return updateSessionState(mutatorFn, context);
    }
    return null;
}

function createDraftActionState(actionId, subgoalId, actionName) {
    return {
        id: actionId,
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
}

/*
 * Function: setFacetPopups
 * Description: This function handles non-custom persona names by adding tool tips.
 * Params: personaName
 */
function setFacetPopups(personaName) {
    var personaType = typeof getSessionPersonaType === "function" ? getSessionPersonaType() : personaName;
    if (isStandardGenderMagPersona(personaType)) {
        var lowercaseName = personaType.toLowerCase();
        //set functionality for motivation pop up info window
        $(".MTrigger").unbind("click").click(function () {
            addToolTip(lowercaseName+"MToolTip", personaType);
            /*$('#abbyMSeeMOAR').off('click').on('click', function () {
                var isOpen = $(this).attr("stateVar");

                //The "see more" is expanded and needs to be closed
                if (isOpen == 0) {
                    $("#abbyMPreview").hide();
                    $("#abbyMComplete").show();
                    $("#abbyMSeeMOAR").html("See less");
                    $(this).attr("stateVar", 1);
                } else {
                    $("#abbyMPreview").show();
                    $("#abbyMComplete").hide();
                    $("#abbyMSeeMOAR").html("See more...");
                    $(this).attr("stateVar", 0);
                }

            });*/
        });
        //set up other info pop ups
        $(".IPSTrigger").unbind("click").click(function () {
            addToolTip(lowercaseName+"IPSToolTip", personaType);

        });
        $(".SETrigger").unbind("click").click(function () {
            addToolTip(lowercaseName+"SEToolTip", personaType);

        });
        $(".RTrigger").unbind("click").click(function () {
            addToolTip(lowercaseName+"RToolTip", personaType);

        });
        $(".TTrigger").unbind("click").click(function () {
            addToolTip(lowercaseName+"TToolTip", personaType);

        });
    }
}

function renderActionFacetOptions(el, targetSelector, idPrefix) {
    renderFacetOptions($(el).find(targetSelector), {
        idPrefix: idPrefix,
        enableFacetTooltips: !isSessionDiyPersona()
    });
}

/*
 * Function: preActionQuestions
 * Description: This function handles the 'preaction questions' in the pop up window
 *	 These questions are the 'will <persona> know what to do at this step/why' page in the
 *	 pop up
 * Params: el - tooltip pop up element
 */
function preActionQuestions(el){
    //get persona name and pronouns to set question text
    var personaName = typeof getSessionPersonaDisplayName === "function"
        ? getSessionPersonaDisplayName()
        : getSessionPersonaName();
    var pronoun = getSessionPersonaPronoun();
    var possessive = getSessionPersonaPossessive();
    $(el).find("#preActQ").html("Will " + personaName+ " know what to do at this step?").attr("style","color:black");
    $(el).find("#preFacets").html("Which of " + personaName + 
				  "'s facets did you use to answer the above question?").attr("style","color:black");
    renderActionFacetOptions(el, "#preFacetOptions", "preFacet");

	//hide draw button and retake button, show preaction questions
    $(el).find("#annotateImage").hide();
    $(el).find("#retakeImage").hide();
    $(el).find("#imageCanvasTemplate").hide();
    $(el).find("#preActionTemplate").show();
    $(el).find("#imageCaption2").show();
    $(el).find("#HRmorelikefunpolice").show();

    var draftAction = typeof getSessionDraftAction === "function" ? getSessionDraftAction() : null;
    if (draftAction && draftAction.preAction) {
        $(el).find('#actionYes').prop("checked", Boolean(draftAction.preAction.ynm && draftAction.preAction.ynm.yes));
        $(el).find('#actionNo').prop("checked", Boolean(draftAction.preAction.ynm && draftAction.preAction.ynm.no));
        $(el).find('#actionMaybe').prop("checked", Boolean(draftAction.preAction.ynm && draftAction.preAction.ynm.maybe));
        $(el).find('#whyYes').val(draftAction.preAction.why || "");
        applyFacetSelections($(el).find("#preFacetOptions"), draftAction.preAction.facetValues || {});
    }

    //when save and continue button is clicked, save input values
    $(el).find("#preActionClose").off("click").on("click", function(event){
		event.preventDefault();
		event.stopPropagation();
		//(actionName)Currently save and then deletes this name before it can be called again
		var actionName = getSessionCurrentActionName();
		var yesNoMaybe = {"yes": $(el).find('#actionYes').is(":checked"),
			"no": $(el).find('#actionNo').is(":checked"),
			"maybe": $(el).find('#actionMaybe').is(":checked")};
		var whyText = $(el).find('#whyYes').val();
		var facets = collectFacetSelections($(el).find("#preFacetOptions"));

		var yesNoMaybePost = {"yes": false,
			"no": false,
			"maybe": false};
		var whyTextPost = "";
		var facetsPost = {"motiv": false,
			"info": false,
			"self": false,
			"risk": false,
			"tinker": false,
			"none": false};

        syncDraftActionState(function (state) {
            state.currentStep = "doActionPrompt";
            if (state.draftAction) {
                state.draftAction.preAction = {
                    ynm: yesNoMaybe,
                    why: whyText,
                    facetValues: toSessionFacetValues(facets)
                };
                state.draftAction.status = "preActionAnswered";
            }
        }, "Saved pre-action answers in sessionState.");
	doActionPrompt(el);
	});
	
	//when back button is clicked, show buttons, hide preaction
	$(el).find("#preActionBack").off("click").on("click", function(event){
		event.preventDefault();
		event.stopPropagation();
		//if popup is set up, change elements to be shown, else set up new pop up
        if (document.getElementById("myToolTip")) {
            $(el).find("#preActionTemplate").hide();
            $(el).find("#imageCanvasTemplate").show();
            $(el).find("#retakeImage").show();
			$(el).find("#annotateImage").show();
			$(el).find("#HRmorelikefunpolice").hide();
			$(el).find("#imageCaption2").hide();
            syncDraftActionState(function (state) {
                state.currentStep = "screenshotPreview";
                if (state.draftAction) {
                    state.draftAction.status = "screenshotPreview";
                }
            }, "Returned from pre-action questions to screenshot preview.");
        } else {
            renderImage();
        }
	});

	//Set up links by checkboxes to show info popups
    setFacetPopups(personaName);
}

/*
 *	Function: doActionPrompt
 *	Description: This function handles adding the action prompt to the pop up
 *	Params: el - tooltip pop up element
 */
function doActionPrompt(el){
	//hide preaction questions, show action prompt
	$(el).find("#imageCaption3").hide();
	$(el).find("#imageCaption2").show();	
	$(el).find("#imageCanvas").show();
	$(el).find("#preActionTemplate").hide();
    $(el).find("#doActionPromptTemplate").show();

    //hide canvas container so screen can be clicked
    var container = document.getElementById("genderMagCanvasContainer");
    container.style.display = "none";

    //add button functions
	$(el).find("#postAction").off("click").on("click", function(event){
        event.preventDefault();
        event.stopPropagation();
        syncDraftActionState(function (state) {
            state.currentStep = "postActionQuestions";
            if (state.draftAction) {
                state.draftAction.status = "performed";
            }
        }, "Moved from do-action prompt to post-action questions.");
		postActionQuestions(el);
	});
	//back button to return to preaction questions
	$(el).find("#doActionBack").off("click").on("click", function(event){
        event.preventDefault();
        event.stopPropagation();
		$(el).find("#doActionPromptTemplate").hide();
        $(el).find("#preActionTemplate").show();
        syncDraftActionState(function (state) {
            state.currentStep = "preActionQuestions";
            if (state.draftAction) {
                state.draftAction.status = "preActionAnswered";
            }
        }, "Returned from do-action prompt to pre-action questions.");
		preActionQuestions(el);
	});
	//continue link to go to postaction questions
	$(el).find(".continueTrigger").off("click").on("click", function(event){
        event.preventDefault();
        event.stopPropagation();
        container.style.display = "block";
        syncDraftActionState(function (state) {
            state.currentStep = "postActionQuestions";
            if (state.draftAction) {
                state.draftAction.status = "performed";
            }
        }, "Continued from do-action prompt to post-action questions.");
		postActionQuestions(el);
	});
}

/*
 * Function: postActionQuestions
 * Description: This function handles the post action questions (which are 'will <persona> know
 *   they did the right thing/why')
 * Params: el - tooltip pop up element
 */
function postActionQuestions(el){
    //get persona name and pronouns to set question text
    var personaName = typeof getSessionPersonaDisplayName === "function"
        ? getSessionPersonaDisplayName()
        : getSessionPersonaName();
    var pronoun = getSessionPersonaPronoun();
    var possessive = getSessionPersonaPossessive();
    $(el).find("#postActQ").html("If " + personaName + 
				 " did the right thing (what you just demonstrated), will " +
        pronoun + " know that " + pronoun + " did the right thing and is making progress toward " +
        possessive + " goal?").attr("style","color:black");
    $(el).find("#postFacets").html("Which of " + personaName +
				   "'s facets did you use to answer the above question?").attr("style","color:black");
    renderActionFacetOptions(el, "#postFacetOptions", "postFacet");

	//hide do action prompt, show post action questions
	$(el).find("#doActionPromptTemplate").hide();
    $(el).find("#postActionTemplate").show();
    $(el).find("#imageCaption2").hide();	
    $(el).find("#imageCanvas").hide();
    $(el).find("#imageCaption3").show();

    var draftAction = typeof getSessionDraftAction === "function" ? getSessionDraftAction() : null;
    if (draftAction && draftAction.postAction) {
        $(el).find('#YNMyes').prop("checked", Boolean(draftAction.postAction.ynm && draftAction.postAction.ynm.yes));
        $(el).find('#YNMno').prop("checked", Boolean(draftAction.postAction.ynm && draftAction.postAction.ynm.no));
        $(el).find('#YNMmaybe').prop("checked", Boolean(draftAction.postAction.ynm && draftAction.postAction.ynm.maybe));
        $(el).find('#postWhyYes').val(draftAction.postAction.why || "");
        applyFacetSelections($(el).find("#postFacetOptions"), draftAction.postAction.facetValues || {});
    }

	//link to show image preview again
	$(el).find("#afterb44lyfe").off("click").on("click", function(event){
        event.preventDefault();
        event.stopPropagation();
		$(el).find("#imageCaption2").show();
		$(el).find("#imageCanvas").show();
		$(el).find("#imageCaption3").hide();
	});

	//save and continue button - on click save input
	$(el).find("#submitPostAction").off("click").on("click", function(event){
        event.preventDefault();
        event.stopPropagation();
		var actionName = getSessionCurrentActionName();
		var yesNoMaybe = {"yes": $(el).find('#YNMyes').is(":checked"),
			"no": $(el).find('#YNMno').is(":checked"),
			"maybe": $(el).find('#YNMmaybe').is(":checked")};
		var whyText = $(el).find('#postWhyYes').val();
		var facets = collectFacetSelections($(el).find("#postFacetOptions"));
		savePostIdealAction(actionName, yesNoMaybe, whyText, facets);
        syncDraftActionState(function (state) {
            state.currentStep = "actionLoop";
            if (state.draftAction) {
                state.draftAction.postAction = {
                    ynm: yesNoMaybe,
                    why: whyText,
                    facetValues: toSessionFacetValues(facets)
                };
                state.draftAction.status = "complete";
            }
        }, "Saved post-action answers and entered action loop.");
        //move on to checking if user wants new subgoal or action or end session
		actionLoop(el);
	});

	$(el).find("#postActionBack").off("click").on("click", function(event){
        event.preventDefault();
        event.stopPropagation();
		$(el).find("#doActionPromptTemplate").show();
		$(el).find("#postActionTemplate").hide();
		$(el).find("#imageCaption2").show();
		$(el).find("#imageCanvas").show();
		$(el).find("#imageCaption3").hide();
        syncDraftActionState(function (state) {
            state.currentStep = "doActionPrompt";
            if (state.draftAction) {
                state.draftAction.status = "performed";
            }
        }, "Returned from post-action questions to do-action prompt.");

		doActionPrompt(el);
	});

	//set functionality for facet pop up info window
	setFacetPopups(personaName);
}

/*
 * Function: actionLoop
 * Description: This function handles asking the user if they want to make a new action or subgoal for their gm session
 *	 It also contains the save and exit functionality for the end of the gm session
 * Params: el - tooltip pop up element
 */
function actionLoop(el){
	//hide post action questions, show action loop (if user wants new subgoal/action or close session
	$(el).find("#postActionTemplate").hide();
    $(el).find("#imageCaption2").hide();	
	$(el).find("#HRmorelikefunpolice").hide();
	$(el).find("#imageCanvas").hide();
	$(el).find("#imageCaption3").hide();
    $(el).find("#retakeImage").hide();
    $(el).find("#annotateImage").hide();
	$(el).find("#actionLoopTemplate").show();

	//make new action on 'add another action' button click
	$(el).find("#moreActions").off("click").on("click", function(event){
		event.preventDefault();
		event.stopPropagation();
		if ($(el).find("#actionNameInput").val() == ""){
			alert("Please name your action before continuing");
		} else{
			//save action name, get screenshot, set up pop up, start action questions
			var actionName = $(el).find("#actionNameInput").val();
			var currentSessionState = typeof getSessionState === "function" ? getSessionState() : null;
			var nextSubgoalId = currentSessionState ? currentSessionState.currentSubgoalId : null;
			var nextActionId = getSessionNextActionId(currentSessionState, nextSubgoalId);
			addToSandwich('idealAction', {
                subgoalId: nextSubgoalId,
                actionId: nextActionId,
                name: actionName
            });
            var yesNoMaybe = {"yes": false,
                "no": false,
                "maybe": false};
            var whyText = "";
            var facets = {"motiv": false,
                "info": false,
                "self": false,
                "risk": false,
                "tinker": false,
                "none": false};
            var currentSubgoal = currentSessionState
                ? getSessionSubgoalById(currentSessionState.currentSubgoalId, currentSessionState)
                : null;
            syncDraftActionState(function (state) {
                state.currentStep = "actionPrompt";
                state.currentSubgoalId = nextSubgoalId || state.currentSubgoalId;
                state.currentActionId = nextActionId;
                state.screenshot.imageUrl = "";
                state.screenshot.sourceX = 0;
                state.screenshot.sourceY = 0;
                state.draftAction = createDraftActionState(nextActionId, state.currentSubgoalId, actionName);
            }, "Started another action from action loop in sessionState.");
			$(el).remove();
			overlayScreen("");
			preActionQuestions(el);

		}
	});

	//make new subgoal on 'create new subgoal' button click
	$(el).find("#newSubgoal").off("click").on("click", function(event){
		event.preventDefault();
		event.stopPropagation();
		if($(el).find("#subgoalInput").val() === ""){
			alert("Please name your subgoal before continuing");
		}
		else{
			//reset subgoal stats, set new name as current subgoal name
			var newSubgoalName = $(el).find("#subgoalInput").val();
			//remove tooltip
			$(el).remove();
        	//close canvas so page is clickable
        	document.getElementById('genderMagCanvasContainer').style.display="none";

        	//open slider and go back to subgoal questions
			openSlider();
			var numSubgoals = getSessionNextSubgoalId();
			//save a dummy subgoal so it can be reached again if the user clicks away
			saveSubgoal(numSubgoals, newSubgoalName, 0, "", 0);
            syncDraftActionState(function (state) {
                state.currentStep = "subgoalQuestions";
                state.currentSubgoalId = numSubgoals;
                state.currentActionId = null;
                state.draftAction = null;
                state.screenshot.imageUrl = "";
                state.screenshot.sourceX = 0;
                state.screenshot.sourceY = 0;
            }, "Started a new subgoal from action loop in sessionState.");
			drawSubgoal(numSubgoals); //creates undefined unnamed subgoal
		}
	});

	//exits the gendermag session
	function exit() {
		$(el).find("#actionLoopTemplate").hide();
		$(el).find("#theFinalCountDown").show();
		$(el).find("#exitButton").hide();

		//on click of redownload zip button, download sheet again
		$(el).find("#finalDownload").off("click").on("click", function (event) {
			event.preventDefault();
			event.stopPropagation();
			generateAndDownloadReport(false, "scripts/action.js:finalDownload");
		});

		$(el).find("#oldFormat").off("click").on("click", function (event) {
			event.preventDefault();
			event.stopPropagation();
			generateAndDownloadReport(true, "scripts/action.js:oldFormat");
		});

		//make sure user has downloaded their file before quitting
		$(el).find("#finalYesCheckbox").off("change").on("change", function (event) {
			event.stopPropagation();
			if ($(el).find('#finalYesCheckbox').is(":checked")) {
				$(el).find('#finalYes').prop('disabled', false);
				$(el).find("#finalYes").attr("style","background-color:#7D1935;color:white;");
			}
			else {
				$(el).find('#finalYes').prop('disabled', true);
				$(el).find("#finalYes").attr("style","background-color:#7D1935;color:white;opacity:0.5");
			}
		});	

		//final quit button clears local storage and reloads
		$(el).find("#finalYes").off("click").on("click", function (event) {
			event.preventDefault();
			event.stopPropagation();
			resetSessionState(function () {
				localStorage.clear(); 
				location.reload();
			});
		});

		//'I'm not done, take me back' button returns to action loop
		$(el).find("#finalNo").off("click").on("click", function (event) {
			event.preventDefault();
			event.stopPropagation();
			$(el).find('#theFinalCountDown').hide();
			$(el).find('#actionLoopTemplate').show();
			$(el).find('#exitButton').show();
            syncDraftActionState(function (state) {
                state.currentStep = "actionLoop";
            }, "Returned from final exit confirmation to action loop.");
		});
	}

	//TODO(roseg31) : Investigate this...
	//on save and exit button click, save all info, close session
	$(el).find("#saveAndExit").off("click").on("click", function(event){
		event.preventDefault();
		event.stopPropagation();
		//create and download sheet with session data
        syncDraftActionState(function (state) {
            state.currentStep = "finished";
        }, "Marked walkthrough as finished in sessionState.");
		generateAndDownloadReport(false, "scripts/action.js:saveAndExit");

		exit();
	});

	$(el).find("#justExit").off("click").on("click", function(event){
		event.preventDefault();
		event.stopPropagation();
        syncDraftActionState(function (state) {
            state.currentStep = "finished";
        }, "Marked walkthrough as finished in sessionState.");
		exit();
	});

	//back button returns to post action questions, resets got post action key
	$(el).find("#loopActionBack").off("click").on("click", function(event){
		event.preventDefault();
		event.stopPropagation();
		$(el).find("#actionLoopTemplate").hide();
        $(el).find("#postActionTemplate").show();
		$(el).find("#imageCanvas").show();
		$(el).find("#imageCaption2").show();
		$(el).find("#HRmorelikefunpolice").show();
        syncDraftActionState(function (state) {
            state.currentStep = "postActionQuestions";
            if (state.draftAction) {
                state.draftAction.status = "complete";
            }
        }, "Returned from action loop to post-action questions.");
		postActionQuestions(el);
	});
	
}



