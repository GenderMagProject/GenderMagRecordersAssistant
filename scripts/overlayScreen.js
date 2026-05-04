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
  console.log("Received renderImage call with URL:", request.imageUrl);
  if (request.callFunction === "renderImage") {
    renderImage(request.imageUrl);
  }
});

function updateScreenshotSessionState(mutatorFn, context) {
  if (typeof updateSessionState === "function") {
    return updateSessionState(mutatorFn, context);
  }
  return null;
}

function getOverlaySessionState() {
  if (typeof getSessionState === "function") {
    return getSessionState();
  }
  return null;
}

function getOverlayScreenshotState() {
  var sessionState = getOverlaySessionState();
  var draftScreenshot = sessionState && sessionState.draftAction && sessionState.draftAction.screenshot
    ? sessionState.draftAction.screenshot
    : null;
  var sessionScreenshot = sessionState && sessionState.screenshot ? sessionState.screenshot : null;

  return {
    imageUrl:
      (draftScreenshot && draftScreenshot.imageUrl) ||
      (sessionScreenshot && sessionScreenshot.imageUrl) ||
      localStorage.getItem("currImgURL") ||
      "",
    sourceX: Number(
      draftScreenshot && draftScreenshot.sourceX !== undefined
        ? draftScreenshot.sourceX
        : (sessionScreenshot && sessionScreenshot.sourceX !== undefined
          ? sessionScreenshot.sourceX
          : localStorage.getItem("sourceX"))
    ) || 0,
    sourceY: Number(
      draftScreenshot && draftScreenshot.sourceY !== undefined
        ? draftScreenshot.sourceY
        : (sessionScreenshot && sessionScreenshot.sourceY !== undefined
          ? sessionScreenshot.sourceY
          : localStorage.getItem("sourceY"))
    ) || 0
  };
}

function getOverlayActionName() {
  if (typeof getSessionCurrentActionName === "function") {
    var currentActionName = getSessionCurrentActionName();
    if (currentActionName) {
      return currentActionName;
    }
  }

  return localStorage.getItem("currActionName") || "";
}

function syncPreviewImageState(imageUrl, context) {
  if (!imageUrl) {
    return;
  }

  if (typeof updateScreenshotSessionState === "function") {
    updateScreenshotSessionState(function (state) {
      state.screenshot.imageUrl = imageUrl;
      if (state.draftAction && state.draftAction.screenshot) {
        state.draftAction.screenshot.imageUrl = imageUrl;
      }
    }, context);
    return;
  }

  localStorage.setItem("currImgURL", imageUrl);
}

function syncPreviewOffsetState(sourceX, sourceY, context) {
  if (typeof updateScreenshotSessionState === "function") {
    updateScreenshotSessionState(function (state) {
      state.screenshot.sourceX = sourceX;
      state.screenshot.sourceY = sourceY;
      if (state.draftAction && state.draftAction.screenshot) {
        state.draftAction.screenshot.sourceX = sourceX;
        state.draftAction.screenshot.sourceY = sourceY;
      }
    }, context);
    return;
  }

  localStorage.setItem("sourceX", sourceX);
  localStorage.setItem("sourceY", sourceY);
}

/*
 * Function: overlayScreen
 * Description: This function contains the functionality for taking the screen capture and creating the pop up window
 *   with the canvas that displays the image.
 * Params: onlyDraw - tells whether to go straight to drawing the pop up ("onlyToolTip")
 *   or to take the screenshot first ("")
 */
function overlayScreen(onlyDraw, onToolTipReady) {
  //If skipping screenshot and loading tooltip window from local storage
  closeSlider();
  console.log("check onlyDraw value in overlayScreen func:", onlyDraw);
  console.log("Slider is closed now, loading tooltip window from local storage");
  sidebarBody().find("#nukeStatus").show();
  const canvasContainer = getOrCreateCanvasContainer();
  ensureHighlightBoxesExist(canvasContainer);
  const genderMagCanvas = getOrCreateCanvas(canvasContainer);
  const drawingState = {
    ctx : genderMagCanvas.getContext("2d"),
    rect: {},
    drag: false,
    screenshotFlag: onlyDraw === "onlyToolTip" ? undefined : true
  };

  if (onlyDraw === "onlyToolTip") {
  setHighlightBoxesVisible(false);
  loadToolTipUI(drawingState, onToolTipReady);
  } else {
    setHighlightBoxesVisible(true);
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
function loadToolTipUI(drawingState, onToolTipReady) {
  const toolTip = createToolTipElement();
  console.log("ToolTip created in loadToolTipUI:", toolTip);
  appendTemplateToElement(toolTip,"./templates/action.html", (error, data) => {
    if (error) {
      console.error("Error appending action template:", error);
    } else {
      //add button functionality
      console.log("Action template appended in loadToolTipUI:", data);
      setupToolTipButtonHandlers(toolTip);
      updateActionNameUI();
      const {
        canvas: previewCanvas,
        context: previewCtx,
        myImg,
        ratioWidth,
        ratioHeight
      } = prepareCanvasPreview();
      var canContainer = document.getElementById("genderMagCanvasContainer");
      var sourceY = canContainer.offsetTop;
      var sourceX = canContainer.offsetLeft;
      setupDrawOnImageLogic(myImg, ratioWidth, ratioHeight, sourceX, sourceY, previewCtx);
      if (typeof onToolTipReady === "function") {
        onToolTipReady(toolTip);
      }
    }
  }
 );
}
function createToolTipElement() {
  if (typeof ensureFloatingUiBaseStyles === "function") {
    ensureFloatingUiBaseStyles();
  }
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
  $("#myToolTip").draggable();
  return toolTip;
}

function setupToolTipButtonHandlers(toolTip) {
  $(toolTip).find(".closeToolTip").off("click").on("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    updateScreenshotSessionState(function (state) {
      state.currentStep = "preActionQuestions";
      if (state.draftAction) {
        state.draftAction.status = "screenshotCaptured";
      }
    }, "Accepted screenshot preview and moved to pre-action questions.");
    preActionQuestions(toolTip);
  });

  $(toolTip).find("#retakeImage").off("click").on("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toolTip.remove();
    updateScreenshotSessionState(function (state) {
      state.currentStep = "actionPrompt";
      state.screenshot.imageUrl = "";
      state.screenshot.sourceX = 0;
      state.screenshot.sourceY = 0;
      if (state.draftAction) {
        state.draftAction.screenshot = {
          imageUrl: "",
          sourceX: 0,
          sourceY: 0
        };
        state.draftAction.status = "named";
      }
    }, "Retaking screenshot and clearing preview state.");
    overlayScreen();
    overlayScreen();
  });

  $(toolTip).find("#exitButton").off("click").on("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    justExit("popup");
  });

  $(toolTip).find("#imageBack").off("click").on("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toolTip.remove();
    document.getElementById("genderMagCanvasContainer").style.display = "none";
    openSlider();
  });
}


function updateActionNameUI() {
  const actionSpan = getOverlayActionName();
  $(".actionNameSpan").html("Action: " + actionSpan);
}

function whenPreviewImageReady(img, onReady) {
  if (!img) {
    return;
  }

  if (img.complete && (img.naturalWidth || img.width)) {
    onReady(img);
    return;
  }

  const handleLoad = function () {
    img.removeEventListener("load", handleLoad);
    onReady(img);
  };

  img.addEventListener("load", handleLoad);
}

function redrawPreviewCanvasFromCurrentImage(img, context, previewWidth, previewHeight) {
  whenPreviewImageReady(img, function () {
    context.clearRect(0, 0, previewWidth, previewHeight);
    context.drawImage(img, 0, 0, previewWidth, previewHeight);
  });
}

function setCurrentPreviewImage(img, context, imageUrl, previewWidth, previewHeight) {
  if (!img || !context || !imageUrl) {
    return;
  }

  syncPreviewImageState(imageUrl, "Updated screenshot preview image source.");
  img.src = imageUrl;
  redrawPreviewCanvasFromCurrentImage(img, context, previewWidth, previewHeight);
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
  var screenshotState = getOverlayScreenshotState();
  var imgURL = screenshotState.imageUrl;
  if (imgURL) {
    myImg.src = imgURL;
  } else {
    myImg.removeAttribute("src");
  }
  var previewHeight = 350;
  var previewWidth = 465;
  var imageWidth = myImg.naturalWidth || myImg.width || 1920;
  var imageHeight = myImg.naturalHeight || myImg.height || 742;
  var imageRatio = imageWidth / imageHeight;
  var ratioHeight = imageHeight * 0.75;
  var ratioWidth = imageRatio * ratioHeight;

  function drawPreviewImage() {
    context.clearRect(0, 0, previewWidth, previewHeight);
    context.drawImage(myImg, 0, 0, previewWidth, previewHeight);
  }

  whenPreviewImageReady(myImg, drawPreviewImage);
  return { canvas, context, myImg, ratioWidth, ratioHeight };
}

function setupDrawOnImageLogic(myImg, ratioWidth, ratioHeight, sourceX, sourceY, canvasCtx ) {
  //Functionality when 'draw on image' button is clicked
  $(".previewTrigger").unbind("click").click(function () {
    if (typeof ensureFloatingUiBaseStyles === "function") {
      ensureFloatingUiBaseStyles();
    }
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
        var drawCtx = annotationCanvas.getContext("2d");

        function drawOnCanvas(canvas) {
          var $myCanvas = $(canvas);
          var $offset = $myCanvas.offset();
          var lineWidth = 2;
          var lineColor = "#FF0000";
          var isMouseDown = false;
          var pos = { x: 0, y: 0 };
          var lastPos = { x: 0, y: 0 };

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

          $myCanvas.off("mousedown mouseup mousemove");

          $myCanvas.on("mousedown", function (e) {
            $offset = $myCanvas.offset();
            e.stopPropagation();
            isMouseDown = true;
            history.saveState($myCanvas[0]);
          });

          $myCanvas.on("mouseup", function () {
            $offset = $myCanvas.offset();
            isMouseDown = false;
          });

          $myCanvas.on("mousemove", function (e) {
            lastPos.x = pos.x;
            lastPos.y = pos.y;
            pos.x = e.pageX - $offset.left;
            pos.y = e.pageY - $offset.top;

            if (isMouseDown) {
              paintLine(
                lastPos.x,
                lastPos.y,
                pos.x,
                pos.y,
                lineWidth,
                lineColor
              );
            }
          });
        }

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

        drawOnCanvas("#annotationCanvas");
        whenPreviewImageReady(myImg, function () {
          drawCtx.clearRect(0, 0, ratioWidth, ratioHeight);
          drawCtx.drawImage(myImg, 0, 0, ratioWidth, ratioHeight);
        });

        //set button functionality on drawing pop up
        $("#undoDraw").unbind("click").click(function () {
            var drawnOnURL = history.undo(annotationCanvas, drawCtx);
            if (drawnOnURL) {
              syncPreviewImageState(drawnOnURL, "Updated screenshot preview after annotation undo.");
            }
          });

        $("#redoDraw").unbind("click").click(function () {
            var drawnOnURL = history.redo(annotationCanvas, drawCtx);
            if (drawnOnURL) {
              syncPreviewImageState(drawnOnURL, "Updated screenshot preview after annotation redo.");
            }
          });

        $("#backLargePreview").unbind("click").click(function () {
            $("#imageAnnotation").remove();
          });

        // Save the annotated image and return to the screenshot preview.
        $("#closeLargePreview").unbind("click").click(function () {
            $("#imageAnnotation").remove();
            var drawnOnURL = history.saveState(annotationCanvas);
            setCurrentPreviewImage(myImg, canvasCtx, drawnOnURL, 465, 350);
            updateScreenshotSessionState(function (state) {
              state.screenshot.imageUrl = drawnOnURL;
              if (state.draftAction && state.draftAction.screenshot) {
                state.draftAction.screenshot.imageUrl = drawnOnURL;
              }
            }, "Updated screenshot preview after annotation.");
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
//Helper function to ensure highlight boxes visually track the region user is selecting in the canvas container
function ensureHighlightBoxesExist(container) {
  console.log("Ensuring highlight boxes exist in container:", container);
  if (!document.getElementById("highlightHover")) {
    const hoverBox = document.createElement("div");
    hoverBox.id = "highlightHover";
    Object.assign(hoverBox.style, {
      position: "absolute",
      border: "6px solid #7D1935",
      width: "100px",
      height: "50px",
      opacity: "1",
      zIndex: "100000",
      display: "none"
    });
    container.appendChild(hoverBox);
  }

  if (!document.getElementById("highlightBorder2")) {
    const borderBox = document.createElement("div");
    borderBox.id = "highlightBorder2";
    Object.assign(borderBox.style, {
      position: "absolute",
      border: "3px solid #FFFFFF",
      width: "100px",
      height: "50px",
      opacity: "1",
      zIndex: "100001",
      display: "none"
    });
    container.appendChild(borderBox);
  }
}

function setHighlightBoxesVisible(isVisible) {
  const displayValue = isVisible ? "block" : "none";
  const hoverBox = document.getElementById("highlightHover");
  const borderBox = document.getElementById("highlightBorder2");

  if (hoverBox) {
    hoverBox.style.display = displayValue;
  }

  if (borderBox) {
    borderBox.style.display = displayValue;
  }
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

// Compute and store screenshot offset based on user's highlighted element.
// These offsets help position the captured image preview later in renderImage().
// In the original version, this was done in renderImage(), but now moved here for better modularity and DOM context availability.

  let sourceX = 0;
  let sourceY = 0;

  if (elm?.offsetLeft > 90) sourceX = elm.offsetLeft - 90;
  if (elm?.offsetTop > 60)  sourceY = elm.offsetTop - 60;

  syncPreviewOffsetState(sourceX, sourceY, "Stored screenshot source offsets.");

  elements.forEach((el) => {
    if (["genderMagCanvas", "genderMagCanvasContainer", "highlightHover", "highlightBorder2"].includes(el.id)) {
      el.style.display = "default";
    }
  });

  chrome.runtime.sendMessage({ greeting: "takeScreenShot" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Screenshot error:", chrome.runtime.lastError);
    } else if (response?.status === "success") {
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
  if (imgURL) {
    updateScreenshotSessionState(function (state) {
      var screenshotState = getOverlayScreenshotState();
      var sourceX = screenshotState.sourceX;
      var sourceY = screenshotState.sourceY;
      state.currentStep = "screenshotPreview";
      state.screenshot.imageUrl = imgURL;
      state.screenshot.sourceX = sourceX;
      state.screenshot.sourceY = sourceY;

      if (state.draftAction) {
        state.draftAction.screenshot = {
          imageUrl: imgURL,
          sourceX: sourceX,
          sourceY: sourceY
        };
        state.draftAction.status = "screenshotPreview";
      }
    }, "Stored screenshot preview in sessionState from renderImage.");
  }

  //create div, add style, append to body
  var toolTip = document.createElement("div");
  toolTip.id = "myToolTip";
  if (typeof ensureFloatingUiBaseStyles === "function") {
    ensureFloatingUiBaseStyles();
  }
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
          updateScreenshotSessionState(function (state) {
            state.currentStep = "preActionQuestions";
            if (state.draftAction) {
              state.draftAction.status = "screenshotCaptured";
            }
          }, "Accepted screenshot preview and moved to pre-action questions.");
          preActionQuestions(toolTip);
        });
      $("#retakeImage")
        .unbind("click")
        .click(function () {
          toolTip.remove();
          updateScreenshotSessionState(function (state) {
            state.currentStep = "actionPrompt";
            state.screenshot.imageUrl = "";
            state.screenshot.sourceX = 0;
            state.screenshot.sourceY = 0;
            if (state.draftAction) {
              state.draftAction.screenshot = {
                imageUrl: "",
                sourceX: 0,
                sourceY: 0
              };
              state.draftAction.status = "named";
            }
          }, "Retaking screenshot and clearing preview state.");
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
      var actionSpan = getOverlayActionName();
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
          syncPreviewImageState(drawnOnURL, "Saved annotation baseline in sessionState.");
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
        myImg.src = getOverlayScreenshotState().imageUrl || "";
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
      
      // Retrieve screenshot offset (set during onMouseUp) to align preview correctly.
      // This replaces older logic that directly accessed `elm.offsetTop/Left`.

      const screenshotState = getOverlayScreenshotState();
      const sourceX = screenshotState.sourceX;
      const sourceY = screenshotState.sourceY;

      var destWidth = myImg.width - ratioWidth;
      var destHeight = myImg.height - ratioHeight;
      var sourceWidth = myImg.width - destWidth;
      var sourceHeight = myImg.height - destHeight;
      var destX = canvas.width / 2 - destWidth / 2;
      var destY = canvas.height / 2 - destHeight / 2;

      //functionality for drawing preview image on pop up
      $(".previewTrigger").unbind("click").click(function () {
          if (typeof ensureFloatingUiBaseStyles === "function") {
            ensureFloatingUiBaseStyles();
          }
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
                    syncPreviewImageState(drawnOnURL, "Updated screenshot preview after annotation undo.");
                  });

                $("#redoDraw")
                  .unbind("click")
                  .click(function () {
                    var drawnOnURL = history.redo(annotationCanvas, ctx);
                    syncPreviewImageState(drawnOnURL, "Updated screenshot preview after annotation redo.");
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
                    setCurrentPreviewImage(myImg, context, drawnOnURL, previewWidth, previewHeight);
                    syncPreviewImageState(drawnOnURL, "Updated screenshot preview after closing annotation.");
                  });
              }
            }
          );
        });

      whenPreviewImageReady(myImg, function () {
        context.clearRect(0, 0, previewWidth, previewHeight);
        context.drawImage(myImg, 0, 0, previewWidth, previewHeight);
      });
    }
  });
}
