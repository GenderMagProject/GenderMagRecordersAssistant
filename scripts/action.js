
	
var personaName = localStorage.getItem("personaName");
if (personaName !== null ) {personaName = personaName.slice(1, personaName.length-1);}
else { personaName = "abby"; }

function preActionQuestions(el){
	

    $(el).find("#annotateImage").hide();
    $(el).find("#retakeImage").hide();
	$(el).find("#imageCanvasTemplate").hide();
    $(el).find("#preActionTemplate").show();
	$(el).find("#imageCaption2").show();
		$(el).find("#HRmorelikefunpolice").show();
	$("#preActionClose").unbind( "click" ).click(function(){
		var actionName = localStorage.getItem("currActionName"); //Currently save and then deletes this name before it can be called again
		var yesNoMaybe = {"yes": $('#actionYes').is(":checked"), "no": $('#actionNo').is(":checked"), "maybe": $('#actionMaybe').is(":checked")};
		var whyText = $('#whyYes').val();
		var facets = {"motiv": $('#motiv').is(":checked"), "info": $('#info').is(":checked"), "self": $('#self').is(":checked"), "risk": $('#risk').is(":checked"), "tinker": $('#tinker').is(":checked")};
		savePreIdealAction(actionName, yesNoMaybe, whyText, facets);
        setStatusToTrue("gotPreActionQuestions");
		doActionPrompt(el);
	});
	

	$("#preActionBack").unbind( "click" ).click(function(){
        if (statusIsTrue("drewToolTip")) {
            $(el).find("#preActionTemplate").hide();
            $(el).find("#imageCanvasTemplate").show();
            $(el).find("#retakeImage").show();
            $(el).find("#annotateImage").show();
				$(el).find("#HRmorelikefunpolice").hide();
			$(el).find("#imageCaption2").hide();
		
            setStatusToFalse("gotScreenshot");
        }
        else {
            renderImage();
        }
	})
	//currently hard coded with Abby name, not sure how this will impact when selecting other personas but suspect things might break. 
    $(".abbyMTrigger").unbind( "click" ).click(function (){
        addToolTip(personaName+"MToolTip", personaName);	
		
    });
    $(".abbyIPSTrigger").unbind( "click" ).click(function(){
        addToolTip(personaName+"IPSToolTip", personaName);

    });
    $(".abbySETrigger").unbind( "click" ).click(function(){
        addToolTip(personaName+"SEToolTip", personaName);

    });
    $(".abbyRTrigger").unbind( "click" ).click(function(){
        addToolTip(personaName+"RToolTip", personaName);

    });
    $(".abbyTTrigger").unbind( "click" ).click(function(){
        addToolTip(personaName+"TToolTip", personaName);
	
    });
}

function doActionPrompt(el){
	$(el).find("#imageCaption3").hide();
	$(el).find("#imageCaption2").show();	
	$(el).find("#imageCanvas").show();
	$(el).find("#preActionTemplate").hide();
    $(el).find("#doActionPromptTemplate").show();
	$("#postAction").unbind( "click" ).click(function(){
        setStatusToTrue("idealActionPerformed");
		postActionQuestions(el);
	});
	$("#doActionBack").unbind( "click" ).click(function(){
		$(el).find("#doActionPromptTemplate").hide();
        $(el).find("#preActionTemplate").show();
        setStatusToFalse("gotPreActionQuestions");
		preActionQuestions(el);
	});
	$(".continueTrigger").unbind("click").click(function(){
		setStatusToTrue("idealActionPerformed");
		postActionQuestions(el);
	});
}

function postActionQuestions(el){
	$(el).find("#doActionPromptTemplate").hide();
    $(el).find("#postActionTemplate").show();
	$(el).find("#imageCaption2").hide();	
	$(el).find("#imageCanvas").hide();
	$(el).find("#imageCaption3").show();
	$("#afterb44lyfe").unbind("click").click(function(){
		$(el).find("#imageCaption2").show();	
		$(el).find("#imageCanvas").show();
		$(el).find("#imageCaption3").hide();
	});
	$("#submitPostAction").unbind( "click" ).click(function(){
	    setStatusToTrue("gotPostActionQuestions");
		var actionName = localStorage.getItem("currActionName");
		var yesNoMaybe = {"yes": $('#YNMyes').is(":checked"), "no": $('#YNMno').is(":checked"), "maybe": $('#YNMmaybe').is(":checked")};
		var whyText = $('#postWhyYes').val();
		var facets = {"motiv": $('#Q2motiv').is(":checked"), "info": $('#Q2info').is(":checked"), "self": $('#Q2self').is(":checked"), "risk": $('#Q2risk').is(":checked"), "tinker": $('#Q2tinker').is(":checked")};
		savePostIdealAction(actionName, yesNoMaybe, whyText, facets);
        
		actionLoop(el);
	});
    $(".abbyMTrigger").unbind( "click" ).click(function (){
        addToolTip("abbyMToolTip", "Abby");	
		$('#abbyMSeeMOAR').off('click').on('click', function() {
				var isOpen = $(this).attr("stateVar");
		
				//The "see more" is expanded and needs to be closed
				if (isOpen == 0) {
					$("#abbyMPreview").hide();
					$("#abbyMComplete").show();
					$("#abbyMSeeMOAR").html("See less");	
					$(this).attr("stateVar", 1);
				}
				else{
					$("#abbyMPreview").show();
					$("#abbyMComplete").hide();
					$("#abbyMSeeMOAR").html("See more...");	
					$(this).attr("stateVar", 0);
				}
				
			});
    });
    $(".abbyIPSTrigger").unbind( "click" ).click(function(){
        addToolTip("abbyIPSToolTip", "Abby");
			
    });
    $(".abbySETrigger").unbind( "click" ).click(function(){
        addToolTip("abbySEToolTip", "Abby");
		
		});
    $(".abbyRTrigger").unbind( "click" ).click(function(){
        addToolTip("abbyRToolTip", "Abby");
		
    });
    $(".abbyTTrigger").unbind( "click" ).click(function(){
        addToolTip("abbyTToolTip", "Abby");
	
	});
    $("#postActionBack").unbind( "click" ).click(function(){
        $(el).find("#postActionTemplate").hide();
        $(el).find("#doActionPromptTemplate").show();
        setStatusToFalse("idealActionPerformed");
        doActionPrompt(el);
    });
}

function actionLoop(el){
	$(el).find("#postActionTemplate").hide();
    $(el).find("#imageCaption2").hide();	
	$(el).find("#HRmorelikefunpolice").hide();
	$(el).find("#imageCanvas").hide();
	$(el).find("#imageCaption3").hide();
	$(el).find("#actionLoopTemplate").show();
	
	
	$("#moreActions").unbind( "click" ).click(function(){
		if ($(el).find("#actionNameInput").val() == ""){
			alert("Please name your action before continuing");
			
		}
		else{
		localStorage.setItem("currActionName", $(el).find("#actionNameInput").val());
		addToSandwich('idealAction', 0);
		$(el).remove();
        setStatusToFalse("drewToolTip");
		overlayScreen(0);
		overlayScreen(0); //Need to refactor overlay screen to not have to call it twice in certain instances
		preActionQuestions(el);     
        
        //Reset action states                   
        setStatusToFalse("highlightedAction");
        setStatusToFalse("gotScreenshot");
        setStatusToFalse("gotPreActionQuestions");
        setStatusToFalse("idealActionPerformed");
        setStatusToFalse("gotPostActionQuestions");
		}
	});
	
	$("#newSubgoal").unbind( "click" ).click(function(){
		if($(el).find("#subgoalInput").val() == ""){
			alert("Please name your subgoal before continuing")
		}
		else{
		localStorage.setItem("numActions", 0 );
		localStorage.setItem("currSubgoalName", $(el).find("#subgoalInput").val() );
		$(el).remove();
        setStatusToFalse("drewToolTip");
        
        //Reset action states
        setStatusToFalse("gotActionName");
        setStatusToFalse("actionPromptOnScreen");
        setStatusToFalse("drewToolTip");            
        setStatusToFalse("highlightedAction");
        setStatusToFalse("gotScreenshot");
        setStatusToFalse("gotPreActionQuestions");
        setStatusToFalse("idealActionPerformed");
        setStatusToFalse("gotPostActionQuestions");
        //Reset subgoal states
        setStatusToFalse("gotSubgoalName");
        setStatusToFalse("gotSubgoalQuestions");
        
		openSlider();
		var numSubgoals = Number(localStorage.getItem("numSubgoals"));
		numSubgoals++;
		localStorage.setItem("numSubgoals", numSubgoals)
		drawSubgoal(numSubgoals); //creates undefined unnamed subgoal
		}
	});
	
	$("#saveAndExit").unbind( "click" ).click(function(){
		
		$(el).find("#actionLoopTemplate").hide();
		$(el).find("#theFinalCountDown").show();
		
        setStatusToTrue("finishedGM");
		var entrees = parseSubgoalArray();
		var scurvy = createCSV(entrees);
		downloadCSV(scurvy);
		
		$("#finalDownload").unbind("click").click(function () {
			var entrees = parseSubgoalArray();
			var scurvy = createCSV(entrees);
			downloadCSV(scurvy);
		});
		
		$("#finalYesCheckbox").unbind("click").click(function () {
			if ($('#finalYesCheckbox').is(":checked")) {
				$('#finalYes').prop('disabled', false);
				$("#finalYes").attr("style","background-color:#7D1935;color:white;");
			}
			else {
				$('#finalYes').prop('disabled', true);
				$("#finalYes").attr("style","background-color:#7D1935;color:white;opacity:0.5");
			}
		});	
		
		$("#finalYes").unbind("click").click(function () {
			localStorage.clear(); 
			location.reload();
		});
		
		$("#finalNo").unbind("click").click(function () {
			$('#theFinalCountDown').hide();
			setStatusToFalse('finishedGM');
			$('#actionLoopTemplate').show();
		});
		
		
		
	});	
	$("#loopActionBack").unbind( "click" ).click(function(){
		$(el).find("#actionLoopTemplate").hide();
        $(el).find("#postActionTemplate").show();
		$(el).find("#imageCanvas").show();
		$(el).find("#imageCaption2").show();
		$(el).find("#HRmorelikefunpolice").show();
        setStatusToFalse("gotPostActionQuestions");
		postActionQuestions(el);
	});
	
}

function reloadToolTipState () {
	
	overlayScreen("onlyToolTip");
	
	var toolTip = document.getElementById("myToolTip");

	if (statusIsTrue("finishedGM")) {
		$(toolTip).find("#imageCanvasTemplate").hide();
		actionLoop(toolTip);
		$("#saveAndExit").click();
	}
	
	else if (statusIsTrue("gotPostActionQuestions")) {
		$(toolTip).find("#imageCanvasTemplate").hide();
		actionLoop(toolTip);
	}
	
	else if (statusIsTrue("idealActionPerformed")) {
		$(toolTip).find("#imageCanvasTemplate").hide();
		postActionQuestions(toolTip);
	}
	
	else if (statusIsTrue("gotPreActionQuestions")) {	
		$(toolTip).find("#imageCanvasTemplate").hide();
		doActionPrompt(toolTip);
	}
	
	else if (statusIsTrue("gotScreenshot")) {
		$(toolTip).find("#imageCanvasTemplate").hide();
		preActionQuestions(toolTip);
	}
	
	else if (statusIsTrue("highlightedAction")) {

		//renderImage()
		//console.log("on image");
		//overlayScreen("onlyToolTip");
	}
	
}

