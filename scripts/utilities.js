/*
 * File Name: utilities.js
 * Functions: init, appendTemplateToElement, importStylesheet, addOnClicks, 
 *            sidebarBody, openSlider, closeSlider, saveAndExit, justExit
 * Description: This file provides utility functions for use throughout the 
 *              project such as 'openSlider'
 */

/*
 * Function: init
 * Description: Initializes the status object, imports necessary stylesheets,
 *              and sets up the slider on the page.
 * Params: None
 */
function init() {
    // Initialize the status object
    initStatusObject();

    // Import all necessary stylesheets and start out with just the slider on the page
    importStylesheet("body", "./styles/slider.css");
    appendTemplateToElement("body", "./templates/slider.html");
    importStylesheet($("#slideout").contents().find("head"), 
                     "/styles/sliderbody.css");
    importStylesheet($("#slideout").contents().find("head"), 
                     "/styles/styles.css");
    importStylesheet($("#slideout").contents().find("head"), 
                     "/jquery-ui-1.12.1/jquery-ui.css");
    importStylesheet($("#slideout").contents().find("head"), 
                     "font-awesome-4.6.1/css/font-awesome.min.css");
    $("#slideout").contents().find("body").append("GenderMag");
    
    addOnClicks();
    setup("#GenderMagFrame", "./templates/firstState.html");
    reloadSandwich();
}

/*
 * Function: appendTemplateToElement
 * Description: Appends the contents of another HTML file to a specified element.
 * Params:
 *      el: The element to which the template will be appended.
 *      file: The LOCAL path of the template to use (e.g., "/templates/popup.html").
 * Pre: The element 'el' must exist.
 * Post: Template will be added to the element AFTER all other content.
 */
function appendTemplateToElement(el, file) {    
    var msg = $.ajax({
        type: "GET", 
        url: chrome.extension.getURL(file), 
        async: false
    }).responseText;
    
    var dataToAppend = $($.parseHTML(msg));
    $(el).append(dataToAppend);
}

/*
 * Function: importStylesheet
 * Description: Adds another stylesheet to an element.
 * Params:
 *      el: The element to which the stylesheet will be appended.
 *      file: The LOCAL path of the stylesheet to use (e.g., "/styles/styles.css").
 * Pre: The element 'el' must exist.
 * Post: Stylesheet will be added to the element.
 */
function importStylesheet(el, file) {
    return $("<link>", {
        rel: "stylesheet",
        href: chrome.extension.getURL(file),
        type: "text/css"
    }).appendTo($(el));    
}

/*
 * Function: addOnClicks
 * Description: Adds click event handlers for the slider bar.
 * Params: None
 */
function addOnClicks() {
    var el = $("#slideout").contents().find("body");
    
    if (el) {
        $("#slideout").contents().find("body")
            .off('click')
            .on('click', function(event) {
                $("#slideout").toggleClass("clicked");
                $("#GenderMagFrame").toggleClass("clicked");

                if ($("#slideout").hasClass("clicked")) {
                    setStatusToTrue("sliderIsOpen");
                } else {
                    setStatusToFalse("sliderIsOpen");
                }            
        });
    }
}

/*
 * Function: sidebarBody
 * Description: Returns the GenderMag frame element.
 * Params: None
 */
function sidebarBody() {
    return $("#GenderMagFrame").contents();
}

/*
 * Function: openSlider
 * Description: Shows the contents of the slider at the bottom of the screen.
 * Params: None
 */
function openSlider() {
    if (!$("#slideout").hasClass("clicked")) {
        $("#slideout").addClass("clicked");
        $("#GenderMagFrame").addClass("clicked");
        setStatusToTrue("sliderIsOpen");
    }
}

/*
 * Function: closeSlider
 * Description: Hides the contents of the slider at the bottom of the screen.
 * Params: None
 */
function closeSlider() {
    if ($("#slideout").hasClass("clicked")) {
        $("#slideout").toggleClass("clicked");
        $("#GenderMagFrame").toggleClass("clicked");
        setStatusToFalse("sliderIsOpen");
    }
}

/*
 * Function: saveAndExit
 * Description: Saves the current state and exits based on the exit type.
 * Params:
 *      exitType: Specifies the type of exit, either "slider" or another value.
 */
function saveAndExit(exitType) {
    var el = sidebarBody().find('#sideBySide');
    
    if (exitType === "slider") {
        el.contents().hide();
        appendTemplateToElement(el, '/templates/sliderFinalWarning.html');
        sidebarBody().find('#saveAndExit').attr("hidden", true);
        sidebarBody().find('#justExit').attr("hidden", true);
    } else {
        document.getElementById('myToolTip').style.display = "none";
        document.getElementById('genderMagCanvasContainer').style.display = "none";
        openSlider();
        el.contents().hide();
        appendTemplateToElement(el, '/templates/sliderFinalWarning.html');
        sidebarBody().find('#saveAndExit').attr("hidden", true);
        sidebarBody().find('#justExit').attr("hidden", true);
    }
    
    var scurvy = createCSV();
    downloadCSV(scurvy);

    $(el).find("#sliderFinalDownload")
        .unbind("click")
        .click(function() {
            var scurvy = createCSV();
            downloadCSV(scurvy, false);
        });

    $(el).find("#oldFormat")
        .unbind("click")
        .click(function() {
            var scurvy = createOldCSV();
            downloadCSV(scurvy, true);
        });

    $(el).find("#sliderYesCheckbox")
        .unbind("click")
        .click(function() {
            if ($(el).find('#sliderYesCheckbox').is(":checked")) {
                $(el).find('#sliderFinalYes').prop('disabled', false);
                $(el).find("#sliderFinalYes")
                    .attr("style", "background-color:#7D1935;color:white;");
            } else {
                $(el).find('#sliderFinalYes').prop('disabled', true);
                $(el).find("#sliderFinalYes")
                    .attr("style", "background-color:#7D1935;color:white;opacity:0.5");
            }
        });

    $(el).find("#sliderFinalYes")
        .unbind("click")
        .click(function() {
            localStorage.clear();
            location.reload();
        });

    $(el).find("#sliderFinalNo")
        .unbind("click")
        .click(function() {
            sidebarBody().find('#saveAndExit').attr("hidden", false);
            sidebarBody().find('#justExit').attr("hidden", false);
            $(el).find('#sliderFinalCountdown').remove();
            
            if (exitType === "slider") {
                $(el).find('#subgoalList').show();
                $(el).find('#containeryo').show();
                $(el).find('#personaInfo').show();
            } else {
                document.getElementById('myToolTip').style.display = "block";
                document.getElementById('genderMagCanvasContainer').style.display = "block";
                closeSlider();
                el.contents().show();
            }
        });
}

/*
 * Function: justExit
 * Description: Exits without saving based on the exit type.
 * Params:
 *      exitType: Specifies the type of exit, either "slider" or another value.
 */
function justExit(exitType) {
    var el = sidebarBody().find('#sideBySide');
    
    if (exitType === "slider") {
        el.contents().hide();
        appendTemplateToElement(el, '/templates/sliderFinalWarning.html');
        sidebarBody().find('#saveAndExit').attr("hidden", true);
        sidebarBody().find('#justExit').attr("hidden", true);
    } else {
        document.getElementById('myToolTip').style.display = "none";
        document.getElementById('genderMagCanvasContainer').style.display = "none";
        openSlider();
        el.contents().hide();
        appendTemplateToElement(el, '/templates/sliderFinalWarning.html');
        sidebarBody().find('#saveAndExit').attr("hidden", true);
        sidebarBody().find('#justExit').attr("hidden", true);
    }
    
    var scurvy = createCSV();

    $(el).find("#sliderFinalDownload")
        .unbind("click")
        .click(function() {
            var scurvy = createCSV();
            downloadCSV(scurvy, false);
        });

    $(el).find("#oldFormat")
        .unbind("click")
        .click(function() {
            var scurvy = createOldCSV();
            downloadCSV(scurvy, true);
        });

    $(el).find("#sliderYesCheckbox")
        .unbind("click")
        .click(function() {
            if ($(el).find('#sliderYesCheckbox').is(":checked")) {
                $(el).find('#sliderFinalYes').prop('disabled', false);
                $(el).find("#sliderFinalYes")
                    .attr("style", "background-color:#7D1935;color:white;");
            } else {
                $(el).find('#sliderFinalYes').prop('disabled', true);
                $(el).find("#sliderFinalYes")
                    .attr("style", "background-color:#7D1935;color:white;opacity:0.5");
            }
        });

    $(el).find("#sliderFinalYes")
        .unbind("click")
        .click(function() {
            localStorage.clear();
            location.reload();
        });

    $(el).find("#sliderFinalNo")
        .unbind("click")
        .click(function() {
            sidebarBody().find('#saveAndExit').attr("hidden", false);
            sidebarBody().find('#justExit').attr("hidden", false);
            $(el).find('#sliderFinalCountdown').remove();
            
            if (exitType === "slider") {
                $(el).find('#subgoalList').show();
                $(el).find('#containeryo').show();
                $(el).find('#personaInfo').show();
            } else {
                document.getElementById('myToolTip').style.display = "block";
                document.getElementById('genderMagCanvasContainer').style.display = "block";
                closeSlider();
                el.contents().show();
            }
        });
}
