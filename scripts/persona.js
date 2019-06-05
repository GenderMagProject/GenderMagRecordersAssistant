function loadPersona(personaName){
	//console.log("in load persona" , personaName);
	if(personaName === "Abi"){
		saveVarToLocal("personaPronoun", "she");
		saveVarToLocal("personaPossessive", 'her');
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
		saveVarToLocal("personaPronoun", 'he');
		saveVarToLocal("personaPossessive", 'his');
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
	else if(personaName === "Patrick"){
		saveVarToLocal("personaPronoun", "he");
		saveVarToLocal("personaPossessive", "his");
		appendTemplateToElement(sidebarBody().find("#personaInfo"), "./templates/Patrick/patrickPersona.html");
		var patrickSRC=chrome.extension.getURL("images/Patricmulti.png");
		var patrickIMG= "<img id='PatrickPhoto' src='" + patrickSRC + "' alt='Patrick Jones' class='sidebarImg' width='100' height='100'/>";
		sidebarBody().find("#picGoesHere").append(patrickIMG);

		sidebarBody().find(".patrickMTrigger").unbind( "click" ).click(function (){
			addToolTip("patrickMToolTip", "Patrick");
		});
		sidebarBody().find(".patrickIPSTrigger").unbind( "click" ).click(function(){
			addToolTip("patrickIPSToolTip", "Patrick");
		});
		sidebarBody().find(".patrickSETrigger").unbind( "click" ).click(function(){
			addToolTip("patrickSEToolTip", "Patrick");
		});
		sidebarBody().find(".patrickRTrigger").unbind( "click" ).click(function(){
			addToolTip("patrickRToolTip", "Patrick");
		});
		sidebarBody().find(".patrickTTrigger").unbind( "click" ).click(function(){
			addToolTip("patrickTToolTip", "Patrick");
		});
	}
	else if(personaName === "Patricia"){
		saveVarToLocal("personaPronoun", "she");
		saveVarToLocal("personaPossessive", "her");
		appendTemplateToElement(sidebarBody().find("#personaInfo"), "./templates/Patricia/patriciaPersona.html");
		var patriciaSRC=chrome.extension.getURL("images/Patriciamulti.png");
		var patriciaIMG= "<img id='PatriciaPhoto' src='" + patriciaSRC + "' alt='Patricia Jones' class='sidebarImg' width='100' height='100'/>";
		sidebarBody().find("#picGoesHere").append(patriciaIMG);

		sidebarBody().find(".patriciaMTrigger").unbind( "click" ).click(function (){
			addToolTip("patriciaMToolTip", "Patricia");
		});
		sidebarBody().find(".patriciaIPSTrigger").unbind( "click" ).click(function(){
			addToolTip("patriciaIPSToolTip", "Patricia");
		});
		sidebarBody().find(".patriciaSETrigger").unbind( "click" ).click(function(){
			addToolTip("patriciaSEToolTip", "Patricia");
		});
		sidebarBody().find(".patriciaRTrigger").unbind( "click" ).click(function(){
			addToolTip("patriciaRToolTip", "Patricia");
		});
		sidebarBody().find(".patriciaTTrigger").unbind( "click" ).click(function(){
			addToolTip("patriciaTToolTip", "Patricia");
		});
	}
	else if(personaName === "Custom"){
		saveVarToLocal("personaPronoun", "they");
		saveVarToLocal("personaPossessive", "their");
		appendTemplateToElement(sidebarBody().find("#personaInfo"), "./templates/custom/custom.html");
//	var patrickSRC=chrome.extension.getURL("images/Patricmulti.png");
//	var patrickIMG= "<img id='PatrickPhoto' src='" + patrickSRC + "' alt='Patrick Jones' class='sidebarImg' width='100' height='100'/>";
//	sidebarBody().find("#picGoesHere").append(patrickIMG);

		sidebarBody().find(".patriciaMTrigger").unbind( "click" ).click(function (){
			addToolTip("patriciaMToolTip", "Patricia");
		});
		sidebarBody().find(".patriciaIPSTrigger").unbind( "click" ).click(function(){
			addToolTip("patriciaIPSToolTip", "Patricia");
		});
		sidebarBody().find(".patriciaSETrigger").unbind( "click" ).click(function(){
			addToolTip("patriciaSEToolTip", "Patricia");
		});
		sidebarBody().find(".patriciaRTrigger").unbind( "click" ).click(function(){
			addToolTip("patriciaRToolTip", "Patricia");
		});
		sidebarBody().find(".patriciaTTrigger").unbind( "click" ).click(function(){
			addToolTip("patriciaTToolTip", "Patricia");
		});
	}
	else{

	}
}
