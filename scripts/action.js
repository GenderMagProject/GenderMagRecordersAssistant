/*
 * File Name: action.js
 * Functions: preActionQuestions, doActionPrompt, postActionQuestions, actionLoop, reloadToolTipState
 * Description: This file contains functions to handle the action part of the walkthrough starting right
 *   after the screenshot through the end and exit of the session
 */


//Sets persona name?? Runs at startup??
var personaName = localStorage.getItem("personaName");
if (personaName !== null ) {personaName = personaName.slice(1, personaName.length-1);}
else { personaName = "abby"; }

/*
 * Function: preActionQuestions
 * Description: This function handles the 'preaction questions' in the pop up window
 *	 These questions are the 'will <persona> know what to do at this step/why' page in the
 *	 pop up
 * Params: el - tooltip pop up element
 */
function preActionQuestions(el){
	//hide draw button and retake button, show preaction questions
    $(el).find("#annotateImage").hide();
    $(el).find("#retakeImage").hide();
	$(el).find("#imageCanvasTemplate").hide();
    $(el).find("#preActionTemplate").show();
	$(el).find("#imageCaption2").show();
	$(el).find("#HRmorelikefunpolice").show();
	//when save and continue button is clicked, save input values
	$("#preActionClose").unbind( "click" ).click(function(){
		var actionName = localStorage.getItem("currActionName"); //Currently save and then deletes this name before it can be called again
		var yesNoMaybe = {"yes": $('#actionYes').is(":checked"), "no": $('#actionNo').is(":checked"), "maybe": $('#actionMaybe').is(":checked")};
		var whyText = $('#whyYes').val();
		var facets = {"motiv": $('#motiv').is(":checked"), "info": $('#info').is(":checked"), "self": $('#self').is(":checked"), "risk": $('#risk').is(":checked"), "tinker": $('#tinker').is(":checked")};
		savePreIdealAction(actionName, yesNoMaybe, whyText, facets);
        setStatusToTrue("gotPreActionQuestions");
		doActionPrompt(el);
	});
	
	//when back button is clicked, show buttons, hide preaction
	$("#preActionBack").unbind( "click" ).click(function(){
		//if popup is set up, change elements to be shown, else set up new pop up
        if (statusIsTrue("drewToolTip")) {
            $(el).find("#preActionTemplate").hide();
            $(el).find("#imageCanvasTemplate").show();
            $(el).find("#retakeImage").show();
            $(el).find("#annotateImage").show();
            $(el).find("#HRmorelikefunpolice").hide();
			$(el).find("#imageCaption2").hide();
			setStatusToFalse("gotScreenshot");
        } else {
            renderImage();
        }
	});

	//Set up links by checkboxes to show info popups
	//currently hard coded with Abby name, not sure how this will impact when selecting other personas but suspect things might break. 
	//motivation info

	//set functionality for motivation pop up info window
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
	//set up other info pop ups
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
}

/*
 *	Function: doActionPrompt
 *	Description: This function handles adding the action prompt to the pop up
 *	Params: el - tooltip pop up element
 */
function doActionPrompt(el){
	//hide preaction questions, show action prompt
	$(el).find("#imageCaption3").hide();
	$(el).find("#imageCaption2").show();	
	$(el).find("#imageCanvas").show();
	$(el).find("#preActionTemplate").hide();
    $(el).find("#doActionPromptTemplate").show();

    //hide canvas container so screen can be clicked
    var container = document.getElementById("genderMagCanvasContainer");
    container.style.display = "none";

    //add button functions
	$("#postAction").unbind( "click" ).click(function(){
        setStatusToTrue("idealActionPerformed");
		postActionQuestions(el);
	});
	//back button to return to preaction questions
	$("#doActionBack").unbind( "click" ).click(function(){
		$(el).find("#doActionPromptTemplate").hide();
        $(el).find("#preActionTemplate").show();
        setStatusToFalse("gotPreActionQuestions");
		preActionQuestions(el);
	});
	//continue link to go to postaction questions
	$(".continueTrigger").unbind("click").click(function(){
		setStatusToTrue("idealActionPerformed");
        container.style.display = "block";
		postActionQuestions(el);
	});
}

/*
 * Function: postActionQuestions
 * Description: This function handles the post action questions (which are 'will <persona> know
 *   they did the right thing/why')
 * Params: el - tooltip pop up element
 */
function postActionQuestions(el){
	//hide do action prompt, show post action questions
	$(el).find("#doActionPromptTemplate").hide();
    $(el).find("#postActionTemplate").show();
	$(el).find("#imageCaption2").hide();	
	$(el).find("#imageCanvas").hide();
	$(el).find("#imageCaption3").show();

	//link to show image preview again
	$("#afterb44lyfe").unbind("click").click(function(){
		$(el).find("#imageCaption2").show();
		$(el).find("#imageCanvas").show();
		$(el).find("#imageCaption3").hide();
	});

	//save and continue button - on click save input
	$("#submitPostAction").unbind( "click" ).click(function(){
	    setStatusToTrue("gotPostActionQuestions");
		var actionName = localStorage.getItem("currActionName");
		var yesNoMaybe = {"yes": $('#YNMyes').is(":checked"), "no": $('#YNMno').is(":checked"), "maybe": $('#YNMmaybe').is(":checked")};
		var whyText = $('#postWhyYes').val();
		var facets = {"motiv": $('#Q2motiv').is(":checked"), "info": $('#Q2info').is(":checked"), "self": $('#Q2self').is(":checked"), "risk": $('#Q2risk').is(":checked"), "tinker": $('#Q2tinker').is(":checked")};
		savePostIdealAction(actionName, yesNoMaybe, whyText, facets);
        //move on to checking if user wants new subgoal or action or end session
		actionLoop(el);
	});

	//set functionality for motivation pop up info window
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
    //set up other info pop ups
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

/*
 * Function: actionLoop
 * Description: This function handles asking the user if they want to make a new action or subgoal for their gm session
 *	 It also contains the save and exit functionality for the end of the gm session
 * Params: el - tooltip pop up element
 */
function actionLoop(el){
	//hide post action questions, show action loop (if user wants new subgoal/action or close session
	$(el).find("#postActionTemplate").hide();
    $(el).find("#imageCaption2").hide();	
	$(el).find("#HRmorelikefunpolice").hide();
	$(el).find("#imageCanvas").hide();
	$(el).find("#imageCaption3").hide();
    $(el).find("#retakeImage").hide();
    $(el).find("#annotateImage").hide();
	$(el).find("#actionLoopTemplate").show();

	//make new action on 'add another action' button click
	$("#moreActions").unbind( "click" ).click(function(){
		if ($(el).find("#actionNameInput").val() == ""){
			alert("Please name your action before continuing");
		} else{
			//save action name, get screenshot, set up pop up, start action questions
			localStorage.setItem("currActionName", $(el).find("#actionNameInput").val());
			addToSandwich('idealAction', 0);
			$(el).remove();
        	setStatusToFalse("drewToolTip");
			overlayScreen("");
			preActionQuestions(el);

        	//Reset action states
        	setStatusToFalse("highlightedAction");
        	setStatusToFalse("gotScreenshot");
        	setStatusToFalse("gotPreActionQuestions");
        	setStatusToFalse("idealActionPerformed");
        	setStatusToFalse("gotPostActionQuestions");
		}
	});

	//make new subgoal on 'create new subgoal' button click
	$("#newSubgoal").unbind( "click" ).click(function(){
		if($(el).find("#subgoalInput").val() === ""){
			alert("Please name your subgoal before continuing");
		}
		else{
			//reset subgoal stats, set new name as current subgoal name
			localStorage.setItem("numActions", 0 );
			localStorage.setItem("currSubgoalName", $(el).find("#subgoalInput").val() );
			setStatusToTrue("gotSubgoalName");
			//remove tooltip
			$(el).remove();
        	setStatusToFalse("drewToolTip");
        	//close canvas so page is clickable
        	document.getElementById('genderMagCanvasContainer').style.display="none";

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
        	//setStatusToFalse("gotSubgoalName");
        	setStatusToFalse("gotSubgoalQuestions");

        	//open slider and go back to subgoal questions
			openSlider();
			var numSubgoals = Number(localStorage.getItem("numSubgoals"));
			numSubgoals++;
			localStorage.setItem("numSubgoals", numSubgoals)
			drawSubgoal(numSubgoals); //creates undefined unnamed subgoal
		}
	});

	//on save and exit button click, save all info, close session
	$("#saveAndExit").unbind( "click" ).click(function(){
		$(el).find("#actionLoopTemplate").hide();
		$(el).find("#theFinalCountDown").show();

		//create and download sheet with session data
        setStatusToTrue("finishedGM");
		var entrees = parseSubgoalArray();
		var scurvy = createCSV(entrees);
		downloadCSV(scurvy);

		//on click of redownload zip button, download sheet again
		$("#finalDownload").unbind("click").click(function () {
			var entrees = parseSubgoalArray();
			var scurvy = createCSV(entrees);
			downloadCSV(scurvy);
		});

		//make sure user has downloaded their file before quitting
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

		//final quit button clears local storage and reloads
		$("#finalYes").unbind("click").click(function () {
			localStorage.clear(); 
			location.reload();
		});

		//'I'm not done, take me back' button returns to action loop
		$("#finalNo").unbind("click").click(function () {
			$('#theFinalCountDown').hide();
			setStatusToFalse('finishedGM');
			$('#actionLoopTemplate').show();
		});
	});

	//back button returns to post action questions, resets got post action key
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

/*
 * Function: reloadToolTipState
 * Description: This function handles returning the tool to the correct location in the session when the page
 *	 is reloaded. It checks which flags are set starting with the finished flag and ending with the
 *	 screenshot flag.
 * Params: none
 */
function reloadToolTipState () {
	//set up tool tip (skipping screenshot)
	overlayScreen("onlyToolTip");
	var toolTip = document.getElementById("myToolTip");

	//if session is at end, open to action loop & trigger continue click to get to last page
	if (statusIsTrue("finishedGM")) {
		$(toolTip).find("#imageCanvasTemplate").hide();
		actionLoop(toolTip);
		$("#saveAndExit").click();
	}
	//if post action is finished, open to action loop
	else if (statusIsTrue("gotPostActionQuestions")) {
		$(toolTip).find("#imageCanvasTemplate").hide();
		actionLoop(toolTip);
	}
	//if action was performed, go back to post action questions
	else if (statusIsTrue("idealActionPerformed")) {
		$(toolTip).find("#imageCanvasTemplate").hide();
		postActionQuestions(toolTip);
	}
	//if preaction questions are done, go to action prompt
	else if (statusIsTrue("gotPreActionQuestions")) {	
		$(toolTip).find("#imageCanvasTemplate").hide();
		doActionPrompt(toolTip);
	}
	//if screenshot taken, go to preaction
	else if (statusIsTrue("gotScreenshot")) {
		$(toolTip).find("#imageCanvasTemplate").hide();
		preActionQuestions(toolTip);
	}
	//???? who what when why where how?
	else if (statusIsTrue("highlightedAction")) {

		//renderImage()
		//console.log("on image");
		//overlayScreen("onlyToolTip");
	}
	
}

