/* Function preWalkthrough
 * Appends the HTML template found in <file> to the element with the ID of <id>. Then, calls the handlePreWalkthroughInfo() 
 * function, which gets the user's team name, persona choice, and scenario name and puts the first subgoal template on the screen.
 * 
 * Takes 2 arguements:
 * 		id: the id of the element to which the template will be appended
 * 		file: the LOCAL path of the template to use (e.g., "/templates/popup.html")
 *
 * Pre: Element must exist
 * Post: The template is appended to that element, and the user has filled out the prewalkthrough information. The user is 
 * 	on the first subgoal.
 */

function preWalkthrough (id, file) {

	var el = $(id).contents().find('body');
	el.empty();
	appendTemplateToElement(el,file);
	//seeMoreOnclick();
	nukeButtonOnclick();
	makeEditable();
	handlePreWalkthroughInfo();

}

/* Function seeMoreOnclick
 * 
 * Adds the functionality to the "See more..." link of the popup.html template.
 * 
 * Takes no arguments.
 *
 * Pre: The prewalkthrough template has been appended to the sidebar (so the elements that are referenced exist).
 * Post: The "see more..." link is functional.
 */
function seeMoreOnclick () {
	
	/*sidebarBody().find('body').off('click', '.moreOrLess').on('click', '.moreOrLess', function() {
		var isOpen = $(this).attr("stateVar");
		
		//The "see more" is expanded and needs to be closed
		if (isOpen == 1) {
			$(this).attr("stateVar", 0);
			isOpen = $(this).attr("stateVar");
			sidebarBody().find(".complete").hide();
			sidebarBody().find(".preview").show();
			sidebarBody().find(".moreOrLess").html("See more");
		}
		
		//The "see more" is closed and needs to be expanded
		else {
			$(this).attr("stateVar", 1);
			isOpen = $(this).attr("stateVar");
			sidebarBody().find(".preview").hide();
			sidebarBody().find(".moreOrLess").html("See less");
			sidebarBody().find(".complete").show();
		}
		
	});*/
	
}


function nukeButtonOnclick () {
	
	sidebarBody().find('body').off('click', '#nukeStatus').on('click', '#nukeStatus', function() {
		
		var el = sidebarBody().find('#sideBySide');
		el.contents().hide();
		appendTemplateToElement(el, '/templates/sliderFinalWarning.html');
		
		var entrees = parseSubgoalArray();
		var scurvy = createCSV(entrees);
		downloadCSV(scurvy);
		
		sidebarBody().find("#sliderFinalDownload").unbind("click").click(function () {
			var entrees = parseSubgoalArray();
			var scurvy = createCSV(entrees);
			downloadCSV(scurvy);
		});
		
		sidebarBody().find("#sliderYesCheckbox").unbind("click").click(function () {
			if (sidebarBody().find('#sliderYesCheckbox').is(":checked")) {
				sidebarBody().find('#sliderFinalYes').prop('disabled', false);
				sidebarBody().find("#sliderFinalYes").attr("style","background-color:#7D1935;color:white;");
			}
			else {
				sidebarBody().find('#sliderFinalYes').prop('disabled', true);
				sidebarBody().find("#sliderFinalYes").attr("style","background-color:#7D1935;color:white;opacity:0.5");
			}
		});	
		
		sidebarBody().find("#sliderFinalYes").unbind("click").click(function () {
			localStorage.clear(); 
			location.reload();
		});
		
		sidebarBody().find("#sliderFinalNo").unbind("click").click(function () {
			sidebarBody().find('#sliderFinalCountdown').remove();
			sidebarBody().find('#subgoalList').show();
			sidebarBody().find('#containeryo').show();
			sidebarBody().find('#personaInfo').show();
		});

	});
	
}


/* Function makeEditable
 * 
 * Adds the functionality "Edit" buttons (e.g, for team name, persona, etc)
 * 
 * Takes no arguments.
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
	});
	
	//Scenario name button
	sidebarBody().find('body').off('click', '#editScenario').on('click', '#editScenario', function() {
		sidebarBody().find("#editScenario").hide();
		sidebarBody().find("#getScenario").show();
		sidebarBody().find("#getScenario").children().show();
	});
	
}

/* Function handlePreWalkthroughInfo
 * 
 * Handles the prewalkthrough information -- team name, persona choice, and scenario name. Asks the user for each of these in turn, 
 * 	and leaves the template ready to set up for the subgoal. 
 * 
 * Takes no arguments.
 *
 * Pre: The prewalkthrough template has been appended to the sidebar (so the elements that are referenced exist).
 * Post: The user's team name, persona selection, and scenario have been stored in the local storage variables:
 *			team name -> teamName
 *			persona choice -> personaName
 *			scenario -> scenarioName
 */

function handlePreWalkthroughInfo () {
	
	var sidebarHead = $("#mySidebar").contents().find("head");
	//Set team name
	
	//If the state variable is set, reload previous input
	var isSetTeam = statusIsTrue("gotTeamName");
	if (isSetTeam) {		//Restore from previous state
		//console.log("Restoring team name...");
		sidebarBody().find("#teamName").html("<b>Team:</b> "+ getVarFromLocal("teamName") );
		sidebarBody().find("#editTeam").show();
		sidebarBody().find("#getTeam").hide();
		if( localStorage.getItem("inGetPersona") != "true") {
			//console.log("showing persona select...");
			sidebarBody().find("#getPersona").show();
		}
	}
	
	else {
		//console.log("no previous teamName");
		sidebarBody().find("#teamInput").keyup(function(event){
			if(event.keyCode == 13){
				sidebarBody().find("#submitTeam").unbind( "click" ).click();
			} 
		});
		sidebarBody().find('body').off('click', '#submitTeam').on('click', '#submitTeam', function() {
			
			//Get and save team name
			var teamName = sidebarBody().find("#teamInput").val();
			saveVarToLocal("teamName", teamName);
            setStatusToTrue("gotTeamName");
			
			//Display team name and edit button
			sidebarBody().find("#teamName").html("<b>Team:</b> "+ teamName);
			sidebarBody().find("#editTeam").show();
			sidebarBody().find("#getTeam").hide();
			sidebarBody().find("#getPersona").show();
		});
		
	}
	
	
	//If the state variable is set, reload previous input
	var isSetPersona = statusIsTrue("gotPersonaName");
	if (isSetPersona) {		//Restore from previous state
		//console.log("Restoring persona name...");
		var personaName = getVarFromLocal("personaName");
		sidebarBody().find("#personaName").html("<b>Persona:</b> " + personaName);
		loadPersona(personaName);
		sidebarBody().find("#personaInfo").show();
		if ((personaName == "Tim") || (personaName == "Patrick")) {
			pronoun = "he";
			possessive = "his";
		} else {
			pronoun = "she";
			possessive = "her";
		}
		sidebarBody().find("#getPersona").children().hide();
		sidebarBody().find("#getPersona").hide();
		sidebarBody().find("#editPersona").show();
		personaShown = true;
		if( localStorage.getItem("inGetScenario") != "true") {
			//console.log("showing scenario input...");
			//Show Scenario
			sidebarBody().find("#getScenario").show();
			//sidebarBody().find("#getScenario").children().show();
			sidebarBody().find("#scenarioPrompt").html("Take a moment to describe the scenario " + personaName + " will be performing");
		}
		
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
			if ((personaName == "Tim") || (personaName == "Patrick")) {
				pronoun = "he";
				possessive = "his";
			} else {
				pronoun = "she";
				possessive = "her";
			}
			sidebarBody().find("#getPersona").children().hide();
			sidebarBody().find("#getPersona").hide();
			//Show Scenario
			sidebarBody().find("#getScenario").show();
			sidebarBody().find("#scenarioPrompt").html("Take a moment to describe the scenario " + personaName + " will be performing");
			sidebarBody().find("#editPersona").show();
			personaShown = true;
			
		});
		
	}
	
	//Get scenario name
	
	//If the state variable is set, reload previous input
	var isSetScenario = statusIsTrue("gotScenarioName");
	if (isSetScenario) {		//Restore from previous state
		//console.log("Restoring scenario...");
		//Get and save scenario name
		var scenarioName = getVarFromLocal("scenarioName");
		
		//Display scenario and related info
		sidebarBody().find("#scenarioName").html("<b>Scenario:</b> " + scenarioName);
		sidebarBody().find("#editScenario").show();
		
		sidebarBody().find("#getScenario").children().hide();
		sidebarBody().find("#getScenario").hide();
		
		if( localStorage.getItem("inGetScenario") != "true") {
			//console.log("showing subgoal select...");
			//Show subgoal
			sidebarBody().find("#getSubgoal").show();
			sidebarBody().find("#setup").hide();
			var personaName = getVarFromLocal("personaName");
			if (!personaName) {
				console.log("persona name was null. Check your save");
			}
			sidebarBody().find("#subgoalPrompt").html("Now that you've completed the initial setup, enter a subgoal for " + personaName + " to perform");
			sidebarBody().find("#subgoalInput").keyup(function(event){
				if(event.keyCode == 13){
					sidebarBody().find("#submitSubgoal").unbind( "click" ).click();
				} 
			});
		}
	}
	
	else {
		sidebarBody().find("#scenarioInput").keyup(function(event){
			if(event.keyCode == 13){
				sidebarBody().find("#submitScenario").unbind( "click" ).click();
			} 
		});
		sidebarBody().find('body').off('click', '#submitScenario').on('click', '#submitScenario', function() {
			
			//Get and save scenario name
			var scenarioName = sidebarBody().find("#scenarioInput").val();
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
				//console.log("persona name was null. Check your save");
			}
			sidebarBody().find("#subgoalPrompt").html("Now that you've completed the initial setup, enter a subgoal for " + personaName + " to perform");
			sidebarBody().find("#subgoalInput").keyup(function(event){
				if(event.keyCode == 13){
					sidebarBody().find("#submitSubgoal").unbind( "click" ).click();
				} 
			});
			
		});
	}
	
	
	//If the state variable is set, reload previous input
	var isSetSubName = statusIsTrue("gotSubgoalName");
	if (isSetSubName) {		//Restore from previous state
		//console.log("Subgoal name flag was true...");
		var subgoalArray = getSubgoalArrayFromLocal();
		if (!subgoalArray) {		//They haven't saved any subgoals yet, but they have the name
			var subName = localStorage.getItem("currSubgoalName");
			sidebarBody().find("#editTeam").hide();
			sidebarBody().find("#editPersona").hide();
			sidebarBody().find("#editScenario").hide();
			var subgoalId = localStorage.getItem("numSubgoals");
			if(subgoalId == undefined){
				subgoalId = 1;
				localStorage.setItem("numSubgoals", subgoalId);
			}
			else{
				//subgoalId++;
				localStorage.setItem("numSubgoals", subgoalId);
				
			}
			console.log("Before");
			drawSubgoal(subgoalId);
			console.log("Drawn");
		}
		else {			//They have subgoals
			var subName = localStorage.getItem("currSubgoalName");
			var subgoalId = localStorage.getItem("numSubgoals");
			if(subgoalId == undefined){
				subgoalId = 1;
				localStorage.setItem("numSubgoals", subgoalId);
			}
			else{
				//subgoalId++;
				localStorage.setItem("numSubgoals", subgoalId);
				
			}
			//console.log("subName: ", subName, "subId: ", subgoalId);
			drawSubgoal(subgoalId);
			console.log("Drawn 2");
		}			
	}
	
	else {			//Happens if gotSubgoalName is false
		
		sidebarBody().find('body').off('click', '#submitSubgoal').on('click', '#submitSubgoal', function() {
            if (sidebarBody().find("#subgoalInput").val() == "") {
                alert("Please name your subgoal before continuing");
            }
            else {
                sidebarBody().find("#editTeam").hide();
                sidebarBody().find("#editPersona").hide();
                sidebarBody().find("#editScenario").hide();
                var subgoalId = localStorage.getItem("numSubgoals");
                setStatusToTrue("gotSubgoalName");
                var subName = sidebarBody().find("#subgoalInput").val();
                localStorage.setItem("currSubgoalName", subName);;
                if(subgoalId == undefined){
                    subgoalId = 1;
                    localStorage.setItem("numSubgoals", subgoalId);
                }
                else{
                    subgoalId++;
                    localStorage.setItem("numSubgoals", subgoalId);
                    
                }
                drawSubgoal(subgoalId);
				console.log("Drawn 3");
            }
		});
	}
	
}	
	


















