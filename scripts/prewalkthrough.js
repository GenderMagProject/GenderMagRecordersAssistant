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
function preWalkthrough (id, file) {
	var el = $(id).contents().find('body');
	el.empty();
	appendTemplateToElement(el,file);
	makeEditable();
	handlePreWalkthroughInfo();
	sidebarBody().find('body').off('click', '#saveAndExit').on('click', '#saveAndExit', function() {
		saveAndExit("slider");
	});
	sidebarBody().find('body').off('click', '#justExit').on('click', '#justExit', function() {
		justExit("slider");
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
function handlePreWalkthroughInfo () {
	
	//var sidebarHead = $("#mySidebar").contents().find("head");

	//Set team name
	//If the state variable is set, reload previous input
	var isSetTeam = statusIsTrue("gotTeamName");
	if (isSetTeam) {
		//Hide initial instructions
		sidebarBody().find("#explain").hide();

		sidebarBody().find("#teamName").html("<b>Team:</b> "+ getVarFromLocal("teamName") );
		sidebarBody().find("#editTeam").show();
		sidebarBody().find("#getTeam").hide();
		if( localStorage.getItem("inGetPersona") !== "true") {
			sidebarBody().find("#getPersona").show();
		}
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
				saveVarToLocal("teamName", teamName);
				setStatusToTrue("gotTeamName");

				//Display team name and edit button
				sidebarBody().find("#teamName").html("<b>Team:</b> " + teamName);
				sidebarBody().find("#editTeam").show();
				sidebarBody().find("#getTeam").hide();
				sidebarBody().find("#getPersona").show();
				//Hide the initial instructions
				sidebarBody().find("#explain").hide();
			}
		});
	}

	//If the state variable is set, reload previous input
	var isSetPersona = statusIsTrue("gotPersonaName");
	if (isSetPersona) {
		//Restore from previous state
		var personaName = getVarFromLocal("personaName");
		sidebarBody().find("#personaName").html("<b>Persona:</b> " + personaName);
		loadPersona(personaName);
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
			//Get and save persona selection
			var personaName = sidebarBody().find("#personaSelection").val();
			saveVarToLocal("personaName", personaName);
            setStatusToTrue("gotPersonaName");

			//Display persona selection and related info
			sidebarBody().find("#personaName").html("<b>Persona:</b> " + personaName);
			loadPersona(personaName);
			sidebarBody().find("#personaInfo").show();
			var pronoun = localStorage.getItem('personaPronoun');
			var possessive = localStorage.getItem('personaPossessive');
			sidebarBody().find("#getPersona").children().hide();
			sidebarBody().find("#getPersona").hide();

            //show persona pronouns
			sidebarBody().find("#getPersonaPronoun").show();
		});
	}

	var isSetPronoun = statusIsTrue("gotPronoun");
	if (isSetPronoun) {
		//Restore from previous state
		//Get and save scenario name
		var pronoun = getVarFromLocal("pronoun");
		var possessive = getVarFromLocal("possessive");
		var personaName = getVarFromLocal("personaName");
		sidebarBody().find("#getPersonaPronoun").hide();

		if( localStorage.getItem("inGetScenario") !== "true") {
			//Show Scenario
			sidebarBody().find("#getScenario").show();
			//sidebarBody().find("#getScenario").children().show();
			sidebarBody().find("#scenarioPrompt").html("Take a moment to describe the scenario " 
								   + personaName + " will be performing");
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
			if(personaPronoun === "" || personaPossessive === ""){
				alert("Please enter both the pronoun and possessive adjective.");
			}
			else {
				saveVarToLocal("personaPronoun", personaPronoun);
				saveVarToLocal("personaPossessive", personaPossessive);

				var personaName = getVarFromLocal("personaName");
				setStatusToTrue("gotPronoun");
				sidebarBody().find("#getPersonaPronoun").hide();
				sidebarBody().find("#getScenario").show();
				sidebarBody().find("#scenarioPrompt").html("Take a moment to describe the scenario " 
									   + personaName + " will be performing");
				sidebarBody().find("#editPersona").show();
				personaShown = true;
			}
			updatePronouns();
		});
	}
	
	//Get scenario name
	//If the state variable is set, reload previous input
	var isSetScenario = statusIsTrue("gotScenarioName");
	if (isSetScenario) {
		//Restore from previous state
		//Get and save scenario name
		var scenarioName = getVarFromLocal("scenarioName");
		
		//Display scenario and related info
		sidebarBody().find("#scenarioName").html("<b>Scenario:</b> " + scenarioName);
		sidebarBody().find("#editScenario").show();
		
		sidebarBody().find("#getScenario").children().hide();
		sidebarBody().find("#getScenario").hide();
		
		if( localStorage.getItem("inGetScenario") !== "true") {
			//Show subgoal from local storage
			sidebarBody().find("#getSubgoal").show();
			sidebarBody().find("#setup").hide();
			var personaName = getVarFromLocal("personaName");
			if (!personaName) {
				console.log("persona name was null. Check your save");
			}
			//prompt for subgoal name - can use submit button or enter key
			sidebarBody().find("#subgoalPrompt").html("Now that you've completed the initial setup, enter a subgoal for " 
								  + personaName + " to perform");
			sidebarBody().find("#subgoalInput").keyup(function(event){
				if(event.keyCode == 13){
					sidebarBody().find("#submitSubgoal").unbind( "click" ).click();
				} 
			});
		}
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
				saveVarToLocal("scenarioName", scenarioName);
				setStatusToTrue("gotScenarioName");
				setStatusToTrue("finishedPrewalkthrough");

				//Display scenario and related info
				sidebarBody().find("#scenarioName").html("<b>Scenario:</b> " + scenarioName);
				sidebarBody().find("#editScenario").show();

				sidebarBody().find("#getScenario").children().hide();
				sidebarBody().find("#getScenario").hide();

				//Show subtask
				sidebarBody().find("#getSubgoal").show();
				sidebarBody().find("#setup").hide();

				var personaName = getVarFromLocal("personaName");
				if (!personaName) {
					console.log("persona name was null. Check your save");
				}
				sidebarBody().find("#subgoalPrompt").html("Now that you've completed the initial setup, enter a subgoal for " 
									  + personaName + " to perform");
				sidebarBody().find("#subgoalInput").keyup(function (event) {
					if (event.keyCode == 13) {
						sidebarBody().find("#submitSubgoal").unbind("click").click();
					}
				});
			}
		});
	}
	
	
	//If the state variable is set, reload previous input
	var isSetSubName = statusIsTrue("gotSubgoalName");
	if (isSetSubName) {
		//Restore from previous state
		sidebarBody().find("#welcomeText").html("GenderMag Recorder's Assistant: <i>In Session</i>");

		var subgoalArray = getSubgoalArrayFromLocal();
		if (!subgoalArray) {
			//They haven't saved any subgoals yet, but they have the name
			//var subName = localStorage.getItem("currSubgoalName");
			sidebarBody().find("#editTeam").hide();
			sidebarBody().find("#editPersona").hide();
			sidebarBody().find("#editScenario").hide();
			var subgoalId = localStorage.getItem("numSubgoals");
			if(subgoalId == null){
				subgoalId = 1;
				localStorage.setItem("numSubgoals", subgoalId);
			}
			drawSubgoal(subgoalId);
		}
		else {
			//They have subgoals
			//var subName = localStorage.getItem("currSubgoalName");
			var subgoalId = localStorage.getItem("numSubgoals");
			if(subgoalId == null){
				subgoalId = 1;
				localStorage.setItem("numSubgoals", subgoalId);
			}
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
                var subgoalId = localStorage.getItem("numSubgoals");
                setStatusToTrue("gotSubgoalName");
                var subName = sidebarBody().find("#subgoalInput").val();
                localStorage.setItem("currSubgoalName", subName);
                if(subgoalId == null){
                    subgoalId = 1;
                    localStorage.setItem("numSubgoals", subgoalId);
                }
                else{
                    subgoalId++;
                    localStorage.setItem("numSubgoals", subgoalId);
                    
                }
				//save a dummy subgoal so it can be reached again if the user clicks away
                saveSubgoal(subgoalId, subName, 0, "", 0);
                drawSubgoal(subgoalId);
            }
		});
	}
	
}

