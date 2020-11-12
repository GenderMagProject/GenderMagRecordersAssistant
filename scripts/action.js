/*
 * File Name: action.js
 * Functions: preActionQuestions, doActionPrompt, postActionQuestions, actionLoop, reloadToolTipState
 * Description: This file contains functions to handle the action part of the walkthrough starting right
 *   after the screenshot through the end and exit of the session
 */


//Sets persona name?? Runs at startup??
var personaName = localStorage.getItem("personaName");
if (personaName !== null ) {personaName = personaName.slice(1, personaName.length-1);}
else { personaName = "Abi"; }

function setFacetPopups(personaName) {
    if(personaName !== "Custom"){
        var lowercaseName = personaName.toLowerCase();
        //set functionality for motivation pop up info window
        $(".MTrigger").unbind("click").click(function () {
            addToolTip(lowercaseName+"MToolTip", personaName);
            /*$('#abbyMSeeMOAR').off('click').on('click', function () {
                var isOpen = $(this).attr("stateVar");

                //The "see more" is expanded and needs to be closed
                if (isOpen == 0) {
                    $("#abbyMPreview").hide();
                    $("#abbyMComplete").show();
                    $("#abbyMSeeMOAR").html("See less");
                    $(this).attr("stateVar", 1);
                } else {
                    $("#abbyMPreview").show();
                    $("#abbyMComplete").hide();
                    $("#abbyMSeeMOAR").html("See more...");
                    $(this).attr("stateVar", 0);
                }

            });*/
        });
        //set up other info pop ups
        $(".IPSTrigger").unbind("click").click(function () {
            addToolTip(lowercaseName+"IPSToolTip", personaName);

        });
        $(".SETrigger").unbind("click").click(function () {
            addToolTip(lowercaseName+"SEToolTip", personaName);

        });
        $(".RTrigger").unbind("click").click(function () {
            addToolTip(lowercaseName+"RToolTip", personaName);

        });
        $(".TTrigger").unbind("click").click(function () {
            addToolTip(lowercaseName+"TToolTip", personaName);

        });
    }
}

/*
 * Function: preActionQuestions
 * Description: This function handles the 'preaction questions' in the pop up window
 *	 These questions are the 'will <persona> know what to do at this step/why' page in the
 *	 pop up
 * Params: el - tooltip pop up element
 */
function preActionQuestions(el){
    //get persona name and pronouns to set question text
    var personaName = getVarFromLocal("personaName");
    var pronoun = getVarFromLocal("personaPronoun");
    var possessive = getVarFromLocal("personaPossessive");
    $(el).find("#preActQ").html("Will " + personaName+ " know what to do at this step?");
    $(el).find("#preFacets").html("Which of " + personaName + 
				  "'s facets did you use to answer the above question?");

	//hide draw button and retake button, show preaction questions
    $(el).find("#annotateImage").hide();
    $(el).find("#retakeImage").hide();
	$(el).find("#imageCanvasTemplate").hide();
    $(el).find("#preActionTemplate").show();
	$(el).find("#imageCaption2").show();
	$(el).find("#HRmorelikefunpolice").show();
	//when save and continue button is clicked, save input values
	$("#preActionClose").unbind( "click" ).click(function(){
		//(actionName)Currently save and then deletes this name before it can be called again
		var actionName = localStorage.getItem("currActionName"); 
		var yesNoMaybe = {"yes": $('#actionYes').is(":checked"),
			"no": $('#actionNo').is(":checked"),
			"maybe": $('#actionMaybe').is(":checked")};
		var whyText = $('#whyYes').val();
		var facets = {"motiv": $('#motiv').is(":checked"),
			"info": $('#info').is(":checked"),
			"self": $('#self').is(":checked"),
			"risk": $('#risk').is(":checked"),
			"tinker": $('#tinker').is(":checked"),
			"none": $('#none').is(":checked")};

		var yesNoMaybePost = {"yes": false,
			"no": false,
			"maybe": false};
		var whyTextPost = "";
		var facetsPost = {"motiv": false,
			"info": false,
			"self": false,
			"risk": false,
			"tinker": false,
			"none": false};

		saveIdealAction(actionName, yesNoMaybe, whyText, facets, yesNoMaybePost, whyTextPost,facetsPost);
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
    setFacetPopups(personaName);
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
    //get persona name and pronouns to set question text
    var personaName = getVarFromLocal("personaName");
    var pronoun = getVarFromLocal("personaPronoun");
    var possessive = getVarFromLocal("personaPossessive");
    $(el).find("#postActQ").html("If " + personaName + 
				 " did the right thing (what you just demonstrated), will " +
        pronoun + " know that " + pronoun + " did the right thing and is making progress toward " +
        possessive + " goal?");
    $(el).find("#postFacets").html("Which of " + personaName +
				   "'s facets did you use to answer the above question?");

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
	    setStatusToFalse("inMiddleOfAction");
		var actionName = localStorage.getItem("currActionName");
		var yesNoMaybe = {"yes": $('#YNMyes').is(":checked"),
			"no": $('#YNMno').is(":checked"),
			"maybe": $('#YNMmaybe').is(":checked")};
		var whyText = $('#postWhyYes').val();
		var facets = {"motiv": $('#Q2motiv').is(":checked"),
			"info": $('#Q2info').is(":checked"),
			"self": $('#Q2self').is(":checked"),
			"risk": $('#Q2risk').is(":checked"),
			"tinker": $('#Q2tinker').is(":checked"),
			"none": $('#Q2none').is(":checked")};
		savePostIdealAction(actionName, yesNoMaybe, whyText, facets);
        //move on to checking if user wants new subgoal or action or end session
		actionLoop(el);
	});

	$("#postActionBack").unbind("click").click(function(){
		setStatusToFalse("idealActionPerformed");
		$(el).find("#doActionPromptTemplate").show();
		$(el).find("#postActionTemplate").hide();
		$(el).find("#imageCaption2").show();
		$(el).find("#imageCanvas").show();
		$(el).find("#imageCaption3").hide();

		doActionPrompt(el);
	});

	//set functionality for facet pop up info window
	setFacetPopups(personaName);
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
			var actionName = $(el).find("#actionNameInput").val();
			addToSandwich('idealAction', 0);
            var yesNoMaybe = {"yes": false,
                "no": false,
                "maybe": false};
            var whyText = "";
            var facets = {"motiv": false,
                "info": false,
                "self": false,
                "risk": false,
                "tinker": false,
                "none": false};
            saveIdealAction(actionName, yesNoMaybe, whyText, facets, yesNoMaybe, whyText, facets);
			$(el).remove();
        	setStatusToFalse("drewToolTip");
			overlayScreen("");
			preActionQuestions(el);

        	//Reset action states
			setStatusToTrue("inMiddleOfAction");
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
			//save a dummy subgoal so it can be reached again if the user clicks away
			var subName = localStorage.getItem("currSubgoalName");
			saveSubgoal(numSubgoals, subName, 0, "", 0);
			drawSubgoal(numSubgoals); //creates undefined unnamed subgoal
		}
	});

	//exits the gendermag session
	function exit() {
		//setStatusToFalse("inMiddleOfAction");
		localStorage.setItem("inMiddleOfAction", "false");
		$(el).find("#actionLoopTemplate").hide();
		$(el).find("#theFinalCountDown").show();
		$(el).find("#exitButton").hide();

		//on click of redownload zip button, download sheet again
		$("#finalDownload").unbind("click").click(function () {
			setStatusToFalse("inMiddleOfAction");
			var scurvy = createCSV();
			downloadCSV(scurvy, false);
		});

		$("#oldFormat").unbind("click").click(function () {
			var scurvy = createOldCSV();
			downloadCSV(scurvy, true);
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
			$('#exitButton').show();
		});
	}

	//TODO(roseg31) : Investigate this...
	//on save and exit button click, save all info, close session
	$("#saveAndExit").unbind( "click" ).click(function(){
		//create and download sheet with session data
        setStatusToTrue("finishedGM");
		var scurvy = createCSV();
		downloadCSV(scurvy);

		exit();
	});

	$("#justExit").unbind( "click" ).click(function(){
		setStatusToTrue("finishedGM");
		var scurvy = createCSV();
		exit();
	});

	//back button returns to post action questions, resets got post action key
	$("#loopActionBack").unbind( "click" ).click(function(){
		$(el).find("#actionLoopTemplate").hide();
        $(el).find("#postActionTemplate").show();
		$(el).find("#imageCanvas").show();
		$(el).find("#imageCaption2").show();
		$(el).find("#HRmorelikefunpolice").show();
        setStatusToFalse("gotPostActionQuestions");
		setStatusToTrue("inMiddleOfAction");
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

