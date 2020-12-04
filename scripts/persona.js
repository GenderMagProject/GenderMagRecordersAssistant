/*
 * File Name: persona.js
 * Functions: loadPersona
 * Description: This file contains code to display persona info in the slider
 */

/*
 * Function: loadPersona
 * Description: This function loads the persona's image, description, and tooltips from their template
 * Params: personaName - the persona chosen by the user
 */
function loadPersona(personaName){
	//console.log("in load persona" , personaName);
	if(personaName === "Abi"){
		appendTemplateToElement(sidebarBody().find("#personaInfo"), "./templates/Abi/abiPersona.html");
		var abiSRC=chrome.extension.getURL("images/abimulti.png");
		var abiIMG= "<img id='AbiPhoto' src='" + abiSRC + "' alt='Abi Jones' class='sidebarImg' width='120' height='100'/>";
		sidebarBody().find("#picGoesHere").append(abiIMG);
		sidebarBody().find(".abiMTrigger").unbind( "click" ).click(function (){
			addToolTip("abiMToolTip", "Abi");
		});
		sidebarBody().find(".abiIPSTrigger").unbind( "click" ).click(function(){
			addToolTip("abiIPSToolTip", "Abi");
		});

		sidebarBody().find(".abiSETrigger").unbind( "click" ).click(function(){
			addToolTip("abiSEToolTip", "Abi");
		});
		sidebarBody().find(".abiRTrigger").unbind( "click" ).click(function(){
			addToolTip("abiRToolTip", "Abi");
		});
		sidebarBody().find(".abiTTrigger").unbind( "click" ).click(function(){
			addToolTip("abiTToolTip", "Abi");
		});


	}
	else if(personaName === "Tim"){
		appendTemplateToElement(sidebarBody().find("#personaInfo"), "./templates/Tim/timPersona.html");
		var timSRC=chrome.extension.getURL("images/Timmulti.png");
		var tImg = "<img id='TimPhoto' src='" + timSRC + "' alt='Tim Hopkins' class='sidebarImg' width='100' height='100'/>";
		sidebarBody().find("#picGoesHere").append(tImg);

		sidebarBody().find(".timMTrigger").unbind( "click" ).click(function (){
			addToolTip("timMToolTip", "Tim");
		});
		sidebarBody().find(".timIPSTrigger").unbind( "click" ).click(function(){
			addToolTip("timIPSToolTip", "Tim");
		});
		sidebarBody().find(".timSETrigger").unbind( "click" ).click(function(){
			addToolTip("timSEToolTip", "Tim");
		});
		sidebarBody().find(".timRTrigger").unbind( "click" ).click(function(){
			addToolTip("timRToolTip", "Tim");
		});
		sidebarBody().find(".timTTrigger").unbind( "click" ).click(function(){
			addToolTip("timTToolTip", "Tim");
		});

	}
	else if(personaName === "Pat"){
		appendTemplateToElement(sidebarBody().find("#personaInfo"), "./templates/pat/patPersona.html");
		var patSRC=chrome.extension.getURL("images/Patmulti.png");
		var patIMG= "<img id='patPhoto' src='" + patSRC + "' alt='Pat Jones' class='sidebarImg' width='100' height='100'/>";
		sidebarBody().find("#picGoesHere").append(patIMG);

		sidebarBody().find(".patMTrigger").unbind( "click" ).click(function (){
			addToolTip("patMToolTip", "Pat");
		});
		sidebarBody().find(".patIPSTrigger").unbind( "click" ).click(function(){
			addToolTip("patIPSToolTip", "Pat");
		});
		sidebarBody().find(".patSETrigger").unbind( "click" ).click(function(){
			addToolTip("patSEToolTip", "Pat");
		});
		sidebarBody().find(".patRTrigger").unbind( "click" ).click(function(){
			addToolTip("patRToolTip", "Pat");
		});
		sidebarBody().find(".patTTrigger").unbind( "click" ).click(function(){
			addToolTip("patTToolTip", "Pat");
		});
	}
	else if(personaName === "Custom"){
		appendTemplateToElement(sidebarBody().find("#personaInfo"), "./templates/custom/custom.html");

	}

}
