
function drawSubgoal(subgoalId){
	id = "#GenderMagFrame";
	file = "/templates/subgoal.html";
	
	//console.log("draw subgoal called, ", subgoalId);

	var isSetSubgoalQuestions = (statusIsTrue("gotSubgoalQuestions"));
	

	if (isSetSubgoalQuestions) {
		//console.log("in walkthrough if");
		var subgoals = getSubgoalArrayFromLocal();
		var numActions = localStorage.getItem("numActions");

		var subName = subgoals[subgoalId - 1].name;
		//console.log("subname", subName);

		var el = $(id).contents().find('#containeryo');
		el.empty();
		appendTemplateToElement(el,file);
		sidebarBody().find('#subgoalHeading').html("Subgoal: " + subName);
		sidebarBody().find('#editSubgoal').hide();
		if(subgoals){
			var subgoal = subgoals[subgoalId-1];
			//console.log("in draw subgoals", subgoal, subgoalId, subgoal.ynm.yes, subgoal.name);
			//console.log("in subgoal setting area", subName)
			sidebarBody().find('#subgoalHeading').html("Subgoal: " + subgoal.name);
			sidebarBody().find('#yes').prop("checked", subgoal.ynm.yes);
			sidebarBody().find('#no').prop("checked", subgoal.ynm.no);
			sidebarBody().find('#maybe').prop("checked", subgoal.ynm.maybe);

			sidebarBody().find('#A0Q0motiv').prop("checked", subgoal.facetValues.motiv);  //not to be confused with motion
			sidebarBody().find('#A0Q0info').prop("checked", subgoal.facetValues.info); //not to be confused with inFork
			sidebarBody().find('#A0Q0selfE').prop("checked", subgoal.facetValues.selfE); //not to be confused with selfie
			sidebarBody().find('#A0Q0risk').prop("checked", subgoal.facetValues.risk);   // not to be confused with risque
			sidebarBody().find('#A0Q0tinker').prop("checked", subgoal.facetValues.tinker); //not to be confused with tinkle
			sidebarBody().find('#A0Q0none').prop("checked", subgoal.facetValues.none); //not to be confused with nun
	
			sidebarBody().find('#A0Q0Response').html(subgoal.why);
			sidebarBody().find('#A0Q0whyYes').hide();
			sidebarBody().find('#editSubgoal').show();
			sidebarBody().find('#editSubgoal').unbind( "click" ).click(function(){
				sidebarBody().find("#editSubgoal").hide();
				sidebarBody().find('#addAction').show();
				sidebarBody().find("#A0Q0whyYes").show();
				sidebarBody().find("#A0Q0whyYes").html(subgoal.why);
				sidebarBody().find("#A0Q0Response").hide();
			});
            sidebarBody().find('body').off('click', '#addAction').on('click', '#addAction', function(){
                var yesNoMaybe = {"yes": sidebarBody().find("#yes").is(":checked"), "no": sidebarBody().find("#no").is(":checked"), "maybe": sidebarBody().find("#maybe").is(":checked")};
                var whyText = sidebarBody().find('#A0Q0whyYes').val();
                if (whyText == "") {
                    whyText = sidebarBody().find('#A0Q0Response').html();
                }
                var facets = {"motiv": sidebarBody().find("#A0Q0motiv").is(":checked"), "info": sidebarBody().find("#A0Q0info").is(":checked"), "selfE": sidebarBody().find("#A0Q0selfE").is(":checked"), "risk": sidebarBody().find("#A0Q0risk").is(":checked"), "tinker": sidebarBody().find("#A0Q0tinker").is(":checked")};
                saveSubgoal(subgoalId, subName, yesNoMaybe, whyText, facets);
                setStatusToTrue("gotSubgoalQuestions");
                var numActions = localStorage.getItem("numActions");
                if(numActions > 0){
                    drawAction(numActions, subgoalId);
                }
                else{
                    localStorage.setItem("numActions", 1);
                    drawAction(1, subgoalId);
                }
            });
		}
		
		

	}
	
	else {
		//console.log("in walkthrough else");
		var subName = localStorage.getItem("currSubgoalName");
		var el = $(id).contents().find('#containeryo');
		el.empty();
		appendTemplateToElement(el,file);
		sidebarBody().find('#subgoalHeading').html("Subgoal: " + subName);

		sidebarBody().find('body').off('click', '#addAction').on('click', '#addAction', function(){
			var yesNoMaybe = {"yes": sidebarBody().find("#yes").is(":checked"), "no": sidebarBody().find("#no").is(":checked"), "maybe": sidebarBody().find("#maybe").is(":checked")};
			var whyText = sidebarBody().find('#A0Q0whyYes').val();
            if (whyText == "") {
                whyText = sidebarBody().find('#A0Q0Response').html();
            }
            //console.log("WHY", whyText);
			var facets = {"motiv": sidebarBody().find("#A0Q0motiv").is(":checked"), "info": sidebarBody().find("#A0Q0info").is(":checked"), "selfE": sidebarBody().find("#A0Q0selfE").is(":checked"), "risk": sidebarBody().find("#A0Q0risk").is(":checked"), "tinker": sidebarBody().find("#A0Q0tinker").is(":checked")};
			saveSubgoal(subgoalId, subName, yesNoMaybe, whyText, facets);
			setStatusToTrue("gotSubgoalQuestions");
			var numActions = localStorage.getItem("numActions");
			if(numActions > 0){
				
				drawAction(numActions, subgoalId);
			}
			else{
				localStorage.setItem("numActions", 1);
				drawAction(1, subgoalId);
			}
		});
		
	}
	
	
	
}

function drawAction(actionNum, subgoalId){
	
	//console.log("draw action called", actionNum, subgoalId);
	id = "#GenderMagFrame";
	file = "/templates/actionPrompt.html";
	var el = $(id).contents().find('#containeryo');
	el.empty();
	appendTemplateToElement(el,file);
	var actionName = "THE ACTION NAME";
	var currArray = getSubgoalArrayFromLocal();
		
	if (statusIsTrue("gotActionName")) {

		if (actionNum >  currArray[subgoalId-1].actions.length) {
			actionName = localStorage.getItem("currActionName");
		}
		else {
			actionName = currArray[subgoalId-1].actions[actionNum-1].name;
		}
		sidebarBody().find('#getActionName').hide();
        sidebarBody().find('#actionNameGot').html("<b>Ideal Action: " + actionName + "</b>");
        sidebarBody().find('#actionNameGot').show();
		sidebarBody().find("#promptAction").show();
		setStatusToTrue("actionPromptOnScreen");
	}
	//console.log("action/subgoal", actionNum, subgoalId, actionName); 
	
	
	//Below is add onclicks - so if gotActionName wan't true, it doesn't do anything really
	sidebarBody().find('#submitActionName').unbind( "click" ).click(function() {
		actionName = sidebarBody().find("#actionNameInput").val();
        if (actionName == "" && !(statusIsTrue('gotActionName'))) {
            alert("Please name your action before continuing");
        }
        else {
            //currArray = getSubgoalArrayFromLocal();
            var actionItem = {
                name: actionName,
                actionId: actionNum, 
                subgoalId: subgoalId
            };
            
            if(actionName==""){
            }
			//console.log("actionname", actionName);
			saveVarToLocal("currActionName", actionName);
			setStatusToTrue("gotActionName");
			sidebarBody().find('#getActionName').hide();
			sidebarBody().find('#actionNameGot').html("<b>Ideal Action: " + actionName + "</b>");
			sidebarBody().find('#actionNameGot').show();
			sidebarBody().find("#promptAction").show();
			setStatusToTrue("actionPromptOnScreen");
            
            if(actionNum >  currArray[subgoalId-1].actions.length){
                //console.log("sadness sandwhich", actionNum, currArray[subgoalId-1].actions.length, actionItem);
                addToSandwich("idealAction", actionItem);
                
            }
            else{
            }
            sidebarBody().find("#editAction").show();
            sidebarBody().find("#editAction").unbind( "click" ).click(function(){
                sidebarBody().find('#editAction').hide();
                sidebarBody().find('#getActionName').show();
                sidebarBody().find('#actionNamePrompt').hide();
                sidebarBody().find("#promptAction").hide();
                setStatusToFalse("actionPromptOnScreen");
            });
        }
	});
	sidebarBody().find("#actionNameInput").keyup(function(event){
		if(event.keyCode == 13){
			sidebarBody().find("#submitActionName").click();
		} 
	});
	sidebarBody().find('body').off('click', '#overlayTrigger').on('click', '#overlayTrigger', function() {
		if (statusIsTrue('drewToolTip')) {
			var justTheToolTip = document.getElementById("myToolTip");
			$(justTheToolTip).remove();
		}
		overlayScreen();
		overlayScreen();
	});
	sidebarBody().find("#promptActionBack").unbind( "click" ).click(function(){
		el.empty();
		var subgoalId = localStorage.getItem("numSubgoals");
		//console.log("get back", subgoalId);
		drawSubgoal(subgoalId);
	})
}
