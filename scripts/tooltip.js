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
		pageDiv.style.zindex = "10002";	
		pageDiv.style.border ="3px solid #4A96AD";
		pageDiv.style.cursor="pointer";
		pageDiv.style.borderRadius="5px";
		pageDiv.style.backgroundColor = "white";
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
	
}