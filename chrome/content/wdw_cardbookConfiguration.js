if ("undefined" == typeof(wdw_cardbookConfiguration)) {
	var wdw_cardbookConfiguration = {

		allTypes: {},
		
		validateABForType: function (aType) {
			var aListBox = document.getElementById(aType + 'Listbox');
			var aList = [];

			for (var i=0; i<aListBox.itemCount; i++) {
				var aItem = aListBox.getItemAtIndex(i);
				var aItemChecked = aItem.getAttribute('checked');
				aItemChecked = typeof aItemChecked == "boolean" ? aItemChecked : (aItemChecked == 'true' ? true : false);
				if (aItemChecked) {
					aList.push(aItem.getAttribute('value'));
				}
			}

			var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			str.data = aList.join(',');
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			prefs.setComplexValue('extensions.cardbook.' + aType, Components.interfaces.nsISupportsString, str);
		},

		displayABForType: function (aType) {
			var aListBox = document.getElementById(aType + 'Listbox');
			var aPref = document.getElementById('extensions.cardbook.' + aType);

			var sortedAddressBooks = [];
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][6]) {
					sortedAddressBooks.push([cardbookRepository.cardbookAccounts[i][0], cardbookRepository.cardbookAccounts[i][4]]);
				}
			}
			sortedAddressBooks = sortedAddressBooks.sort(function(a,b) {
				return a[0].localeCompare(b[0], 'en', {'sensitivity': 'base'});
			});

			for (var i = 0; i < sortedAddressBooks.length; i++) {
				var aItem = aListBox.appendItem(sortedAddressBooks[i][0], sortedAddressBooks[i][1]);
				aItem.setAttribute('type', 'checkbox');
				if (aPref.value.indexOf(sortedAddressBooks[i][1]) >= 0) {
					aItem.setAttribute('checked', true);
				} else {
					aItem.setAttribute('checked', false);
				}
			}
		},
		
		//needed for linux
		addAcceptButton: function(e) {
			var buttonAccept = document.documentElement.getButton('accept');
			buttonAccept.hidden = false;
			buttonAccept.disabled = false;
		},

		refreshListBoxTypes: function (aType) {
			var myListBox = document.getElementById('typesListbox');
			var count = myListBox.itemCount;
			while(count-- > 0){
				myListBox.removeItemAt(0);
			}
			
			if (wdw_cardbookConfiguration.allTypes[aType] != null && wdw_cardbookConfiguration.allTypes[aType] !== undefined && wdw_cardbookConfiguration.allTypes[aType] != "") {
				var aArray = [];
				var aArray = wdw_cardbookConfiguration.allTypes[aType];
				// aArray = cardbookRepository.arrayUnique(aArray);
				aArray = aArray.sort(function(a,b) {
					return a[0].localeCompare(b[0], 'en', {'sensitivity': 'base'});
				});
				for (var i = 0; i < aArray.length; i++) {
					var aItem = myListBox.appendItem(aArray[i], aArray[i]);
				}
			}
		},

		loadCustoms: function () {
			for (var i in cardbookRepository.customFields) {
				document.getElementById(cardbookRepository.customFields[i] + 'Name').value = cardbookRepository.customFieldsValue[cardbookRepository.customFields[i]];
				document.getElementById(cardbookRepository.customFields[i] + 'Label').value = cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]];
			}
		},
		
		loadTypes: function () {
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService();
			wdw_cardbookConfiguration.allTypes = cardbookPrefService.getAllTypes();
		},
		
		displayTypes: function () {
			var type = document.getElementById('typesCategoryRadiogroup').selectedItem.value;
			wdw_cardbookConfiguration.refreshListBoxTypes(type);
		},
		
		addType: function () {
			var type = document.getElementById('typesCategoryRadiogroup').selectedItem.value;
			var myListBox = document.getElementById('typesListbox');
			var myArgs = {type: "", typeAction: ""};
			var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookConfigurationTypes.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
			if (myArgs.typeAction == "SAVE") {
				wdw_cardbookConfiguration.allTypes[type] = [];
				for (var i = 0; i < myListBox.itemCount; i++) {
					wdw_cardbookConfiguration.allTypes[type].push(myListBox.getItemAtIndex(i).getAttribute("value"));
				}
				wdw_cardbookConfiguration.allTypes[type].push(myArgs.type);
				wdw_cardbookConfiguration.refreshListBoxTypes(type);
			}
		},
		
		renameType: function () {
			var type = document.getElementById('typesCategoryRadiogroup').selectedItem.value;
			var myListBox = document.getElementById('typesListbox');
			if (myListBox.selectedIndex == -1) {
				return;
			} else {
				var myItem = myListBox.getSelectedItem(0);
				var myArgs = {type: myItem.getAttribute("value"),
									typeAction: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookConfigurationTypes.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.typeAction == "SAVE") {
					wdw_cardbookConfiguration.allTypes[type] = [];
					for (let i = 0; i < myListBox.itemCount; i++) {
						if (i === myListBox.selectedIndex) {
							wdw_cardbookConfiguration.allTypes[type].push(myArgs.type);
						} else {
							wdw_cardbookConfiguration.allTypes[type].push(myListBox.getItemAtIndex(i).getAttribute("value"));
						}
					}
					wdw_cardbookConfiguration.refreshListBoxTypes(type);
				}
			}
		},
		
		deleteType: function () {
			var type = document.getElementById('typesCategoryRadiogroup').selectedItem.value;
			var myListBox = document.getElementById('typesListbox');
			if (myListBox.selectedIndex == -1) {
				return;
			} else {
				wdw_cardbookConfiguration.allTypes[type] = [];
				for (let i = 0; i < myListBox.itemCount; i++) {
					if (i !== myListBox.selectedIndex) {
						wdw_cardbookConfiguration.allTypes[type].push(myListBox.getItemAtIndex(i).getAttribute("value"));
					}
				}
				wdw_cardbookConfiguration.refreshListBoxTypes(type);
			}
		},
		
		validateTypes: function () {
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService();
			cardbookPrefService.delTypes();
			for (var i in wdw_cardbookConfiguration.allTypes) {
				for (var j = 0; j < wdw_cardbookConfiguration.allTypes[i].length; j++) {
					cardbookPrefService.setTypes(i, j, wdw_cardbookConfiguration.allTypes[i][j]);
				}
			}
		},

		loadPeriodicSync: function () {
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var autoSync = prefs.getBoolPref("extensions.cardbook.autoSync");
			if (!(autoSync)) {
				document.getElementById('autoSyncInterval').disabled = true;
				document.getElementById('autoSyncIntervalTextBox').disabled = true;
			}
		},

		validateCustomFieldName: function (aValue) {
			var strBundle = document.getElementById("cardbook-strings");
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
			var customFieldsErrorTitle = strBundle.getString("customFieldsError");
			if (aValue.toUpperCase() !== aValue) {
				var customFieldsErrorMsg = strBundle.getFormattedString("customFieldsErrorUPPERCASE", [aValue]);
				prompts.alert(null, customFieldsErrorTitle, customFieldsErrorMsg);
				return false;
			} else if (!(aValue.toUpperCase().startsWith("X-"))) {
				var customFieldsErrorMsg = strBundle.getFormattedString("customFieldsErrorX", [aValue]);
				prompts.alert(null, customFieldsErrorTitle, customFieldsErrorMsg);
				return false;
			} else if (aValue.toUpperCase() === "X-THUNDERBIRD-ETAG") {
				var customFieldsErrorMsg = strBundle.getFormattedString("customFieldsErrorETAG", [aValue]);
				prompts.alert(null, customFieldsErrorTitle, customFieldsErrorMsg);
				return false;
			} else if (aValue.indexOf(":") >= 1 || aValue.indexOf(",") >= 1 || aValue.indexOf(";") >= 1 || aValue.indexOf(".") >= 1) {
				var customFieldsErrorMsg = strBundle.getFormattedString("customFieldsErrorCHAR", [aValue]);
				prompts.alert(null, customFieldsErrorTitle, customFieldsErrorMsg);
				return false;
			}
			return true;
		},
		
		validateUniqueCustomFieldName: function (aList) {
			if (cardbookUtils.cleanArray(aList).length !== cardbookUtils.cleanArray(cardbookRepository.arrayUnique(aList)).length) {
				var strBundle = document.getElementById("cardbook-strings");
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
				var customFieldsErrorTitle = strBundle.getString("customFieldsError");
				var customFieldsErrorMsg = strBundle.getString("customFieldsErrorUNIQUE");
				prompts.alert(null, customFieldsErrorTitle, customFieldsErrorMsg);
				return false;
			}
			return true;
		},
		
		validateCustoms: function () {
			var allcustomFieldNames = [];
			for (var i in cardbookRepository.customFields) {
				var name = document.getElementById(cardbookRepository.customFields[i] + 'Name');
				var nameValue = name.value;
				var label = document.getElementById(cardbookRepository.customFields[i] + 'Label');
				var labelValue = label.value;
				allcustomFieldNames.push(nameValue);
				if (nameValue != null && nameValue !== undefined && nameValue != "") {
					if (wdw_cardbookConfiguration.validateCustomFieldName(nameValue)) {
						if (!(labelValue != null && labelValue !== undefined && labelValue != "")) {
							var strBundle = document.getElementById("cardbook-strings");
							var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
							var customFieldsErrorTitle = strBundle.getString("customFieldsError");
							var customFieldsErrorMsg = strBundle.getString("customFieldsErrorLABEL");
							prompts.alert(null, customFieldsErrorTitle, customFieldsErrorMsg);
							return false;
						}
					} else {
						return false;
					}
				}
			}
			var customLists = ['kindCustom', 'memberCustom'];
			for (var i in customLists) {
				var nameValue = document.getElementById(customLists[i] + 'TextBox').value;
				allcustomFieldNames.push(nameValue);
				if (!(wdw_cardbookConfiguration.validateCustomFieldName(nameValue))) {
					return false;
				}
			}
			if (!(wdw_cardbookConfiguration.validateUniqueCustomFieldName(allcustomFieldNames))) {
				return false;
			}
			wdw_cardbookConfiguration.setCustoms();
			return true;
		},
		
		setCustoms: function () {
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService();
			cardbookPrefService.delCustoms();
			for (var i in cardbookRepository.customFields) {
				var name = document.getElementById(cardbookRepository.customFields[i] + 'Name');
				var nameValue = name.value;
				var label = document.getElementById(cardbookRepository.customFields[i] + 'Label');
				var labelValue = label.value;
				if (nameValue != null && nameValue !== undefined && nameValue != "") {
					cardbookPrefService.setCustoms(cardbookRepository.customFields[i], nameValue + ":" + labelValue);
					cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]] = labelValue;
				} else {
					cardbookPrefService.setCustoms(cardbookRepository.customFields[i], "");
					cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]] = "";
				}
				cardbookRepository.customFieldsValue[cardbookRepository.customFields[i]] = nameValue;
			}
		},
		
		validateStatusInformationLineNumber: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			if (document.getElementById('statusInformationLineNumberTextBox').value < 10) {
				document.getElementById('statusInformationLineNumberTextBox').value = 10;
			}
			while (cardbookRepository.statusInformation.length > document.getElementById('statusInformationLineNumberTextBox').value) {
				cardbookRepository.statusInformation.splice(0,1);
			}
		},

		showautoSyncInterval: function () {
			if (document.getElementById('autoSyncCheckBox').checked) {
				document.getElementById('autoSyncInterval').disabled = true;
				document.getElementById('autoSyncIntervalTextBox').disabled = true;
			} else {
				document.getElementById('autoSyncInterval').disabled = false;
				document.getElementById('autoSyncIntervalTextBox').disabled = false;
			}
		},

		load: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			wdw_cardbookConfiguration.addAcceptButton();
			wdw_cardbookConfiguration.loadTypes();
			wdw_cardbookConfiguration.displayTypes();
			wdw_cardbookConfiguration.loadPeriodicSync();
			wdw_cardbookConfiguration.loadCustoms();
			wdw_cardbookConfiguration.displayABForType("emailsCollection");
		},
		
		accept: function () {
			wdw_cardbookConfiguration.validateStatusInformationLineNumber();
			wdw_cardbookConfiguration.validateTypes();
			wdw_cardbookConfiguration.validateABForType("emailsCollection");
			if (!(wdw_cardbookConfiguration.validateCustoms())) {
				// don't work
				// return false;
				throw "Cardbook validation error";
			}
			cardbookRepository.validateLook(document.getElementById('defaultLookCheckBox').checked);
		},
		
		cancel: function () {
			close();
		}
	};
};