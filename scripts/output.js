/*
 * Global Varibles
 * Don't modify without updating rest of file!
 * Also todo: Refactor so there are no global variables!
 */
var imgList = [];
var globName = "";

/*
 * Function: now
 * Gets the date and time in the format hr:min
 */
function now() {
	var date = new Date();
	return date.getHours() + ":" + date.getMinutes();
}

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
        subgoalEntry.push("Subgoal " + (j+1));
        subgoalEntry.push(sanitizeString(currSubgoal.name));
        subgoalEntry.push("\n"); // new row
        subgoalEntry.push("Will the persona have formed this subgoal as a step to their overall goal?");
        subgoalEntry.push("\n"); // new row
        subgoalEntry.push("Yes");
        subgoalEntry.push("No");
        subgoalEntry.push("Maybe");
        subgoalEntry.push("Why?");
        subgoalEntry.push("\n"); // new row
        subgoalEntry.push(currSubgoal.ynm["yes"]);
        subgoalEntry.push(currSubgoal.ynm["no"]);
        subgoalEntry.push(currSubgoal.ynm["maybe"]);
        subgoalEntry.push(sanitizeString(currSubgoal.why));
        subgoalEntry.push("\n"); // new row
        subgoalEntry.push("Subgoal Facets:");
        subgoalEntry.push("\n"); // new row
        subgoalEntry.push("Motivation");
        subgoalEntry.push("Information Processing");
        subgoalEntry.push("Computer Self Efficacy");
        subgoalEntry.push("Attitude Toward Risk");
        subgoalEntry.push("Tinkering"); //FIX
        subgoalEntry.push("\n"); // new row
        subgoalEntry.push(currSubgoal.facetValues["motiv"]);
        subgoalEntry.push(currSubgoal.facetValues["info"]);
        subgoalEntry.push(currSubgoal.facetValues["selfE"]);
        subgoalEntry.push(currSubgoal.facetValues["risk"]);
        subgoalEntry.push(currSubgoal.facetValues["tinker"]);
        subgoalEntry.push("\n"); // new row

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
        actionEntry.push("Yes");
        actionEntry.push("No");
        actionEntry.push("Maybe");
        actionEntry.push("Why?");
        actionEntry.push("\n"); //new row
        actionEntry.push(actionList[i].preAction.ynm["yes"]);
        actionEntry.push(actionList[i].preAction.ynm["no"]);
        actionEntry.push(actionList[i].preAction.ynm["maybe"]);
        actionEntry.push(sanitizeString(actionList[i].preAction.why));
        actionEntry.push("\n"); //new row
        actionEntry.push("PreAction Facets:");
        actionEntry.push("\n"); //new row
        actionEntry.push("Motivation");
        actionEntry.push("Information Processing");
        actionEntry.push("Computer Self Efficacy");
        actionEntry.push("Attitude Toward Risk");
        actionEntry.push("Tinkering"); //FIX
        actionEntry.push("\n"); //new row
        actionEntry.push(actionList[i].preAction.facetValues["motiv"]);
        actionEntry.push(actionList[i].preAction.facetValues["info"]);
        actionEntry.push(actionList[i].preAction.facetValues["self"]);
        actionEntry.push(actionList[i].preAction.facetValues["risk"]);
        actionEntry.push(actionList[i].preAction.facetValues["tinker"]);
        actionEntry.push("\n"); //new row
        actionEntry.push("\n"); //new row
        //post action question
        actionEntry.push(sanitizeString("If the persona does the right thing, will" +
            " they know that they did the right thing and is making " +
            "progress toward their goal?"));
        actionEntry.push("\n"); //new row
        actionEntry.push("Yes");
        actionEntry.push("No");
        actionEntry.push("Maybe");
        actionEntry.push("Why?");
        actionEntry.push("\n"); //new row
        actionEntry.push(actionList[i].postAction.ynm["yes"]);
        actionEntry.push(actionList[i].postAction.ynm["no"]);
        actionEntry.push(actionList[i].postAction.ynm["maybe"]);
        actionEntry.push(sanitizeString(actionList[i].postAction.why));
        actionEntry.push("\n"); //new
        actionEntry.push("\n"); //new row
        actionEntry.push("Post action facets:");
        actionEntry.push("\n"); //new row
        actionEntry.push("Motivation");
        actionEntry.push("Information Processing");
        actionEntry.push("Computer Self Efficacy");
        actionEntry.push("Attitude Toward Risk");
        actionEntry.push("Tinkering"); //FIX
        actionEntry.push("\n"); //new row
        actionEntry.push(actionList[i].postAction.facetValues["motiv"]);
        actionEntry.push(actionList[i].postAction.facetValues["info"]);
        actionEntry.push(actionList[i].postAction.facetValues["self"]);
        actionEntry.push(actionList[i].postAction.facetValues["risk"]);
        actionEntry.push(actionList[i].postAction.facetValues["tinker"]);
        actionEntry.push("\n");
        actionEntry.push("Action Image Name:");
        actionEntry.push("S"+(1 + parseInt(j))+"A"+(1 + parseInt(actionList[i].id))+"_"+actionList[i].name.substring(1, actionList[i].name.length-1));
        actionEntry.push("\n");

        downloadURI(actionList[i].imgURL, "S"+(1 + parseInt(j))+"A"+(1 + parseInt(actionList[i].id))+"_"+actionList[i].name.substring(1, actionList[i].name.length-1));
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
	csvContent += header1 + "\n";
	var header2 = ["Date", "Time", "Team", "Persona", "Scenario"];
	csvContent += header2.join(",") + "\n";
	var teamName = localStorage.getItem("teamName");
	var personaName = localStorage.getItem("personaName");
	var scenarioName = localStorage.getItem("scenarioName");
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = today.getMonth();
	var yyyy = today.getFullYear();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var todayString = months[mm] + " " + dd + " " + yyyy;
	var DTTPS = [todayString, now(), teamName, personaName, scenarioName];
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
 * Makes call to creat_zip to put together zip file and download
 * todo: Refactor so this is included in another method as it's unnecessary to
 *  have this be separate.
 */
function downloadCSV(csvContent, old) {
	create_zip(csvContent, old);
}

function downloadURI(uri, name) {
	var safeName = name;
	var safeUri = uri.slice(22);
	console.log("in image", safeUri);
	var imgObj = {
		name:safeName+".png",
		uri: safeUri
	};
	console.log("imgobj", imgObj);
	imgList.push(imgObj);

  }

function create_zip(csvContent, old) {
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

            downloadURI(currI.actions[i].imgURL, "S"+(1 + parseInt(j))+"A"+(1 + parseInt(i))+"_"+newName);
        }

        if (entry.length != 0) {
            entries.push(entry);
        }
    }
    return entries;
}

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