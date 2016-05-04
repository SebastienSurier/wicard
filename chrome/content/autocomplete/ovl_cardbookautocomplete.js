Components.utils.import("chrome://cardbook/content/cardbookRepository.js");

function changeAutoComplete() {
	let done = false;
	let i = 1;
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	var autocompletion = prefs.getBoolPref("extensions.cardbook.autocompletion");
	if (autocompletion) {
		while (!done) {
			let textbox = document.getElementById(autocompleteWidgetPrefix + "#" + i);
			if (textbox) {
				let acValue = textbox.getAttribute("autocompletesearch");
				if (acValue && acValue.length > 0) {
					acValue = acValue.replace(/(^| )addrbook($| )/, "$1addrbook-cardbook$2");
					textbox.setAttribute("autocompletesearch", acValue);
					textbox.setAttribute("showCommentColumn", "true");
					textbox.showCommentColumn = true;
				}
				i++;
			} else {
				done = true;
			}
		}
	}
}

window.addEventListener("load", changeAutoComplete, false);
