
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  console.log("renderimage" , request);
    if (request.callFunction == "renderImage"){
    //console.log("rendering image" , request.imageUrl);
		renderImage(request.imageUrl);
        localStorage.setItem("currImgURL", request.imageUrl);
	}
});


function overlayScreen(onlyDraw){
	
	if (onlyDraw == "onlyToolTip") {
		closeSlider();
		sidebarBody().find("#nukeStatus").show();
		var canvasContainer;
		if(!document.getElementById('genderMagCanvasContainer')){
			//console.log("in if");
			canvasContainer = document.createElement('div');
				// Add the div into the document
		}
		else{
			canvasContainer = document.getElementById('genderMagCanvas');
		}
		
		canvasContainer.id = "genderMagCanvasContainer";
		canvasContainer.style.position="fixed";
		// Set to 100% so that it will have the dimensions of the document
		canvasContainer.style.left="0px";
		canvasContainer.style.top="0px";
		canvasContainer.style.width="100%";
		canvasContainer.style.height="100%";
		canvasContainer.style.zIndex="9999";
		document.body.appendChild(canvasContainer);
		
		var canvas = document.createElement('canvas');
		canvas.style.width = canvasContainer.scrollWidth+"px";
		canvas.style.height = canvasContainer.scrollHeight+"px";
		canvas.id = "genderMagCanvas";
		canvas.position = "fixed";
		//canvas.style.cssText = "z-index:100; background:blue; width:100%; height:100%;";
		canvas.style.opacity = .50;
		canvas.width=canvasContainer.scrollWidth;
		canvas.height=canvasContainer.scrollHeight;
		canvas.style.overflow = 'visible';
		canvas.style.position = 'fixed';
		canvasContainer.appendChild(canvas);


		var genderMagCanvas = document.getElementById('genderMagCanvas'),
			ctx = genderMagCanvas.getContext('2d'),
			rect = {},
			drag = false;
		
		
		//
		elm = document.elementFromPoint(rect.startX, rect.startY);
		var elements = new Array();
		while(elm.id == "genderMagCanvas" || elm.id == "genderMagCanvasContainer" )
		{
			elements.push(elm);
			elm.style.display = "none";
			elm = document.elementFromPoint(rect.startX, rect.startY);
		}
		var toolTip = document.createElement("div");
		toolTip.id = "myToolTip";
		toolTip.style.position = "absolute";
		//toolTip.style.left = elm.offsetLeft+100 + "px";
		//toolTip.style.top = elm.offsetTop+100 + "px";
		toolTip.style.left = 100 + "px";
		toolTip.style.top = 100 + "px";
		toolTip.style.height = "550px";
		toolTip.style.width = "500px";
		toolTip.style.zindex = "10002";	
		toolTip.style.border ="3px solid #4A96AD";
		toolTip.style.backgroundColor = "white";
		toolTip.style.cursor="pointer";
		toolTip.style.borderRadius="5px";
		toolTip.style.overflow="auto";
		setStatusToTrue("drewToolTip");
		
		document.body.appendChild(toolTip);
		$('#myToolTip').draggable();
		//addToolTip("imageCanvas");

		appendTemplateToElement(toolTip ,"./templates/action.html");
		$(".closeToolTip").unbind( "click" ).unbind( "click" ).click(function() {
			//toolTip.remove();
			//toolTip.innerHTML = " ";
			setStatusToTrue("gotScreenshot");
			preActionQuestions(toolTip);
		});
		$("#retakeImage").unbind( "click" ).unbind( "click" ).click(function(){
			toolTip.remove();
			setStatusToFalse("drewToolTip");
			overlayScreen();
			overlayScreen();
		});
		$("#imageBack").unbind( "click" ).unbind( "click" ).click(function(){
			openSlider();
		});
		var actionSpan = localStorage.getItem("currActionName");
		$(".actionNameSpan").html("Action: " + actionSpan);
		//$(".previewTrigger").click(function(){ //#triggered
		//	window.open(imgURL);
		//});
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
		console.log("Myimg.src", myImg.src);
		var imageRatio = myImg.width/myImg.height;
		var ratioHeight = myImg.height * 0.75;
		var ratioWidth = imageRatio*ratioHeight;
		//console.log("my image", myImg.height, myImg.width, imageRatio, ratioHeight, ratioWidth);
		var sourceY = localStorage.getItem("sourceY");
		var sourceX = localStorage.getItem("sourceX");
		
		
		

    	//console.log("Source x and y: ", elm.offsetLeft, elm.offsetTop, sourceX, sourceY);
    	var destWidth = myImg.width-ratioWidth;
    	var destHeight = myImg.height-ratioHeight;
		var sourceWidth = myImg.width - destWidth;
   		var sourceHeight = myImg.height - destHeight;
    	var destX = canvas.width / 2 - destWidth / 2;
    	var destY = canvas.height / 2 - destHeight / 2;
		
		var sx = localStorage.getItem("sx");
		var sy = localStorage.getItem("sy");
		if(sx && sy){
			//console.log("drawing image in canvas");
			context.drawImage(myImg, sx, sy, myImg.width, myImg.height,0,0, ratioWidth*9/10, ratioHeight*9/10);
		}
		else{
			context.drawImage(myImg,sourceX, sourceY,myImg.width, myImg.height,0,0,ratioWidth*9/10, ratioHeight*9/10);
		}
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
			//drawOnCanvas("#annotationCanvas");
			var annotationCanvas = document.getElementById("annotationCanvas");
			ctx = annotationCanvas.getContext("2d");
		
			ctx.drawImage(myImg,0,0,myImg.width, myImg.height,0,0,ratioWidth, ratioHeight);
			
		$('#undoDraw').unbind( "click" ).click(function() {
			//console.log("undo", annotationCanvas, ctx);
			history.undo(annotationCanvas, ctx);
		});
  
		$('#redoDraw').unbind( "click" ).click(function() {
			//console.log("redo ");
			history.redo(annotationCanvas, ctx);
		});
			
			$("#backLargePreview").unbind( "click" ).click(function(){
				$("#imageAnnotation").remove();
				var drawnOnURL = history.saveState(annotationCanvas);
				localStorage.setItem("currImgURL", drawnOnURL);
				
				var smallerImg = document.getElementById("previewImage");
					var oldWidth = myImg.width;
					var oldHeight = myImg.height;
					smallerImg.src = drawnOnURL
					//console.log("New height", oldWidth, oldHeight, smallerImg.width, smallerImg.height);
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
					//console.log("Newer height", myImg, sx, sy, smallerImg.width,smallerImg.height,0,0, ratioWidth*9/10, ratioHeight*9/10);
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
	if(!document.getElementById('genderMagCanvasContainer')){
		//console.log("In overlayScreen");
		var canvasContainer = document.createElement('div');
			// Add the div into the document
	}
	else{
		var canvasContainer = document.getElementById('genderMagCanvas');	
	}
	
		canvasContainer.id = "genderMagCanvasContainer";
		canvasContainer.style.position="fixed";
		// Set to 100% so that it will have the dimensions of the document
		canvasContainer.style.left="0px";
		canvasContainer.style.top="0px";
		canvasContainer.style.width="100%";
		canvasContainer.style.height="100%";
		canvasContainer.style.zIndex="99999";
		document.body.appendChild(canvasContainer);
		
		var canvas = document.createElement('canvas');
		canvas.style.width = canvasContainer.scrollWidth+"px";
		canvas.style.height = canvasContainer.scrollHeight+"px";
		canvas.id = "genderMagCanvas";
		canvas.position = "fixed";
		//canvas.style.cssText = "z-index:100; background:blue; width:100%; height:100%;";
		canvas.style.opacity = .50;
		canvas.width=canvasContainer.scrollWidth;
		canvas.height=canvasContainer.scrollHeight;
		canvas.style.overflow = 'visible';
		canvas.style.position = 'fixed';
		canvasContainer.appendChild(canvas);


		var genderMagCanvas = document.getElementById('genderMagCanvas'),
			ctx = genderMagCanvas.getContext('2d'),
			rect = {},
			drag = false;

		var screenshotFlag = true;

	
		function init() {
			genderMagCanvas.addEventListener('mousedown', mouseDown, false);
			genderMagCanvas.addEventListener('mouseup', mouseUp, false);
			genderMagCanvas.addEventListener('mousemove', mouseMove, false);

			//genderMagCanvasContainer.addEventListener('mousedown', mouseDown, false);
			//genderMagCanvasContainer.addEventListener('mouseup', mouseUp, false);
			//genderMagCanvas.parentElement.addEventListener('mousemove', mouseMove, false);
		}
		function mouseDown(e) {
			rect.startX = e.pageX - this.offsetLeft;
			rect.startY = e.pageY - this.offsetTop;
			drag = true;
		}			
		function mouseUp(e) {
			if(screenshotFlag) {
				drag = false;
				console.log("mouse up");
				globXY = [e.pageX, e.pageY];
				elm = document.elementFromPoint(rect.startX, rect.startY);//elm can return undefined;
				var elements = new Array();
				while (elm.id === "genderMagCanvas") {
					elements.push(elm);
					elm.style.display = "none";
					elm = document.elementFromPoint(rect.startX, rect.startY);
				}
				//console.log("element" , elm.innerText, elm.textContent);
				var highlightClick = document.createElement("div");
				highlightClick.id = "highlightClick";
				//	document.body.appendChild(highlightClick);
				highlightClick.style.position = "absolute";
				highlightClick.style.left = elm.offsetLeft + "px";
				highlightClick.style.top = elm.offsetTop + "px";
				highlightClick.style.height = elm.offsetHeight + "px";
				highlightClick.style.width = elm.offsetWidth + "px";
				highlightClick.style.border = "3px solid #7D1935";
				highlightClick.style.opacity = "1";
				//highlightClick.style.zindex = "10000";
				//highlightClick.style.zIndex = "99999";

				//console.log("Clicked ", highlightClick)
				setStatusToTrue("highlightedAction");
				//console.log(elements);
				for (var element in elements) {
					if (element.id === "genderMagCanvas" || element.id === "genderMagCanvasContainer" || element.id === "highlightHover") {
						element.style.display = "default";
					}
				}
				chrome.runtime.sendMessage({greeting: "takeScreenShot"}, function (response) {

				});


				//console.log("sending message");
				setTimeout(function () {
					//	document.getElementById("highlightClick").remove();
					$("#highlightHover").remove();
					screenshotFlag = false;
				}, 500);
			}
		}
		function mouseMove(e) {
			if (drag) {
				rect.w = (e.pageX - this.offsetLeft) - rect.startX;
				rect.h = (e.pageY - this.offsetTop) - rect.startY ;
				//ctx.clearRect(0,0,canvas.width,canvas.height);
				//draw();
			}
			if($("#highlightHover") && screenshotFlag){
				rect.startX = e.clientX - this.offsetLeft;
				rect.startY = e.clientY - this.offsetTop;
				var hoverElm = document.elementFromPoint(rect.startX, rect.startY);
				rect.w = (e.pageX - this.offsetLeft) - rect.startX;
				rect.h = (e.pageY - this.offsetTop) - rect.startY ;

				$("#highlightHover").remove();
				var highlightHover = document.createElement("div");
				highlightHover.id = "highlightHover";
				document.getElementById('genderMagCanvasContainer').appendChild(highlightHover);
				//document.body.appendChild(highlightHover);
				highlightHover.style.position = "absolute";
				highlightHover.style.left = rect.startX-30 + "px";
				highlightHover.style.top = rect.startY-20 + "px";
				highlightHover.style.height = "50px";
				highlightHover.style.width = "100px";
				highlightHover.style.border = "3px solid #7D1935";
				highlightHover.style.opacity = "1";

				//console.log("Hovered if", hoverElm);
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

}}

function renderImage(imgURL){
	var toolTip = document.createElement("div");
	toolTip.id = "myToolTip";
	toolTip.style.position = "absolute";
	//toolTip.style.left = elm.offsetLeft+100 + "px";
	//toolTip.style.top = elm.offsetTop+100 + "px";
	toolTip.style.left = 100 + "px";
	toolTip.style.top = 100 + "px";	
	toolTip.style.height = "550px";
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
	//addToolTip("imageCanvas");

	appendTemplateToElement(toolTip ,"./templates/action.html");
	$(".closeToolTip").unbind( "click" ).click(function() {
		//toolTip.remove();
		//toolTip.innerHTML = " ";
        setStatusToTrue("gotScreenshot");
        preActionQuestions(toolTip);
	});
	$("#retakeImage").unbind( "click" ).click(function(){
		toolTip.remove();
        setStatusToFalse("drewToolTip");
		overlayScreen();
	});
	$("#imageBack").unbind( "click" ).click(function(){
		openSlider();
	});
	var actionSpan = localStorage.getItem("currActionName");
		$(".actionNameSpan").html("Action: " + actionSpan);
		var canvas = document.getElementById("imageCanvas");
		canvas.width = "465";
		canvas.height=	"350";
		canvas.style.border="2px solid #4A96AD";
		canvas.style.margin="10px";
		var context = canvas.getContext("2d");
		var myImg = document.getElementById("previewImage");

		function drawOnCanvas(canvas){
			var $myCanvas = $(canvas);
			//$myCanvas.draggable();
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
				//console.log("time to save");
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
		
			var history = {
				redo_list: [],
				undo_list: [],
				saveState: function(canvas, list, keep_redo) {
					keep_redo = keep_redo || false;
					if(!keep_redo) {
						this.redo_list = [];
					}
					//console.log("WHYYY", canvas[0]);
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
						//console.log("prev image", restore_state);
						var img =  document.createElement('img');
						img.src = restore_state;
						img.onload = function() {
							
						context.clearRect(0, 0,  canvas.width, canvas.height);
						context.drawImage(img, 0, 0);  
							//console.log("should be drawn");
						}
						return img.src;
					}
				}
			}
	

		
		if (imgURL) {
            myImg.src = imgURL;
        }
        else {
             myImg.src = localStorage.getItem("currImgURL");
        }
		//console.log("myIImagesource" , myImg);
		if(myImg.width == 0 || myImg.height == 0){
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
		console.log("my image", myImg.height, myImg.width, imageRatio, ratioHeight, ratioWidth);
		var sourceY = elm.offsetTop;
		var sourceX = elm.offsetLeft;
		
		if(elm.offsetLeft > 90) {
			sourceX = elm.offsetLeft - 90;//-(elm.offsetLeft/16);
		}
		if(elm.offsetTop > 60) {
			sourceY = elm.offsetTop - 60;//+ (elm.offsetTop/8);
		}
		localStorage.setItem("sourceX", sourceX);
		localStorage.setItem("sourceY", sourceY);
		
		//console.log("Source x and y: ", elm.offsetLeft, elm.offsetTop, sourceX, sourceY);
    	var destWidth = myImg.width-ratioWidth;
    	var destHeight = myImg.height-ratioHeight;
		var sourceWidth = myImg.width - destWidth;
   		var sourceHeight = myImg.height - destHeight;
    	var destX = canvas.width / 2 - destWidth / 2;
    	var destY = canvas.height / 2 - destHeight / 2;
		//console.log(globXY);
		
		//console.log("after glob");
    	
		$(".previewTrigger").unbind( "click" ).click(function(){ //#triggered
		importStylesheet("head","/styles/overlayScreen.css");
		appendTemplateToElement("body", "/templates/imageAnnotation.html");
	//console.log("after preview trigger");
    	
		//document.getElementById("#imageAnnotation").style.transition = "all 2s";	
		console.log("mytooltip", ratioWidth, ratioHeight, myToolTip.style.top, myToolTip.style.left);
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
	
			console.log("about to draw image", myImg);
			ctx.drawImage(myImg,0,0, ratioWidth, ratioHeight);
			console.log("image drawn");
		$('#undoDraw').unbind( "click" ).click(function() {
			//console.log("undo", annotationCanvas, ctx);
			var drawnOnURL = history.undo(annotationCanvas, ctx);
			localStorage.setItem("currImgURL", drawnOnURL);
		});
  
		$('#redoDraw').unbind( "click" ).click(function() {
			//console.log("redo ");
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
					//console.log("New height", oldWidth, oldHeight, smallerImg.width, smallerImg.height);
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
					//console.log("Newer height", myImg, sx, sy, smallerImg.width,smallerImg.height,0,0, ratioWidth*9/10, ratioHeight*9/10);
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
					//console.log("New height", oldWidth, oldHeight, smallerImg.width, smallerImg.height);
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
					//console.log("Newer height", myImg, sx, sy, smallerImg.width,smallerImg.height,0,0, ratioWidth*9/10, ratioHeight*9/10);
					context.drawImage(myImg, sx, sy, smallerImg.width,smallerImg.height,0,0, ratioWidth*9/10, ratioHeight*9/10);
				}
			});
			
		});
		//console.log("old height", myImg.width, myImg.height);
		var sx = localStorage.getItem("sx");
		var sy = localStorage.getItem("sy");
		//console.log("after sx/sy", context);
		if(sx && sy){
			context.drawImage(myImg, 0, 0, myImg.width, myImg.height,0,0, previewWidth*9/10, previewHeight*9/10);
			//console.log("after if")
		}
		else{
			myImg.onload = function(){
			context.drawImage(myImg, 0, 0, previewWidth, previewHeight);
			}
		}	
					
}


