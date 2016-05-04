if ("undefined" == typeof(ovl_cardbookAddContacts)) {
	var ovl_cardbookAddContacts = {
		hideOldAddressbook: function () {
			document.getElementById("addToAddressBookItem").setAttribute("hidden", true);
			document.getElementById("editContactItem").setAttribute("hidden", true);
			document.getElementById("viewContactItem").setAttribute("hidden", true);
		},
		
		hideOrShowNewAddressbook: function (aValue) {
			if (aValue) {
				document.getElementById("addToCardbookMenu").setAttribute("hidden", true);
			} else {
				document.getElementById("addToCardbookMenu").removeAttribute("hidden");
			}
		}
		
	};
};

// for the contact menu popup
// setupEmailAddressPopup
(function() {
	// Keep a reference to the original function.
	var _original = setupEmailAddressPopup;
	
	// Override a function.
	setupEmailAddressPopup = function() {
		// Execute original function.
		var rv = _original.apply(null, arguments);
		
		// Execute some action afterwards.
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		var exclusive = prefs.getBoolPref("extensions.cardbook.exclusive");
		if (exclusive) {
			ovl_cardbookAddContacts.hideOldAddressbook();
		}
		ovl_cardbookAddContacts.hideOrShowNewAddressbook((arguments[0].getAttribute("hascard") == "true"));
		
		// return the original result
		return rv;
	};

})();
