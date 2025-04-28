/*
 * File Name: persona.js
 * Functions: loadPersona
 * Description: This file contains code to display persona info in the slider
 */

/*
 * Function: loadPersona
 * Description: This function loads the persona's image, description, and tooltips from their template
 * Params: personaName - the persona chosen by the user
 */

function loadPersona(personaName) {
    const facets = ["M", "IPS", "SE", "R", "T"];
    const personas = {
        Abi: {
            template: "./templates/Abi/abiPersona.html",
            imageSrc: "images/abimulti.png",
            imageId: "AbiPhoto",
            imageAlt: "Abi Jones",
            toolTipPrefix: "abi"
        },
        Tim: {
            template: "./templates/Tim/timPersona.html",
            imageSrc: "images/Timmulti.png",
            imageId: "TimPhoto",
            imageAlt: "Tim Hopkins",
            toolTipPrefix: "tim"
        },
        Pat: {
            template: "./templates/pat/patPersona.html",
            imageSrc: "images/Patmulti.png",
            imageId: "patPhoto",
            imageAlt: "Pat Jones",
            toolTipPrefix: "pat"
        },
        Custom: {
            template: "./templates/custom/custom.html"
        }
    };

    const persona = personas[personaName];
    if (!persona) {
        console.error("Unknown persona:", personaName);
        return;
    }

    appendTemplateToElement(sidebarBody().find("#personaInfo"), persona.template, function (error) {
        if (error) {
            console.error(`Error loading ${personaName} template:`, error);
            return;
        }

        if (persona.imageSrc) {
            const imgSrc = chrome.runtime.getURL(persona.imageSrc);
            const imgHTML = `<img id='${persona.imageId}' src='${imgSrc}' alt='${persona.imageAlt}' class='sidebarImg' width='100' height='100'/>`;
            sidebarBody().find("#picGoesHere").append(imgHTML);
        }

        if (persona.toolTipPrefix) {
            facets.forEach(facet => {
                const triggerClass = `${persona.toolTipPrefix}${facet}Trigger`;
                const toolTipId = `${persona.toolTipPrefix}${facet}ToolTip`;
                sidebarBody().find(`.${triggerClass}`).unbind("click").click(function () {
                    addToolTip(toolTipId, personaName);
                });
            });
        }
    });
}

