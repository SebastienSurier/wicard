if ("undefined" == typeof(wdw_quickCreation)) {
	var wdw_quickCreation = {
		
		loadVersion: function () {
			var myRadiogroup = document.getElementById("cardCreationVersionRadiogroup");
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			myRadiogroup.value = prefs.getComplexValue("extensions.cardbook.cardCreationVersion", Components.interfaces.nsISupportsString).data;
		},
				
		loadAddressBooks: function (aAddressBookId) {
			var myPopup = document.getElementById("addressbookMenupopup");
			while (myPopup.hasChildNodes()) {
				myPopup.removeChild(myPopup.firstChild);
			}
			var j = 0;
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][6]) {
					var menuItem = document.createElement("menuitem");
					menuItem.setAttribute("label", cardbookRepository.cardbookAccounts[i][0]);
					menuItem.setAttribute("value", cardbookRepository.cardbookAccounts[i][4]);
					myPopup.appendChild(menuItem);
					if (cardbookRepository.cardbookAccounts[i][4] == aAddressBookId) {
						document.getElementById("addressbookMenulist").selectedIndex = j;
					}
					j++;
				}
			}
		},
				
		loadContacts: function () {
			var myPopup = document.getElementById("contactMenupopup");
			var myAddressBookId = document.getElementById('addressbookMenulist').selectedItem.value;
			while (myPopup.hasChildNodes()) {
				myPopup.removeChild(myPopup.firstChild);
			}
			var mySortedContacts = [];
			for (var i = 0; i < cardbookRepository.cardbookDisplayCards[myAddressBookId].length; i++) {
				var myCard = cardbookRepository.cardbookDisplayCards[myAddressBookId][i]
				mySortedContacts.push([myCard.fn, myCard.uid]);
			}
			mySortedContacts = mySortedContacts.sort(function(a,b) {
				return a[0].localeCompare(b[0], 'en', {'sensitivity': 'base'});
			});
			var menuItem = document.createElement("menuitem");
			menuItem.setAttribute("label", "");
			menuItem.setAttribute("value", "");
			myPopup.appendChild(menuItem);
			document.getElementById("contactMenulist").selectedIndex = 0;
			for (var i = 0; i < mySortedContacts.length; i++) {
				var menuItem = document.createElement("menuitem");
				menuItem.setAttribute("label", mySortedContacts[i][0]);
				menuItem.setAttribute("value", mySortedContacts[i][1]);
				myPopup.appendChild(menuItem);
			}
		},
				
		changeVersion: function () {
			var myVersion = document.getElementById('cardCreationVersionRadiogroup').value;
			cardbookTypes.enableOrDisablePrefWeight(myVersion);
		},
				
		changeAddressbook: function () {
			wdw_quickCreation.loadContacts();
			var myAddressBookId = document.getElementById('addressbookMenulist').selectedItem.value;
			wdw_categoriesEdition.loadCategories(myAddressBookId, []);
		},
				
		changeContact: function () {
			var myContactId = document.getElementById('contactMenulist').selectedItem.value;
			if (myContactId != null && myContactId !== undefined && myContactId != "") {
				document.getElementById('versionGroupbox').setAttribute('hidden', 'true');
				document.getElementById('categoriesGroupbox').setAttribute('hidden', 'true');
				document.getElementById('contactGroupbox').setAttribute('hidden', 'true');
				document.getElementById('orgGroupbox').setAttribute('hidden', 'true');
			} else {
				document.getElementById('versionGroupbox').setAttribute('hidden', 'false');
				document.getElementById('categoriesGroupbox').setAttribute('hidden', 'false');
				document.getElementById('contactGroupbox').setAttribute('hidden', 'false');
				document.getElementById('orgGroupbox').setAttribute('hidden', 'false');
			}
		},

		load: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			wdw_quickCreation.loadAddressBooks(window.arguments[0].dirPrefId);
			wdw_quickCreation.loadContacts();
			wdw_quickCreation.loadVersion();
			cardbookTypes.loadTypes("email", [], "", [], document.getElementById('cardCreationVersionRadiogroup').value);

			var myAddressBookId = document.getElementById('addressbookMenulist').selectedItem.value;
			wdw_categoriesEdition.loadCategories(myAddressBookId, []);
			
			wdw_nameEdition.displayCustoms();
			wdw_orgEdition.displayCustoms();
			
			document.getElementById('fnTextBox').value = window.arguments[0].fn;
			document.getElementById('emailValueTextBox').value = window.arguments[0].email;
		},

		save: function () {
			if (cardbookTypes.validateTypes()) {
				window.arguments[0].dirPrefId = document.getElementById('addressbookMenulist').selectedItem.value;
				window.arguments[0].uid = document.getElementById('contactMenulist').selectedItem.value;
				window.arguments[0].categories = wdw_categoriesEdition.getCategories();
				window.arguments[0].version = document.getElementById('cardCreationVersionRadiogroup').value;
				
				window.arguments[0].fn = document.getElementById('fnTextBox').value;
				window.arguments[0].lastname = document.getElementById('lastnameTextBox').value;
				window.arguments[0].firstname = document.getElementById('firstnameTextBox').value;
				window.arguments[0].othername = document.getElementById('othernameTextBox').value;
				window.arguments[0].suffixname = document.getElementById('suffixnameTextBox').value;
				window.arguments[0].prefixname = document.getElementById('prefixnameTextBox').value;
				window.arguments[0].nickname = document.getElementById('nicknameTextBox').value;
				window.arguments[0].customField1NameTextBox = document.getElementById('customField1NameTextBox').value;
				window.arguments[0].customField2NameTextBox = document.getElementById('customField2NameTextBox').value;
				
				window.arguments[0].org = document.getElementById('orgTextBox').value;
				window.arguments[0].title = document.getElementById('titleTextBox').value;
				window.arguments[0].role = document.getElementById('roleTextBox').value;
				window.arguments[0].customField1OrgTextBox = document.getElementById('customField1OrgTextBox').value;
				window.arguments[0].customField2OrgTextBox = document.getElementById('customField2OrgTextBox').value;

				window.arguments[0].emailLine[0][0] = document.getElementById('emailValueTextBox').value;
				var parsedTypes = cardbookTypes.getParsedTypes("email", window.arguments[0].emailLine[2]);
				window.arguments[0].emailLine[1] = parsedTypes.types;
				window.arguments[0].emailLine[2] = parsedTypes.pgName;
				window.arguments[0].emailLine[3] = parsedTypes.pgValue;
				window.arguments[0].quickCreationAction="SAVE";

				close();
			}
		},

		cancel: function () {
			window.arguments[0].quickCreationAction="CANCEL";
			close();
		}

	};

};