function loadPersona(personaName){
	//console.log("in load persona" , personaName);
	if(personaName == "Abby"){
		appendTemplateToElement(sidebarBody().find("#personaInfo"), "./templates/Abby/abbyPersona.html");
		var abbySRC=chrome.extension.getURL("images/abbymulti.png");
		var abbyIMG= "<img id='AbbyPhoto' src='" + abbySRC + "' alt='Abby Jones' class='sidebarImg' width='120' height='100'/>";
		sidebarBody().find("#picGoesHere").append(abbyIMG);
		sidebarBody().find(".abbyMTrigger").unbind( "click" ).click(function (){
			addToolTip("abbyMToolTip", "Abby");	
		});
		sidebarBody().find(".abbyIPSTrigger").unbind( "click" ).click(function(){
			addToolTip("abbyIPSToolTip", "Abby");
		});
	
		sidebarBody().find(".abbySETrigger").unbind( "click" ).click(function(){
			addToolTip("abbySEToolTip", "Abby");
		});
		sidebarBody().find(".abbyRTrigger").unbind( "click" ).click(function(){
			addToolTip("abbyRToolTip", "Abby");
		});
		sidebarBody().find(".abbyTTrigger").unbind( "click" ).click(function(){
			addToolTip("abbyTToolTip", "Abby");
		});
		
			
	}
	else if(personaName == "Tim"){
		appendTemplateToElement(sidebarBody().find("#personaInfo"), "./templates/Tim/timPersona.html");
		var timSRC=chrome.extension.getURL("images/Tim_square.jpg");
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
	else if(personaName == "Patrick"){
		appendTemplateToElement(sidebarBody().find("#personaInfo"), "./templates/Patrick/patrickPersona.html");
		var patrickSRC=chrome.extension.getURL("images/Patrick_square.jpg");
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
	else if(personaName == "Patricia"){
		appendTemplateToElement(sidebarBody().find("#personaInfo"), "./templates/Patricia/patriciaPersona.html");
		var patriciaSRC=chrome.extension.getURL("images/Patricia_square.jpg");
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
	else{

	}
}