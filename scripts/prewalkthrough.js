/*
 * File: prewalkthrough.js
 * Functions: preWalkthrough, makeEditable, handlePreWalkthroughInfo
 * Description: Handles the slider walkthrough, starting from the beginning to 
 *              the scenario section where it calls drawSubgoal.
 */

/* 
 * Function: preWalkthrough
 * Description: Appends the HTML template to the specified element and initializes
 *              the prewalkthrough process. 
 * Params:
 *   id (string): ID of the element where the template will be appended.
 *   file (string): Path to the local HTML template file.
 * Pre: The element with the specified ID must exist.
 * Post: The template is appended, and the user begins the prewalkthrough process.
 */
function preWalkthrough(id, file) {
    const targetElement = $(id).contents().find('body');
    targetElement.empty();

    appendTemplateToElement(targetElement, file);
    makeEditable();
    handlePreWalkthroughInfo();

    const sidebar = sidebarBody().find('body');
    bindClickEvent(sidebar, '#saveAndExit', () => saveAndExit("slider"));
    bindClickEvent(sidebar, '#justExit', () => justExit("slider"));
}

/* 
 * Function: makeEditable
 * Description: Adds "Edit" functionality for input fields (team name, persona, scenario).
 * Pre: The prewalkthrough template is appended to the sidebar.
 * Post: The user can edit input fields via "Edit" buttons.
 */
function makeEditable() {
    const sidebar = sidebarBody().find('body');

    bindClickEvent(sidebar, '#editTeam', () => toggleEditField("#editTeam", "#getTeam"));
    bindClickEvent(sidebar, '#editPersona', () => {
        toggleEditField("#editPersona", "#getPersona");
        sidebarBody().find("#personaInfo").hide().empty();
        sidebarBody().find("#getPersonaPronoun").show();
    });
    bindClickEvent(sidebar, '#editScenario', () => toggleEditField("#editScenario", "#getScenario"));
}

/*
 * Function: handlePreWalkthroughInfo
 * Description: Manages user inputs for the team name, persona, and scenario, 
 *              and prepares the setup for the subgoal phase.
 * Pre: The prewalkthrough template is appended to the sidebar.
 * Post: Relevant user inputs are saved, and the user progresses to the subgoal phase.
 */
function handlePreWalkthroughInfo() {
    setupTeamName();
    setupPersona();
    setupPronouns();
    setupScenario();
    setupSubgoal();
}

/*
 * Function: setupTeamName
 * Description: Handles the input, validation, and display of the team name.
 */
function setupTeamName() {
    const sidebar = sidebarBody();

    if (statusIsTrue("gotTeamName")) {
        displaySavedTeamName();
        return;
    }

    bindKeyEvent("#teamInput", 13, () => sidebar.find("#submitTeam").click());
    bindClickEvent(sidebar, '#submitTeam', () => {
        const teamName = sidebar.find("#teamInput").val().trim();
        if (!teamName) {
            displayError("Please enter a name", "#teamError");
            return;
        }

        saveVarToLocal("teamName", teamName);
        setStatusToTrue("gotTeamName");
        displaySavedTeamName(teamName);
    });
}

/*
 * Function: setupPersona
 * Description: Handles the input, validation, and display of the persona.
 */
function setupPersona() {
    const sidebar = sidebarBody();

    if (statusIsTrue("gotPersonaName")) {
        displaySavedPersona();
        return;
    }

    bindClickEvent(sidebar, '#submitPersona', () => {
        const personaName = sidebar.find("#personaSelection").val().trim();
        if (!personaName) {
            displayError("Please select a persona", "#personaError");
            return;
        }

        saveVarToLocal("personaName", personaName);
        setStatusToTrue("gotPersonaName");
        displaySavedPersona(personaName);
    });
}

/*
 * Function: setupPronouns
 * Description: Handles the input, validation, and display of persona pronouns.
 */
function setupPronouns() {
    const sidebar = sidebarBody();

    if (statusIsTrue("gotPronoun")) {
        displaySavedPronouns();
        return;
    }

    bindKeyEvent("#pronounInput", 13, () => sidebar.find("#submitPronoun").click());
    bindKeyEvent("#possessiveInput", 13, () => sidebar.find("#submitPronoun").click());
    bindClickEvent(sidebar, '#submitPronoun', () => {
        const pronoun = sidebar.find("#pronounInput").val().trim();
        const possessive = sidebar.find("#possessiveInput").val().trim();

        if (!pronoun || !possessive) {
            displayError("Please enter both pronoun and possessive adjective.", "#pronounError");
            return;
        }

        saveVarToLocal("personaPronoun", pronoun);
        saveVarToLocal("personaPossessive", possessive);
        setStatusToTrue("gotPronoun");
        displaySavedPronouns(pronoun, possessive);
    });
}

/*
 * Function: setupScenario
 * Description: Handles the input, validation, and display of the scenario.
 */
function setupScenario() {
    const sidebar = sidebarBody();

    if (statusIsTrue("gotScenarioName")) {
        displaySavedScenario();
        return;
    }

    bindKeyEvent("#scenarioInput", 13, () => sidebar.find("#submitScenario").click());
    bindClickEvent(sidebar, '#submitScenario', () => {
        const scenarioName = sidebar.find("#scenarioInput").val().trim();

        if (!scenarioName) {
            displayError("Please enter the scenario name", "#scenarioError");
            return;
        }

        saveVarToLocal("scenarioName", scenarioName);
        setStatusToTrue("gotScenarioName");
        setStatusToTrue("finishedPrewalkthrough");
        displaySavedScenario(scenarioName);
    });
}

/*
 * Function: setupSubgoal
 * Description: Handles the input, validation, and display of the subgoal.
 */
function setupSubgoal() {
    const sidebar = sidebarBody();

    if (statusIsTrue("gotSubgoalName")) {
        loadSavedSubgoal();
        return;
    }

    bindKeyEvent("#subgoalInput", 13, () => sidebar.find("#submitSubgoal").click());
    bindClickEvent(sidebar, '#submitSubgoal', () => {
        const subgoalName = sidebar.find("#subgoalInput").val().trim();

        if (!subgoalName) {
            displayError("Please name your subgoal before continuing", "#subgoalError");
            return;
        }

        saveSubgoalToLocal(subgoalName);
        drawSubgoal(subgoalName);
    });
}

/*
 * Helper Functions
 */

function bindClickEvent(element, selector, callback) {
    element.off('click', selector).on('click', selector, callback);
}

function bindKeyEvent(selector, keyCode, callback) {
    sidebarBody().find(selector).off('keyup').on('keyup', function (event) {
        if (event.keyCode === keyCode) callback();
    });
}

function toggleEditField(hideSelector, showSelector) {
    sidebarBody().find(hideSelector).hide();
    sidebarBody().find(showSelector).show();
}

function displayError(message, errorSelector) {
    sidebarBody().find(errorSelector).text(message).show();
}

function displaySavedTeamName(teamName) {
    const sidebar = sidebarBody();
    teamName = teamName || getVarFromLocal("teamName");
    sidebar.find("#teamName").html(`<b>Team:</b> ${teamName}`);
    toggleEditField("#getTeam", "#editTeam");
}


