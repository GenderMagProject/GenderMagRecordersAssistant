/*
 * Filename : output.js
 * Functions : now, today, sanitizeString, getSubgoalInfo, getActionInfo, createCSV,
 * downloadCSV, downloadURI, parseSubgoalArray, createOldCSV
 * Description :
*/



/*
 * Global Varibles
 * Don't modify without updating rest of file!
 * Also todo: Refactor so there are no global variables!
 */
var imgList = [];
var globName = "";

/*
 * Function: insertImage()
 * Inserts an image into the excel file
 */
function insertImage(){




}



/*
 * Function: now
 * Gets the date and time in the format hr:min
 */
function now() {
	var date = new Date();
	return date.getHours() + ":" + date.getMinutes();
}
/*
 * Function: today
 * Gets the date in the format month/day/year
 */
function today() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var dayOfMonth = date.getDate();
    var year = date.getFullYear();

    return month + "/" + dayOfMonth + "/" + year;
}

/*
 * Function: sanitizeString
 * Arg: string unsafeWord
 * Ret: string
 * Takes string in and prevents commas in the string from creating new cells in
 * the csv file.
 */
function sanitizeString(unsafeWord){
	var safeWord = '\"'+ unsafeWord + '\"';
	return safeWord;
}

/*
 * Function: getSubgoalInfo
 * Ret: string (ready for csv)
 * Formats the subgoal information for the csv file. Also makes call to getActionInfo
 * so that each subgoal includes the actions associate with it
 */
function getSubgoalInfo(){
    var subgoalList= getSubgoalArrayFromLocal();

    var fullEntry = "";
    for (var j in subgoalList) {
        var subgoalEntry = [];
        var currSubgoal = subgoalList[j]; //Current Input
        subgoalEntry.push("\n");
        subgoalEntry.push("\n"); // new row
        subgoalEntry.push("Subgoal " + (parseInt(j)+1));
        subgoalEntry.push(sanitizeString(currSubgoal.name));
        subgoalEntry.push("\n"); // new row
        subgoalEntry.push("Will the persona have formed this subgoal as a step to their overall goal?");
        subgoalEntry.push("\n"); // new row
      // subgoalEntry.push(currSubgoal.ynm["yes"].localeCompare("TRUE"));
         if(currSubgoal.ynm["yes"] === true){
            subgoalEntry.push("Yes");
            subgoalEntry.push(currSubgoal.ynm["yes"]);
            subgoalEntry.push("\n"); // new row
        }
        if(currSubgoal.ynm["no"] === true){
            subgoalEntry.push("No");
            subgoalEntry.push(currSubgoal.ynm["no"]);
            subgoalEntry.push("\n"); // new row 
        }

        if(currSubgoal.ynm["maybe"] === true){
            subgoalEntry.push("Maybe");
            subgoalEntry.push(currSubgoal.ynm["maybe"]);
            subgoalEntry.push("\n"); // new row
        }

        subgoalEntry.push("Why?");
        subgoalEntry.push(sanitizeString(currSubgoal.why));
        subgoalEntry.push("\n"); // new row
        subgoalEntry.push("\n"); // new row
        subgoalEntry.push("Subgoal Facets:");
        subgoalEntry.push("\n"); // new row
        if(currSubgoal.facetValues["motiv"] === true){
            subgoalEntry.push("Motivation");
            subgoalEntry.push(currSubgoal.facetValues["motiv"]);
            subgoalEntry.push("\n");
        }

        if(currSubgoal.facetValues["info"] === true){
            subgoalEntry.push("Information Processing");
            subgoalEntry.push(currSubgoal.facetValues["info"]);
            subgoalEntry.push("\n");
        }

        if(currSubgoal.facetValues["selfE"] === true){
            subgoalEntry.push("Computer Self Efficacy");
            subgoalEntry.push(currSubgoal.facetValues["selfE"]);
            subgoalEntry.push("\n");
        }

        if(currSubgoal.facetValues["risk"] === true){
            subgoalEntry.push("Attitude Toward Risk");
            subgoalEntry.push(currSubgoal.facetValues["risk"]);
            subgoalEntry.push("\n");
        }

        if(currSubgoal.facetValues["tinker"] === true){
            subgoalEntry.push("Tinkering"); //FIX
            subgoalEntry.push(currSubgoal.facetValues["tinker"]);
            subgoalEntry.push("\n"); // new row
        }


        var subgoalString = subgoalEntry.join(",");
        // This for loop is really weird --> TODO cleanup
        var currentAction = 0;
        for (var i in currSubgoal.actions) {
            if(i.id !== currentAction) {
                currentAction = i.id;
                console.log("action" + i);
                var actionString = getActionInfo(currSubgoal.actions, j);
                subgoalString = subgoalString + actionString;
            }
        }
        fullEntry = fullEntry + subgoalString;
    }
    // Add any uncompleted action
    // The assumption here is that uncompleted actions will always belong to the last subgoal
    // This assumption may need to be updated later on
    if(localStorage.getItem("inMiddleOfAction")==="true" && !localStorage.getItem("finishedGM")){
            console.log("middle of action!");
            var actString = getActionInfo([getVarFromLocal("currPreAction")]);
            fullEntry = fullEntry + actString;
    }
    return fullEntry;
}

/*
 * Function: getActionInfo
 * Arg: array of actions actionList
 * Ret: string (ready for csv)
 * Formats the action information for all actions in a given list so
 * it's ready to go into the csv file.
 */
function getActionInfo(actionList, j){
    var actionEntry = [];
    for(var i in actionList) {
        //get new line and to the right part of csv
        actionEntry.push("\n");
        actionEntry.push("\n"); //new row
        //pre action question
        actionEntry.push("Action " + actionList[i].id);
        actionEntry.push(actionList[i].name);
        actionEntry.push("\n");
        actionEntry.push("Will the persona know what to do at this step?");
        actionEntry.push("\n"); //new row
        if(actionList[i].preAction.ynm["yes"] === true){
            actionEntry.push("Yes");
            actionEntry.push(actionList[i].preAction.ynm["yes"]);
            actionEntry.push("\n"); //new row
        }

        if(actionList[i].preAction.ynm["no"] === true){
            actionEntry.push("No");
            actionEntry.push(actionList[i].preAction.ynm["no"]);
            actionEntry.push("\n"); //new row
        }

        if(actionList[i].preAction.ynm["maybe"] === true){
            actionEntry.push("Maybe");
            actionEntry.push(actionList[i].preAction.ynm["maybe"]);
            actionEntry.push("\n"); //new row
        }

        actionEntry.push("Why?");
        actionEntry.push(sanitizeString(actionList[i].preAction.why));
        actionEntry.push("\n"); //new row
        actionEntry.push("PreAction Facets:");
        actionEntry.push("\n"); //new row
        if(actionList[i].preAction.facetValues["motiv"] === true){
            actionEntry.push("Motivation");
            actionEntry.push(actionList[i].preAction.facetValues["motiv"]);
            actionEntry.push("\n"); //new row
        }

        if(actionList[i].preAction.facetValues["info"] === true){
            actionEntry.push("Information Processing");
            actionEntry.push(actionList[i].preAction.facetValues["info"]);
            actionEntry.push("\n"); //new row
        }

        if(actionList[i].preAction.facetValues["self"] === true){
            actionEntry.push("Computer Self Efficacy");
            actionEntry.push(actionList[i].preAction.facetValues["self"]);
            actionEntry.push("\n"); //new row
        }

        if(actionList[i].preAction.facetValues["risk"] === true){
            actionEntry.push("Attitude Toward Risk");
            actionEntry.push(actionList[i].preAction.facetValues["risk"]);
            actionEntry.push("\n"); //new row
        }

        if(actionList[i].preAction.facetValues["tinker"] === true){
            actionEntry.push("Tinkering"); //FIX
            actionEntry.push(actionList[i].preAction.facetValues["tinker"]);
            actionEntry.push("\n"); //new row
        }

        actionEntry.push("\n"); //new row
        actionEntry.push("\n"); //new row
        //post action question
        actionEntry.push(sanitizeString("If the persona does the right thing, will" +
            " they know that they did the right thing and is making " +
            "progress toward their goal?"));
        actionEntry.push("\n"); //new row
        if(actionList[i].postAction.ynm["yes"] === true){
            actionEntry.push("Yes");
            actionEntry.push();
            actionEntry.push("\n"); //new row
        }

        if(actionList[i].postAction.ynm["no"] === true){
            actionEntry.push("No");
            actionEntry.push(actionList[i].postAction.ynm["no"]);
            actionEntry.push("\n"); //new row
        }

        if(actionList[i].postAction.ynm["maybe"] === true){
            actionEntry.push("Maybe");
            actionEntry.push(actionList[i].postAction.ynm["maybe"]);
            actionEntry.push("\n"); //new row
        }

        actionEntry.push("Why?");
        actionEntry.push(sanitizeString(actionList[i].postAction.why));
        actionEntry.push("\n"); //new
        actionEntry.push("\n"); //new row
        actionEntry.push("Post action facets:");
        actionEntry.push("\n"); //new row
        if(actionList[i].postAction.facetValues["motiv"] === true){
            actionEntry.push("Motivation");
            actionEntry.push(actionList[i].postAction.facetValues["motiv"]);
            actionEntry.push("\n"); //new row
        }

        if(actionList[i].postAction.facetValues["info"] === true){
            actionEntry.push("Information Processing");
            actionEntry.push(actionList[i].postAction.facetValues["info"]);
            actionEntry.push("\n"); //new row
        }

        if(actionList[i].postAction.facetValues["self"] === true){
            actionEntry.push("Computer Self Efficacy");
            actionEntry.push(actionList[i].postAction.facetValues["self"]);
            actionEntry.push("\n"); //new row
        }

        if(actionList[i].postAction.facetValues["risk"] === true){
            actionEntry.push("Attitude Toward Risk");
            actionEntry.push(actionList[i].postAction.facetValues["risk"]);
            actionEntry.push("\n"); //new row
        }

        if(actionList[i].postAction.facetValues["tinker"] === true){
            actionEntry.push("Tinkering"); //FIX
            actionEntry.push(actionList[i].postAction.facetValues["tinker"]);
            actionEntry.push("\n"); //new row
        }

        actionEntry.push("\n");
        actionEntry.push("\n");
        actionEntry.push("Action Image Name:");
        actionEntry.push("S"+(1 + parseInt(j))+"A"+(parseInt(actionList[i].id))+"_"+actionList[i].name.substring(1, actionList[i].name.length-1));
        actionEntry.push("\n");

        downloadURI(actionList[i].imgURL, "S"+(1 + parseInt(j))+"A"+(parseInt(actionList[i].id))+"_"+actionList[i].name.substring(1, actionList[i].name.length-1));
       // var tempName = "S"+(1 + parseInt(j))+"A"+(parseInt(actionList[i].id))+"_"+actionList[i].name.substring(1, actionList[i].name.length-1);
    }
    return actionEntry.join(",");
}

/*
 * Function: createCSV
 * Ret: string (ready for csv)
 * Sets up header for the csv file, calls getSubgoalInfo and attaches the
 * subgoal/action info to the header to create the complete file content.
 */
function createCSV() {
	var csvContent = "";
	var header1 = "GenderMag Recorder's Assistant Results"
	var teamName = localStorage.getItem("teamName");
	var personaName = localStorage.getItem("personaName");
	var scenarioName = localStorage.getItem("scenarioName");
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = today.getMonth();
	var yyyy = today.getFullYear();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var todayString = months[mm] + " " + dd + " " + yyyy;
	var DTTPS = [teamName, personaName, scenarioName];
	csvContent += header1 + "\n";
    var header2 = ["Date:", todayString, "Time:", now()];
    csvContent += header2 + "\n";
    var header3 = ["Team", "Persona", "Scenario"];
    csvContent += header3.join(",") + "\n";
	console.log(todayString);
	globName += DTTPS[0];
	globName += DTTPS[2];
	globName += "GenderMagSession";
	csvContent += DTTPS.join(",") + "\n";
	var fullContent = getSubgoalInfo();
	csvContent += fullContent;

	return csvContent;
}

/*
 * Function: downloadCSV
 * Arg: csvContent - string (ready for csv)
 * Arg: old - boolean 
 * Creates and downloads a zip file containing the date and content of the gendermag session.
 */
function downloadCSV(csvContent, old) {
    console.log((csvContent));
	var zip = new JSZip();
    var today = new Date();
    var dd = today.getDate() + 1;
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var hr = today.getHours();
    var min = today.getMinutes();
    if(old){
        zip.file("OldFormatGenderMagSession-on-" + mm + "-" + dd + "-" + yyyy + "-at-" + hr + "-" + min + ".csv", csvContent);
    } else {
        zip.file("GenderMagSession-on-" + mm + "-" + dd + "-" + yyyy + "-at-" + hr + "-" + min + ".csv", csvContent);
    }
	var img = zip.folder("images");
    console.log(imgList + "HHH");
	for(var i in imgList){
	    console.log("IMAGE");
		img.file(imgList[i].name, imgList[i].uri, {base64: true});
	}
	zip.generateAsync({type:"blob"}).then(function(content) {
    // see FileSaver.js
		saveAs(content, globName+".zip");
	});
}

/*
*This function downloads the image into the designated folder when given the uri and name
*/
function downloadURI(uri, name) {
    try {
        //checks to see if the uri or name is null
        if (uri === null || name === null) throw "The uri or name for your image is null.";
        var safeName = name;
        //uri must be converted to string in order to perform slice function to shorten the uri
        toString(uri);
        var safeUri = uri.slice(22);
        console.log("in image", safeUri);
        //creates the image object using the name and shortened uri
        var imgObj = {
            name:safeName+".png",
            uri: safeUri
        };
        console.log("imgobj", imgObj);
        //pushes the image to the list of images
        imgList.push(imgObj);
    } catch (error) {
        console.log(error);
    }
}

/*
 *  OLD FUNCTIONS DO NOT CALL FROM NEW FUNCTIONS
 *  DO NOT LIKE THESE
 *  DO NOT USE THESE FUNCTIONS THE FORMATTING IS BAD
 */

/*		each element of the action array
		id: preAction.actionId,
        name: preAction.name,
        imgURL: currImgURL,
        preAction: preAction,
        postAction: postAction
		pre
		actionId: targetSubgoal.actions.length + 1, //Check this when done
		name: name,
		subgoalId: targetSubgoal.id,
		ynm: yesnomaybe,
		why: whyText,
		facetValues: facets
		post
		actionId: currPreAction.actionId,  //Check this when done
		name: name,
		subgoalId: currPreAction.subgoalId,
		ynm: yesnomaybe,
		why: whyText,
		facetValues: facets
/*
 * Function: parseSubgoalArray
 *
 */
function parseSubgoalArray(){
    var userInput= getSubgoalArrayFromLocal();
    var entry = []; //corresponds to a single row in the csv
    var entries = [];

    for (var j in userInput) {
        var currI = userInput[j]; //Current Input

        entry = [sanitizeString(currI.name),
            sanitizeString(currI.why),
            currI.ynm["yes"],
            currI.ynm["no"],
            currI.ynm["maybe"],
            currI.facetValues["motiv"],
            currI.facetValues["info"],
            currI.facetValues["selfE"],
            currI.facetValues["risk"],
            currI.facetValues["tinker"],
        ];
        for(var i in currI.actions){
            //get new line and to the right part of csv
            entry.push("\n, , , , , , , , ,");

            //pre action question
            //console.log("action name", currI.actions[i].preAction.why, currI.actions[i].postAction.why)
            entry.push(currI.actions[i].name);
            entry.push(sanitizeString(currI.actions[i].preAction.why));
            entry.push(currI.actions[i].preAction.ynm["yes"]);
            entry.push(currI.actions[i].preAction.ynm["no"]);
            entry.push(currI.actions[i].preAction.ynm["maybe"]);
            entry.push(currI.actions[i].preAction.facetValues["motiv"]);
            entry.push(currI.actions[i].preAction.facetValues["info"]);
            entry.push(currI.actions[i].preAction.facetValues["self"]);
            entry.push(currI.actions[i].preAction.facetValues["risk"]);
            entry.push(currI.actions[i].preAction.facetValues["tinker"]);

            //post action question
            entry.push(sanitizeString(currI.actions[i].postAction.why));
            entry.push(currI.actions[i].postAction.ynm["yes"]);
            entry.push(currI.actions[i].postAction.ynm["no"]);
            entry.push(currI.actions[i].postAction.ynm["maybe"]);
            entry.push(currI.actions[i].postAction.facetValues["motiv"]);
            entry.push(currI.actions[i].postAction.facetValues["info"]);
            entry.push(currI.actions[i].postAction.facetValues["self"]);
            entry.push(currI.actions[i].postAction.facetValues["risk"]);
            entry.push(currI.actions[i].postAction.facetValues["tinker"]);

            //url currently is about 4X as long as longest cell allowed in excel, so instead just downloading image as part of zip
            //entry.push('\"' +currI.actions[i].imgURL+'\"');

            var newName = currI.actions[i].name;
            if(currI.actions[i].name[0] == "\""){
                newName = currI.actions[i].name.slice(1)
            }
            if(currI.actions[i].name[currI.actions[i].name.length-1] == "\""){
                newName = newName.slice(0, newName.length-1)
            }

            downloadURI(currI.actions[i].imgURL, "S"+(1 + parseInt(j))+"A"+(parseInt(i))+"_"+newName);
        }

        if (entry.length != 0) {
            entries.push(entry);
        }
    }
    return entries;
}
/*
 * Function: createOLDCSV
 *
 */
function createOldCSV() {
    console.log('getting things');
    var entries = parseSubgoalArray();
    var csvContent = "";
    var header1 = ["Date", "Time", "Team", "Persona", "Scenario"];
    csvContent += header1.join(",") + "\n";
    var teamName = localStorage.getItem("teamName");
    var persona5Delayed = localStorage.getItem("personaName");
    var inAWorld = localStorage.getItem("scenarioName");
    var DTTPS = [today(), now(), teamName, persona5Delayed, inAWorld];
    globName += DTTPS[0];
    globName += DTTPS[2];
    globName += "OldFormatGenderMagSession";
    csvContent += DTTPS.join(",") + "\n";


    var header2 = ["Subgoal",
        "Will the persona have formed this subgoal as a step to their overall goal?",
        "Yes", "No", "Maybe",
        "Motivation", "Info Processing", "Self-Efficacy", "Risk", "Tinker",
        "Action",
        "Will the persona know what to do at this step?",
        "Yes", "No", "Maybe",
        "Motivation", "Info Processing", "Self-Efficacy", "Risk", "Tinker",
        sanitizeString("If the persona does the right thing, will they know that they did the right thing and is making progress toward their goal?"),
        "Yes", "No", "Maybe",
        "Motivation", "Info Processing", "Self-Efficacy", "Risk", "Tinker"];
    csvContent += header2.join(",") + "\n";

    entries.forEach(function(entry, index){
        //console.log("entry", entry);
        var dataString = entry.join(",");
        csvContent += index < entries.length ? dataString + "\n" : dataString;
    });

    return csvContent;
}
