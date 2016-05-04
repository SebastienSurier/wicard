if ("undefined" == typeof(ovl_lightning)) {
	var ovl_lightning = {
		
		initialized : false,

		onLoad: function() {
			try {
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var cardbookAutocompletion = prefs.getBoolPref("extensions.cardbook.autocompletion");
				if (cardbookAutocompletion) {
					document.getElementById("attendeeCol3#1").setAttribute('autocompletesearch', 'addrbook-cardbook');
				} else {
					document.getElementById("attendeeCol3#1").setAttribute('autocompletesearch', 'addrbook ldap');
				}
			} catch(e) {
				document.getElementById("attendeeCol3#1").setAttribute('autocompletesearch', 'addrbook ldap');
			};
		}

	}
};
window.addEventListener("load", function(e) { ovl_lightning.onLoad(e); }, false);
