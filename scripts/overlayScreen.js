/*
 * File Name: overlayScreen.js
 * Functions: overlayScreen, renderImage
 * Description: This file contains functions to manage the 'tooltip' or 'pop up' that appears after the slider portion
 *   of the walkthrough. This includes screenshot functionality, making the pop up window, displaying the
 *   screenshot picture in the window.
 */

/*
 *  Not a function: adds event listener to screenshot call,
 *    when screenshot is taken, the following process runs and render image is called.
 */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  //console.log("renderimage" , request);
    if (request.callFunction === "renderImage"){
		renderImage(request.imageUrl);
        localStorage.setItem("currImgURL", request.imageUrl);
	}
});

/*
 * Function: overlayScreen
 * Description: This function contains the functionality for taking the screen capture and creating the pop up window
 *   with the canvas that displays the image.
 * Params: onlyDraw - tells whether to go straight to drawing the pop up ("onlyToolTip")
 *   or to take the screenshot first ("")
 */
function overlayScreen(onlyDraw){
	//If skipping screenshot and loading tooltip window from local storage
	if (onlyDraw === "onlyToolTip") {
		closeSlider();
		sidebarBody().find("#nukeStatus").show();
		var canvasContainer;
		var canvas;
		//show existing container if exists, else make one
		if (document.getElementById('genderMagCanvasContainer')) {
			canvasContainer = document.getElementById('genderMagCanvasContainer');
			canvasContainer.style.display = "block";
			document.getElementById('genderMagCanvas').style.display = "block";
		} else {
			canvasContainer = document.createElement('div');

			// Add style and append the div into the document
			canvasContainer.id = "genderMagCanvasContainer";
			canvasContainer.style.position = "fixed";
			// Set to 100% so that it will have the dimensions of the document
			canvasContainer.style.left = "0px";
			canvasContainer.style.top = "0px";
			canvasContainer.style.width = "100%";
			canvasContainer.style.height = "100%";
			canvasContainer.style.zIndex = "9999";
			document.body.appendChild(canvasContainer);

			//create genderMagCanvas element
			canvas = document.createElement('canvas');
			canvas.style.width = canvasContainer.scrollWidth + "px";
			canvas.style.height = canvasContainer.scrollHeight + "px";
			canvas.id = "genderMagCanvas";
			canvas.position = "fixed";
			canvas.style.opacity = .50;
			canvas.width = canvasContainer.scrollWidth;
			canvas.height = canvasContainer.scrollHeight;
			canvas.style.overflow = 'visible';
			canvas.style.position = 'fixed';

			canvas.style.left = "0px";
			canvas.style.top = "0px";
			canvas.style.width = "100%";
			canvas.style.height = "100%";
			canvas.style.zIndex = "9999";

			canvasContainer.appendChild(canvas);
		}

		var genderMagCanvas = document.getElementById('genderMagCanvas'),
			ctx = genderMagCanvas.getContext('2d'),
			rect = {},
			drag = false;

		//add pop up window to body
		var toolTip = document.createElement("div");
		toolTip.id = "myToolTip";
		toolTip.style.position = "absolute";
		toolTip.style.left = 100 + "px";
		toolTip.style.top = 100 + "px";
		toolTip.style.height = "600px";
		toolTip.style.width = "500px";
		toolTip.style.zIndex = "99999";
		toolTip.style.border ="3px solid #4A96AD";
		toolTip.style.backgroundColor = "white";
		toolTip.style.cursor="pointer";
		toolTip.style.borderRadius="5px";
		toolTip.style.overflow="auto";
		setStatusToTrue("drewToolTip");
		
		document.body.appendChild(toolTip);
		$('#myToolTip').draggable();

		//add action questions to pop up
		appendTemplateToElement(toolTip ,"./templates/action.html");

		//add button functionality
		$(".closeToolTip").unbind( "click" ).unbind( "click" ).click(function() {
			setStatusToTrue("gotScreenshot");
			preActionQuestions(toolTip);
		});

		$("#retakeImage").unbind( "click" ).unbind( "click" ).click(function(){
			toolTip.remove();
			setStatusToFalse("drewToolTip");
			overlayScreen();
			overlayScreen();
		});
        $("#exitButton").unbind( "click" ).unbind( "click" ).click(function(){
            saveAndExit("popup");
        });

		$("#imageBack").unbind( "click" ).unbind( "click" ).click(function(){
		    toolTip.remove();
            document.getElementById('genderMagCanvasContainer').style.display="none";
			openSlider();
		});

		var actionSpan = localStorage.getItem("currActionName");
		$(".actionNameSpan").html("Action: " + actionSpan);

		//Get ready to display image
		canvas = document.getElementById("imageCanvas");
		canvas.width = "465";
		canvas.height=	"350";
		canvas.style.border="2px solid #4A96AD";
		canvas.style.margin="10px";
		var context = canvas.getContext("2d");
		var myImg = document.getElementById("previewImage");
		var imgURL = localStorage.getItem("currImgURL");
		if (imgURL) {
            myImg.src = imgURL;
        }
        else {
             myImg.src = localStorage.getItem("currImgURL");
        }
		var previewHeight = 350;
		var previewWidth = 465;
		var imageRatio = myImg.width/myImg.height;
		var ratioHeight = myImg.height * 0.75;
		var ratioWidth = imageRatio*ratioHeight;
		var canContainer = document.getElementById("genderMagCanvasContainer");
		var sourceY = canContainer.offsetTop;
		var sourceX = canContainer.offsetLeft;
		
		var sx = localStorage.getItem("sx");
		var sy = localStorage.getItem("sy");

		//draw preview image
		if(sx && sy){
			context.drawImage(myImg, 0, 0, myImg.width, myImg.height,0,0, previewWidth*9/10, previewHeight*9/10);
		}
		else{
			context.drawImage(myImg, 0, 0, previewWidth, previewHeight);
		}

		//Functionality when 'draw on image' button is clicked
		$(".previewTrigger").unbind( "click" ).click(function(){
		    importStylesheet("head","/styles/overlayScreen.css");
	    	appendTemplateToElement("body", "/templates/imageAnnotation.html");

		    $("#imageAnnotation").width(ratioWidth+10);
		    $("#imageAnnotation").height(ratioHeight+40);
		    $("#imageAnnotation").draggable();
		    $("#annotationCanvas").attr("width", ratioWidth);
		    $("#annotationCanvas").attr("height", ratioHeight);
		    $("#annotationCanvas").width(ratioWidth);
		    $("#annotationCanvas").height(ratioHeight);
		    $("#imageAnnotation").css("position", "absolute");
		    $("#imageAnnotation").css("top", myToolTip.style.top);
		    $("#imageAnnotation").css("left", myToolTip.style.left);
		    //$("#imageAnnotation").css("zIndex", 99999);

		    //set up draw on image functionality
	    	var annotationCanvas = document.getElementById("annotationCanvas");
	    	ctx = annotationCanvas.getContext("2d");
	    	ctx.drawImage(myImg,0,0, ratioWidth, ratioHeight);

	       	//set button functionality on drawing pop up
	    	$('#undoDraw').unbind( "click" ).click(function() {
	    		history.undo(annotationCanvas, ctx);
	    	});

	    	$('#redoDraw').unbind( "click" ).click(function() {
	    		history.redo(annotationCanvas, ctx);
	    	});

	    	//functionality for closing drawing pop up and saving new image
		    $("#backLargePreview").unbind( "click" ).click(function(){
		       $("#imageAnnotation").remove();
		        var drawnOnURL = history.saveState(annotationCanvas);
		        //set saved image as the annotated one
		        localStorage.setItem("currImgURL", drawnOnURL);

		        var smallerImg = document.getElementById("previewImage");
		        var oldWidth = myImg.width;
		        var oldHeight = myImg.height;
		        smallerImg.src = drawnOnURL;
                context.clearRect(0,0,465, 150);

                //does this ever get called?
                if(oldHeight > smallerImg.height){
                    var sx = sourceX *smallerImg.width/oldWidth;
                    var sy = sourceY *smallerImg.height/oldHeight;
                    localStorage.setItem("sx", sx);
                    localStorage.setItem("sy", sy);
                    context.drawImage(myImg, sx, sy, smallerImg.width,smallerImg.height,0,0, ratioWidth*9/10, ratioHeight*9/10);
                }
                else{
                    var sx = localStorage.getItem("sx");
                    var sy = localStorage.getItem("sy");
                    context.drawImage(myImg, sx, sy, smallerImg.width,smallerImg.height,0,0, ratioWidth*9/10, ratioHeight*9/10);
                }
		    });

		    $("#closeLargePreview").unbind( "click" ).click(function(){
		        $("#imageAnnotation").remove();
		    });
		});
	}
	
	else {
		//close slider to prepare for screenshot box cursor
		closeSlider();
		sidebarBody().find("#nukeStatus").show();
		//show existing container or create if doesn't exist
		if (document.getElementById('genderMagCanvasContainer')) {
			var canvasContainer = document.getElementById('genderMagCanvasContainer');
			canvasContainer.style.display = "block";
			document.getElementById('genderMagCanvas').style.display = "block";
		} else {
			var canvasContainer = document.createElement('div');

			// Add style and append the div to the body
			canvasContainer.id = "genderMagCanvasContainer";
			canvasContainer.style.position = "fixed";
			// Set to 100% so that it will have the dimensions of the document
			canvasContainer.style.left = "0px";
			canvasContainer.style.top = "0px";
			canvasContainer.style.width = "100%";
			canvasContainer.style.height = "100%";
			canvasContainer.style.zIndex = "99999";
			document.body.appendChild(canvasContainer);

			//create canvas, add style, append to container
			var canvas = document.createElement('canvas');
			canvas.style.width = canvasContainer.scrollWidth + "px";
			canvas.style.height = canvasContainer.scrollHeight + "px";
			canvas.id = "genderMagCanvas";
			canvas.position = "fixed";
			canvas.style.opacity = .50;
			canvas.width = canvasContainer.scrollWidth;
			canvas.height = canvasContainer.scrollHeight;
			canvas.style.overflow = 'visible';
			canvas.style.position = 'fixed';

			canvas.style.left = "0px";
			canvas.style.top = "0px";
			canvas.style.width = "100%";
			canvas.style.height = "100%";
			canvas.style.zIndex = "99999";

			canvasContainer.appendChild(canvas);
		}

		var genderMagCanvas = document.getElementById('genderMagCanvas'),
			ctx = genderMagCanvas.getContext('2d'),
			rect = {},
			drag = false;

		//flag to indicate screenshot process is happening
		var screenshotFlag = true;

	    //set listeners for taking screenshot
		function init() {
			genderMagCanvas.addEventListener('mousedown', mouseDown, false);
			genderMagCanvas.addEventListener('mouseup', mouseUp, false);
			genderMagCanvas.addEventListener('mousemove', mouseMove, false);
		}

		//mouse down gets location for screenshot box
		function mouseDown(e) {
			rect.startX = e.pageX - this.offsetLeft;
			rect.startY = e.pageY - this.offsetTop;
			drag = true;
		}
		//mouse up gets click on page and calls for screenshot
		function mouseUp(e) {
			if(screenshotFlag) {
				drag = false;
				globXY = [e.pageX, e.pageY];
				elm = document.elementFromPoint(rect.startX, rect.startY);//elm can return undefined;
				var elements = new Array();
				if(elm === null){
				  elm = document.getElementById("genderMagCanvasContainer");
                }else {
                    while (elm.id === "genderMagCanvas") {
                        elements.push(elm);
                        elm.style.display = "none";
                        elm = document.elementFromPoint(rect.startX, rect.startY);
                    }
                }
				setStatusToTrue("highlightedAction");
				for (var element in elements) {
					if (element.id === "genderMagCanvas" || element.id === "genderMagCanvasContainer" || element.id === "highlightHover") {
						element.style.display = "default";
					}
				}
				//take the screenshot
				chrome.runtime.sendMessage({greeting: "takeScreenShot"}, function (response) {
					//catch error from screenshot
					if(chrome.runtime.lastError){
						//do nothing - not a bad error it just happens
					}
				});


				setTimeout(function () {
					$("#highlightHover").remove();
					//screenshot process finished, flag set to false
					screenshotFlag = false;
				}, 500);
			}
		}
		//Function to create and display box cursor for screen capture
		function mouseMove(e) {
			if (drag) {
				rect.w = (e.pageX - this.offsetLeft) - rect.startX;
				rect.h = (e.pageY - this.offsetTop) - rect.startY ;
			}
			//highlight hover is recreated every time mouse moves
			if($("#highlightHover") && screenshotFlag){
				rect.startX = e.clientX - this.offsetLeft;
				rect.startY = e.clientY - this.offsetTop;
				rect.w = (e.pageX - this.offsetLeft) - rect.startX;
				rect.h = (e.pageY - this.offsetTop) - rect.startY ;

				$("#highlightHover").remove();
				var highlightHover = document.createElement("div");
				highlightHover.id = "highlightHover";
				document.getElementById('genderMagCanvasContainer').appendChild(highlightHover);
				highlightHover.style.position = "absolute";
				highlightHover.style.left = rect.startX-30 + "px";
				highlightHover.style.top = rect.startY-20 + "px";
				highlightHover.style.height = "50px";
				highlightHover.style.width = "100px";
				highlightHover.style.border = "3px solid #7D1935";
				highlightHover.style.opacity = "1";
			}
			else{
				var highlightHover = document.createElement("div");
				highlightHover.id = "highlightHover";
			}
		}
		function draw() {
			ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
		}
		init();

    }
}

/*
 * Function: renderImage
 * This function draws the pop up after the screenshot is taken in overlay screen - called from screenshot function
 * Params: imgURL - the url of the image to be used in the preview
 */
function renderImage(imgURL){
    //create div, add style, append to body
	var toolTip = document.createElement("div");
	toolTip.id = "myToolTip";
	toolTip.style.position = "absolute";
	toolTip.style.left = 100 + "px";
	toolTip.style.top = 100 + "px";	
	toolTip.style.height = "600px";
	toolTip.style.width = "500px";
	toolTip.style.zIndex = "99999";
	toolTip.style.border ="3px solid #4A96AD";
	toolTip.style.backgroundColor = "white";
	toolTip.style.cursor="pointer";
	toolTip.style.borderRadius="5px";
	toolTip.style.overflow="auto";
    setStatusToTrue("drewToolTip");
	
	document.body.appendChild(toolTip);
	//make pop up draggable
	$('#myToolTip').draggable();

	//add action questions to pop up
	appendTemplateToElement(toolTip ,"./templates/action.html");

	//add button functionality
	$(".closeToolTip").unbind( "click" ).click(function() {
		//toolTip.remove();
        setStatusToTrue("gotScreenshot");
        preActionQuestions(toolTip);
	});
	$("#retakeImage").unbind( "click" ).click(function(){
		toolTip.remove();
        setStatusToFalse("drewToolTip");
		overlayScreen();
	});
    $("#exitButton").unbind( "click" ).unbind( "click" ).click(function(){
        saveAndExit("popup");
    });
	$("#imageBack").unbind( "click" ).click(function(){
	    toolTip.remove();
        document.getElementById('genderMagCanvasContainer').style.display="none";
		openSlider();
	});

	//print current action name on pop up
	var actionSpan = localStorage.getItem("currActionName");
	$(".actionNameSpan").html("Action: " + actionSpan);
	var canvas = document.getElementById("imageCanvas");
	canvas.width = "465";
	canvas.height=	"350";
	canvas.style.border="2px solid #4A96AD";
	canvas.style.margin="10px";
	var context = canvas.getContext("2d");
	var myImg = document.getElementById("previewImage");

	//drawing functionality for image
	function drawOnCanvas(canvas){
	    var $myCanvas = $(canvas);
	    var $offset = $myCanvas.offset();
	    var $lineWidthVal = 2;
	    var lineColor = "#FF0000";
	    var isMouseDown = false;
	    var pos = {
	        x:0,
            y:0
	    };
	    var lastPos = {
	        x:0,
            y:0
	    };
	    function paintLine(x1, y1, x2, y2, paintWidth, paintColor) {
	        $myCanvas.drawLine({
                strokeStyle: paintColor,
                strokeWidth: paintWidth,
                rounded: true,
                strokeJoin: 'round',
                strokeCap: 'round',
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
	        });
	    }
	    /*
	   	** PAINTING FUNCTIONALITY **
		*/

	    //On mousedown the painting functionality kicks in
        $myCanvas.on('mousedown', function(e) {
            $offset = $myCanvas.offset();
            e.stopPropagation();
            isMouseDown = true;
            var drawnOnURL = history.saveState($myCanvas[0]);
            localStorage.setItem("currImgURL", drawnOnURL);
        });

        //On mouseup the painting functionality stops
        $myCanvas.on('mouseup', function() {
            $offset = $myCanvas.offset();
            isMouseDown = false;
            return;
        });

        //On mousemove store the mouse coordinates and
        //use jCanvas drawLine() method
        $myCanvas.on('mousemove', function(e) {
            lastPos.x = pos.x;
            lastPos.y = pos.y;
            pos.x = e.pageX - $offset.left;
            pos.y = e.pageY - $offset.top;

            if (isMouseDown) {
                //context.beginPath();
                paintLine(lastPos.x, lastPos.y, pos.x, pos.y, $lineWidthVal, lineColor);
            }
        });
	}

	//list of previously drawn lines for redo and undo functionality
	var history = {
	    redo_list: [],
        undo_list: [],
        saveState: function(canvas, list, keep_redo) {
	        keep_redo = keep_redo || false;
	        if(!keep_redo) {
	            this.redo_list = [];
	        }
	        (list || this.undo_list).push(canvas.toDataURL());
	        return canvas.toDataURL();
	        },

        undo: function(canvas, context) {
	        return this.restoreState(canvas, context, this.undo_list, this.redo_list);
	        },
				
        redo: function(canvas, context) {
	        return this.restoreState(canvas, context, this.redo_list, this.undo_list);
	        },
    
        restoreState: function(canvas, context,  pop, push) {
	        if(pop.length) {
	            this.saveState(canvas, push, true);
	            var restore_state = pop.pop();
	            var img =  document.createElement('img');
	            img.src = restore_state;
	            img.onload = function() {
	                context.clearRect(0, 0,  canvas.width, canvas.height);
	                context.drawImage(img, 0, 0);
	            };
	            return img.src;
	        }
	    }
	};
	
	if (imgURL) {
	    myImg.src = imgURL;
	} else {
	    myImg.src = localStorage.getItem("currImgURL");
	}

	if(myImg.width === 0 || myImg.height === 0){
	    myImg.width = 1920;
	    myImg.height = 742;
	}
		
	var imageRatio = myImg.width/myImg.height;
	//set size for image preview
    var previewHeight = 350;
    var previewWidth = 465;

    //set size for annotation
    var ratioHeight = myImg.height * 0.75;
    var ratioWidth = imageRatio*ratioHeight;
    var sourceY = elm.offsetTop;
    var sourceX = elm.offsetLeft;
		
    if(elm.offsetLeft > 90) {
        sourceX = elm.offsetLeft - 90;
    }
    if(elm.offsetTop > 60) {
        sourceY = elm.offsetTop - 60;
    }
    localStorage.setItem("sourceX", sourceX);
    localStorage.setItem("sourceY", sourceY);
    var destWidth = myImg.width-ratioWidth;
    var destHeight = myImg.height-ratioHeight;
    var sourceWidth = myImg.width - destWidth;
    var sourceHeight = myImg.height - destHeight;
    var destX = canvas.width / 2 - destWidth / 2;
    var destY = canvas.height / 2 - destHeight / 2;

    //functionality for drawing preview image on pop up
    $(".previewTrigger").unbind( "click" ).click(function(){
		importStylesheet("head","/styles/overlayScreen.css");
		appendTemplateToElement("body", "/templates/imageAnnotation.html");

		$("#imageAnnotation").width(ratioWidth+10);
		$("#imageAnnotation").height(ratioHeight+40);
		$("#imageAnnotation").draggable();
	
		$("#annotationCanvas").attr("width", ratioWidth);
		$("#annotationCanvas").attr("height", ratioHeight);
		$("#annotationCanvas").width(ratioWidth);
		$("#annotationCanvas").height(ratioHeight);
        $("#imageAnnotation").css("position", "absolute");
		$("#imageAnnotation").css("top", myToolTip.style.top);
		$("#imageAnnotation").css("left", myToolTip.style.left);
        $("#imageAnnotation").css("zIndex", 99999);
			
		drawOnCanvas("#annotationCanvas");
		var annotationCanvas = document.getElementById("annotationCanvas");
		ctx = annotationCanvas.getContext("2d");
		ctx.drawImage(myImg,0,0, ratioWidth, ratioHeight);
		console.log("image drawn");
		$('#undoDraw').unbind( "click" ).click(function() {
			var drawnOnURL = history.undo(annotationCanvas, ctx);
			localStorage.setItem("currImgURL", drawnOnURL);
		});
  
		$('#redoDraw').unbind( "click" ).click(function() {
			var drawnOnURL = history.redo(annotationCanvas, ctx);
			localStorage.setItem("currImgURL", drawnOnURL);
		});
			
		$("#backLargePreview").unbind( "click" ).click(function(){
		    $("#imageAnnotation").remove();
		    var drawnOnURL = history.saveState(annotationCanvas);
		    localStorage.setItem("currImgURL", drawnOnURL);
				
		    var smallerImg = document.getElementById("previewImage");
		    var oldWidth = myImg.width;
		    var oldHeight = myImg.height;
		    smallerImg.src = drawnOnURL
            context.clearRect(0,0,465, 350);
		    if(oldHeight > smallerImg.height){
		        var sx = sourceX *smallerImg.width/oldWidth;
		        var sy = sourceY *smallerImg.height/oldHeight;
		        localStorage.setItem("sx", sx);
		        localStorage.setItem("sy", sy);
		        context.drawImage(myImg, sx, sy, myImg.width, myImg.height,0,0, ratioWidth*9/10, ratioHeight*9/10);
		    }
		    else{
		        var sx = localStorage.getItem("sx");
		        var sy = localStorage.getItem("sy");
		        context.drawImage(myImg, sx, sy, smallerImg.width,smallerImg.height,0,0, ratioWidth*9/10, ratioHeight*9/10);
		    }
		});
		$("#closeLargePreview").unbind( "click" ).click(function(){
		    $("#imageAnnotation").remove();
		    var drawnOnURL = history.saveState(annotationCanvas);
		    localStorage.setItem("currImgURL", drawnOnURL);
				
		    var smallerImg = document.getElementById("previewImage");
		    var oldWidth = myImg.width;
		    var oldHeight = myImg.height;
		    smallerImg.src = drawnOnURL;
		    context.clearRect(0,0,465, 150);
		    if(oldHeight > smallerImg.height){
		        var sx = sourceX *smallerImg.width/oldWidth;
		        var sy = sourceY *smallerImg.height/oldHeight;
		        localStorage.setItem("sx", sx);
		        localStorage.setItem("sy", sy);
		        context.drawImage(myImg, sx, sy, smallerImg.width,smallerImg.height,0,0, ratioWidth*9/10, ratioHeight*9/10);
		    }
		    else{
		        var sx = localStorage.getItem("sx");
		        var sy = localStorage.getItem("sy");
		        context.drawImage(myImg, sx, sy, smallerImg.width,smallerImg.height,0,0, ratioWidth*9/10, ratioHeight*9/10);
		    }
		});
    });

    var sx = localStorage.getItem("sx");
    var sy = localStorage.getItem("sy");
    if(sx && sy){
        context.drawImage(myImg, 0, 0, myImg.width, myImg.height,0,0, previewWidth*9/10, previewHeight*9/10);
    }
    else{
        myImg.onload = function(){
			context.drawImage(myImg, 0, 0, previewWidth, previewHeight);
        };
    }
}


