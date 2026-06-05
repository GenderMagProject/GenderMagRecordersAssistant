/*
 * File Name: tooltip.js
 * Functions: updatePronouns (not in use), addToolTip
 * Description: This file contains functions to handle tooltips
 */

/* 
 * Function: updatePronouns
 * Description: This function is made to insert the users pronouns and possessive adjective into the tool tip.
 * 	It should be called from addToolTip but is currently not in use do to grammar problems with the wording
 * 	in the tool tip (for example: she gathers vs. they gather)
 * Params: none
 */
function updatePronouns() {
	if(getVarFromLocal('personaPronoun')){
		var x = document.getElementsByClassName("pronoun");
		var i;
		for (i = 0; i < x.length; i++) {
			x[i].innerHTML = getVarFromLocal('personaPronoun');
		}
		var y = document.getElementsByClassName("possessive");
		for (i = 0; i < y.length; i++) {
			y[i].innerHTML = getVarFromLocal('personaPossessive');
		}
		if (getVarFromLocal('personaPronoun') === 'she' ||
			getVarFromLocal('personaPronoun') === 'he') {
			var y = document.getElementsByClassName("verb-is");
			for (i = 0; i < y.length; i++) {
				y[i].innerHTML = "is";
			}
			var w = document.getElementsByClassName("verb-other");
			for (i = 0; i < w.length; i++) {
				w[i].innerHTML = "s";
			}
		}
	}
}

function addToolTip(toolTipName, folderName) {
    if (typeof ensureFloatingUiBaseStyles === "function") {
        ensureFloatingUiBaseStyles();
    }
    // Remove existing tooltip if present
    if ($("#" + toolTipName + "Div").length) {
        $("#" + toolTipName + "Div").remove();
    }

    // Create the tooltip container
    var pageDiv = document.createElement("div");
    pageDiv.id = toolTipName + "Div";
    document.body.appendChild(pageDiv);
    Object.assign(pageDiv.style, {
        position: "fixed",
        right: "50px",
        top: "30px",
        height: "200px",
        width: "500px",
        zIndex: "99999",
        border: "3px solid #4A96AD",
        cursor: "pointer",
        borderRadius: "5px",
        backgroundColor: "white",
        overflow: "auto",
    });

    // Append the template and bind events only after content is loaded
    appendTemplateToElement($("#" + toolTipName + "Div"), 'templates/' + folderName + '/' + toolTipName + '.html', function (error) {
        if (error) {
            console.error("Error appending tooltip template:", error);
            return;
        }

        // Bind events after content is appended
        $("#" + toolTipName + "Button").off("click").on("click", function () {
            $("#" + toolTipName + "Div").remove();
        });

        $('#' + toolTipName + 'SeeMOAR').off("click").on("click", function () {
            var isOpen = $(this).attr("stateVar");
            if (isOpen == 0) {
                $("#" + toolTipName + "Preview").hide();
                $("#" + toolTipName + "Complete").show();
                $("#" + toolTipName + "SeeMOAR").html("See less");
                $(this).attr("stateVar", 1);
            } else {
                $("#" + toolTipName + "Preview").show();
                $("#" + toolTipName + "Complete").hide();
                $("#" + toolTipName + "SeeMOAR").html("See more...");
                $(this).attr("stateVar", 0);
            }
        });

        // Make the tooltip draggable
        $("#" + toolTipName + "Div").draggable();

        // Update pronouns
        updatePronouns();
    });
}
