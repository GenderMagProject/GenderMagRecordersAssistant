
/* Function Name: init
 * Description: Initializes the status object, imports necessary stylesheets, appends the slider template to the body, and sets up event listeners.
 * Parameters: None
 */
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

/* Function Name: sidebarBody
 * Description: Returns the GenderMag frame element.
 * Parameters: None
 */
function sidebarBody() {
    return $("#GenderMagFrame").contents();
}
