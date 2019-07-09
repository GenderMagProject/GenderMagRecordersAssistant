/*
 * This function is made to insert the users pronouns and possessive adjective into the tool tip
 * It should be called from addToolTip but is currently not in use do to grammar problems with the wording
 * in the tool tip (for example: she gathers vs. they gather)
 */
function updatePronoun() {
	var x = document.getElementsByClassName("pronoun");
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].innerHTML = localStorage.getItem('personaPronoun');
	}
	var y = document.getElementsByClassName("possessive");
	for (i = 0; i < y.length; i++) {
		y[i].innerHTML = localStorage.getItem('personaPossessive');
	}
}

function addToolTip(toolTipName, folderName){
	if($("#"+toolTipName + "Div")){
		$("#"+toolTipName+"Div").remove();
	}

		var pageDiv = document.createElement("div");
		pageDiv.id = toolTipName+"Div";
		document.body.appendChild(pageDiv);
		pageDiv.style.position="fixed";
		pageDiv.style.right = "50px";
		pageDiv.style.top = "30px";
		pageDiv.style.height = "200px";
		pageDiv.style.width = "500px";
		pageDiv.style.zIndex = "99999";
		pageDiv.style.border ="3px solid #4A96AD";
		pageDiv.style.cursor="pointer";
		pageDiv.style.borderRadius="5px";
		pageDiv.style.backgroundColor = "white";
		pageDiv.style.overflow = "auto";

		appendTemplateToElement($("#"+toolTipName+"Div"), 'templates/'+folderName+ '/' +toolTipName +'.html');
		$("#"+toolTipName+"Div").draggable();
		$("#" + toolTipName + "Button").off('click').on('click', function() {
			$("#" + toolTipName + "Div").remove();
		});
		$('#'+toolTipName+'SeeMOAR').off('click').on('click', function() {
				var isOpen = $(this).attr("stateVar");
		
				//The "see more" is expanded and needs to be closed
				if (isOpen == 0) {
					$("#"+toolTipName+"Preview").hide();
					$("#"+toolTipName+"Complete").show();
					$("#"+toolTipName+"SeeMOAR").html("See less");	
					$(this).attr("stateVar", 1);
				}
				else{
					$("#"+toolTipName+"Preview").show();
					$("#"+toolTipName+"Complete").hide();
					$("#"+toolTipName+"SeeMOAR").html("See more...");	
					$(this).attr("stateVar", 0);
				}
				
		});
	//updatePronoun();
}