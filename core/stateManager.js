//State management for the overall interactions 
/*
 * Filename: status.js
 * Functions: 
 *    initStatusObject, getStatusObject, saveStatusObject, statusIsTrue,
 *    setStatusToTrue, setStatusToFalse, setStatusToStop,
 *    createDefaultSessionState, getSessionState, saveSessionState,
 *    updateSessionState, resetSessionState
 * 
 * Description: Manages the status object and its properties. The status object
 *              tracks various stages and states within the application. Which 
 *              enables information storing about the progress and interactions 
 *              of the user.
 */
//add error handling?

var SESSION_STATE_KEY = "sessionState";
var EXTENSION_SESSION_STATE_KEY = "activeSessionState";
var sessionStateCache = null;
var sessionStorageListenerRegistered = false;

function createDefaultSessionState() {
	return {
		version: 1,
		currentStep: "start",
		ui: {
			sliderOpen: false,
			tooltipOpen: false,
			activeTabId: null
		},
		teamName: "",
		persona: {
			selectedType: "",
			name: "",
			pronoun: "",
			possessive: "",
			description: "",
			facets: []
		},
		scenarioName: "",
		currentSubgoalId: null,
		currentActionId: null,
		screenshot: {
			imageUrl: "",
			sourceX: 0,
			sourceY: 0
		},
		draftAction: null,
		subgoals: []
	};
}

function canUseExtensionSessionStorage() {
	return Boolean(
		typeof chrome !== "undefined" &&
		chrome.storage &&
		chrome.storage.session
	);
}

function cloneSessionState(state) {
	return JSON.parse(JSON.stringify(state || createDefaultSessionState()));
}

function getLocalSessionStateMirror() {
	var rawState = localStorage.getItem(SESSION_STATE_KEY);
	if (!rawState) {
		return null;
	}

	try {
		return JSON.parse(rawState);
	}
	catch (error) {
		console.error("Failed to parse local sessionState mirror:", error);
		return null;
	}
}

function hasStartedSession(state) {
	var sessionState = state || getSessionState();
	return Boolean(sessionState && sessionState.currentStep && sessionState.currentStep !== "start");
}

function isTooltipStep(stepOrState) {
	var step = typeof stepOrState === "string"
		? stepOrState
		: stepOrState && stepOrState.currentStep;
	return [
		"screenshotPreview",
		"preActionQuestions",
		"doActionPrompt",
		"postActionQuestions",
		"actionLoop",
		"finished"
	].indexOf(step) >= 0;
}

function isSliderOpenInSession(state) {
	var sessionState = state || getSessionState();
	return Boolean(sessionState && sessionState.ui && sessionState.ui.sliderOpen);
}

function getSessionSubgoalById(subgoalId, state) {
	var sessionState = state || getSessionState();
	if (!sessionState || !Array.isArray(sessionState.subgoals)) {
		return null;
	}

	var targetId = Number(subgoalId);
	for (var i = 0; i < sessionState.subgoals.length; i++) {
		if (Number(sessionState.subgoals[i].id) === targetId) {
			return sessionState.subgoals[i];
		}
	}

	return null;
}

function getSessionPersona(state) {
	var sessionState = state || getSessionState();
	return sessionState && sessionState.persona ? sessionState.persona : createDefaultSessionState().persona;
}

function isSessionBuiltInPersonaName(personaName) {
	return ["Abi", "Pat", "Tim", "Custom", "DIY"].indexOf(personaName) >= 0;
}

function getSessionPersonaType(state) {
	var persona = getSessionPersona(state);
	if (persona.selectedType) {
		return persona.selectedType;
	}

	if (persona.name && isSessionBuiltInPersonaName(persona.name)) {
		return persona.name;
	}

	return "";
}

function getSessionPersonaName(state) {
	var persona = getSessionPersona(state);
	if (persona.name) {
		return persona.name;
	}

	var personaType = getSessionPersonaType(state);
	if (personaType && personaType !== "DIY") {
		return personaType;
	}

	return "";
}

function getSessionPersonaDisplayName(state) {
	return getSessionPersonaName(state) || "Abi";
}

function getSessionPersonaPronoun(state) {
	return getSessionPersona(state).pronoun || "they";
}

function getSessionPersonaPossessive(state) {
	return getSessionPersona(state).possessive || "their";
}

function getSessionPersonaDescription(state) {
	return getSessionPersona(state).description || "";
}

function isSessionDiyPersona(state) {
	return getSessionPersonaType(state) === "DIY";
}

function normalizePersonaFacetScale(scale) {
	if (typeof scale !== "string") {
		return "Medium";
	}

	var normalizedScale = scale.toLowerCase();
	if (normalizedScale === "low") {
		return "Low";
	}
	if (normalizedScale === "high") {
		return "High";
	}
	return "Medium";
}

function createSessionPersonaFacetId(name, index) {
	var baseId = String(name || ("facet-" + (index + 1)))
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	if (!baseId) {
		baseId = "facet-" + (index + 1);
	}

	return baseId + "-" + (index + 1);
}

function normalizeSessionPersonaFacet(facet, index) {
	var facetName = facet && facet.name ? String(facet.name).trim() : "";
	var facetDescription = facet && facet.description ? String(facet.description).trim() : "";

	return {
		id: facet && facet.id ? String(facet.id) : createSessionPersonaFacetId(facetName, index),
		name: facetName,
		description: facetDescription,
		scale: normalizePersonaFacetScale(facet && facet.scale)
	};
}

function getSessionPersonaFacets(state) {
	var persona = getSessionPersona(state);
	if (!Array.isArray(persona.facets)) {
		return [];
	}

	return persona.facets.map(function (facet, index) {
		return normalizeSessionPersonaFacet(facet, index);
	});
}

function getSessionCurrentSubgoal(state) {
	var sessionState = state || getSessionState();
	if (!sessionState || !sessionState.currentSubgoalId) {
		return null;
	}

	return getSessionSubgoalById(sessionState.currentSubgoalId, sessionState);
}

function getSessionCurrentSubgoalName(state) {
	var currentSubgoal = getSessionCurrentSubgoal(state);
	return currentSubgoal && currentSubgoal.name ? currentSubgoal.name : "";
}

function getSessionDraftAction(state) {
	var sessionState = state || getSessionState();
	return sessionState && sessionState.draftAction ? sessionState.draftAction : null;
}

function getSessionCurrentActionName(state) {
	var draftAction = getSessionDraftAction(state);
	return draftAction && draftAction.name ? draftAction.name : "";
}

function getSessionCurrentActionId(state) {
	var draftAction = getSessionDraftAction(state);
	if (draftAction && draftAction.id) {
		return Number(draftAction.id);
	}

	var sessionState = state || getSessionState();
	return sessionState && sessionState.currentActionId ? Number(sessionState.currentActionId) : null;
}

function getSessionNextActionId(state, subgoalId) {
	var sessionState = state || getSessionState();
	var targetSubgoalId = subgoalId || (sessionState && sessionState.currentSubgoalId);
	var targetSubgoal = getSessionSubgoalById(targetSubgoalId, sessionState);

	if (targetSubgoal && Array.isArray(targetSubgoal.actions)) {
		return targetSubgoal.actions.length + 1;
	}

	return 1;
}

function getSessionNextSubgoalId(state) {
	var sessionState = state || getSessionState();
	if (!sessionState || !Array.isArray(sessionState.subgoals) || sessionState.subgoals.length === 0) {
		return 1;
	}

	return sessionState.subgoals.length + 1;
}

function createDefaultSessionYNM() {
	return {
		yes: false,
		no: false,
		maybe: false
	};
}

function createDefaultSessionFacets() {
	return {
		motiv: false,
		info: false,
		selfE: false,
		risk: false,
		tinker: false,
		none: false
	};
}

function toSessionYNM(ynm) {
	if (ynm && typeof ynm === "object") {
		return {
			yes: Boolean(ynm.yes),
			no: Boolean(ynm.no),
			maybe: Boolean(ynm.maybe)
		};
	}

	return createDefaultSessionYNM();
}

function toSessionFacets(facets) {
	if (facets && typeof facets === "object") {
		var normalizedFacets = {};

		Object.keys(facets).forEach(function (facetKey) {
			normalizedFacets[facetKey] = Boolean(facets[facetKey]);
		});

		if (normalizedFacets.self || normalizedFacets.selfE) {
			normalizedFacets.self = Boolean(normalizedFacets.self || normalizedFacets.selfE);
			normalizedFacets.selfE = Boolean(normalizedFacets.self || normalizedFacets.selfE);
		}

		if (!Object.prototype.hasOwnProperty.call(normalizedFacets, "none")) {
			normalizedFacets.none = false;
		}

		return normalizedFacets;
	}

	return createDefaultSessionFacets();
}

function toSessionAction(action) {
	if (!action) {
		return null;
	}

	var actionImageUrl = action.imgURL || (action.screenshot && action.screenshot.imageUrl) || "";

	return {
		id: action.id || action.actionId || null,
		name: action.name || "",
		imgURL: actionImageUrl,
		screenshot: {
			imageUrl: actionImageUrl,
			sourceX: 0,
			sourceY: 0
		},
		preAction: {
			ynm: toSessionYNM(action.preAction && action.preAction.ynm),
			why: action.preAction && action.preAction.why ? action.preAction.why : "",
			facetValues: toSessionFacets(action.preAction && action.preAction.facetValues)
		},
		postAction: {
			ynm: toSessionYNM(action.postAction && action.postAction.ynm),
			why: action.postAction && action.postAction.why ? action.postAction.why : "",
			facetValues: toSessionFacets(action.postAction && action.postAction.facetValues)
		},
		status: "complete"
	};
}

function buildLegacyActionFromSessionAction(action, subgoalId) {
	if (!action) {
		return null;
	}

	var actionId = action.id || action.actionId || null;
	var actionName = action.name || "";
	var actionImageUrl = action.imgURL || (action.screenshot && action.screenshot.imageUrl) || "";

	return {
		id: actionId,
		name: actionName,
		imgURL: actionImageUrl,
		preAction: {
			actionId: actionId,
			name: actionName,
			subgoalId: subgoalId,
			ynm: toSessionYNM(action.preAction && action.preAction.ynm),
			why: action.preAction && action.preAction.why ? action.preAction.why : "",
			facetValues: toSessionFacets(action.preAction && action.preAction.facetValues)
		},
		postAction: {
			actionId: actionId,
			name: actionName,
			subgoalId: subgoalId,
			ynm: toSessionYNM(action.postAction && action.postAction.ynm),
			why: action.postAction && action.postAction.why ? action.postAction.why : "",
			facetValues: toSessionFacets(action.postAction && action.postAction.facetValues)
		}
	};
}

function buildLegacySubgoalArrayFromSessionState(state) {
	if (!state || !Array.isArray(state.subgoals)) {
		return [];
	}

	return state.subgoals.map(function (subgoal) {
		var subgoalId = subgoal.id || null;
		return {
			id: subgoalId,
			name: subgoal.name || "",
			ynm: toSessionYNM(subgoal.ynm),
			why: subgoal.why || "",
			facetValues: toSessionFacets(subgoal.facetValues),
			actions: Array.isArray(subgoal.actions)
				? subgoal.actions.map(function (action) {
					return buildLegacyActionFromSessionAction(action, subgoalId);
				}).filter(Boolean)
				: []
		};
	});
}

function stripImageDataFromSessionAction(action) {
	if (!action) {
		return action;
	}

	var clonedAction = cloneSessionState(action);
	clonedAction.imgURL = "";

	if (clonedAction.screenshot) {
		clonedAction.screenshot.imageUrl = "";
	}

	return clonedAction;
}

function createLocalSessionStateMirror(state) {
	var mirroredState = cloneSessionState(state);

	if (mirroredState.screenshot) {
		mirroredState.screenshot.imageUrl = "";
	}

	if (mirroredState.draftAction) {
		mirroredState.draftAction = stripImageDataFromSessionAction(mirroredState.draftAction);
	}

	if (Array.isArray(mirroredState.subgoals)) {
		mirroredState.subgoals = mirroredState.subgoals.map(function (subgoal) {
			var clonedSubgoal = cloneSessionState(subgoal);
			clonedSubgoal.actions = Array.isArray(clonedSubgoal.actions)
				? clonedSubgoal.actions.map(stripImageDataFromSessionAction)
				: [];
			return clonedSubgoal;
		});
	}

	return mirroredState;
}

function stripLegacySubgoalArrayImages(subgoalArray) {
	if (!Array.isArray(subgoalArray)) {
		return [];
	}

	return subgoalArray.map(function (subgoal) {
		var clonedSubgoal = cloneSessionState(subgoal);
		clonedSubgoal.actions = Array.isArray(clonedSubgoal.actions)
			? clonedSubgoal.actions.map(function (action) {
				var clonedAction = cloneSessionState(action);
				clonedAction.imgURL = "";
				return clonedAction;
			})
			: [];
		return clonedSubgoal;
	});
}

function buildLegacyPreActionFromDraftAction(state) {
	if (!state || !state.draftAction) {
		return null;
	}

	return {
		actionId: state.draftAction.id,
		name: state.draftAction.name || "",
		subgoalId: state.draftAction.subgoalId,
		ynm: toSessionYNM(state.draftAction.preAction && state.draftAction.preAction.ynm),
		why: state.draftAction.preAction && state.draftAction.preAction.why ? state.draftAction.preAction.why : "",
		facetValues: toSessionFacets(state.draftAction.preAction && state.draftAction.preAction.facetValues)
	};
}

function isDraftActionInProgress(state) {
	if (!state || !state.draftAction) {
		return false;
	}

	return [
		"actionPrompt",
		"screenshotPreview",
		"preActionQuestions",
		"doActionPrompt",
		"postActionQuestions"
	].indexOf(state.currentStep) >= 0;
}

function setJsonLocalValue(key, value) {
	if (value === undefined || value === null || value === "") {
		localStorage.removeItem(key);
		return;
	}
	localStorage.setItem(key, JSON.stringify(value));
}

function setPlainLocalValue(key, value) {
	if (value === undefined || value === null || value === "") {
		localStorage.removeItem(key);
		return;
	}
	localStorage.setItem(key, String(value));
}

function clearLegacySessionMirror() {
	[
		"teamName",
		"personaName",
		"personaType",
		"personaPronoun",
		"personaPossessive",
		"personaDescription",
		"personaFacets",
		"scenarioName",
		"subgoalArray",
		"numSubgoals",
		"currSubgoalName",
		"numActions",
		"currActionName",
		"currImgURL",
		"sourceX",
		"sourceY",
		"currPreAction",
		"inMiddleOfAction",
		"sidebarHTML"
	].forEach(function (key) {
		localStorage.removeItem(key);
	});
}

function mirrorLegacySessionState(state) {
	var sessionState = cloneSessionState(state);
	var localMirrorState = canUseExtensionSessionStorage()
		? createLocalSessionStateMirror(sessionState)
		: cloneSessionState(sessionState);
	var currentSubgoal = getSessionSubgoalById(sessionState.currentSubgoalId, sessionState);
	var screenshotState = sessionState.draftAction && sessionState.draftAction.screenshot && sessionState.draftAction.screenshot.imageUrl
		? sessionState.draftAction.screenshot
		: sessionState.screenshot;
	var actionList = currentSubgoal && Array.isArray(currentSubgoal.actions) ? currentSubgoal.actions : [];
	var draftPreAction = buildLegacyPreActionFromDraftAction(sessionState);

	localStorage.setItem(SESSION_STATE_KEY, JSON.stringify(localMirrorState));
	sessionStateCache = sessionState;

	if (!hasStartedSession(sessionState)) {
		clearLegacySessionMirror();
		localStorage.setItem(SESSION_STATE_KEY, JSON.stringify(localMirrorState));
		return;
	}

	setJsonLocalValue("teamName", sessionState.teamName || "");
	setJsonLocalValue("personaName", sessionState.persona && sessionState.persona.name ? sessionState.persona.name : "");
	setJsonLocalValue("personaType", getSessionPersonaType(sessionState));
	setJsonLocalValue("personaPronoun", sessionState.persona && sessionState.persona.pronoun ? sessionState.persona.pronoun : "");
	setJsonLocalValue("personaPossessive", sessionState.persona && sessionState.persona.possessive ? sessionState.persona.possessive : "");
	setJsonLocalValue("personaDescription", getSessionPersonaDescription(sessionState));
	setJsonLocalValue("personaFacets", getSessionPersonaFacets(sessionState));
	setJsonLocalValue("scenarioName", sessionState.scenarioName || "");

	var legacySubgoalArray = buildLegacySubgoalArrayFromSessionState(sessionState);
	var legacySubgoalMirror = canUseExtensionSessionStorage()
		? stripLegacySubgoalArrayImages(legacySubgoalArray)
		: legacySubgoalArray;
	if (legacySubgoalArray.length > 0) {
		localStorage.setItem("subgoalArray", JSON.stringify(legacySubgoalMirror));
	} else {
		localStorage.removeItem("subgoalArray");
	}

	setPlainLocalValue("numSubgoals", sessionState.currentSubgoalId || legacySubgoalArray.length || "");
	setPlainLocalValue("currSubgoalName", currentSubgoal && currentSubgoal.name ? currentSubgoal.name : "");
	setPlainLocalValue(
		"numActions",
		sessionState.draftAction && sessionState.draftAction.id
			? sessionState.draftAction.id
			: (actionList.length || "")
	);
	setPlainLocalValue("currActionName", sessionState.draftAction && sessionState.draftAction.name ? sessionState.draftAction.name : "");
	setPlainLocalValue("currImgURL", screenshotState && screenshotState.imageUrl ? screenshotState.imageUrl : "");
	setPlainLocalValue("sourceX", screenshotState && screenshotState.sourceX ? screenshotState.sourceX : 0);
	setPlainLocalValue("sourceY", screenshotState && screenshotState.sourceY ? screenshotState.sourceY : 0);

	if (draftPreAction) {
		localStorage.setItem("currPreAction", JSON.stringify(draftPreAction));
	} else {
		localStorage.removeItem("currPreAction");
	}

	localStorage.setItem("inMiddleOfAction", isDraftActionInProgress(sessionState) ? "true" : "false");
}

function persistSessionStateToExtensionStorage(state, context) {
	if (!canUseExtensionSessionStorage()) {
		return;
	}

	chrome.storage.session.set({ [EXTENSION_SESSION_STATE_KEY]: cloneSessionState(state) }, function () {
		if (chrome.runtime.lastError) {
			console.error("Failed to persist sessionState to chrome.storage.session:", chrome.runtime.lastError);
			return;
		}
		if (context) {
			logSessionState(context + " [extension session synced]", state);
		}
	});
}

function clearExtensionSessionStorage(onComplete) {
	if (!canUseExtensionSessionStorage()) {
		if (typeof onComplete === "function") {
			onComplete();
		}
		return;
	}

	chrome.storage.session.remove(EXTENSION_SESSION_STATE_KEY, function () {
		if (chrome.runtime.lastError) {
			console.error("Failed to clear extension sessionState:", chrome.runtime.lastError);
		}
		if (typeof onComplete === "function") {
			onComplete();
		}
	});
}

function registerExtensionSessionListener() {
	if (sessionStorageListenerRegistered || !canUseExtensionSessionStorage() || !chrome.storage.onChanged) {
		return;
	}

	chrome.storage.onChanged.addListener(function (changes, areaName) {
		if (areaName !== "session" || !changes[EXTENSION_SESSION_STATE_KEY]) {
			return;
		}

		var nextState = changes[EXTENSION_SESSION_STATE_KEY].newValue || createDefaultSessionState();
		mirrorLegacySessionState(nextState);
		if (typeof handleSessionStateSync === "function") {
			handleSessionStateSync(nextState);
		}
		logSessionState("Synced sessionState from chrome.storage.session.", nextState);
	});

	sessionStorageListenerRegistered = true;
}

function bootstrapSessionState(onReady) {
	registerExtensionSessionListener();

	var localState = getLocalSessionStateMirror();
	if (!canUseExtensionSessionStorage()) {
		var fallbackState = localState || createDefaultSessionState();
		mirrorLegacySessionState(fallbackState);
		if (typeof onReady === "function") {
			onReady(fallbackState);
		}
		return;
	}

	chrome.storage.session.get(EXTENSION_SESSION_STATE_KEY, function (storedState) {
		if (chrome.runtime.lastError) {
			console.error("Failed to read sessionState from chrome.storage.session:", chrome.runtime.lastError);
			var erroredState = localState || createDefaultSessionState();
			mirrorLegacySessionState(erroredState);
			if (typeof onReady === "function") {
				onReady(erroredState);
			}
			return;
		}

		var extensionState = storedState[EXTENSION_SESSION_STATE_KEY];
		var activeState = null;

		if (extensionState && hasStartedSession(extensionState)) {
			activeState = extensionState;
			logSessionState("Loaded active sessionState from chrome.storage.session.", extensionState);
		}
		else {
			activeState = createDefaultSessionState();
		}

		mirrorLegacySessionState(activeState);
		if (typeof onReady === "function") {
			onReady(activeState);
		}
	});
}

function logSessionState(context, state) {
	try {
		console.log("[sessionState] " + context, JSON.parse(JSON.stringify(state)));
	}
	catch (error) {
		console.log("[sessionState] " + context, state, error);
	}
}

function getSessionState() {
	if (sessionStateCache) {
		return cloneSessionState(sessionStateCache);
	}

	var localState = getLocalSessionStateMirror();
	if (!localState) {
		var defaultState = createDefaultSessionState();
		logSessionState("No saved state found. Using default state.", defaultState);
		return defaultState;
	}

	sessionStateCache = cloneSessionState(localState);
	return cloneSessionState(localState);
}

function saveSessionState(state, context) {
	mirrorLegacySessionState(state);
	if (hasStartedSession(state)) {
		persistSessionStateToExtensionStorage(state, context);
	} else {
		clearExtensionSessionStorage();
	}
	logSessionState(context || "Saved state.", state);
}

function updateSessionState(mutatorFn, context) {
	var state = getSessionState();
	if (typeof mutatorFn === "function") {
		mutatorFn(state);
	}
	saveSessionState(state, context || "Updated state.");
	return state;
}

function resetSessionState(onComplete) {
	var defaultState = createDefaultSessionState();
	clearExtensionSessionStorage(function () {
		if (typeof onComplete === "function") {
			onComplete(defaultState);
		}
	});
	mirrorLegacySessionState(defaultState);
	logSessionState("Reset to default state.", defaultState);
	return defaultState;
}

/*
 * Function: initStatusObject
 * Description: Initializes the status object in local storage if it is not already present.
 * Params: None
 */
function initStatusObject (onReady) {
	console.log("3");
	bootstrapSessionState(function (sessionState) {
		logSessionState("Initialized sessionState.", sessionState);
		if (typeof onReady === "function") {
			onReady(sessionState);
		}
	});
}

//Subgoal state management starts here  
var subgoalArray = [];

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
	var sessionState = getSessionState();
	if (sessionState && Array.isArray(sessionState.subgoals) && sessionState.subgoals.length > 0) {
		return buildLegacySubgoalArrayFromSessionState(sessionState);
	}

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

/*
 * Function: saveSubgoal
 * Description: Creates a new subgoal and saves it to local storage at the end of subgoalArray
 * Params: id, name, yesnomaybe, whyText, facets, actionList
 */
function saveSubgoal (id, name, yesnomaybe, whyText, facets, actionList = []) {
	var subgoal = {
		id: id,
		name: name,
		ynm: yesnomaybe,
		why: whyText,
		facetValues: facets,
		actions: actionList
	};
	var subArr = getSubgoalArrayFromLocal();
	if (!subArr){
		subArr = subgoalArray;
	}
	subArr[id-1] = subgoal;
	localStorage.setItem("subgoalArray", JSON.stringify(subArr));  //update subgoalArray in local storage
	console.log("Getting out from saveSubgoal successfully");
	updateSessionState(function (state) {
		var existingIndex = state.subgoals.findIndex(function (sessionSubgoal) {
			return sessionSubgoal.id === id;
		});
		var existingActions = existingIndex >= 0 ? state.subgoals[existingIndex].actions : [];
		var sessionActions = Array.isArray(actionList) && actionList.length > 0
			? actionList.map(toSessionAction).filter(Boolean)
			: existingActions;
		var sessionSubgoal = {
			id: id,
			name: name || "",
			ynm: toSessionYNM(yesnomaybe),
			why: typeof whyText === "string" ? whyText : "",
			facetValues: toSessionFacets(facets),
			actions: sessionActions
		};

		if (existingIndex >= 0) {
			state.subgoals[existingIndex] = sessionSubgoal;
		} else {
			state.subgoals.push(sessionSubgoal);
		}

		state.currentSubgoalId = id;
	}, "Mirrored subgoal into sessionState.");
	addToSandwich("subgoal", subgoal);
}

//Action state management starts here
/*
 * Function: saveIdealAction
 * Description: Defines what a preIdealAction, postIdealAction, and idealAction are
 * Params: name, yesnomaybe, whyText, facets, yesnomaybePost, whyTextPost, facetsPost
 */
function saveIdealAction(name, yesnomaybe, whyText, facets, yesnomaybePost, whyTextPost, facetsPost) {
	updateSessionState(function (state) {
		if (!state.draftAction) {
			return;
		}

		state.draftAction.preAction = {
			ynm: toSessionYNM(yesnomaybe),
			why: whyText || "",
			facetValues: toSessionFacets(facets)
		};
		state.draftAction.postAction = {
			ynm: toSessionYNM(yesnomaybePost),
			why: whyTextPost || "",
			facetValues: toSessionFacets(facetsPost)
		};
	}, "Updated draftAction legacy save hook in sessionState.");
}

//Creates a new preIdealAction object and saves it to local storage on the current subgoal's actions
//Pre: subgoalArray isn't empty
function savePreIdealAction (name, yesnomaybe, whyText, facets) {
	updateSessionState(function (state) {
		if (!state.draftAction) {
			return;
		}

		state.draftAction.preAction = {
			ynm: toSessionYNM(yesnomaybe),
			why: whyText || "",
			facetValues: toSessionFacets(facets)
		};
	}, "Updated pre-action draft state in sessionState.");
}

//Creates a new postIdealAction object and saves it to local storage on the current subgoal's actions
//Pre: subgoalArray isn't empty, and the current preAction isn't null
function savePostIdealAction (name, yesnomaybe, whyText, facets) {
	var sessionState = getSessionState();
	var draftAction = sessionState && sessionState.draftAction ? sessionState.draftAction : null;

	if (draftAction) {
		var preIdealAction = {
			id: draftAction.id,
			name: draftAction.name || name,
			imgURL: (draftAction.screenshot && draftAction.screenshot.imageUrl) || sessionState.screenshot.imageUrl || localStorage.getItem("currImgURL"),
			preAction: {
				actionId: draftAction.id,
				name: draftAction.name || name,
				subgoalId: draftAction.subgoalId,
				ynm: toSessionYNM(draftAction.preAction && draftAction.preAction.ynm),
				why: draftAction.preAction && draftAction.preAction.why ? draftAction.preAction.why : "",
				facetValues: toSessionFacets(draftAction.preAction && draftAction.preAction.facetValues)
			}
		};
		var postIdealAction = {
			actionId: draftAction.id,
			name: draftAction.name || name,
			subgoalId: draftAction.subgoalId,
			ynm: yesnomaybe,
			why: whyText,
			facetValues: facets
		};
		glueActionsAndSave(preIdealAction, postIdealAction);
		return;
	}

    var currPreAction = getVarFromLocal("currPreAction");
	if (!currPreAction) {
		return;
	}
	var fallbackPostIdealAction = {
		actionId: currPreAction.actionId,
		name: name,
		subgoalId: currPreAction.subgoalId, 
		ynm: yesnomaybe,
		why: whyText,
		facetValues: facets
	};
    glueActionsAndSave(currPreAction, fallbackPostIdealAction);
}


/*	Puts the pre and post actions into an object and sticks it in the target subgoal's actions array.
*	Takes 2 arguments: preIdealAction, postIdealAction
*	Pre: both must exist
*	Post: target subgoal's actions array has an action object made of pre and post action objects.
*/
function glueActionsAndSave (action, postAction) {
    
    //Get the associated image's (screenshot of action) URL from local
    var currImgURL = action && action.imgURL
		? action.imgURL
		: ((action && action.screenshot && action.screenshot.imageUrl) || localStorage.getItem("currImgURL")); 
    //Make the object
    var idealAction = {
        id: action.id,
        name: action.name,
        imgURL: currImgURL,
        preAction: action.preAction,
        postAction: postAction
    };    
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
		var localMirrorSubgoalArray = canUseExtensionSessionStorage()
			? stripLegacySubgoalArrayImages(currArray)
			: currArray;
        localStorage.setItem("subgoalArray", JSON.stringify(localMirrorSubgoalArray));   //Update the subgoal array
		updateSessionState(function (state) {
			var targetIndex = state.subgoals.findIndex(function (sessionSubgoal) {
				return sessionSubgoal.id === targetSubgoal.id;
			});
			var sessionSubgoal;

			if (targetIndex >= 0) {
				sessionSubgoal = state.subgoals[targetIndex];
			} else {
				sessionSubgoal = {
					id: targetSubgoal.id,
					name: targetSubgoal.name || "",
					ynm: toSessionYNM(targetSubgoal.ynm),
					why: targetSubgoal.why || "",
					facetValues: toSessionFacets(targetSubgoal.facetValues),
					actions: []
				};
				state.subgoals.push(sessionSubgoal);
				targetIndex = state.subgoals.length - 1;
			}

			var sessionAction = toSessionAction(idealAction);
			var existingActionIndex = sessionSubgoal.actions.findIndex(function (savedAction) {
				return savedAction.id === sessionAction.id;
			});

			if (existingActionIndex >= 0) {
				sessionSubgoal.actions[existingActionIndex] = sessionAction;
			} else {
				sessionSubgoal.actions.push(sessionAction);
			}

			state.subgoals[targetIndex] = sessionSubgoal;
			state.currentSubgoalId = targetSubgoal.id;
			state.currentActionId = sessionAction.id;
		}, "Mirrored completed action into sessionState.");
		
		//Rebind the onclick of the side list action to show the answers
		var sideActionIdToFind = "#sideAction" + targetSubgoal.id + "-" + idealAction.id;
		//console.log("Rebinding onclick to loadAnswers...");
		sidebarBody().find(sideActionIdToFind).unbind( "click" ).click(function(){
			loadActionAnswersTemplate(idealAction.id, targetSubgoal.id);
		});
    }
}

//walkthrough functions

// I have doubts about how useful this function is. ATM it exists just to avoid duplicate code
function refreshSubgoalInfo(subgoalId){
	var subgoals = getSubgoalArrayFromLocal();
	//get current subgoal name and pronoun/possessive
	var subName = localStorage.getItem("currSubgoalName");
	var subgoal;

	if(subgoals[subgoalId - 1] !== undefined && subgoals[subgoalId - 1].name !== subName){
		subName = subgoals[subgoalId - 1].name;
		sidebarBody().find('#editSubName').hide();
        subgoal = subgoals[subgoalId - 1];
	} else{
	    subgoal =  subgoals[subgoals.length-1];
    }
    return subgoal;
}

