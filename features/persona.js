/*
 * File Name: persona.js
 * Functions: loadPersona
 * Description: Handles persona info display and shared facet rendering helpers.
 */

var DIY_PERSONA_TYPE = "DIY";
var DIY_PERSONA_OPTION_LABEL = "DIY persona and facets";
var DIY_PERSONA_MAX_FACETS = 6;
var STANDARD_PERSONA_TYPES = ["Abi", "Pat", "Tim"];
var STANDARD_FACET_DEFINITIONS = [
	{ key: "motiv", label: "Motivation", triggerClass: "MTrigger" },
	{ key: "selfE", label: "Computer Self-Efficacy", triggerClass: "SETrigger" },
	{ key: "risk", label: "Attitude Towards Risk", triggerClass: "RTrigger" },
	{ key: "info", label: "Information Processing Style", triggerClass: "IPSTrigger" },
	{ key: "tinker", label: "Learning: by Process vs. by Tinkering", triggerClass: "TTrigger" }
];
var NONE_FACET_DEFINITION = {
	key: "none",
	label: "None of the Above",
	triggerClass: ""
};

function escapePersonaHtml(value) {
	return String(value || "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function getPersonaStateForUi(state) {
	if (state) {
		return state;
	}

	if (typeof getSessionState === "function") {
		return getSessionState();
	}

	return null;
}

function isStandardGenderMagPersona(personaType) {
	return STANDARD_PERSONA_TYPES.indexOf(personaType) >= 0;
}

function cloneFacetDefinition(definition) {
	return {
		key: definition.key,
		label: definition.label,
		triggerClass: definition.triggerClass || "",
		scale: definition.scale || "",
		description: definition.description || ""
	};
}

function getStandardFacetDefinitions(includeNone) {
	var facetDefinitions = STANDARD_FACET_DEFINITIONS.map(cloneFacetDefinition);

	if (includeNone !== false) {
		facetDefinitions.push(cloneFacetDefinition(NONE_FACET_DEFINITION));
	}

	return facetDefinitions;
}

function getCurrentFacetDefinitions(state, includeNone) {
	var sessionState = getPersonaStateForUi(state);

	if (typeof isSessionDiyPersona === "function" && isSessionDiyPersona(sessionState)) {
		var customFacetDefinitions = [];
		var customFacets = typeof getSessionPersonaFacets === "function"
			? getSessionPersonaFacets(sessionState)
			: [];

		customFacets.forEach(function (facet) {
			customFacetDefinitions.push({
				key: facet.id,
				label: facet.name,
				description: facet.description,
				scale: facet.scale,
				triggerClass: ""
			});
		});

		if (includeNone !== false) {
			customFacetDefinitions.push(cloneFacetDefinition(NONE_FACET_DEFINITION));
		}

		return customFacetDefinitions;
	}

	return getStandardFacetDefinitions(includeNone);
}

function getFacetDefinitionByKey(facetKey, state) {
	var definitions = getCurrentFacetDefinitions(state, true);
	for (var i = 0; i < definitions.length; i++) {
		if (definitions[i].key === facetKey) {
			return definitions[i];
		}
	}

	return null;
}

function getFacetLabelByKey(facetKey, state) {
	var definition = getFacetDefinitionByKey(facetKey, state);
	if (definition && definition.label) {
		return definition.label;
	}

	if (facetKey === "self") {
		return "Computer Self-Efficacy";
	}

	return facetKey;
}

function getSelectedFacetKeys(facetValues) {
	var selectedKeys = [];
	if (!facetValues || typeof facetValues !== "object") {
		return selectedKeys;
	}

	Object.keys(facetValues).forEach(function (facetKey) {
		if (!facetValues[facetKey]) {
			return;
		}

		if (facetKey === "self" && facetValues.selfE) {
			return;
		}

		selectedKeys.push(facetKey);
	});

	return selectedKeys;
}

function getSelectedFacetLabels(facetValues, state) {
	var selectedKeys = getSelectedFacetKeys(facetValues);
	var definitions = getCurrentFacetDefinitions(state, true);
	var labels = [];
	var seen = {};

	definitions.forEach(function (definition) {
		if (selectedKeys.indexOf(definition.key) >= 0 && !seen[definition.key]) {
			labels.push(definition.label);
			seen[definition.key] = true;
		}
	});

	selectedKeys.forEach(function (facetKey) {
		if (!seen[facetKey]) {
			labels.push(getFacetLabelByKey(facetKey, state));
			seen[facetKey] = true;
		}
	});

	if (labels.length === 0) {
		return ["None of the Above"];
	}

	return labels;
}

function createFacetCheckboxId(idPrefix, facetKey) {
	return (idPrefix || "facet-option") + "-" + String(facetKey).replace(/[^a-zA-Z0-9_-]+/g, "-");
}

function renderFacetOptions(target, options) {
	var config = options || {};
	var state = getPersonaStateForUi(config.state);
	var definitions = config.definitions || getCurrentFacetDefinitions(state, config.includeNone);
	var checkboxName = config.checkboxName || "facetOption";
	var idPrefix = config.idPrefix || "facetOption";
	var enableFacetTooltips = config.enableFacetTooltips !== false;
	var checkboxHtml = definitions.map(function (definition) {
		var checkboxId = createFacetCheckboxId(idPrefix, definition.key);
		var useTriggerClass = enableFacetTooltips ? definition.triggerClass : "";
		var labelClass = useTriggerClass ? " class=\"" + useTriggerClass + "\"" : "";
		var labelStyle = useTriggerClass
			? "color:#0645AD; text-decoration: underline;"
			: "color:black;";

		return [
			"<div class=\"facetOptionRow\" style=\"margin-bottom:4px;\">",
			"<input type=\"checkbox\" class=\"facetOptionInput\" name=\"", checkboxName, "\"",
			" id=\"", checkboxId, "\" data-facet-key=\"", escapePersonaHtml(definition.key), "\" value=\"", escapePersonaHtml(definition.label), "\">",
			"<span", labelClass, " style=\"", labelStyle, "\">", escapePersonaHtml(definition.label), "</span>",
			"</div>"
		].join("");
	}).join("");

	$(target).html(checkboxHtml);
}

function collectFacetSelections(target) {
	var facetSelections = {};

	$(target).find("input[data-facet-key]").each(function () {
		var facetKey = $(this).attr("data-facet-key");
		facetSelections[facetKey] = $(this).is(":checked");
	});

	if (facetSelections.self && !facetSelections.selfE) {
		facetSelections.selfE = true;
	}

	return facetSelections;
}

function applyFacetSelections(target, facetValues) {
	$(target).find("input[data-facet-key]").each(function () {
		var facetKey = $(this).attr("data-facet-key");
		$(this).prop("checked", Boolean(facetValues && facetValues[facetKey]));
	});
}

function getDiyPersonaSummaryLines(state) {
	var sessionState = getPersonaStateForUi(state);
	var customFacets = typeof getSessionPersonaFacets === "function"
		? getSessionPersonaFacets(sessionState)
		: [];

	return customFacets.map(function (facet) {
		return facet.scale + ": " + facet.description;
	});
}

function shouldShowDiyPersonaEditor(state, mode) {
	if (mode === "editor") {
		return true;
	}

	if (mode === "summary") {
		return false;
	}

	var sessionState = getPersonaStateForUi(state);
	return !sessionState || !sessionState.scenarioName;
}

function renderDiyPersonaPane(container, options) {
	var config = options || {};
	var sessionState = getPersonaStateForUi(config.state);
	var personaType = typeof getSessionPersonaType === "function" ? getSessionPersonaType(sessionState) : DIY_PERSONA_TYPE;
	var personaName = typeof getSessionPersonaName === "function" ? getSessionPersonaName(sessionState) : "";
	var personaDescription = typeof getSessionPersonaDescription === "function" ? getSessionPersonaDescription(sessionState) : "";
	var editorVisible = shouldShowDiyPersonaEditor(sessionState, config.mode);
	var summaryVisible = !editorVisible;
	var summaryLines = getDiyPersonaSummaryLines(sessionState);
	var summaryListHtml = summaryLines.length > 0
		? "<ul>" + summaryLines.map(function (line) {
			return "<li>" + escapePersonaHtml(line) + "</li>";
		}).join("") + "</ul>"
		: "<p style=\"margin-top:8px; color:black;\">Custom facets will appear here after they are saved.</p>";

	$(container).find("#diyPersonaEditor").toggle(editorVisible);
	$(container).find("#diyPersonaSummary").toggle(summaryVisible);
	$(container).find("#diyPersonaNameInput").val(personaType === DIY_PERSONA_TYPE ? personaName : "");
	$(container).find("#diyPersonaDescriptionInput").val(personaDescription);
	$(container).find("#diyPersonaSummaryName").text(personaName || DIY_PERSONA_OPTION_LABEL);
	$(container).find("#diyPersonaSummaryDescription").text(personaDescription || "");
	$(container).find("#diyPersonaFacetSummary").html(summaryListHtml);
}

function loadPersona(personaName, options) {
	var config = options || {};
	var facets = ["M", "IPS", "SE", "R", "T"];
	var personas = {
		Abi: {
			template: "./templates/Abi/abiPersona.html",
			imageSrc: "images/abimulti.png",
			imageId: "AbiPhoto",
			imageAlt: "Abi Jones",
			toolTipPrefix: "abi"
		},
		Tim: {
			template: "./templates/Tim/timPersona.html",
			imageSrc: "images/Timmulti.png",
			imageId: "TimPhoto",
			imageAlt: "Tim Hopkins",
			toolTipPrefix: "tim"
		},
		Pat: {
			template: "./templates/pat/patPersona.html",
			imageSrc: "images/Patmulti.png",
			imageId: "patPhoto",
			imageAlt: "Pat Jones",
			toolTipPrefix: "pat"
		},
		Custom: {
			template: "./templates/custom/custom.html"
		},
		DIY: {
			template: "./templates/custom/diyPersona.html"
		}
	};

	var persona = personas[personaName];
	if (!persona) {
		reportExtensionError({
			code: "UNKNOWN_PERSONA_TYPE",
			source: "features/persona.js",
			userMessage: "The selected persona could not be loaded.",
			technicalMessage: "loadPersona was called with an unknown persona type.",
			error: new Error("Unknown persona: " + personaName),
			details: {
				personaName: personaName
			}
		});
		return;
	}

	var personaContainer = sidebarBody().find("#personaInfo");
	personaContainer.empty();

	appendTemplateToElement(personaContainer, persona.template, function (error) {
		if (error) {
			reportExtensionError({
				code: "PERSONA_TEMPLATE_FAILED",
				source: "features/persona.js",
				userMessage: "The persona details for this step could not be loaded.",
				technicalMessage: "Failed to load the selected persona template.",
				error: error,
				details: {
					personaName: personaName,
					template: persona.template
				}
			});
			return;
		}

		if (personaName === DIY_PERSONA_TYPE) {
			renderDiyPersonaPane(personaContainer, config);
			return;
		}

		if (persona.imageSrc) {
			var imgSrc = chrome.runtime.getURL(persona.imageSrc);
			var imgHTML = "<img id='" + persona.imageId + "' src='" + imgSrc + "' alt='" + persona.imageAlt + "' class='sidebarImg' width='100' height='100'/>";
			personaContainer.find("#picGoesHere").append(imgHTML);
		}

		if (persona.toolTipPrefix) {
			facets.forEach(function (facet) {
				var triggerClass = persona.toolTipPrefix + facet + "Trigger";
				var toolTipId = persona.toolTipPrefix + facet + "ToolTip";
				personaContainer.find("." + triggerClass).unbind("click").click(function () {
					addToolTip(toolTipId, personaName);
				});
			});
		}
	});
}
