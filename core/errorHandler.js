(function (root) {
    var ERROR_MODAL_ID = "genderMagErrorModal";
    var ERROR_BACKDROP_ID = "genderMagErrorBackdrop";
    var ERROR_STYLES_ID = "genderMagErrorStyles";
    var globalHandlersRegistered = false;
    var lastShownSignature = "";
    var lastShownAt = 0;

    function getCurrentExtensionContext() {
        var state = typeof getSessionState === "function" ? getSessionState() : null;

        return {
            currentStep: state && state.currentStep ? state.currentStep : null,
            currentSubgoalId: state && state.currentSubgoalId !== undefined ? state.currentSubgoalId : null,
            currentActionId: state && state.currentActionId !== undefined ? state.currentActionId : null
        };
    }

    function serializeForDisplay(value, depth, seen) {
        var currentDepth = typeof depth === "number" ? depth : 0;
        var seenValues = seen || [];

        if (value === null || value === undefined) {
            return value;
        }

        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            return value;
        }

        if (value instanceof Error) {
            return {
                name: value.name,
                message: value.message,
                stack: value.stack || null
            };
        }

        if (typeof value === "function") {
            return "[Function]";
        }

        if (typeof value !== "object") {
            return String(value);
        }

        if (currentDepth >= 3) {
            return "[MaxDepth]";
        }

        if (seenValues.indexOf(value) >= 0) {
            return "[Circular]";
        }

        seenValues.push(value);

        if (Array.isArray(value)) {
            var serializedArray = value.slice(0, 20).map(function (item) {
                return serializeForDisplay(item, currentDepth + 1, seenValues);
            });
            seenValues.pop();
            return serializedArray;
        }

        var serializedObject = {};
        Object.keys(value).slice(0, 30).forEach(function (key) {
            try {
                serializedObject[key] = serializeForDisplay(value[key], currentDepth + 1, seenValues);
            } catch (error) {
                serializedObject[key] = "[Unserializable]";
            }
        });
        seenValues.pop();
        return serializedObject;
    }

    function normalizeTechnicalError(error) {
        if (!error) {
            return null;
        }

        if (error instanceof Error) {
            return {
                name: error.name,
                message: error.message,
                stack: error.stack || null
            };
        }

        if (typeof error === "string") {
            return {
                name: "Error",
                message: error,
                stack: null
            };
        }

        if (error && typeof error.message === "string") {
            return {
                name: error.name || "Error",
                message: error.message,
                stack: error.stack || null
            };
        }

        return serializeForDisplay(error, 0, []);
    }

    function buildExtensionErrorEntry(options) {
        var config = options || {};
        var manifest = typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getManifest
            ? chrome.runtime.getManifest()
            : null;

        return {
            timestamp: new Date().toISOString(),
            code: config.code || "UNEXPECTED_EXTENSION_ERROR",
            source: config.source || "unknown",
            userMessage: config.userMessage || "Something went wrong in the extension.",
            technicalMessage: config.technicalMessage || "",
            technicalError: normalizeTechnicalError(config.error),
            details: serializeForDisplay(config.details || {}, 0, []),
            context: getCurrentExtensionContext(),
            extensionVersion: manifest && manifest.version ? manifest.version : null
        };
    }

    function ensureErrorDialogStyles() {
        if (typeof document === "undefined") {
            return;
        }

        if (document.getElementById(ERROR_STYLES_ID)) {
            return;
        }

        var style = document.createElement("style");
        style.id = ERROR_STYLES_ID;
        style.textContent = [
            "#" + ERROR_BACKDROP_ID + " {",
            "  position: fixed;",
            "  inset: 0;",
            "  background: rgba(0, 0, 0, 0.45);",
            "  z-index: 2147483646;",
            "  display: flex;",
            "  align-items: center;",
            "  justify-content: center;",
            "  padding: 24px;",
            "  box-sizing: border-box;",
            "}",
            "#" + ERROR_MODAL_ID + " {",
            "  width: min(720px, 100%);",
            "  max-height: min(80vh, 760px);",
            "  overflow: auto;",
            "  background: #ffffff;",
            "  color: #111111;",
            "  border: 3px solid #4A96AD;",
            "  border-radius: 8px;",
            "  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);",
            "  font-family: Arial, Helvetica, sans-serif;",
            "}",
            "#" + ERROR_MODAL_ID + " * {",
            "  box-sizing: border-box;",
            "  font-family: inherit;",
            "}",
            "#" + ERROR_MODAL_ID + " header {",
            "  padding: 16px 20px;",
            "  background: #4A96AD;",
            "  color: #ffffff;",
            "}",
            "#" + ERROR_MODAL_ID + " h2 {",
            "  margin: 0;",
            "  font-size: 20px;",
            "}",
            "#" + ERROR_MODAL_ID + " .gm-error-body {",
            "  padding: 18px 20px 20px;",
            "}",
            "#" + ERROR_MODAL_ID + " .gm-error-summary {",
            "  margin: 0 0 12px;",
            "  line-height: 1.5;",
            "}",
            "#" + ERROR_MODAL_ID + " .gm-error-next-steps {",
            "  margin: 0 0 14px;",
            "  padding-left: 18px;",
            "}",
            "#" + ERROR_MODAL_ID + " .gm-error-next-steps li {",
            "  margin-bottom: 6px;",
            "}",
            "#" + ERROR_MODAL_ID + " .gm-error-meta {",
            "  margin: 0 0 14px;",
            "  padding: 12px;",
            "  background: #f5f8fa;",
            "  border-radius: 6px;",
            "  line-height: 1.5;",
            "}",
            "#" + ERROR_MODAL_ID + " .gm-error-meta strong {",
            "  display: inline-block;",
            "  min-width: 132px;",
            "}",
            "#" + ERROR_MODAL_ID + " textarea {",
            "  width: 100%;",
            "  min-height: 220px;",
            "  resize: vertical;",
            "  padding: 12px;",
            "  border: 1px solid #b9c4cc;",
            "  border-radius: 6px;",
            "  background: #fcfcfc;",
            "  color: #111111;",
            "  line-height: 1.4;",
            "}",
            "#" + ERROR_MODAL_ID + " .gm-error-actions {",
            "  margin-top: 16px;",
            "  display: flex;",
            "  gap: 10px;",
            "  justify-content: flex-end;",
            "  flex-wrap: wrap;",
            "}",
            "#" + ERROR_MODAL_ID + " button {",
            "  min-width: 120px;",
            "  min-height: 34px;",
            "  padding: 0 14px;",
            "  border: none;",
            "  border-radius: 5px;",
            "  background: #7D1935;",
            "  color: #ffffff;",
            "  cursor: pointer;",
            "}",
            "#" + ERROR_MODAL_ID + " button.gm-error-secondary {",
            "  background: #4A96AD;",
            "}",
            "#" + ERROR_MODAL_ID + " .gm-error-copy-status {",
            "  margin-top: 10px;",
            "  color: #0b5e39;",
            "  min-height: 18px;",
            "}",
            "@media (max-width: 700px) {",
            "  #" + ERROR_BACKDROP_ID + " { padding: 12px; }",
            "  #" + ERROR_MODAL_ID + " .gm-error-body { padding: 14px; }",
            "}"
        ].join("\n");

        (document.head || document.documentElement).appendChild(style);
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function buildErrorReportText(entry) {
        var lines = [];
        lines.push("GenderMag Recorder's Assistant Error Report");
        lines.push("------------------------------------------");
        lines.push("Time: " + (entry.timestamp || ""));
        lines.push("Error Code: " + (entry.code || ""));
        lines.push("Source: " + (entry.source || ""));
        lines.push("Extension Version: " + (entry.extensionVersion || "unknown"));
        lines.push("Current Step: " + (entry.context && entry.context.currentStep ? entry.context.currentStep : "unknown"));
        lines.push("Current Subgoal: " + (entry.context && entry.context.currentSubgoalId !== null ? entry.context.currentSubgoalId : "n/a"));
        lines.push("Current Action: " + (entry.context && entry.context.currentActionId !== null ? entry.context.currentActionId : "n/a"));
        lines.push("");
        lines.push("User Message:");
        lines.push(entry.userMessage || "");
        lines.push("");
        lines.push("Technical Message:");
        lines.push(entry.technicalMessage || "");
        lines.push("");
        lines.push("Technical Error:");
        lines.push(JSON.stringify(entry.technicalError || {}, null, 2));
        lines.push("");
        lines.push("Additional Details:");
        lines.push(JSON.stringify(entry.details || {}, null, 2));
        lines.push("");
        lines.push("Suggested report:");
        lines.push("Please include what you were doing when this happened, and attach or paste this error report into your GitHub issue or bug report.");
        return lines.join("\n");
    }

    function copyTextToClipboard(text, textarea) {
        if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }

        return new Promise(function (resolve, reject) {
            try {
                if (!textarea) {
                    reject(new Error("No textarea available for fallback copy."));
                    return;
                }

                textarea.focus();
                textarea.select();
                var succeeded = document.execCommand("copy");
                if (!succeeded) {
                    reject(new Error("Copy command was not successful."));
                    return;
                }

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    function hideExtensionError() {
        if (typeof document === "undefined") {
            return;
        }

        var backdrop = document.getElementById(ERROR_BACKDROP_ID);
        if (backdrop) {
            backdrop.remove();
        }
    }

    function showExtensionError(entry) {
        if (typeof document === "undefined") {
            return entry;
        }

        var signature = [entry.code || "", entry.source || "", entry.technicalMessage || ""].join("|");
        var now = Date.now();
        if (signature === lastShownSignature && now - lastShownAt < 1500) {
            return entry;
        }
        lastShownSignature = signature;
        lastShownAt = now;

        ensureErrorDialogStyles();
        hideExtensionError();

        var reportText = buildErrorReportText(entry);
        var backdrop = document.createElement("div");
        backdrop.id = ERROR_BACKDROP_ID;
        backdrop.innerHTML = [
            "<div id=\"", ERROR_MODAL_ID, "\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"gmErrorTitle\">",
            "<header><h2 id=\"gmErrorTitle\">GenderMag Extension Error</h2></header>",
            "<div class=\"gm-error-body\">",
            "<p class=\"gm-error-summary\">", escapeHtml(entry.userMessage || "Something went wrong in the extension."), "</p>",
            "<ul class=\"gm-error-next-steps\">",
            "<li>Try the action again if it makes sense for your task.</li>",
            "<li>If the extension still fails, refresh the page and restart the current step.</li>",
            "<li>Copy the details below and include them in a GitHub issue or send them directly to the team.</li>",
            "</ul>",
            "<div class=\"gm-error-meta\">",
            "<div><strong>Error code:</strong> ", escapeHtml(entry.code || "UNEXPECTED_EXTENSION_ERROR"), "</div>",
            "<div><strong>Where it failed:</strong> ", escapeHtml(entry.source || "unknown"), "</div>",
            "<div><strong>Current step:</strong> ", escapeHtml(entry.context && entry.context.currentStep ? entry.context.currentStep : "unknown"), "</div>",
            "</div>",
            "<textarea id=\"gmErrorReportText\" readonly></textarea>",
            "<div class=\"gm-error-actions\">",
            "<button type=\"button\" class=\"gm-error-secondary\" id=\"gmCopyErrorReport\">Copy details</button>",
            "<button type=\"button\" id=\"gmCloseErrorReport\">Close</button>",
            "</div>",
            "<div class=\"gm-error-copy-status\" id=\"gmErrorCopyStatus\"></div>",
            "</div>",
            "</div>"
        ].join("");

        var host = document.body || document.documentElement;
        host.appendChild(backdrop);

        var textarea = document.getElementById("gmErrorReportText");
        var copyStatus = document.getElementById("gmErrorCopyStatus");
        textarea.value = reportText;

        document.getElementById("gmCloseErrorReport").addEventListener("click", function () {
            hideExtensionError();
        });

        backdrop.addEventListener("click", function (event) {
            if (event.target === backdrop) {
                hideExtensionError();
            }
        });

        document.getElementById("gmCopyErrorReport").addEventListener("click", function () {
            copyTextToClipboard(reportText, textarea)
                .then(function () {
                    copyStatus.textContent = "Error details copied. You can paste them into a GitHub issue or bug report.";
                })
                .catch(function () {
                    copyStatus.textContent = "Select the text above and copy it manually if the automatic copy did not work.";
                    textarea.focus();
                    textarea.select();
                });
        });

        return entry;
    }

    function reportExtensionError(options) {
        var entry = buildExtensionErrorEntry(options);
        return showExtensionError(entry);
    }

    function registerGlobalErrorHandlers() {
        if (globalHandlersRegistered) {
            return;
        }

        globalHandlersRegistered = true;

        if (typeof window !== "undefined" && window.addEventListener) {
            window.addEventListener("error", function (event) {
                if (event && event.filename && String(event.filename).indexOf("errorHandler.js") >= 0) {
                    return;
                }

                reportExtensionError({
                    code: "UNCAUGHT_EXTENSION_ERROR",
                    source: "window",
                    userMessage: "The extension ran into an unexpected error.",
                    technicalMessage: event && event.message ? event.message : "Unexpected window error",
                    error: event && event.error ? event.error : event && event.message,
                    details: {
                        filename: event && event.filename ? event.filename : null,
                        line: event && event.lineno ? event.lineno : null,
                        column: event && event.colno ? event.colno : null
                    }
                });
            }, true);

            window.addEventListener("unhandledrejection", function (event) {
                reportExtensionError({
                    code: "UNHANDLED_EXTENSION_REJECTION",
                    source: "window",
                    userMessage: "The extension ran into an unexpected background task failure.",
                    technicalMessage: "Unhandled promise rejection in extension code.",
                    error: event && event.reason ? event.reason : "Unhandled promise rejection"
                });
            });

            if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
                chrome.runtime.onMessage.addListener(function (request) {
                    if (request && request.type === "gm:extensionError" && request.payload) {
                        reportExtensionError(request.payload);
                    }
                });
            }
        }
    }

    root.reportExtensionError = reportExtensionError;
    root.hideExtensionError = hideExtensionError;

    registerGlobalErrorHandlers();
})(typeof globalThis !== "undefined" ? globalThis : this);
