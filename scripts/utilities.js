/*
 * File Name: utilities.js
 * Functions: init, appendTemplateToElement, importStylesheet, addOnClicks, sidebarBody, openSlider, closeSlider
 * Description: This file provides utility functions for use throughout the project such as 'openSlider'
 */

/*
 * Function: init
 * Description: This function
 * Params: None
 */
// function init(){
// 	console.log("2");
//     //init the status object
//     initStatusObject();

//     //import all necessary stylesheets and start out with just the slider on the page
// 	importStylesheet("body","./styles/slider.css");
// 	appendTemplateToElement("body","./templates/slider.html");
// 	importStylesheet($("#slideout").contents().find("head"),"/styles/sliderbody.css");
// 	importStylesheet($("#slideout").contents().find("head"),"/styles/styles.css");
// 	importStylesheet($("#slideout").contents().find("head"),"/jquery-ui-1.12.1/jquery-ui.css");
// 	importStylesheet($("#slideout").contents().find("head"),"font-awesome-4.6.1/css/font-awesome.min.css");
// 	$("#slideout").contents().find("body").append("GenderMag");
// 	addOnClicks();
// 	setup("#GenderMagFrame", "./templates/firstState.html");
// 	reloadSandwich();
	
// 	//Local storage removal
// 	//localStorage.removeItem("numSubgoals");
// 	//localStorage.removeItem("subgoalArray");
// 	//localStorage.removeItem("numActions");
	
// }

function init() {
    console.log("2");

    // Initialize the status object
    initStatusObject();

    // Import all necessary stylesheets
    importStylesheet("body", "./styles/slider.css");

    // Append the template asynchronously and handle dependent tasks in a callback
    appendTemplateToElement("body", "./templates/slider.html", (error, data) => {
        if (error) {
            console.error("Error appending slider template:", error);
            return;
        }

        // Perform tasks that depend on the slider being loaded
        console.log("Slider template appended successfully.");

        // Import additional stylesheets for the slider content
        importStylesheet($("#slideout").contents().find("head"), "/styles/sliderbody.css");
        importStylesheet($("#slideout").contents().find("head"), "/styles/styles.css");
        importStylesheet($("#slideout").contents().find("head"), "/jquery-ui-1.12.1/jquery-ui.css");
        importStylesheet($("#slideout").contents().find("head"), "font-awesome-4.6.1/css/font-awesome.min.css");

        // Append text and setup event listeners
        $("#slideout").contents().find("body").append("GenderMag");
        addOnClicks();
        setup("#GenderMagFrame", "./templates/firstState.html");
        reloadSandwich();
		console.log("Utilities init execution completed")
        // Local storage removal (if needed)
        // localStorage.removeItem("numSubgoals");
        // localStorage.removeItem("subgoalArray");
        // localStorage.removeItem("numActions");
    });
}


/* Function: appendTemplateToElement
 * Description: This function is used to add the contents of another html file to a specified element
 * Params:
 * 		el: the element to which the template will be appended
 *		file: the LOCAL path of the template to use (e.g., "/templates/popup.html")
 *
 * Pre: element el must exist
 * Post: template will be added to element AFTER all other content. Elements within the template can be referred to
 * as long as the referrer is still in the scope in which this function was called.
 */ 
//  async function appendTemplateToElement(el,file){
// 	console.log("5");	
// 	var msg = $.ajax({type: "GET", url: chrome.extension.getURL(file), async: false}).responseText;
// 	var dataToAppend =$($.parseHTML(msg));
// 	$(el).append(dataToAppend);
// }

//mv3 function , made it async 
function appendTemplateToElement(el, file, callback) {
    console.log("5");

    fetch(chrome.runtime.getURL(file))
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch the file: " + response.statusText);
            }
            return response.text();
        })
        .then(msg => {
            // Parse fetched HTML
            const dataToAppend = $($.parseHTML(msg));
            console.log("Data to append:", dataToAppend);

            // Append the content
            $(el).append(dataToAppend);
            console.log("Content appended successfully.");

            // Execute all scripts within the fetched content
            dataToAppend.filter("script").each(function () {
                if (this.src) {
                    // External script
                    const script = document.createElement("script");
                    script.src = this.src;
                    document.head.appendChild(script);
                } else {
                    // Inline script
                    eval(this.textContent); // Be cautious with eval
                }
            });

            // Callback to signal completion
            if (typeof callback === "function") {
                callback(null, dataToAppend);
            }
        })
        .catch(error => {
            console.error("Error appending template to element:", error);

            // Callback with error
            if (typeof callback === "function") {
                callback(error, null);
            }
        });
}



/* Function: importStylesheet
 * Description: This function is used to add another stylesheet to an element
 * Takes 2 arguments:
 * 		el: the element to which the stylesheet will be appended
 *		file: the LOCAL path of the template to use (e.g., "/styles/styles.css")
 *
 * Pre: element el must exist
 * Post: Stylesheet will be added to the element.
 */
function importStylesheet(el, file){
	console.log("4");
	//console.log("#"+ el);
	return $("<link>", {
			rel:"stylesheet",
			//href: chrome.extension.getURL(file),
			href: chrome.runtime.getURL(file),
			type: "text/css"
		}).appendTo($(el));	
}

/* Function: addOnClicks
 * Description: This function adds on clicks for the slider bar
 * Params: None
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

/*
 * Function: sidebarBody
 * Description: This function returns the GenderMag frame element
 * Params: None
 */
function sidebarBody(){
	return $("#GenderMagFrame").contents();
}

/*
 * Function: openSlider
 * Description: This function shows the contents of the slider at the bottom of the screen
 * Params: None
 */
function openSlider(){
	if(!$("#slideout").hasClass("clicked")){
		$("#slideout").addClass("clicked");
		$("#GenderMagFrame").addClass("clicked");
        setStatusToTrue("sliderIsOpen");
	}
}

/*
 * Function: closeSlider
 * Description: This function hides the contents of the slider at the bottom of the screen
 * Params: None
 */
function closeSlider(){
	if($("#slideout").hasClass("clicked")){
		$("#slideout").toggleClass("clicked");
		$("#GenderMagFrame").toggleClass("clicked");
        setStatusToFalse("sliderIsOpen");
	}
}

/*
 * Function: saveAndExit
 */
// function saveAndExit(exitType){
// 	el = sidebarBody().find('#sideBySide');
// 	if(exitType === "slider") {
// 		el.contents().hide();
// 		appendTemplateToElement(el, '/templates/sliderFinalWarning.html');
// 		sidebarBody().find('#saveAndExit').attr("hidden", true);
// 		sidebarBody().find('#justExit').attr("hidden", true);
// 	} else {
// 		document.getElementById('myToolTip').style.display = "none";
// 		document.getElementById('genderMagCanvasContainer').style.display="none";
// 		openSlider();
// 		el.contents().hide();
// 		appendTemplateToElement(el, '/templates/sliderFinalWarning.html');
// 		sidebarBody().find('#saveAndExit').attr("hidden", true);
// 		sidebarBody().find('#justExit').attr("hidden", true);
// 	};
// 	var scurvy = createCSV();
// 	downloadCSV(scurvy);

// 	$(el).find("#sliderFinalDownload").unbind("click").click(function () {
// 		var scurvy = createCSV();
// 		downloadCSV(scurvy, false);
// 	});

// 	$(el).find("#oldFormat").unbind("click").click(function () {
// 		var scurvy = createOldCSV();
// 		downloadCSV(scurvy, true);
// 	});

// 	$(el).find("#sliderYesCheckbox").unbind("click").click(function () {
// 		if ($(el).find('#sliderYesCheckbox').is(":checked")) {
// 			$(el).find('#sliderFinalYes').prop('disabled', false);
// 			$(el).find("#sliderFinalYes").attr("style","background-color:#7D1935;color:white;");
// 		}
// 		else {
// 			$(el).find('#sliderFinalYes').prop('disabled', true);
// 			$(el).find("#sliderFinalYes").attr("style","background-color:#7D1935;color:white;opacity:0.5");
// 		}
// 	});

// 	$(el).find("#sliderFinalYes").unbind("click").click(function () {
// 		localStorage.clear();
// 		location.reload();
// 	});

// 	$(el).find("#sliderFinalNo").unbind("click").click(function () {
// 		sidebarBody().find('#saveAndExit').attr("hidden", false);
// 		sidebarBody().find('#justExit').attr("hidden", false);
// 		$(el).find('#sliderFinalCountdown').remove();
// 		if(exitType ==="slider") {
// 			$(el).find('#subgoalList').show();
// 			$(el).find('#containeryo').show();
// 			$(el).find('#personaInfo').show();
// 		}
// 		else{
// 			document.getElementById('myToolTip').style.display = "block";
// 			document.getElementById('genderMagCanvasContainer').style.display="block";
// 			closeSlider();
// 			el.contents().show();
// 		}
// 	});
// }
/*
 * Function: saveAndExit
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
    console.log("in save and exit in utilities");
    var scurvy = createCSV();
    downloadCSV(scurvy);
}

/*
 * Bind events for dynamically injected buttons inside the template
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

/*
 * Function: justExit
 */
// function justExit(exitType){
// 	el = sidebarBody().find('#sideBySide');
// 	if(exitType === "slider") {
// 		el.contents().hide();
// 		appendTemplateToElement(el, '/templates/sliderFinalWarning.html');
// 		sidebarBody().find('#saveAndExit').attr("hidden", true);
// 		sidebarBody().find('#justExit').attr("hidden", true);
// 	} else {
// 		document.getElementById('myToolTip').style.display = "none";
// 		document.getElementById('genderMagCanvasContainer').style.display="none";
// 		openSlider();
// 		el.contents().hide();
// 		appendTemplateToElement(el, '/templates/sliderFinalWarning.html');
// 		sidebarBody().find('#saveAndExit').attr("hidden", true);
// 		sidebarBody().find('#justExit').attr("hidden", true);
// 	};
// 	var scurvy = createCSV();

// 	$(el).find("#sliderFinalDownload").unbind("click").click(function () {
// 		var scurvy = createCSV();
// 		downloadCSV(scurvy, false);
// 	});

// 	$(el).find("#oldFormat").unbind("click").click(function () {
// 		var scurvy = createOldCSV();
// 		downloadCSV(scurvy, true);
// 	});

// 	$(el).find("#sliderYesCheckbox").unbind("click").click(function () {
// 		if ($(el).find('#sliderYesCheckbox').is(":checked")) {
// 			$(el).find('#sliderFinalYes').prop('disabled', false);
// 			$(el).find("#sliderFinalYes").attr("style","background-color:#7D1935;color:white;");
// 		}
// 		else {
// 			$(el).find('#sliderFinalYes').prop('disabled', true);
// 			$(el).find("#sliderFinalYes").attr("style","background-color:#7D1935;color:white;opacity:0.5");
// 		}
// 	});

// 	$(el).find("#sliderFinalYes").unbind("click").click(function () {
// 		localStorage.clear();
// 		location.reload();
// 	});

// 	$(el).find("#sliderFinalNo").unbind("click").click(function () {
// 		sidebarBody().find('#saveAndExit').attr("hidden", false);
// 		sidebarBody().find('#justExit').attr("hidden", false);
// 		$(el).find('#sliderFinalCountdown').remove();
// 		if(exitType ==="slider") {
// 			$(el).find('#subgoalList').show();
// 			$(el).find('#containeryo').show();
// 			$(el).find('#personaInfo').show();
// 		}
// 		else{
// 			document.getElementById('myToolTip').style.display = "block";
// 			document.getElementById('genderMagCanvasContainer').style.display="block";
// 			closeSlider();
// 			el.contents().show();
// 		}
// 	});
// }
/*
 * Function: justExit
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

/* 
 * Bind button events inside #sliderFinalWarning after template injection.
 */
function bindSliderFinalButtons(el, exitType) {
    console.log("Binding events for buttons inside #sliderFinalWarning.");

    $(el).find("#sliderFinalDownload").unbind("click").click(function () {
        console.log("Download button clicked.");
        var scurvy = createCSV();
        downloadCSV(scurvy, false);
    });

    $(el).find("#oldFormat").unbind("click").click(function () {
        console.log("Old format download button clicked.");
        var scurvy = createOldCSV();
        downloadCSV(scurvy, true);
    });

    $(el).find("#sliderYesCheckbox").unbind("click").click(function () {
        console.log("Yes checkbox clicked. Checked:", $(el).find('#sliderYesCheckbox').is(":checked"));
        if ($(el).find('#sliderYesCheckbox').is(":checked")) {
            $(el).find('#sliderFinalYes').prop('disabled', false);
            $(el).find("#sliderFinalYes").attr("style", "background-color:#7D1935;color:white;");
        } else {
            $(el).find('#sliderFinalYes').prop('disabled', true);
            $(el).find("#sliderFinalYes").attr("style", "background-color:#7D1935;color:white;opacity:0.5");
        }
    });

    $(el).find("#sliderFinalYes").unbind("click").click(function () {
        console.log("Quit GenderMag button clicked.");
        localStorage.clear();
        location.reload();
    });

    $(el).find("#sliderFinalNo").unbind("click").click(function () {
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
