
function today() {
	var date = new Date();
	var month = date.getMonth() + 1;
	var dayOfMonth = date.getDate();
	var year = date.getFullYear();
	
	return month + "/" + dayOfMonth + "/" + year;
}

function now() {
	var date = new Date();
	return date.getHours() + ":" + date.getMinutes();
}

//Function to stop commas and \n from actually creating new cells and lines in csv.. in case there is a comma or 
function sanitizeString(unsafeWord){
	var safeWord = '\"'+ unsafeWord + '\"';
	return safeWord;
}
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

var globName = "";
function createCSV(entries) {
	var csvContent = "";
	var header1 = ["Date", "Time", "Team", "Persona", "Scenario"];
	csvContent += header1.join(",") + "\n";
	var teamName = localStorage.getItem("teamName");
	var persona5Delayed = localStorage.getItem("personaName");
	var inAWorld = localStorage.getItem("scenarioName");
	var DTTPS = [today(), now(), teamName, persona5Delayed, inAWorld];
	globName += DTTPS[0];
	globName += DTTPS[2];
	globName += "GenderMagSession";
	csvContent += DTTPS.join(",") + "\n";

	
	var header2 = ["Subgoal",  
					"Will Abby have formed this subgoal as a step to her overall goal?", 
					"Yes", "No", "Maybe", 
					"Motivation", "Info Processing", "Self-Efficacy", "Risk", "Tinker", 
					"Action", 
					"Will Abby know what to do at this step?", 
					"Yes", "No", "Maybe", 
					"Motivation", "Info Processing", "Self-Efficacy", "Risk", "Tinker", 
					sanitizeString("If Abby does the right thing, will she know that she did the right thing and is making progress toward her goal?"), 
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
var imgList = [];
function downloadCSV(csvContent) {
	create_zip(csvContent);
	return;
}

function downloadURI(uri, name) {
	var safeName = name
	var safeUri = uri.slice(22);
	//console.log("in image", safeUri);
	var imgObj = {
		name:safeName+".png",
		uri: safeUri
	};
	//console.log("imgobj", imgObj);
	imgList.push(imgObj)

  }

function create_zip(csvContent) {
	var zip = new JSZip();
	zip.file("GenderMagSession"+".csv", csvContent);
	var img = zip.folder("images");
	for(var i in imgList){
		img.file(imgList[i].name, imgList[i].uri, {base64: true});
	}
	zip.generateAsync({type:"blob"}).then(function(content) {
    // see FileSaver.js
		saveAs(content, globName+".zip");
	});
}