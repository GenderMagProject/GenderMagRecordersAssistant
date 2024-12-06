/*
 * File: prewalkthrough.js
 * Functions: preWalkthrough, makeEditable, handlePreWalkthroughInfo, 
 *            handleTeamName, handlePersona, handlePronouns, handleScenario, 
 *            handleSubgoal
 * Description: This file has functions to handle the slider walkthrough from the 
 *              beginning to the scenario section where it calls drawSubgoal.
 */

/* Function: preWalkthrough
 * Description: This function appends the HTML template found in <file> to the 
 *              element with the ID of <id>. It then calls the 
 *              handlePreWalkthroughInfo() function, which gets the user's team 
 *              name, persona choice, and scenario name, and puts the first 
 *              subgoal template on the screen.
 * Params:
 *      id: the id of the element to which the template will be appended
 *      file: the LOCAL path of the template to use (e.g., "/templates/popup.html")
 * Pre: Element must exist
 * Post: The template is appended to that element, and the user has filled out 
 *       the prewalkthrough information. The user is on the first subgoal.
 */
function preWalkthrough(id, file) {
    var el = $(id).contents().find('body');
    el.empty();
    appendTemplateToElement(el, file);
    makeEditable();
    handlePreWalkthroughInfo();
    sidebarBody()
        .find('body')
        .off('click', '#saveAndExit')
        .on('click', '#saveAndExit', function () {
            saveAndExit("slider");
        });
    sidebarBody()
        .find('body')
        .off('click', '#justExit')
        .on('click', '#justExit', function () {
            justExit("slider");
        });
}

/* Function: makeEditable
 * Description: This function adds the functionality "Edit" buttons (e.g., for 
 *              team name, persona, etc.). It hides the edit button and adds 
 *              editable fields to the slider section.
 * Params: None
 * Pre: The prewalkthrough template has been appended to the sidebar (so the 
 *      elements that are referenced exist).
 * Post: The edit buttons allow the user to edit their input.
 */
function makeEditable() {
    // Team name button
    sidebarBody()
        .find('body')
        .off('click', '#editTeam')
        .on('click', '#editTeam', function () {
            sidebarBody().find("#editTeam").hide();
            sidebarBody().find("#getTeam").show();
        });

    // Persona name button
    sidebarBody()
        .find('body')
        .off('click', '#editPersona')
        .on('click', '#editPersona', function () {
            sidebarBody().find("#editPersona").hide();
            sidebarBody().find("#personaInfo").hide();
            sidebarBody().find("#personaInfo").empty();
            sidebarBody().find("#getPersona").show();
            sidebarBody().find("#getPersona").children().show();
            sidebarBody().find("#getPersonaPronoun").show();
        });

    // Scenario name button
    sidebarBody()
        .find('body')
        .off('click', '#editScenario')
        .on('click', '#editScenario', function () {
            sidebarBody().find("#editScenario").hide();
            sidebarBody().find("#getScenario").show();
            sidebarBody().find("#getScenario").children().show();
        });
}

/* Function: handlePreWalkthroughInfo
 * Description: This function handles the prewalkthrough information -- team name, 
 *              persona choice, and scenario name. Also asks the user for each of 
 *              these in turn, and leaves the template ready to set up for the 
 *              subgoal.
 * Params: None
 * Pre: The prewalkthrough template has been appended to the sidebar (so the 
 *      elements that are referenced exist).
 * Post: The user's team name, persona selection, and scenario have been stored 
 *       in the local storage variables:
 *           team name -> teamName
 *           persona choice -> personaName
 *           scenario -> scenarioName
 */
function handlePreWalkthroughInfo() {
    handleTeamName();
    handlePersona();
    handlePronouns();
    handleScenario();
    handleSubgoal();
}

/* Function: handleTeamName
 * Description: Manages the input and display logic for the team name.
 */
function handleTeamName() {
    var isSetTeam = statusIsTrue("gotTeamName");
    if (isSetTeam) {
        sidebarBody().find("#explain").hide();
        sidebarBody().find("#teamName").html(
            "<b>Team:</b> " + getVarFromLocal("teamName")
        );
        sidebarBody().find("#editTeam").show();
        sidebarBody().find("#getTeam").hide();
        if (localStorage.getItem("inGetPersona") !== "true") {
            sidebarBody().find("#getPersona").show();
        }
    } else {
        sidebarBody()
            .find("#teamInput")
            .keyup(function (event) {
                if (event.keyCode === 13) {
                    sidebarBody().find("#submitTeam").unbind("click").click();
                }
            });
        sidebarBody()
            .find('body')
            .off('click', '#submitTeam')
            .on('click', '#submitTeam', function () {
                var teamName = sidebarBody().find("#teamInput").val();
                if (teamName === "") {
                    alert("Please enter a name");
                } else {
                    saveVarToLocal("teamName", teamName);
                    setStatusToTrue("gotTeamName");
                    sidebarBody().find("#teamName").html(
                        "<b>Team:</b> " + teamName
                    );
                    sidebarBody().find("#editTeam").show();
                    sidebarBody().find("#getTeam").hide();
                    sidebarBody().find("#getPersona").show();
                    sidebarBody().find("#explain").hide();
                }
            });
    }
}

/* Function: handlePersona
 * Description: Manages the input and display logic for the persona.
 */
function handlePersona() {
    var isSetPersona = statusIsTrue("gotPersonaName");
    if (isSetPersona) {
        var personaName = getVarFromLocal("personaName");
        sidebarBody()
            .find("#personaName")
            .html("<b>Persona:</b> " + personaName);
        loadPersona(personaName);
        sidebarBody().find("#personaInfo").show();
        sidebarBody().find("#getPersona").children().hide();
        sidebarBody().find("#getPersona").hide();
        sidebarBody().find("#editPersona").show();
        sidebarBody().find("#getPersonaPronoun").show();
    } else {
        sidebarBody()
            .find('body')
            .off('click', '#submitPersona')
            .on('click', '#submitPersona', function () {
                var personaName = sidebarBody()
                    .find("#personaSelection")
                    .val();
                saveVarToLocal("personaName", personaName);
                setStatusToTrue("gotPersonaName");
                sidebarBody()
                    .find("#personaName")
                    .html("<b>Persona:</b> " + personaName);
                loadPersona(personaName);
                sidebarBody().find("#personaInfo").show();
                sidebarBody().find("#getPersona").children().hide();
                sidebarBody().find("#getPersona").hide();
                sidebarBody().find("#editPersona").show();
                sidebarBody().find("#getPersonaPronoun").show();
            });
    }
}

/* Function: handlePronouns
 * Description: Manages the input and display logic for pronouns.
 */
function handlePronouns() {
    var isSetPronoun = statusIsTrue("gotPronoun");
    if (isSetPronoun) {
        sidebarBody().find("#getPersonaPronoun").hide();
        sidebarBody().find("#getScenario").show();
    } else {
        sidebarBody()
            .find("#pronounInput")
            .keyup(function (event) {
                if (event.keyCode === 13) {
                    sidebarBody().find("#submitPronoun").unbind("click").click();
                }
            });
        sidebarBody()
            .find('body')
            .off('click', '#submitPronoun')
            .on('click', '#submitPronoun', function () {
                var pronoun = sidebarBody().find("#pronounInput").val();
                var possessive = sidebarBody().find("#possessiveInput").val();
                if (pronoun === "" || possessive === "") {
                    alert("Please enter both pronoun and possessive.");
                } else {
                    saveVarToLocal("personaPronoun", pronoun);
                    saveVarToLocal("personaPossessive", possessive);
                    setStatusToTrue("gotPronoun");
                    sidebarBody().find("#getPersonaPronoun").hide();
                    sidebarBody().find("#getScenario").show();
                }
            });
    }
}

/* Function: handleScenario
 * Description: Manages the input and display logic for the scenario.
 */
function handleScenario() {
    var isSetScenario = statusIsTrue("gotScenarioName");
    if (isSetScenario) {
        var scenarioName = getVarFromLocal("scenarioName");
        sidebarBody().find("#scenarioName").html(
            "<b>Scenario:</b> " + scenarioName
        );
        sidebarBody().find("#editScenario").show();
        sidebarBody().find("#getScenario").children().hide();
        sidebarBody().find("#getScenario").hide();

        // Transition to subgoal phase
        sidebarBody().find("#getSubgoal").show(); // Ensure subgoal input is visible
        setStatusToFalse("gotSubgoalName"); // Reset subgoal state to trigger input handling
    } else {
        sidebarBody()
            .find("#scenarioInput")
            .keyup(function (event) {
                if (event.keyCode === 13) {
                    sidebarBody().find("#submitScenario").unbind("click").click();
                }
            });
        sidebarBody()
            .find('body')
            .off('click', '#submitScenario')
            .on('click', '#submitScenario', function () {
                var scenarioName = sidebarBody().find("#scenarioInput").val();
                if (scenarioName === "") {
                    alert("Please enter the scenario name");
                } else {
                    saveVarToLocal("scenarioName", scenarioName);
                    setStatusToTrue("gotScenarioName");
                    setStatusToTrue("finishedPrewalkthrough");
                    setStatusToFalse("gotSubgoalName"); // Reset for subgoal phase
                    sidebarBody().find("#scenarioName").html(
                        "<b>Scenario:</b> " + scenarioName
                    );
                    sidebarBody().find("#editScenario").show();
                    sidebarBody().find("#getScenario").children().hide();
                    sidebarBody().find("#getScenario").hide();

                    // Transition to subgoal phase
                    sidebarBody().find("#getSubgoal").show(); // Display subgoal input
                }
            });
    }
}


/* Function: handleSubgoal
 * Description: Manages the input and display logic for subgoals.
 */
function handleSubgoal() {
    var isSetSubName = statusIsTrue("gotSubgoalName");
    if (isSetSubName) {
        var subgoalId = localStorage.getItem("numSubgoals");
        if (!subgoalId) {
            subgoalId = 1;
            localStorage.setItem("numSubgoals", subgoalId);
        }
        drawSubgoal(subgoalId);
    } else {
        sidebarBody()
            .find("#subgoalInput")
            .keyup(function (event) {
                if (event.keyCode === 13) {
                    sidebarBody().find("#submitSubgoal").unbind("click").click();
                }
            });
        sidebarBody()
            .find('body')
            .off('click', '#submitSubgoal')
            .on('click', '#submitSubgoal', function () {
                var subgoalName = sidebarBody().find("#subgoalInput").val();
                if (subgoalName === "") {
                    alert("Please name your subgoal before continuing");
                } else {
                    setStatusToTrue("gotSubgoalName");
                    var subgoalId = localStorage.getItem("numSubgoals") || 1;
                    subgoalId++;
                    localStorage.setItem("numSubgoals", subgoalId);
                    saveSubgoal(subgoalId, subgoalName, 0, "", 0);
                    drawSubgoal(subgoalId);
                }
            });
    }
}

