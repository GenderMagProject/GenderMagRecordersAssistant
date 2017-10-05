function init(){
	
    //init the status object
    initStatusObject();

	importStylesheet("body","./styles/slider.css");
	appendTemplateToElement("body","./templates/slider.html");
	importStylesheet($("#slideout").contents().find("head"),"/styles/sliderbody.css");
	importStylesheet($("#slideout").contents().find("head"),"/styles/styles.css");
	importStylesheet($("#slideout").contents().find("head"),"/jquery-ui-1.11.4.custom/jquery-ui.css");
	importStylesheet($("#slideout").contents().find("head"),"font-awesome-4.6.1/css/font-awesome.min.css");
	//importStylesheet($("body"), "/styles/screenShotStyle.css");
	$("#slideout").contents().find("body").append("GenderMag");
	addOnClicks();
	setup("#GenderMagFrame", "./templates/firstState.html");
	reloadSandwich();
	
	//Local storage removal
	//localStorage.removeItem("numSubgoals");
	//localStorage.removeItem("subgoalArray");
	//localStorage.removeItem("numActions");
	
}

/* Function appendTemplateToElement
 * 
 * Takes 2 arguements:
 * 		element: the element to which the template will be appended
 *		file: the LOCAL path of the template to use (e.g., "/templates/popup.html")
 *
 * Pre: element must exist
 * Post: template will be added to element AFTER all other content. Elements within the template can be referred to
 * as long as the referrer is still in the scope in which this function was called.
 */ 
function appendTemplateToElement(el,file){	
	var msg = $.ajax({type: "GET", url: chrome.extension.getURL(file), async: false}).responseText;
	var dataToAppend =$($.parseHTML(msg));
	$(el).append(dataToAppend);
}

/* Function importStylesheet
 * 
 * Takes 2 arguements:
 * 		element: the element to which the stylesheet will be appended
 *		file: the LOCAL path of the template to use (e.g., "/styles/styles.css")
 *
 * Pre: element must exist
 * Post: Stylesheet will be added to the element.
 */

function importStylesheet(el, file){
	//console.log("#"+ el);
	return $("<link>", {
			rel:"stylesheet",
			href: chrome.extension.getURL(file),
			type: "text/css"
		}).appendTo($(el));	
}
/* Function addOnClicks
 *
 * Takes no arguments, adds all onclicks for the page
 *
 */
function addOnClicks(){
	
	//The slider handle
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

function sidebarBody(){
	return $("#GenderMagFrame").contents();
}

function openSlider(){
	if(!$("#slideout").hasClass("clicked")){
		$("#slideout").addClass("clicked");
		$("#GenderMagFrame").addClass("clicked");
        setStatusToTrue("sliderIsOpen");
	}
}

function closeSlider(){
	if($("#slideout").hasClass("clicked")){
		$("#slideout").toggleClass("clicked");
		$("#GenderMagFrame").toggleClass("clicked");
        setStatusToFalse("sliderIsOpen");
	}
}