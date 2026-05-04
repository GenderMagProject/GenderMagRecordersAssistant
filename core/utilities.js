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

function ensureFloatingUiBaseStyles() {
    if (document.getElementById("genderMagFloatingUiBaseStyles")) {
        return;
    }

    var style = document.createElement("style");
    style.id = "genderMagFloatingUiBaseStyles";
    style.textContent = [
        "#myToolTip, #imageAnnotation, #diyFacetModal, [id$='ToolTipDiv'] {",
        "  font-family: Arial, Helvetica, sans-serif;",
        "  font-size: 14px;",
        "  line-height: 1.4;",
        "  color: #000000;",
        "  box-sizing: border-box;",
        "  letter-spacing: normal;",
        "  word-spacing: normal;",
        "  text-transform: none;",
        "  text-indent: 0;",
        "  text-rendering: auto;",
        "}",
        "#myToolTip *, #imageAnnotation *, #diyFacetModal *, [id$='ToolTipDiv'] * {",
        "  box-sizing: border-box;",
        "  font-family: inherit;",
        "  line-height: inherit;",
        "  letter-spacing: normal;",
        "  word-spacing: normal;",
        "  text-transform: none;",
        "  text-indent: 0;",
        "  max-width: none;",
        "}",
        "#myToolTip button, #myToolTip input, #myToolTip textarea, #myToolTip select,",
        "#imageAnnotation button, #imageAnnotation input, #imageAnnotation textarea, #imageAnnotation select,",
        "#diyFacetModal button, #diyFacetModal input, #diyFacetModal textarea, #diyFacetModal select,",
        "[id$='ToolTipDiv'] button, [id$='ToolTipDiv'] input, [id$='ToolTipDiv'] textarea, [id$='ToolTipDiv'] select {",
        "  font: inherit;",
        "}",
        "#myToolTip p, #imageAnnotation p, #diyFacetModal p, [id$='ToolTipDiv'] p {",
        "  margin: 10px 0;",
        "  width: auto;",
        "}",
        "#myToolTip textarea, #imageAnnotation textarea, #diyFacetModal textarea {",
        "  resize: vertical;",
        "}",
        "#myToolTip canvas, #imageAnnotation canvas {",
        "  display: block;",
        "}",
        "#myToolTip #imagePreviewActions {",
        "  display: flex;",
        "  justify-content: flex-end;",
        "  align-items: center;",
        "  gap: 10px;",
        "  flex-wrap: wrap;",
        "  margin-top: 10px;",
        "}",
        "#myToolTip #imagePreviewActions button {",
        "  float: none !important;",
        "  width: auto;",
        "  min-width: 185px;",
        "  min-height: 25px;",
        "  padding: 0 14px;",
        "  white-space: nowrap;",
        "}",
        "#myToolTip .ui-draggable-handle, [id$='ToolTipDiv'].ui-draggable-handle {",
        "  cursor: move;",
        "}",
        "#myToolTip button, #imageAnnotation button, #diyFacetModal button, [id$='ToolTipDiv'] button {",
        "  text-transform: none;",
        "  letter-spacing: normal;",
        "}",
        "#diyFacetModalHeader {",
        "  cursor: move;",
        "}",
        "#diyFacetRows {",
        "  display: flex;",
        "  flex-direction: column;",
        "  gap: 10px;",
        "}",
        "#diyFacetModalBody {",
        "  overflow-y: auto;",
        "}"
    ].join("\n");
    document.head.appendChild(style);
}

/* Function Name: sidebarBody
 * Description: Returns the GenderMag frame element.
 * Parameters: None
 */
function sidebarBody() {
    return $("#GenderMagFrame").contents();
}

/* Function Name: setupSliderToggleClick
 * Description: Adds click event listeners to the slider bar to toggle its open/close state and set the status.
 * Parameters: None
 */
function setupSliderToggleClick(){
	
	//when slider is clicked, open or close
	var el = $("#slideout").contents().find("body");
	if (el) {
        el.off("click").on("click", handleSliderClick);
    }    
}

function handleSliderClick() {
	$("#slideout").toggleClass("clicked");
	$("#GenderMagFrame").toggleClass("clicked");

	const isOpen = $("#slideout").hasClass("clicked");
	if (typeof updateSessionState === "function") {
		updateSessionState(function (state) {
			state.ui.sliderOpen = isOpen;
		}, "Updated slider open state in sessionState.");
	}
}
