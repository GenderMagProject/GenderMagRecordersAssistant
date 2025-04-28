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
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //console.log("renderimage" , request);
  if (request.callFunction === "renderImage") {
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
function overlayScreen(onlyDraw) {
  //If skipping screenshot and loading tooltip window from local storage
  closeSlider();
  console.log("Slider is closed now, loading tooltip window from local storage");
  sidebarBody().find("#nukeStatus").show();
  const canvasContainer = getOrCreateCanvasContainer();
  const genderMagCanvas = getOrCreateCanvas(canvasContainer);
  const drawingState = {
    ctx : genderMagCanvas.getContext("2d"),
    rect: {},
    drag: false,
    screenshotFlag: onlyDraw === "onlyToolTip" ? undefined : true
  };

  if (onlyDraw === "onlyToolTip") {
  loadToolTipUI(drawingState);
  } else {
    initializeScreenshotListeners(genderMagCanvas, drawingState);
  }
}


function getOrCreateCanvasContainer() {
  let container = document.getElementById("genderMagCanvasContainer");

  if (!container) {
    container = document.createElement("div");
    container.id = "genderMagCanvasContainer";
    Object.assign(container.style, {
      position: "fixed",
      left: "0px",
      top: "0px",
      width: "100%",
      height: "100%",
      zIndex: "9999"
    });
    document.body.appendChild(container);
  } else {
    container.style.display = "block";
    const existingCanvas = document.getElementById("genderMagCanvas");
    if (existingCanvas) existingCanvas.style.display = "block";
  }

  return container;
}
function getOrCreateCanvas(container) {
  let canvas = document.getElementById("genderMagCanvas");

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "genderMagCanvas";

    Object.assign(canvas.style, {
      position: "fixed",
      left: "0px",
      top: "0px",
      width: "100%",
      height: "100%",
      zIndex: "9999",
      opacity: 0.5,
      overflow: "visible"
    });

    canvas.width = container.scrollWidth;
    canvas.height = container.scrollHeight;
    canvas.style.width = container.scrollWidth + "px";
    canvas.style.height = container.scrollHeight + "px";

    container.appendChild(canvas);
  }

  return canvas;
}
function loadToolTipUI(drawingState) {
  const toolTip = createToolTipElement();
  appendTemplateToElement(toolTip,"./templates/action.html", (error, data) => {
    if (error) {
      console.error("Error appending action template:", error);
    } else {
      //add button functionality
      setupToolTipButtonHandlers(toolTip);
      updateActionNameUI();
      const {
        canvas: previewCanvas,
        context: previewCtx,
        myImg
      } = prepareCanvasPreview();
      const ratioHeight = myImg.height * 0.75;
      const ratioWidth = (myImg.width / myImg.height) * ratioHeight;
      var canContainer = document.getElementById("genderMagCanvasContainer");
      var sourceY = canContainer.offsetTop;
      var sourceX = canContainer.offsetLeft;
      setupDrawOnImageLogic(myImg, ratioWidth, ratioHeight, sourceX, sourceY, previewCtx);
    }
  }
 );
}
function createToolTipElement() {
  const toolTip = document.createElement("div");
  toolTip.id = "myToolTip";
  Object.assign(toolTip.style, {
    position: "absolute",
    left: "100px",
    top: "100px",
    height: "600px",
    width: "500px",
    zIndex: "99999",
    border: "3px solid #4A96AD",
    backgroundColor: "white",
    cursor: "pointer",
    borderRadius: "5px",
    overflow: "auto"
  });
  document.body.appendChild(toolTip);
  setStatusToTrue("drewToolTip");
  $("#myToolTip").draggable();
  return toolTip;
}

function setupToolTipButtonHandlers(toolTip) {
  $(".closeToolTip").off("click").on("click", () => {
    setStatusToTrue("gotScreenshot");
    preActionQuestions(toolTip);
  });

  $("#retakeImage").off("click").on("click", () => {
    toolTip.remove();
    setStatusToFalse("drewToolTip");
    overlayScreen();
    overlayScreen();
  });

  $("#exitButton").off("click").on("click", () => {
    justExit("popup");
  });

  $("#imageBack").off("click").on("click", () => {
    toolTip.remove();
    document.getElementById("genderMagCanvasContainer").style.display = "none";
    openSlider();
  });
}


function updateActionNameUI() {
  const actionSpan = localStorage.getItem("currActionName");
  $(".actionNameSpan").html("Action: " + actionSpan);
}

function prepareCanvasPreview() {
  //Get ready to display image
  canvas = document.getElementById("imageCanvas");
  canvas.width = "465";
  canvas.height = "350";
  canvas.style.border = "2px solid #4A96AD";
  canvas.style.margin = "10px";
  var context = canvas.getContext("2d");

  var myImg = document.getElementById("previewImage");
  var imgURL = localStorage.getItem("currImgURL");
  if (imgURL) {
    myImg.src = imgURL;
  } else {
    myImg.src = localStorage.getItem("currImgURL");
  }
  var previewHeight = 350;
  var previewWidth = 465;
  var imageRatio = myImg.width / myImg.height;
  var ratioHeight = myImg.height * 0.75;
  var ratioWidth = imageRatio * ratioHeight;

  var sx = localStorage.getItem("sx");
  var sy = localStorage.getItem("sy");

  //draw preview image
  if (sx && sy) {
    context.drawImage(myImg,0,0,myImg.width,myImg.height,0,
      0,(previewWidth * 9) / 10,(previewHeight * 9) / 10);
  } else {
    context.drawImage(myImg, 0, 0, previewWidth, previewHeight);
  }
  return { canvas, context, myImg };
}

function setupDrawOnImageLogic(myImg, ratioWidth, ratioHeight, sourceX, sourceY, canvasCtx ) {
  //Functionality when 'draw on image' button is clicked
  $(".previewTrigger").unbind("click").click(function () {
    importStylesheet("head", "/styles/overlayScreen.css");
    //appendTemplateToElement("body", "/templates/imageAnnotation.html");
    appendTemplateToElement("body", "/templates/imageAnnotation.html",(error) => {
        if (error) {
          console.error("Error appending image annotation template:",error);
          return;
        }
        console.log("Image Template Appended");
        $("#imageAnnotation").width(ratioWidth + 10);
        $("#imageAnnotation").height(ratioHeight + 40);
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
        drawCtx = annotationCanvas.getContext("2d");
        drawCtx.drawImage(myImg, 0, 0, ratioWidth, ratioHeight);

        //set button functionality on drawing pop up
        $("#undoDraw").unbind("click").click(function () {
            history.undo(annotationCanvas, drawCtx);
          });

        $("#redoDraw").unbind("click").click(function () {
            history.redo(annotationCanvas, drawCtx);
          });

        //functionality for closing drawing pop up and saving new image
        $("#backLargePreview").unbind("click").click(function () {
            $("#imageAnnotation").remove();
            var drawnOnURL = history.saveState(annotationCanvas);
            //set saved image as the annotated one
            localStorage.setItem("currImgURL", drawnOnURL);

            var smallerImg = document.getElementById("previewImage");
            var oldWidth = myImg.width;
            var oldHeight = myImg.height;
            smallerImg.src = drawnOnURL;
            canvasCtx.clearRect(0, 0, 465, 150);

            //does this ever get called?
            if (oldHeight > smallerImg.height) {
              var sx = (sourceX * smallerImg.width) / oldWidth;
              var sy = (sourceY * smallerImg.height) / oldHeight;
              localStorage.setItem("sx", sx);
              localStorage.setItem("sy", sy);
              canvasCtx.drawImage(myImg,sx, sy, smallerImg.width,smallerImg.height,
                0, 0, (ratioWidth * 9) / 10, (ratioHeight * 9) / 10 );
            } else {
              var sx = localStorage.getItem("sx");
              var sy = localStorage.getItem("sy");
              context.drawImage( myImg,sx, sy,smallerImg.width, smallerImg.height, 0,0,
                 (ratioWidth * 9) / 10,(ratioHeight * 9) / 10 );
            }
          });

        $("#closeLargePreview").unbind("click").click(function () {
            $("#imageAnnotation").remove();
          });
      }
    );
  });
}

function initializeScreenshotListeners(canvas, drawingState) {
  canvas.addEventListener("mousedown", (e) => onMouseDown(e, canvas, drawingState));
  canvas.addEventListener("mouseup", (e) => onMouseUp(e, canvas, drawingState));
  canvas.addEventListener("mousemove", (e) => onMouseMove(e, canvas, drawingState));
}

function onMouseDown(e, canvas, drawingState) {
  drawingState.rect.startX = e.pageX - canvas.offsetLeft;
  drawingState.rect.startY = e.pageY - canvas.offsetTop;
  drawingState.drag = true;
}
function onMouseUp(e, canvas, drawingState) {
  if (!drawingState.screenshotFlag) return;

  drawingState.drag = false;
  globXY = [e.pageX, e.pageY];
  let elm = document.elementFromPoint(drawingState.rect.startX, drawingState.rect.startY);
  const elements = [];

  if (elm === null) {
    elm = document.getElementById("genderMagCanvasContainer");
  } else {
    while (elm && elm.id === "genderMagCanvas") {
      elements.push(elm);
      elm.style.display = "none";
      elm = document.elementFromPoint(drawingState.rect.startX, drawingState.rect.startY);
    }
  }

  setStatusToTrue("highlightedAction");

  elements.forEach((el) => {
    if (["genderMagCanvas", "genderMagCanvasContainer", "highlightHover", "highlightBorder2"].includes(el.id)) {
      el.style.display = "default";
    }
  });

  chrome.runtime.sendMessage({ greeting: "takeScreenShot" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Screenshot error:", chrome.runtime.lastError);
    } else if (response?.status === "screenshot started") {
      console.log("Screenshot process initiated.");
    }
  });

  setTimeout(() => {
    $("#highlightHover").remove();
    $("#highlightBorder2").remove();
    drawingState.screenshotFlag = false;
  }, 500);
}
function onMouseMove(e, canvas, drawingState) {

  if (drawingState.drag) {
    drawingState.rect.w = e.pageX - canvas.offsetLeft - drawingState.rect.startX;
    drawingState.rect.h = e.pageY - canvas.offsetTop - drawingState.rect.startY;
  }

  if ($("#highlightHover").length && drawingState.screenshotFlag) {
    updateHighlightBox(e, "highlightHover", "#7D1935", 6, canvas);
  }

  if ($("#highlightBorder2").length && drawingState.screenshotFlag) {
    updateHighlightBox(e, "highlightBorder2", "#FFFFFF", 3, canvas);
  }
}
function updateHighlightBox(e, id, color, thickness, canvas) {

  const rectX = e.clientX - canvas.offsetLeft;
  const rectY = e.clientY - canvas.offsetTop;

  $(`#${id}`).remove();
  const box = document.createElement("div");
  box.id = id;
  Object.assign(box.style, {
    position: "absolute",
    left: `${rectX - 30}px`,
    top: `${rectY - 20}px`,
    height: "50px",
    width: "100px",
    border: `${thickness}px solid ${color}`,
    opacity: "1"
  });

  document.getElementById("genderMagCanvasContainer").appendChild(box);
}

/*
 * Function: renderImage
 * This function draws the pop up after the screenshot is taken in overlay screen - called from screenshot function
 * Params: imgURL - the url of the image to be used in the preview
 */
function renderImage(imgURL) {
  //create div, add style, append to body
  var toolTip = document.createElement("div");
  toolTip.id = "myToolTip";
  toolTip.style.position = "absolute";
  toolTip.style.left = 100 + "px";
  toolTip.style.top = 100 + "px";
  toolTip.style.height = "600px";
  toolTip.style.width = "500px";
  toolTip.style.zIndex = "99999";
  toolTip.style.border = "3px solid #4A96AD";
  toolTip.style.backgroundColor = "white";
  toolTip.style.cursor = "pointer";
  toolTip.style.borderRadius = "5px";
  toolTip.style.overflow = "auto";
  setStatusToTrue("drewToolTip");

  document.body.appendChild(toolTip);
  //make pop up draggable
  $("#myToolTip").draggable();

  //add action questions to pop up
  //appendTemplateToElement(toolTip ,"./templates/action.html");
  appendTemplateToElement(toolTip, "./templates/action.html", (error, data) => {
    if (error) {
      console.error("Error appending action template:", error);
    } else {
      console.log("Action template appended in renderImage:", data);
      // Add any dependent logic specific to the action template here

      //add button functionality
      $(".closeToolTip")
        .unbind("click")
        .click(function () {
          //toolTip.remove();
          setStatusToTrue("gotScreenshot");
          preActionQuestions(toolTip);
        });
      $("#retakeImage")
        .unbind("click")
        .click(function () {
          toolTip.remove();
          setStatusToFalse("drewToolTip");
          overlayScreen();
        });
      $("#exitButton")
        .unbind("click")
        .unbind("click")
        .click(function () {
          justExit("popup");
        });

      $("#imageBack")
        .unbind("click")
        .click(function () {
          toolTip.remove();
          document.getElementById("genderMagCanvasContainer").style.display =
            "none";
          openSlider();
        });

      //print current action name on pop up
      var actionSpan = localStorage.getItem("currActionName");
      $(".actionNameSpan").html("Action: " + actionSpan);
      var canvas = document.getElementById("imageCanvas");
      canvas.width = "465";
      canvas.height = "350";
      canvas.style.border = "2px solid #4A96AD";
      canvas.style.margin = "10px";
      var context = canvas.getContext("2d");
      var myImg = document.getElementById("previewImage");

      //drawing functionality for image
      function drawOnCanvas(canvas) {
        var $myCanvas = $(canvas);
        var $offset = $myCanvas.offset();
        var $lineWidthVal = 2;
        var lineColor = "#FF0000";
        var isMouseDown = false;
        var pos = {
          x: 0,
          y: 0,
        };
        var lastPos = {
          x: 0,
          y: 0,
        };
        function paintLine(x1, y1, x2, y2, paintWidth, paintColor) {
          $myCanvas.drawLine({
            strokeStyle: paintColor,
            strokeWidth: paintWidth,
            rounded: true,
            strokeJoin: "round",
            strokeCap: "round",
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
          });
        }
        /*
         ** PAINTING FUNCTIONALITY **
         */

        //On mousedown the painting functionality kicks in
        $myCanvas.on("mousedown", function (e) {
          $offset = $myCanvas.offset();
          e.stopPropagation();
          isMouseDown = true;
          var drawnOnURL = history.saveState($myCanvas[0]);
          localStorage.setItem("currImgURL", drawnOnURL);
        });

        //On mouseup the painting functionality stops
        $myCanvas.on("mouseup", function () {
          $offset = $myCanvas.offset();
          isMouseDown = false;
          return;
        });

        //On mousemove store the mouse coordinates and
        //use jCanvas drawLine() method
        $myCanvas.on("mousemove", function (e) {
          lastPos.x = pos.x;
          lastPos.y = pos.y;
          pos.x = e.pageX - $offset.left;
          pos.y = e.pageY - $offset.top;

          if (isMouseDown) {
            //context.beginPath();
            paintLine(
              lastPos.x,
              lastPos.y,
              pos.x,
              pos.y,
              $lineWidthVal,
              lineColor
            );
          }
        });
      }

      //list of previously drawn lines for redo and undo functionality
      var history = {
        redo_list: [],
        undo_list: [],
        saveState: function (canvas, list, keep_redo) {
          keep_redo = keep_redo || false;
          if (!keep_redo) {
            this.redo_list = [];
          }
          (list || this.undo_list).push(canvas.toDataURL());
          return canvas.toDataURL();
        },

        undo: function (canvas, context) {
          return this.restoreState(
            canvas,
            context,
            this.undo_list,
            this.redo_list
          );
        },

        redo: function (canvas, context) {
          return this.restoreState(
            canvas,
            context,
            this.redo_list,
            this.undo_list
          );
        },

        restoreState: function (canvas, context, pop, push) {
          if (pop.length) {
            this.saveState(canvas, push, true);
            var restore_state = pop.pop();
            var img = document.createElement("img");
            img.src = restore_state;
            img.onload = function () {
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.drawImage(img, 0, 0);
            };
            return img.src;
          }
        },
      };

      if (imgURL) {
        myImg.src = imgURL;
      } else {
        myImg.src = localStorage.getItem("currImgURL");
      }

      if (myImg.width === 0 || myImg.height === 0) {
        myImg.width = 1920;
        myImg.height = 742;
      }

      var imageRatio = myImg.width / myImg.height;
      //set size for image preview
      var previewHeight = 350;
      var previewWidth = 465;

      //set size for annotation
      var ratioHeight = myImg.height * 0.75;
      var ratioWidth = imageRatio * ratioHeight;
      var sourceY = elm.offsetTop;
      var sourceX = elm.offsetLeft;

      if (elm.offsetLeft > 90) {
        sourceX = elm.offsetLeft - 90;
      }
      if (elm.offsetTop > 60) {
        sourceY = elm.offsetTop - 60;
      }
      localStorage.setItem("sourceX", sourceX);
      localStorage.setItem("sourceY", sourceY);
      var destWidth = myImg.width - ratioWidth;
      var destHeight = myImg.height - ratioHeight;
      var sourceWidth = myImg.width - destWidth;
      var sourceHeight = myImg.height - destHeight;
      var destX = canvas.width / 2 - destWidth / 2;
      var destY = canvas.height / 2 - destHeight / 2;

      //functionality for drawing preview image on pop up
      $(".previewTrigger").unbind("click").click(function () {
          importStylesheet("head", "/styles/overlayScreen.css");
          //appendTemplateToElement("body", "/templates/imageAnnotation.html");
          // Add image annotation template to body
          appendTemplateToElement(
            "body",
            "/templates/imageAnnotation.html",
            (error, data) => {
              if (error) {
                console.error(
                  "Error appending image annotation template:",
                  error
                );
              } else {
                console.log(
                  "Image annotation template appended in renderImage:",
                  data
                );
                // Add any dependent logic specific to the image annotation here
                $("#imageAnnotation").width(ratioWidth + 10);
                $("#imageAnnotation").height(ratioHeight + 40);
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
                var annotationCanvas =
                  document.getElementById("annotationCanvas");
                ctx = annotationCanvas.getContext("2d");
                ctx.drawImage(myImg, 0, 0, ratioWidth, ratioHeight);
                console.log("image drawn");

                $("#undoDraw")
                  .unbind("click")
                  .click(function () {
                    var drawnOnURL = history.undo(annotationCanvas, ctx);
                    localStorage.setItem("currImgURL", drawnOnURL);
                  });

                $("#redoDraw")
                  .unbind("click")
                  .click(function () {
                    var drawnOnURL = history.redo(annotationCanvas, ctx);
                    localStorage.setItem("currImgURL", drawnOnURL);
                  });

                $("#backLargePreview")
                  .unbind("click")
                  .click(function () {
                    $("#imageAnnotation").remove();
                  });
                $("#closeLargePreview")
                  .unbind("click")
                  .click(function () {
                    $("#imageAnnotation").remove();
                    var drawnOnURL = history.saveState(annotationCanvas);
                    localStorage.setItem("currImgURL", drawnOnURL);

                    var smallerImg = document.getElementById("previewImage");
                    var oldWidth = myImg.width;
                    var oldHeight = myImg.height;
                    smallerImg.src = drawnOnURL;
                    context.clearRect(0, 0, 465, 150);
                    if (oldHeight > smallerImg.height) {
                      var sx = (sourceX * smallerImg.width) / oldWidth;
                      var sy = (sourceY * smallerImg.height) / oldHeight;
                      localStorage.setItem("sx", sx);
                      localStorage.setItem("sy", sy);
                      context.drawImage(
                        myImg,
                        sx,
                        sy,
                        smallerImg.width,
                        smallerImg.height,
                        0,
                        0,
                        (ratioWidth * 9) / 10,
                        (ratioHeight * 9) / 10
                      );
                    } else {
                      var sx = localStorage.getItem("sx");
                      var sy = localStorage.getItem("sy");
                      context.drawImage(
                        myImg,
                        sx,
                        sy,
                        smallerImg.width,
                        smallerImg.height,
                        0,
                        0,
                        (ratioWidth * 9) / 10,
                        (ratioHeight * 9) / 10
                      );
                    }
                  });
              }
            }
          );
        });

      var sx = localStorage.getItem("sx");
      var sy = localStorage.getItem("sy");
      if (sx && sy) {
        context.drawImage(
          myImg,
          0,
          0,
          myImg.width,
          myImg.height,
          0,
          0,
          (previewWidth * 9) / 10,
          (previewHeight * 9) / 10
        );
      } else {
        myImg.onload = function () {
          context.drawImage(myImg, 0, 0, previewWidth, previewHeight);
        };
      }
    }
  });
}
