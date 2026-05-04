/*
 * File: prewalkthrough.js
 * Functions: preWalkthrough,
 * Description: This file has functions to handle the slider walkthrough from the beginning to the scenario section
 * where it calls drawsubgoal
 */

/* Function: preWalkthrough
 * Description: This function appends the HTML template found in <file> to the element with the ID of <id>
 *   then calls the handlePreWalkthroughInfo() function, which gets the user's team name, persona choice, and scenario
 *   name and puts the first subgoal template on the screen.
 * Params:
 * 		id: the id of the element to which the template will be appended
 * 		file: the LOCAL path of the template to use (e.g., "/templates/popup.html")
 *
 * Pre: Element must exist
 * Post: The template is appended to that element, and the user has filled out the prewalkthrough information.
 * 	The user is on the first subgoal.
 */
function preWalkthrough (id, file, onReady, options) {
	var el = $(id).contents().find('body');
	var walkthroughOptions = options || {};
	el.empty();
	//appendTemplateToElement(el,file);
	appendTemplateToElement(el, file, function (error) {
		if (error) {
			console.error("Error appending template in preWalkthrough:", error);
		} else {
			console.log("Template appended successfully in preWalkthrough.");
			makeEditable();
			handlePreWalkthroughInfo(walkthroughOptions);
			sidebarBody().find('body').off('click', '#saveAndExit').on('click', '#saveAndExit', function() {
				saveAndExit("slider");
			});
			sidebarBody().find('body').off('click', '#justExit').on('click', '#justExit', function() {
				justExit("slider");
			});
			if (typeof onReady === "function") {
				onReady();
			}
		}
	});
}

function syncPrewalkthroughSessionState(mutatorFn, context) {
	if (typeof updateSessionState === "function") {
		return updateSessionState(mutatorFn, context);
	}
	return null;
}

function getDisplayedPersonaLabel(state) {
	var sessionState = state || (typeof getSessionState === "function" ? getSessionState() : null);
	var personaType = typeof getSessionPersonaType === "function" ? getSessionPersonaType(sessionState) : "Abi";
	var personaName = typeof getSessionPersonaName === "function" ? getSessionPersonaName(sessionState) : personaType;

	if (personaType === DIY_PERSONA_TYPE) {
		return personaName && personaName !== DIY_PERSONA_TYPE ? personaName : DIY_PERSONA_OPTION_LABEL;
	}

	return personaName;
}

function setPersonaHeaderLabel(state) {
	sidebarBody().find("#personaName").html("<b>Persona:</b> " + getDisplayedPersonaLabel(state));
}

function showScenarioSetupScreen(state) {
	var sessionState = state || (typeof getSessionState === "function" ? getSessionState() : null);
	var personaName = typeof getSessionPersonaDisplayName === "function"
		? getSessionPersonaDisplayName(sessionState)
		: getSessionPersonaName(sessionState);

	sidebarBody().find("#getScenario").children().show();
	sidebarBody().find("#getScenario").show();
	sidebarBody().find("#scenarioPrompt").html("Take a moment to describe the scenario "
		+ personaName + " will be performing");

	if (typeof isSessionDiyPersona === "function" && isSessionDiyPersona(sessionState)) {
		loadPersona(DIY_PERSONA_TYPE, { mode: "summary", state: sessionState });
	}
}

function showSubgoalSetupScreen(state) {
	var sessionState = state || (typeof getSessionState === "function" ? getSessionState() : null);
	var personaName = typeof getSessionPersonaDisplayName === "function"
		? getSessionPersonaDisplayName(sessionState)
		: getSessionPersonaName(sessionState);

	sidebarBody().find("#getSubgoal").children().show();
	sidebarBody().find("#getSubgoal").show();
	sidebarBody().find("#setup").hide();
	sidebarBody().find("#subgoalPrompt").html("Now that you've completed the initial setup, enter a subgoal for "
		+ personaName + " to perform");
	sidebarBody().find("#subgoalInput").keyup(function(event){
		if(event.keyCode == 13){
			sidebarBody().find("#submitSubgoal").unbind( "click" ).click();
		}
	});

	if (typeof isSessionDiyPersona === "function" && isSessionDiyPersona(sessionState)) {
		loadPersona(DIY_PERSONA_TYPE, { mode: "summary", state: sessionState });
	}
}

function setDiyFacetValidation(message) {
	$("#diyFacetValidation").text(message || "");
}

function buildDiyFacetRow(rowIndex, facetData) {
	var facet = facetData || {};
	var selectedScale = facet.scale || "Medium";
	var facetName = typeof escapePersonaHtml === "function" ? escapePersonaHtml(facet.name || "") : (facet.name || "");
	var facetDescription = typeof escapePersonaHtml === "function" ? escapePersonaHtml(facet.description || "") : (facet.description || "");

	return [
		"<div class=\"diyFacetRow\" data-row-index=\"", rowIndex, "\" style=\"display:flex; gap:10px; margin-bottom:10px; align-items:flex-start;\">",
		"<input type=\"text\" class=\"diyFacetName\" style=\"width:22%;\" placeholder=\"Facet name\" value=\"", facetName, "\">",
		"<textarea class=\"diyFacetDescription\" rows=\"2\" style=\"width:53%;\" placeholder=\"Facet description\">", facetDescription, "</textarea>",
		"<select class=\"diyFacetScale\" style=\"width:20%;\">",
		"<option value=\"Low\"", selectedScale === "Low" ? " selected" : "", ">Low</option>",
		"<option value=\"Medium\"", selectedScale === "Medium" ? " selected" : "", ">Medium</option>",
		"<option value=\"High\"", selectedScale === "High" ? " selected" : "", ">High</option>",
		"</select>",
		"</div>"
	].join("");
}

function addDiyFacetRow(facetData) {
	var rows = $("#diyFacetRows .diyFacetRow");
	if (rows.length >= DIY_PERSONA_MAX_FACETS) {
		setDiyFacetValidation("You can add up to " + DIY_PERSONA_MAX_FACETS + " facets for now.");
		return false;
	}

	$("#diyFacetRows").append(buildDiyFacetRow(rows.length + 1, facetData));
	setDiyFacetValidation("");
	return true;
}

function collectDiyFacetRows() {
	var rows = [];

	$("#diyFacetRows .diyFacetRow").each(function (index) {
		rows.push({
			id: "diy-facet-" + (index + 1),
			name: $(this).find(".diyFacetName").val().trim(),
			description: $(this).find(".diyFacetDescription").val().trim(),
			scale: $(this).find(".diyFacetScale").val()
		});
	});

	return rows;
}

function closeDiyFacetModal() {
	$("#diyFacetModalBackdrop").remove();
}

function showDiyFacetModal(onSaveComplete) {
	closeDiyFacetModal();
	if (typeof ensureFloatingUiBaseStyles === "function") {
		ensureFloatingUiBaseStyles();
	}

	appendTemplateToElement("body", "/templates/custom/diyFacetModal.html", function (error) {
		if (error) {
			console.error("Error loading DIY facet modal:", error);
			return;
		}

		var existingFacets = typeof getSessionPersonaFacets === "function"
			? getSessionPersonaFacets()
			: [];

		if (existingFacets.length > 0) {
			existingFacets.forEach(function (facet) {
				addDiyFacetRow(facet);
			});
		} else {
			addDiyFacetRow();
		}

		if ($("#diyFacetModal").draggable) {
			$("#diyFacetModal").draggable({ handle: "#diyFacetModalHeader" });
		}

		$("#addDiyFacetRow").off("click").on("click", function (event) {
			event.preventDefault();
			event.stopPropagation();
			addDiyFacetRow();
		});

		$("#saveDiyFacetRows").off("click").on("click", function (event) {
			event.preventDefault();
			event.stopPropagation();

			var sessionState = typeof getSessionState === "function" ? getSessionState() : null;
			var personaName = typeof getSessionPersonaName === "function" ? getSessionPersonaName(sessionState) : "";
			var personaDescription = typeof getSessionPersonaDescription === "function" ? getSessionPersonaDescription(sessionState) : "";
			var diyFacets = collectDiyFacetRows();

			if (!personaName || personaName === DIY_PERSONA_TYPE) {
				setDiyFacetValidation("Please enter a persona name before saving facets.");
				return;
			}

			if (!personaDescription) {
				setDiyFacetValidation("Please enter a persona description before saving facets.");
				return;
			}

			if (diyFacets.length === 0) {
				setDiyFacetValidation("Please add at least one facet.");
				return;
			}

			for (var i = 0; i < diyFacets.length; i++) {
				if (!diyFacets[i].name || !diyFacets[i].description || ["Low", "Medium", "High"].indexOf(diyFacets[i].scale) < 0) {
					setDiyFacetValidation("Each facet needs a name, description, and Low/Medium/High scale.");
					return;
				}
			}

			var updatedState = syncPrewalkthroughSessionState(function (state) {
				state.currentStep = "prewalkthrough";
				state.persona.facets = diyFacets;
			}, "Saved DIY persona facets in sessionState.");

			closeDiyFacetModal();
			loadPersona(DIY_PERSONA_TYPE, { mode: "summary", state: updatedState });

			if (typeof onSaveComplete === "function") {
				onSaveComplete(updatedState);
			}
		});
	});
}

/* Function: makeEditable
 * Description: This function adds the functionality "Edit" buttons (e.g, for team name, persona, etc) - hide edit
 *   button and add edit fields to the slider section
 * Params: None
 *
 * Pre: The prewalkthrough template has been appended to the sidebar (so the elements that are referenced exist).
 * Post: The edit buttons allow the user to edit their input.
 */
function makeEditable () {
	
	//Team name button
	sidebarBody().find('body').off('click', '#editTeam').on('click', '#editTeam', function() {
		sidebarBody().find("#editTeam").hide();
		sidebarBody().find("#getTeam").show();
	});
	
	//Persona name button
	sidebarBody().find('body').off('click', '#editPersona').on('click', '#editPersona', function() {
		sidebarBody().find("#editPersona").hide();
		sidebarBody().find("#personaInfo").hide();
		sidebarBody().find("#personaInfo").empty();
		closeDiyFacetModal();
		sidebarBody().find("#getPersona").show();
		sidebarBody().find("#getPersona").children().show();
		sidebarBody().find("#getPersonaPronoun").show();
	});
	
	//Scenario name button
	sidebarBody().find('body').off('click', '#editScenario').on('click', '#editScenario', function() {
		sidebarBody().find("#editScenario").hide();
		sidebarBody().find("#getScenario").show();
		sidebarBody().find("#getScenario").children().show();
	});
	
}
//need to add description for below functions 
function handleTeamName(){
	//Set team name
	//If the state variable is set, reload previous input
	var sessionState = typeof getSessionState === "function" ? getSessionState() : null;
	var isSetTeam = Boolean(sessionState && sessionState.teamName);
	if (isSetTeam) {
		//Hide initial instructions
		sidebarBody().find("#explain").hide();

		sidebarBody().find("#teamName").html("<b>Team:</b> "+ sessionState.teamName );
		sidebarBody().find("#editTeam").show();
		sidebarBody().find("#getTeam").hide();
		sidebarBody().find("#getPersona").show();
	}
	//if not set, get and save info
	else {
		//user can use enter key or submit button
		sidebarBody().find("#teamInput").keyup(function(event){
			if(event.keyCode === 13){
				sidebarBody().find("#submitTeam").unbind( "click" ).click();
			} 
		});
		sidebarBody().find('body').off('click', '#submitTeam').on('click', '#submitTeam', function() {
			//Get and save team name
			var teamName = sidebarBody().find("#teamInput").val();
			if(teamName === ""){
				alert("Please enter a name");
			}
			else {
				syncPrewalkthroughSessionState(function (state) {
					state.currentStep = "prewalkthrough";
					state.teamName = teamName;
				}, "Saved team name in sessionState.");

				//Display team name and edit button, Hides #getTeam, shows #getPersona
				sidebarBody().find("#teamName").html("<b>Team:</b> " + teamName);
				sidebarBody().find("#editTeam").show();
				sidebarBody().find("#getTeam").hide();
				sidebarBody().find("#getPersona").show();
				sidebarBody().find("#explain").hide();
			}
		});
	}
}

function handlePersona(){
	//If the state variable is set, reload previous input
	var sessionState = typeof getSessionState === "function" ? getSessionState() : null;
	var isSetPersona = Boolean(
		sessionState &&
		sessionState.persona &&
		(sessionState.persona.name || sessionState.persona.selectedType)
	);
	if (isSetPersona) {
		//Restore from previous state
		var personaType = getSessionPersonaType(sessionState);
		sidebarBody().find("#personaSelection").val(personaType);
		setPersonaHeaderLabel(sessionState);
		loadPersona(personaType, {
			mode: personaType === DIY_PERSONA_TYPE && !sessionState.scenarioName ? "editor" : "summary",
			state: sessionState
		});
		sidebarBody().find("#personaInfo").show();
		sidebarBody().find("#getPersona").children().hide();
		sidebarBody().find("#getPersona").hide();
		sidebarBody().find("#editPersona").show();
		//show persona pronouns
		sidebarBody().find("#getPersonaPronoun").show();
		personaShown = true;

	}
	else {
		//Persona selection
		sidebarBody().find('body').off('click', '#submitPersona').on('click', '#submitPersona', function() {
			var personaType = sidebarBody().find("#personaSelection").val();
			var updatedState = syncPrewalkthroughSessionState(function (state) {
				var previousType = getSessionPersonaType(state);
				state.currentStep = "prewalkthrough";
				state.persona.selectedType = personaType;
				if (previousType !== personaType) {
					state.persona.pronoun = "";
					state.persona.possessive = "";
				}

				if (personaType === DIY_PERSONA_TYPE) {
					if (previousType !== DIY_PERSONA_TYPE) {
						state.persona.name = "";
						state.persona.description = "";
						state.persona.facets = [];
					}
				} else {
					state.persona.name = personaType;
					state.persona.description = "";
					state.persona.facets = [];
				}
			}, "Saved persona name in sessionState.");

			//Display persona selection and related info
			setPersonaHeaderLabel(updatedState);
			loadPersona(personaType, {
				mode: personaType === DIY_PERSONA_TYPE ? "editor" : "summary",
				state: updatedState
			});
			sidebarBody().find("#personaInfo").show();
			sidebarBody().find("#getPersona").children().hide();
			sidebarBody().find("#getPersona").hide();

            //show persona pronouns
			sidebarBody().find("#getPersonaPronoun").show();
		});
	}
}

function handlePronouns(){
	var sessionState = typeof getSessionState === "function" ? getSessionState() : null;
	var isSetPronoun = Boolean(sessionState && sessionState.persona && sessionState.persona.pronoun && sessionState.persona.possessive);
	if (isSetPronoun) {
		//Restore from previous state
		sidebarBody().find("#getPersonaPronoun").hide();

		if (isSessionDiyPersona(sessionState) && getSessionPersonaFacets(sessionState).length === 0 && !sessionState.scenarioName) {
			showDiyFacetModal(function (updatedState) {
				showScenarioSetupScreen(updatedState || getSessionState());
			});
		} else {
			showScenarioSetupScreen(sessionState);
		}
	}
	else{
		//enter get pronoun stuff here
		sidebarBody().find("#pronounInput").keyup(function(event){
			if(event.keyCode === 13){
				sidebarBody().find("#submitPronoun").unbind( "click" ).click();
			}
		});
		sidebarBody().find("#possessiveInput").keyup(function(event){
			if(event.keyCode === 13){
				sidebarBody().find("#submitPronoun").unbind( "click" ).click();
			}
		});
		sidebarBody().find('body').off('click', '#submitPronoun').on('click', '#submitPronoun', function() {

			//Get and save scenario name
			var personaPronoun = sidebarBody().find("#pronounInput").val();
			var personaPossessive = sidebarBody().find("#possessiveInput").val();
			var sessionStateBeforeSave = typeof getSessionState === "function" ? getSessionState() : null;
			var personaType = getSessionPersonaType(sessionStateBeforeSave);
			var diyPersonaName = sidebarBody().find("#diyPersonaNameInput").val().trim();
			var diyPersonaDescription = sidebarBody().find("#diyPersonaDescriptionInput").val().trim();
			if(personaPronoun === "" || personaPossessive === ""){
				alert("Please enter both the pronoun and possessive adjective.");
			}
			else if (personaType === DIY_PERSONA_TYPE && (diyPersonaName === "" || diyPersonaDescription === "")) {
				alert("Please enter both the DIY persona name and persona description before continuing.");
			}
			else {
				var updatedState = syncPrewalkthroughSessionState(function (state) {
					state.currentStep = "prewalkthrough";
					if (getSessionPersonaType(state) === DIY_PERSONA_TYPE) {
						state.persona.name = diyPersonaName;
						state.persona.description = diyPersonaDescription;
					}
					state.persona.pronoun = personaPronoun;
					state.persona.possessive = personaPossessive;
				}, "Saved persona pronouns in sessionState.");
				sidebarBody().find("#getPersonaPronoun").hide();
				setPersonaHeaderLabel(updatedState);
				sidebarBody().find("#editPersona").show();
				personaShown = true;

				if (getSessionPersonaType(updatedState) === DIY_PERSONA_TYPE) {
					showDiyFacetModal(function (savedState) {
						showScenarioSetupScreen(savedState || getSessionState());
					});
				} else {
					showScenarioSetupScreen(updatedState);
				}
			}
			updatePronouns();
		});
	}
}
function handleScenario(){
	//If the state variable is set, reload previous input
	var sessionState = typeof getSessionState === "function" ? getSessionState() : null;
	var isSetScenario = Boolean(sessionState && sessionState.scenarioName);
	if (isSetScenario) {
		//Restore from previous state
		//Get and save scenario name
		var scenarioName = sessionState.scenarioName;
		
		//Display scenario and related info
		sidebarBody().find("#scenarioName").html("<b>Scenario:</b> " + scenarioName);
		sidebarBody().find("#editScenario").show();
		
		sidebarBody().find("#getScenario").children().hide();
		sidebarBody().find("#getScenario").hide();
		showSubgoalSetupScreen(sessionState);
	}
	else {
		//can use enter key or submit button to submit scenario name
		sidebarBody().find("#scenarioInput").keyup(function(event){
			if(event.keyCode == 13){
				sidebarBody().find("#submitScenario").unbind( "click" ).click();
			} 
		});
		sidebarBody().find('body').off('click', '#submitScenario').on('click', '#submitScenario', function() {
			
			//Get and save scenario name
			var scenarioName = sidebarBody().find("#scenarioInput").val();
			if(scenarioName === ""){
				alert("Please enter the scenario name");
			}
			else {
				syncPrewalkthroughSessionState(function (state) {
					state.currentStep = "prewalkthrough";
					state.scenarioName = scenarioName;
				}, "Saved scenario name in sessionState.");

				//Display scenario and related info
				sidebarBody().find("#scenarioName").html("<b>Scenario:</b> " + scenarioName);
				sidebarBody().find("#editScenario").show();

				sidebarBody().find("#getScenario").children().hide();
				sidebarBody().find("#getScenario").hide();

				showSubgoalSetupScreen(getSessionState());
			}
		});
	}
}
function handleSubgoal(){
	//If the state variable is set, reload previous input
	var sessionState = typeof getSessionState === "function" ? getSessionState() : null;
	var isSetSubName = Boolean(sessionState && sessionState.currentSubgoalId);
	console.log("IS subgoal name set? ",isSetSubName);
	if (isSetSubName) {
		//Restore from previous state
		sidebarBody().find("#welcomeText").html("GenderMag Recorder's Assistant: <i>In Session</i>");

		var subgoalArray = sessionState && Array.isArray(sessionState.subgoals) ? sessionState.subgoals : [];
		if (!subgoalArray) {
			//They haven't saved any subgoals yet, but they have the name
			//var subName = localStorage.getItem("currSubgoalName");
			sidebarBody().find("#editTeam").hide();
			sidebarBody().find("#editPersona").hide();
			sidebarBody().find("#editScenario").hide();
			var subgoalId = sessionState.currentSubgoalId || 1;
			drawSubgoal(subgoalId);
		}
		else {
			//They have subgoals
			//var subName = localStorage.getItem("currSubgoalName");
			var subgoalId = sessionState.currentSubgoalId || 1;
                sidebarBody().find("#editTeam").hide();
                sidebarBody().find("#editPersona").hide();
                sidebarBody().find("#editScenario").hide();
			drawSubgoal(subgoalId);
			console.log("Drawn 2");
		}			
	}
	else {
		//Happens if gotSubgoalName is false
		sidebarBody().find('body').off('click', '#submitSubgoal').on('click', '#submitSubgoal', function() {
            if (sidebarBody().find("#subgoalInput").val() === "") {
                alert("Please name your subgoal before continuing");
            }
            else {
                sidebarBody().find("#welcomeText").html("GenderMag Recorder's Assistant: <i>In Session</i>");
                sidebarBody().find("#editTeam").hide();
                sidebarBody().find("#editPersona").hide();
                sidebarBody().find("#editScenario").hide();
                var subgoalId = getSessionNextSubgoalId();
                var subName = sidebarBody().find("#subgoalInput").val();
				//save a dummy subgoal so it can be reached again if the user clicks away
                saveSubgoal(subgoalId, subName, 0, "", 0);
				syncPrewalkthroughSessionState(function (state) {
					state.currentStep = "subgoalQuestions";
					state.currentSubgoalId = Number(subgoalId);
					state.currentActionId = null;
					state.draftAction = null;
					state.screenshot.imageUrl = "";
					state.screenshot.sourceX = 0;
					state.screenshot.sourceY = 0;
				}, "Started subgoal questions in sessionState.");
                drawSubgoal(subgoalId);
            }
		});
	}
}
/* Function: handlePreWalkthroughInfo
 * Description: This function handles the prewalkthrough information -- team name, persona choice, and scenario name.
 *   Also asks the user for each of these in turn, and leaves the template ready to set up for the subgoal.
 * Params: None
 *
 * Pre: The prewalkthrough template has been appended to the sidebar (so the elements that are referenced exist).
 * Post: The user's team name, persona selection, and scenario have been stored in the local storage variables:
 *			team name -> teamName
 *			persona choice -> personaName
 *			scenario -> scenarioName
 */

// TODO: Refactoring. This function might benefit from being broken up into smaller functions, and/or adding a way
// to periodically update variables like length of subgoalArray.
function handlePreWalkthroughInfo (options) {
	var walkthroughOptions = options || {};
	
	//var sidebarHead = $("#mySidebar").contents().find("head");
	//refactored files-- need to add description for methods
	handleTeamName();
	handlePersona();
	handlePronouns();
	//Get scenario name
	handleScenario();
	if (!walkthroughOptions.skipSubgoalStage) {
		handleSubgoal();
	}
	
	
	
}

