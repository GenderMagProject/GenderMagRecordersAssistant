/* Function Name: addOnClicks
 * Description: Adds click event listeners to the slider bar to toggle its open/close state and set the status.
 * Parameters: None
 */
function addOnClicks(){
	
	//when slider is clicked, open or close
	var el = $("#slideout").contents().find("body");
	if (el) {
		$("#slideout").contents().find("body").off('click').on('click', function(event) {
			$("#slideout").toggleClass("clicked");
			$("#GenderMagFrame").toggleClass("clicked");
            if ($( "#slideout" ).hasClass( "clicked" ) ) {
                setStatusToTrue("sliderIsOpen");
            }
            else {
                setStatusToFalse("sliderIsOpen");
            }            
		});
	}
    
}

/* Function Name: openSlider
 * Description: Opens the slider by adding the "clicked" class.
 * Parameters: None
 */
function openSlider() {
    if (!$("#slideout").hasClass("clicked")) {
        $("#slideout").addClass("clicked");
        $("#GenderMagFrame").addClass("clicked");
        setStatusToTrue("sliderIsOpen");
    }
}

/* Function Name: closeSlider
 * Description: Closes the slider by removing the "clicked" class.
 * Parameters: None
 */
function closeSlider() {
    if ($("#slideout").hasClass("clicked")) {
        $("#slideout").toggleClass("clicked");
        $("#GenderMagFrame").toggleClass("clicked");
        setStatusToFalse("sliderIsOpen");
    }
}

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
function bindSliderFinalButtons(el, exitType) {
    console.log("Binding events for buttons inside #sliderFinalWarning.");

    $(el).find("#sliderFinalDownload").off("click").on("click", function () {
        console.log("Download button clicked.");
        var scurvy = createCSV();
        downloadCSV(scurvy, false);
    });

    $(el).find("#oldFormat").off("click").on("click", function () {
        console.log("Old format download button clicked.");
        var scurvy = createOldCSV();
        downloadCSV(scurvy, true);
    });

    $(el).find("#sliderYesCheckbox").off("click").on("click", function () {
        console.log("Yes checkbox clicked. Checked:", $(el).find('#sliderYesCheckbox').is(":checked"));
        if ($(el).find('#sliderYesCheckbox').is(":checked")) {
            $(el).find('#sliderFinalYes').prop('disabled', false);
            $(el).find("#sliderFinalYes").attr("style", "background-color:#7D1935;color:white;");
        } else {
            $(el).find('#sliderFinalYes').prop('disabled', true);
            $(el).find("#sliderFinalYes").attr("style", "background-color:#7D1935;color:white;opacity:0.5");
        }
    });

    $(el).find("#sliderFinalYes").off("click").on("click", function () {
        console.log("Quit GenderMag button clicked.");
        localStorage.clear();
        location.reload();
    });

    $(el).find("#sliderFinalNo").off("click").on("click", function () {
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
