if ("undefined" == typeof(cardbookTypes)) {
	var cardbookTypes = {
		
		validateTypes: function () {
			var data = document.getElementById('prefWeightTextBox').value;
			var dummy = data.replace(/[0-9]*/g, "");
			if (data == "") {
				return true;
			} else if (dummy == "") {
				if (data >=1 && data <= 100) {
					return true;
				}
			}
			var strBundle = document.getElementById("cardbook-strings");
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
			var prefWeightTitle = strBundle.getString("prefWeightTitle");
			var prefWeightMsg = strBundle.getFormattedString("prefWeightMsg", [data]);
			prompts.alert(null, prefWeightTitle, prefWeightMsg);
			return false;
		},

		changePrefWeight: function () {
			if (document.getElementById('prefCheckbox').checked) {
				document.getElementById('prefWeightTextBox').value = "";
				document.getElementById('prefWeightTextBox').disabled = true;
			} else {
				document.getElementById('prefWeightTextBox').disabled = false;
			}
		},

		enableOrDisablePrefWeight: function (aCardVersion) {
			var aPrefWeightBox = document.getElementById('prefWeightTextBox');
			var aPrefWeightLabel = document.getElementById('prefWeightLabel');
			if (aCardVersion === "3.0") {
				aPrefWeightBox.setAttribute('hidden', 'true');
				aPrefWeightLabel.setAttribute('hidden', 'true');
			} else {
				aPrefWeightBox.removeAttribute('hidden');
				aPrefWeightLabel.removeAttribute('hidden');
			}
		},

		getParsedTypes: function (aType, aPgName) {
			var aListBox = document.getElementById(aType + 'TypesListbox');
			var myOutputTypes = [];
			var myOutputPg = [];
			var myOutputPgName = "";
		
			for (var i=0; i<aListBox.itemCount; i++) {
				var aItem = aListBox.getItemAtIndex(i);
				var aItemChecked = aItem.getAttribute('checked');
				aItemChecked = typeof aItemChecked == "boolean" ? aItemChecked : (aItemChecked == 'true' ? true : false);
				if (aItemChecked) {
					var aTypeValue = aItem.getAttribute('value');
					switch (aTypeValue.toUpperCase()) {
						case "OTHER":
						case "WORK":
						case "CELL":
						case "VOICE":
						case "FAX":
						case "HOME":
							myOutputTypes.push(aTypeValue);
							break;
						default:
							if (aPgName != null && aPgName !== undefined && aPgName != "") {
								if (myOutputPg.length === 0) {
									myOutputPg.push(aTypeValue);
									myOutputPgName = aPgName;
								} else {
									myOutputTypes.push(aTypeValue);
								}
							} else {
								myOutputTypes.push(aTypeValue);
							}
					}
				}
			}

			var aPrefBox = document.getElementById('prefCheckbox');
			if (aPrefBox.checked) {
				var aPrefWeightBoxValue = document.getElementById('prefWeightTextBox').value;
				if (aPrefWeightBoxValue != null && aPrefWeightBoxValue !== undefined && aPrefWeightBoxValue != "") {
					myOutputTypes.push("PREF=" + aPrefWeightBoxValue);
				} else {
					myOutputTypes.push("PREF");
				}
			}
			
			return { "types":myOutputTypes, "pgName":myOutputPgName, "pgValue":myOutputPg };
		},

		loadTypes: function (aType, aInputTypes, aPgName, aPgType, aCardVersion) {
			var aListBox = document.getElementById(aType + 'TypesListbox');
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService();
			var myPrefTypes = [];
			myPrefTypes = cardbookPrefService.getAllTypesByType(aType);
			var myInputTypes = [];
			myInputTypes = cardbookUtils.notNull(aPgType, aInputTypes);
			
			for (var i = 0; i < myPrefTypes.length; i++) {
				if (myPrefTypes[i].toLowerCase() !== "pref") {
					var aItem = aListBox.appendItem(myPrefTypes[i], myPrefTypes[i]);
					aItem.setAttribute('type', 'checkbox');
					aItem.setAttribute('checked', false);
					for (var j = 0; j < myInputTypes.length; j++) {
						if (myInputTypes[j].toLowerCase() == myPrefTypes[i].toLowerCase()) {
							aItem.setAttribute('checked', true);
							break;
						}
					}
				}
			}
			
			var aPrefBox = document.getElementById('prefCheckbox');
			var aPrefWeightBox = document.getElementById('prefWeightTextBox');
			aPrefBox.setAttribute('checked', cardbookUtils.getPrefBooleanFromTypes(aInputTypes));
			aPrefWeightBox.setAttribute('value', cardbookUtils.getPrefValueFromTypes(aInputTypes, aCardVersion));
			if (!(aPrefBox.checked)) {
				aPrefWeightBox.value = "";
				aPrefWeightBox.disabled = true;
			}

			cardbookTypes.enableOrDisablePrefWeight(aCardVersion);
		}

	};

};