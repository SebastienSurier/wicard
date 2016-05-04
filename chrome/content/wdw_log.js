if ("undefined" == typeof(wdw_cardbooklog)) {
	var wdw_cardbooklog = {

		getTime: function() {
			var objToday = new Date();
			var year = objToday.getFullYear();
			var month = ("0" + (objToday.getMonth() + 1)).slice(-2);
			var day = ("0" + objToday.getDate()).slice(-2);
			var hour = ("0" + objToday.getHours()).slice(-2);
			var min = ("0" + objToday.getMinutes()).slice(-2);
			var sec = ("0" + objToday.getSeconds()).slice(-2);
			var msec = ("00" + objToday.getMilliseconds()).slice(-3);
			return year + "." + month + "." + day + " " + hour + ":" + min + ":" + sec + ":" + msec;
		},

		updateStatusProgressInformation: function(aLogLine) {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var statusInformationLength = prefs.getComplexValue("extensions.cardbook.statusInformationLineNumber", Components.interfaces.nsISupportsString).data;
			
			if (cardbookRepository.statusInformation.length >= statusInformationLength) {
				cardbookRepository.statusInformation.shift();
			}
			cardbookRepository.statusInformation.push(wdw_cardbooklog.getTime() + " : " + aLogLine);
			// var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
			// consoleService.logStringMessage(wdw_cardbooklog.getTime() + " : " + aLogLine);
		},

		updateStatusProgressInformationWithDebug1: function(aLogLine, aResponse) {
			if (aResponse) {
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var debugMode = prefs.getBoolPref("extensions.cardbook.debugMode");
				if (debugMode) {
					wdw_cardbooklog.updateStatusProgressInformation(aLogLine + aResponse.toSource());
				}
			}
		},

		updateStatusProgressInformationWithDebug2: function(aLogLine) {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var debugMode = prefs.getBoolPref("extensions.cardbook.debugMode");
			if (debugMode) {
				wdw_cardbooklog.updateStatusProgressInformation(aLogLine);
			}
		}

	}
};