if ("undefined" == typeof(wdw_cardbook)) {
	var wdw_cardbook = {

		cardbookeditadrs : [],
		cardbookeditemails : [],
		cardbookedittels : [],
		cardbookeditimpps : [],
		cardbookediturls : [],
		cardbookeditn : [],
		cardbookeditcategories : [],
		cardbookeditlists : {},
		cardbookeditphoto : {},
		cardbookeditlogo : {},
		cardbookeditsound : {},
		cardbookeditorg : "",

		cardbookrefresh : false,

		sortAccounts: function() {
			var myTree = document.getElementById('accountsOrCatsTree');
			
			// get Account selected for categories
			var mySelectedIndex = myTree.currentIndex;
			if (mySelectedIndex !== -1) {
				var myAccountId = myTree.view.getCellText(mySelectedIndex, {id: "accountId"});
			} else {
				var myAccountId = myTree.view.getCellText(0, {id: "accountId"});
			}

			// collect open container
			var listOfOpenedContainer = [];			
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][2]) {
					listOfOpenedContainer.push(cardbookRepository.cardbookAccounts[i][4]);
				}
			}

			// close opened container
			for (var i = 0; i < listOfOpenedContainer.length; i++) {
				var treeIndex = cardbookUtils.getPositionOfAccountId(listOfOpenedContainer[i]);
				if (treeIndex != -1)  {
					myTree.view.toggleOpenState(treeIndex);
				}
			}
			
			// sort accounts
			cardbookRepository.cardbookAccounts = cardbookRepository.cardbookAccounts.sort(function(a,b) {
				return a[0].localeCompare(b[0], 'en', {'sensitivity': 'base'});
			});
			// open opened containers
			for (var i = 0; i < listOfOpenedContainer.length; i++) {
				var treeIndex = cardbookUtils.getPositionOfAccountId(listOfOpenedContainer[i]);
				if (treeIndex != -1)  {
					myTree.view.toggleOpenState(treeIndex);
				}
			}
			
			//  select back category
			if (mySelectedIndex !== -1 && myAccountId.indexOf("::") >= 0) {
				wdw_cardbook.selectAccountOrCat(myAccountId);
			}
		},
		
		removeAccountFromWindow: function() {
			try {
				var myTree = document.getElementById('accountsOrCatsTree');
				var myParentIndex = myTree.view.getParentIndex(myTree.currentIndex);
				if (myParentIndex == -1) {
					myParentAccountId = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
					myParentAccountName = myTree.view.getCellText(myTree.currentIndex, {id: "accountName"});
					myParentAccountType = myTree.view.getCellText(myTree.currentIndex, {id: "accountType"});
				} else {
					myParentAccountId = myTree.view.getCellText(myParentIndex, {id: "accountId"});
					myParentAccountName = myTree.view.getCellText(myParentIndex, {id: "accountName"});
					myParentAccountType = myTree.view.getCellText(myParentIndex, {id: "accountType"});
				}

				cardbookRepository.removeAccountFromRepository(myParentAccountId);

				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				let cardbookPrefService = new cardbookPreferenceService(myParentAccountId);
				cardbookPrefService.delBranch();
				
				wdw_cardbook.windowControlShowing();

				wdw_cardbook.refreshWindow(myParentAccountId, "", "REMOVE");
				cardbookUtils.formatStringForOutput("addressbookClosed", [myParentAccountName]);
				wdw_cardbook.loadCssRules();
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.removeAccountFromWindow error : " + e);
			}
		},
		
		addAccountToWindow: function(aAccountId, aAccountName, aAccountType, aAccountUrl, aAccountUser, aColor, aEnabled, aExpanded) {
			try {
				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				let cardbookPrefService = new cardbookPreferenceService(aAccountId);
				cardbookPrefService.setId(aAccountId);
				cardbookPrefService.setName(aAccountName);
				cardbookPrefService.setType(aAccountType);
				cardbookPrefService.setUrl(aAccountUrl);
				cardbookPrefService.setUser(aAccountUser);
				cardbookPrefService.setColor(aColor);
				cardbookPrefService.setEnabled(aEnabled);
				cardbookPrefService.setExpanded(aExpanded);

				cardbookRepository.addAccountToRepository(aAccountId, aAccountName, aAccountType, aEnabled, aExpanded);
				wdw_cardbook.windowControlShowing();

				wdw_cardbook.refreshWindow(aAccountId, "", "ADD");
				cardbookUtils.formatStringForOutput("addressbookCreated", [aAccountName]);
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.addAccountToWindow error : " + e);
			}
		},

   	loadFirstWindow: function () {
		wdw_cardbook.validateButtons();
		wdw_cardbook.setSyncControl();
		wdw_cardbook.setNoSearchMode();
		wdw_cardbook.clearCard();
		wdw_cardbook.clearAccountOrCat();
		wdw_cardbook.loadCssRules();
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		var defaultLook = prefs.getBoolPref("extensions.cardbook.defaultLook");
		cardbookRepository.validateLook(defaultLook);
		window.setTimeout(function() { wdw_cardbook.refreshAccountsInDirTree(); }, 1000);
	},

		syncAccounts: function () {
			wdw_cardbook.setNoSearchMode();

			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService();
			var result = [];
			result = cardbookPrefService.getAllPrefIds();
			for (let i = 0; i < result.length; i++) {
				var myPrefId = result[i];
				var cardbookPrefService1 = new cardbookPreferenceService(myPrefId);
				var myPrefName = cardbookPrefService1.getName();
				var myPrefType = cardbookPrefService1.getType();
				if (myPrefType !== "FILE") {
					cardbookSynchronization.initSync(myPrefId);
					wdw_cardbook.windowControlShowing();
					cardbookSynchronization.syncAccount(myPrefId);
				}
			}
		},

		syncAccountFromAccountsOrCats: function () {
			try {
				var myTree = document.getElementById('accountsOrCatsTree');
				var myPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
				var myPrefName = cardbookUtils.getPrefNameFromPrefId(myPrefId);
				
				cardbookSynchronization.initSync(myPrefId);
				wdw_cardbook.windowControlShowing();
				cardbookSynchronization.syncAccount(myPrefId);
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.syncAccountFromAccountsOrCats error : " + e);
			}
		},

		displayAccountOrCat: function (aCardList) {
			var accountsOrCatsTreeView = {
				rowCount: aCardList.length,
				isContainer: function(row) { return false },
				cycleHeader: function(idx) { return false },
				getRowProperties: function(row) { return cardbookRepository.cardbookSearchMode + " " + aCardList[row].dirPrefId },
				getCellText: function(row,column){
					if (column.id == "dispn") return aCardList[row].dispn;
					else if (column.id == "lastname") return aCardList[row].lastname;
					else if (column.id == "firstname") return aCardList[row].firstname;
					else if (column.id == "othername") return aCardList[row].othername;
					else if (column.id == "prefixname") return aCardList[row].prefixname;
					else if (column.id == "suffixname") return aCardList[row].suffixname;
					else if (column.id == "fn") return aCardList[row].fn;
					else if (column.id == "nickname") return aCardList[row].nickname;
					else if (column.id == "bday") return aCardList[row].bday;
					else if (column.id == "dispadr") return aCardList[row].dispadr;
					else if (column.id == "disphomeadr") return aCardList[row].disphomeadr;
					else if (column.id == "dispworkadr") return aCardList[row].dispworkadr;
					else if (column.id == "disptel") return aCardList[row].disptel;
					else if (column.id == "disphometel") return aCardList[row].disphometel;
					else if (column.id == "dispworktel") return aCardList[row].dispworktel;
					else if (column.id == "dispcelltel") return aCardList[row].dispcelltel;
					else if (column.id == "dispemail") return aCardList[row].dispemail;
					else if (column.id == "disphomeemail") return aCardList[row].disphomeemail;
					else if (column.id == "dispworkemail") return aCardList[row].dispworkemail;
					else if (column.id == "mailer") return aCardList[row].mailer;
					else if (column.id == "tz") return aCardList[row].tz;
					else if (column.id == "geo") return aCardList[row].geo;
					else if (column.id == "title") return aCardList[row].title;
					else if (column.id == "role") return aCardList[row].role;
					else if (column.id == "org") return aCardList[row].org;
					else if (column.id == "categories") return aCardList[row].categories;
					else if (column.id == "note") return aCardList[row].note;
					else if (column.id == "prodid") return aCardList[row].prodid;
					else if (column.id == "sortstring") return aCardList[row].sortstring;
					else if (column.id == "uid") return aCardList[row].uid;
					else if (column.id == "dispurl") return aCardList[row].dispurl;
					else if (column.id == "version") return aCardList[row].version;
					else if (column.id == "class1") return aCardList[row].class1;
					else if (column.id == "dispimpp") return aCardList[row].dispimpp;
					else if (column.id == "dirPrefId") return aCardList[row].dirPrefId;
					else if (column.id == "kind") return aCardList[row].kind;
					else if (column.id == "rev") return aCardList[row].rev;
					else if (column.id == "cardurl") return aCardList[row].cardurl;
					else if (column.id == "etag") return aCardList[row].etag;
				}
			}
			document.getElementById('cardsTree').view = accountsOrCatsTreeView;
		},

		displayAddresses: function (aVersion) {
			var addressTreeView = {
				rowCount: wdw_cardbook.cardbookeditadrs.length,
				isContainer: function(idx) { return false },
				cycleHeader: function(idx) { return false },
				isEditable: function(idx, column) { return false },
				getCellText: function(idx, column) {
					if (column.id == "addressPrefWeight") return cardbookUtils.getPrefValueFromTypes(wdw_cardbook.cardbookeditadrs[idx][1], aVersion);
					else if (column.id == "addressType") return cardbookUtils.getTypesFromTypes(wdw_cardbook.cardbookeditadrs[idx][3], wdw_cardbook.cardbookeditadrs[idx][1]);
					else if (column.id == "postOffice") return wdw_cardbook.cardbookeditadrs[idx][0][0];
					else if (column.id == "extendedAddr") return wdw_cardbook.cardbookeditadrs[idx][0][1];
					else if (column.id == "street") return wdw_cardbook.cardbookeditadrs[idx][0][2];
					else if (column.id == "locality") return wdw_cardbook.cardbookeditadrs[idx][0][3];
					else if (column.id == "region") return wdw_cardbook.cardbookeditadrs[idx][0][4];
					else if (column.id == "postalCode") return wdw_cardbook.cardbookeditadrs[idx][0][5];
					else if (column.id == "country") return wdw_cardbook.cardbookeditadrs[idx][0][6];
				},
				getCellValue: function(idx, column) {
					if (column.id == "addressPref") return cardbookUtils.getPrefBooleanFromTypes(wdw_cardbook.cardbookeditadrs[idx][1]);
				}
			}
			document.getElementById('addressTree').view = addressTreeView;
		},

		displayTels: function (aVersion) {
			var telTreeView = {
				rowCount: wdw_cardbook.cardbookedittels.length,
				isContainer: function(idx) { return false },
				cycleHeader: function(idx) { return false },
				isEditable: function(idx, column) { return false },
				getCellText: function(idx, column) {
					if (column.id == "telPrefWeight") return cardbookUtils.getPrefValueFromTypes(wdw_cardbook.cardbookedittels[idx][1], aVersion);
					else if (column.id == "telType") return cardbookUtils.getTypesFromTypes(wdw_cardbook.cardbookedittels[idx][3], wdw_cardbook.cardbookedittels[idx][1]);
					else if (column.id == "telValue") return wdw_cardbook.cardbookedittels[idx][0][0];
				},
				getCellValue: function(idx, column) {
					if (column.id == "telPref") return cardbookUtils.getPrefBooleanFromTypes(wdw_cardbook.cardbookedittels[idx][1]);
				}
			}
			document.getElementById('telTree').view = telTreeView;
		},

		displayEmails: function (aVersion) {
			var emailTreeView = {
				rowCount: wdw_cardbook.cardbookeditemails.length,
				isContainer: function(idx) { return false },
				cycleHeader: function(idx) { return false },
				isEditable: function(idx, column) { return false },
				getCellText: function(idx, column) {
					if (column.id == "emailPrefWeight") return cardbookUtils.getPrefValueFromTypes(wdw_cardbook.cardbookeditemails[idx][1], aVersion);
					else if (column.id == "emailType") return cardbookUtils.getTypesFromTypes(wdw_cardbook.cardbookeditemails[idx][3], wdw_cardbook.cardbookeditemails[idx][1]);
					else if (column.id == "emailValue") return wdw_cardbook.cardbookeditemails[idx][0][0];
				},
				getCellValue: function(idx, column) {
					if (column.id == "emailPref") return cardbookUtils.getPrefBooleanFromTypes(wdw_cardbook.cardbookeditemails[idx][1]);
				}
			}
			document.getElementById('emailTree').view = emailTreeView;
		},

		displayImpps: function (aVersion) {
			var imppTreeView = {
				rowCount: wdw_cardbook.cardbookeditimpps.length,
				isContainer: function(idx) { return false },
				cycleHeader: function(idx) { return false },
				isEditable: function(idx, column) { return false },
				getCellText: function(idx, column) {
					if (column.id == "imppPrefWeight") return cardbookUtils.getPrefValueFromTypes(wdw_cardbook.cardbookeditimpps[idx][1], aVersion);
					else if (column.id == "imppType") return cardbookUtils.getTypesFromTypes(wdw_cardbook.cardbookeditimpps[idx][3], wdw_cardbook.cardbookeditimpps[idx][1]);
					else if (column.id == "imppValue") return wdw_cardbook.cardbookeditimpps[idx][0][0];
				},
				getCellValue: function(idx, column) {
					if (column.id == "imppPref") return cardbookUtils.getPrefBooleanFromTypes(wdw_cardbook.cardbookeditimpps[idx][1]);
				}
			}
			document.getElementById('imppTree').view = imppTreeView;
		},

		displayUrls: function (aVersion) {
			var urlTreeView = {
				rowCount: wdw_cardbook.cardbookediturls.length,
				isContainer: function(idx) { return false },
				cycleHeader: function(idx) { return false },
				isEditable: function(idx, column) { return false },
				getCellText: function(idx, column) {
					if (column.id == "urlPrefWeight") return cardbookUtils.getPrefValueFromTypes(wdw_cardbook.cardbookediturls[idx][1], aVersion);
					else if (column.id == "urlType") return cardbookUtils.getTypesFromTypes(wdw_cardbook.cardbookediturls[idx][3], wdw_cardbook.cardbookediturls[idx][1]);
					else if (column.id == "urlValue") return wdw_cardbook.cardbookediturls[idx][0][0];
				},
				getCellValue: function(idx, column) {
					if (column.id == "urlPref") return cardbookUtils.getPrefBooleanFromTypes(wdw_cardbook.cardbookediturls[idx][1]);
				}
			}
			document.getElementById('urlTree').view = urlTreeView;
		},

		displayListTrees: function (aTreeName) {
			var availableCardsTreeView = {
				rowCount: wdw_cardbook.cardbookeditlists[aTreeName].length,
				isContainer: function(idx) { return false },
				cycleHeader: function(idx) { return false },
				isEditable: function(idx, column) { return false },
				getCellText: function(idx, column) {
					if (column.id == aTreeName + "Uid") {
						if (wdw_cardbook.cardbookeditlists[aTreeName][idx]) return wdw_cardbook.cardbookeditlists[aTreeName][idx][0];
					}
					else if (column.id == aTreeName + "Fn") {
						if (wdw_cardbook.cardbookeditlists[aTreeName][idx]) return wdw_cardbook.cardbookeditlists[aTreeName][idx][1];
					}
				}
			}
			document.getElementById(aTreeName + 'Tree').view = availableCardsTreeView;
		},

		displayCategories: function () {
			var numberofCategoriesByLine = 3;
			var aGroupBox = document.getElementById('categoriesGroupbox');
			var aListRows = document.getElementById('categoriesVbox');

			while (aListRows.firstChild) {
				aListRows.removeChild(aListRows.firstChild);
			}
			if (wdw_cardbook.cardbookeditcategories.length == 0) {
				aListRows.setAttribute('hidden', 'true');
				aGroupBox.setAttribute('hidden', 'true');
			} else {
				aGroupBox.removeAttribute('hidden');
				aListRows.removeAttribute('hidden');
				var j = 0;
				for (var i = 0; i < wdw_cardbook.cardbookeditcategories.length; i++) {
					switch (j) {
						case 3:
							j = 0;
						case 0:
							var aHboxBox = document.createElement('hbox');
							aListRows.appendChild(aHboxBox);
							break;
						default:
							break;
					}
					j++;
					var aTextbox = document.createElement('textbox');
					aHboxBox.appendChild(aTextbox);
					aTextbox.setAttribute('id', 'categoriesTextbox' + i);
					aTextbox.setAttribute('value', wdw_cardbook.cardbookeditcategories[i]);
					aTextbox.setAttribute('flex', '1');
					aTextbox.addEventListener("blur", function()
						{
							var id = this.id.replace("categoriesTextbox","");
							wdw_cardbook.cardbookeditcategories[id] = this.value;
							wdw_cardbook.cardbookeditcategories = cardbookUtils.cleanArray(cardbookRepository.arrayUnique(wdw_cardbook.cardbookeditcategories));
							wdw_cardbook.displayCategories();
						}, false);
				}
			}
		},

		displayLists: function (aCard) {
			document.getElementById('searchAvailableCardsInput').value = "";
			document.getElementById('kindTextBox').value = "";
			wdw_cardbook.cardbookeditlists.availableCards = [];
			wdw_cardbook.cardbookeditlists.addedCards = [];
			if (aCard.version == "4.0") {
				document.getElementById('kindTextBox').value = aCard.kind;
				for (var i = 0; i < aCard.member.length; i++) {
					var uid = aCard.member[i].replace("urn:uuid:", "");
					if (cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+uid]) {
						wdw_cardbook.cardbookeditlists.addedCards.push([aCard.member[i], cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+uid].fn]);
					}
				}
			} else if (aCard.version == "3.0") {
				document.getElementById('kindTextBox').value = "";
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var kindCustom = prefs.getComplexValue("extensions.cardbook.kindCustom", Components.interfaces.nsISupportsString).data;
				var memberCustom = prefs.getComplexValue("extensions.cardbook.memberCustom", Components.interfaces.nsISupportsString).data;
				for (var i = 0; i < aCard.others.length; i++) {
					var localDelim1 = aCard.others[i].indexOf(":",0);
					if (localDelim1 >= 0) {
						var header = aCard.others[i].substr(0,localDelim1);
						var trailer = aCard.others[i].substr(localDelim1+1,aCard.others[i].length);
						if (header == kindCustom) {
							document.getElementById('kindTextBox').value = trailer;
						} else if (header == memberCustom) {
							if (cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+trailer.replace("urn:uuid:", "")]) {
								wdw_cardbook.cardbookeditlists.addedCards.push([trailer, cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+trailer.replace("urn:uuid:", "")].fn]);
							}
						}
					}
				}
			}
			wdw_cardbook.sortListTreeCol('addedCards', null, null);
			wdw_cardbook.searchAvailableCards();
		},

		displayCard: function (aCard) {
			wdw_cardbook.cardbookeditadrs = [];
			wdw_cardbook.cardbookeditadrs = JSON.parse(JSON.stringify(aCard.adr));
			wdw_cardbook.cardbookedittels = [];
			wdw_cardbook.cardbookedittels = JSON.parse(JSON.stringify(aCard.tel));
			wdw_cardbook.cardbookeditemails = [];
			wdw_cardbook.cardbookeditemails = JSON.parse(JSON.stringify(aCard.email));
			wdw_cardbook.cardbookeditimpps = [];
			wdw_cardbook.cardbookeditimpps = JSON.parse(JSON.stringify(aCard.impp));
			wdw_cardbook.cardbookediturls = [];
			wdw_cardbook.cardbookediturls = JSON.parse(JSON.stringify(aCard.url));
			wdw_cardbook.cardbookeditcategories = [];
			wdw_cardbook.cardbookeditcategories = JSON.parse(JSON.stringify(aCard.categories));
			wdw_cardbook.cardbookeditn = [aCard.prefixname, aCard.firstname, aCard.othername, aCard.lastname, aCard.suffixname];
			wdw_cardbook.cardbookeditorg = aCard.org;
			wdw_cardbook.cardbookeditphoto.extension = aCard.photo.extension;
			wdw_cardbook.cardbookeditphoto.types = [];
			wdw_cardbook.cardbookeditphoto.types = JSON.parse(JSON.stringify(aCard.photo.types));
			wdw_cardbook.cardbookeditlogo.extension = aCard.logo.extension;
			wdw_cardbook.cardbookeditlogo.types = [];
			wdw_cardbook.cardbookeditlogo.types = JSON.parse(JSON.stringify(aCard.logo.types));
			wdw_cardbook.cardbookeditsound.extension = aCard.sound.extension;
			wdw_cardbook.cardbookeditsound.types = [];
			wdw_cardbook.cardbookeditsound.types = JSON.parse(JSON.stringify(aCard.sound.types));

			document.getElementById('fnTextBox').value = aCard.fn;
			document.getElementById('lastnameTextBox').value = aCard.lastname;
			document.getElementById('firstnameTextBox').value = aCard.firstname;
			document.getElementById('othernameTextBox').value = aCard.othername;
			document.getElementById('prefixnameTextBox').value = aCard.prefixname;
			document.getElementById('suffixnameTextBox').value = aCard.suffixname;
			document.getElementById('nicknameTextBox').value = aCard.nickname;
			document.getElementById('bdayTextBox').value = aCard.bday;
			
			document.getElementById('orgTextBox').value = aCard.org;
			document.getElementById('titleTextBox').value = aCard.title;
			document.getElementById('roleTextBox').value = aCard.role;

			document.getElementById('noteTextBox').value = aCard.note;
			
			document.getElementById('mailerTextBox').value = aCard.mailer;
			document.getElementById('geoTextBox').value = aCard.geo;
			document.getElementById('sortstringTextBox').value = aCard.sortstring;
			document.getElementById('class1TextBox').value = aCard.class1;
			document.getElementById('tzTextBox').value = aCard.tz;
			document.getElementById('agentTextBox').value = aCard.agent;
			document.getElementById('keyTextBox').value = aCard.key;
			document.getElementById('photoLocalURITextBox').value = aCard.photo.localURI;
			document.getElementById('logoLocalURITextBox').value = aCard.logo.localURI;
			document.getElementById('soundLocalURITextBox').value = aCard.sound.localURI;
			document.getElementById('photoURITextBox').value = aCard.photo.URI;
			document.getElementById('logoURITextBox').value = aCard.logo.URI;
			document.getElementById('soundURITextBox').value = aCard.sound.URI;
			document.getElementById('prodidTextBox').value = aCard.prodid;
			document.getElementById('uidTextBox').value = aCard.uid;
			document.getElementById('versionTextBox').value = aCard.version;
			document.getElementById('versionRadiogroup').value = aCard.version;
			document.getElementById('dirPrefIdTextBox').value = aCard.dirPrefId;
			document.getElementById('cardurlTextBox').value = aCard.cardurl;
			document.getElementById('revTextBox').value = aCard.rev;
			document.getElementById('etagTextBox').value = aCard.etag;

			document.getElementById('customField1NameTextBox').value = "";
			document.getElementById('customField2NameTextBox').value = "";
			document.getElementById('customField1OrgTextBox').value = "";
			document.getElementById('customField2OrgTextBox').value = "";
			var othersTemp = JSON.parse(JSON.stringify(aCard.others));
			for (var i = 0; i < othersTemp.length; i++) {
				var othersTempArray = othersTemp[i].split(":");
				for (var j in cardbookRepository.customFields) {
					document.getElementById(cardbookRepository.customFields[j] + 'Label').value = cardbookRepository.customFieldsLabel[cardbookRepository.customFields[j]];
					if (cardbookRepository.customFieldsValue[cardbookRepository.customFields[j]] == othersTempArray[0]) {
						document.getElementById(cardbookRepository.customFields[j] + 'TextBox').value = othersTempArray[1];
						var dummy = othersTemp.splice(i,1);
						i--;
					}
				}
			}
			document.getElementById('othersTextBox').value = othersTemp.join("\n");
			document.getElementById('vcardTextBox').value = cardbookUtils.cardToVcardData(aCard, false);

			wdw_cardbook.displayAddresses(aCard.version);
			wdw_cardbook.displayTels(aCard.version);
			wdw_cardbook.displayEmails(aCard.version);
			wdw_cardbook.displayImpps(aCard.version);
			wdw_cardbook.displayUrls(aCard.version);

			wdw_cardbook.displayLists(aCard);

			wdw_cardbook.displayCategories();
			
			wdw_cardbook.adjustVersion();
			wdw_cardbook.adjustFields();

			if (aCard.photo.localURI != null && aCard.photo.localURI !== undefined && aCard.photo.localURI != "") {
				wdw_cardbook.displayImageCard(aCard.photo.localURI);
			} else {
				wdw_cardbook.displayImageCard("chrome://cardbook/skin/missing_photo_200_214.png");
			}
		},
		
		adjustVersion: function () {
			var row = document.getElementById('versionBox');
			var radiogroup = document.getElementById('versionRadiogroup');
			var label = document.getElementById('versionLabel1');
			var groupbox = document.getElementById('versionGroupbox');
			if (document.getElementById('uidTextBox').value == '') {
				if (row) {
					row.removeAttribute('hidden');
				}
				if (groupbox) {
					groupbox.removeAttribute('hidden');
				}
				if (radiogroup) {
					radiogroup.removeAttribute('hidden');
					var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
					radiogroup.value = prefs.getComplexValue("extensions.cardbook.cardCreationVersion", Components.interfaces.nsISupportsString).data;
				}
				if (label) {
					label.removeAttribute('hidden');
				}
			} else {
				if (row) {
					row.setAttribute('hidden', 'true');
				}
				if (groupbox) {
					groupbox.setAttribute('hidden', 'true');
				}
				if (radiogroup) {
					radiogroup.setAttribute('hidden', 'true');
				}
				if (label) {
					label.setAttribute('hidden', 'true');
				}
			}
		},

		adjustFields: function () {
			var myNewN = [document.getElementById('prefixnameTextBox').value, document.getElementById('firstnameTextBox').value, document.getElementById('othernameTextBox').value,
							document.getElementById('lastnameTextBox').value, document.getElementById('suffixnameTextBox').value];
			document.getElementById('fnTextBox').value = cardbookUtils.getDisplayedName(document.getElementById('fnTextBox').value, document.getElementById('fnTextBox').value, wdw_cardbook.cardbookeditn, myNewN,
																				wdw_cardbook.cardbookeditorg, document.getElementById('orgTextBox').value);
			wdw_cardbook.cardbookeditn = JSON.parse(JSON.stringify(myNewN));
			wdw_cardbook.cardbookeditorg = document.getElementById('orgTextBox').value;
			var nullableFields = {pers: [ 'fn', 'lastname', 'firstname', 'othername', 'prefixname', 'suffixname', 'nickname', 'bday', 'customField1Name', 'customField2Name' ],
									org: [ 'org', 'title', 'role', 'customField1Org', 'customField2Org' ],
									note: [ 'note' ],
									misc: [ 'mailer', 'geo', 'sortstring', 'class1', 'tz', 'agent', 'key', 'photoLocalURI', 'photoURI', 'logoLocalURI', 'logoURI', 'soundLocalURI', 'soundURI' ],
									tech: [ 'dirPrefId', 'version', 'prodid', 'uid', 'cardurl', 'rev', 'etag' ],
									others: [ 'others' ],
									vcard: [ 'vcard' ],
									};
			for (var i in nullableFields) {
				var found = 0;
				for (var j = 0; j < nullableFields[i].length; j++) {
					var row = document.getElementById(nullableFields[i][j] + 'Row');
					var textbox = document.getElementById(nullableFields[i][j] + 'TextBox');
					var label = document.getElementById(nullableFields[i][j] + 'Label');
					if (textbox.value == '') {
						if (row) {
							row.setAttribute('hidden', 'true');
						}
						if (textbox) {
							textbox.setAttribute('hidden', 'true');
						}
						if (label) {
							label.setAttribute('hidden', 'true');
						}
						found++;
					} else {
						if (row) {
							row.removeAttribute('hidden');
						}
						if (textbox) {
							textbox.removeAttribute('hidden');
						}
						if (label) {
							label.removeAttribute('hidden');
						}
					}
				}
				var groupbox = document.getElementById(i + 'Groupbox');
				if (groupbox) {
					if (found == nullableFields[i].length) {
						groupbox.setAttribute('hidden', 'true');
					} else {
						groupbox.removeAttribute('hidden');
					}
				}
			}
			
			var box = document.getElementById('adrBox');
			if (wdw_cardbook.cardbookeditadrs.length == 0) {
				box.setAttribute('hidden', 'true');
			} else {
				box.removeAttribute('hidden');
			}
			var box = document.getElementById('telBox');
			if (wdw_cardbook.cardbookedittels.length == 0) {
				box.setAttribute('hidden', 'true');
			} else {
				box.removeAttribute('hidden');
			}
			var box = document.getElementById('emailBox');
			if (wdw_cardbook.cardbookeditemails.length == 0) {
				box.setAttribute('hidden', 'true');
			} else {
				box.removeAttribute('hidden');
			}
			var box = document.getElementById('imppBox');
			if (wdw_cardbook.cardbookeditimpps.length == 0) {
				box.setAttribute('hidden', 'true');
			} else {
				box.removeAttribute('hidden');
			}
			var box = document.getElementById('urlBox');
			if (wdw_cardbook.cardbookediturls.length == 0) {
				box.setAttribute('hidden', 'true');
			} else {
				box.removeAttribute('hidden');
			}
		},

		validateButtons: function () {
			var buttons = [ "Name", "Org", "Categories", "Address", "Phone", "Email", "Impp", "Url", "Note", "Birthday" ];
			for (var i = 0; i < buttons.length; i++) {
				var buttonId = 'button' + buttons[i];
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var displayButton = prefs.getBoolPref("extensions.cardbook." + buttonId);
				var button = document.getElementById(buttonId);
				if (displayButton) {
					if (button) {
						button.removeAttribute('hidden');
					}
				} else {
					if (button) {
						button.setAttribute('hidden', 'true');
					}
				}
			}
		},

		selectAccountOrCatInNoSearch: function () {
			var myTree = document.getElementById('accountsOrCatsTree');
			wdw_cardbook.setNoSearchMode();
			wdw_cardbook.clearCard();
			wdw_cardbook.selectAccountOrCat();
		},

		selectAccountOrCat: function (aAccountOrCat) {
			var myTree = document.getElementById('accountsOrCatsTree');
			
			if (cardbookRepository.cardbookSearchMode === "SEARCH") {
				var myTree = document.getElementById('cardsTree');
				var mySelectedAccount = cardbookRepository.cardbookSearchValue;
				if (cardbookRepository.cardbookDisplayCards[mySelectedAccount]) {
					wdw_cardbook.sortCardsTreeCol();
					if (cardbookRepository.cardbookDisplayCards[mySelectedAccount].length == 1) {
						wdw_cardbook.displayCard(cardbookRepository.cardbookCards[cardbookRepository.cardbookDisplayCards[mySelectedAccount][0].dirPrefId+"::"+cardbookRepository.cardbookDisplayCards[mySelectedAccount][0].uid]);
						if (myTree.currentIndex != 0) {
							myTree.view.selection.select(0);
						}
					} else if (cardbookUtils.getSelectedCardsCount() == 1) {
						// force refresh
						wdw_cardbook.displayCard(cardbookRepository.cardbookCards[cardbookRepository.cardbookDisplayCards[mySelectedAccount][myTree.currentIndex].dirPrefId+"::"+cardbookRepository.cardbookDisplayCards[mySelectedAccount][myTree.currentIndex].uid]);
					} else {
						wdw_cardbook.clearCard();
					}
				} else {
					wdw_cardbook.clearAccountOrCat();
					wdw_cardbook.clearCard();
				}
			} else if (aAccountOrCat != null && aAccountOrCat !== undefined && aAccountOrCat != "") {
				if (cardbookUtils.getPositionOfAccountId(aAccountOrCat) != -1) {
					myTree.view.selection.select(cardbookUtils.getPositionOfAccountId(aAccountOrCat));
					var myTree = document.getElementById('cardsTree');
					wdw_cardbook.sortCardsTreeCol();
					if (cardbookRepository.cardbookDisplayCards[aAccountOrCat].length == 1) {
						wdw_cardbook.displayCard(cardbookRepository.cardbookCards[cardbookRepository.cardbookDisplayCards[aAccountOrCat][0].dirPrefId+"::"+cardbookRepository.cardbookDisplayCards[aAccountOrCat][0].uid]);
						if (myTree.currentIndex != 0) {
							myTree.view.selection.select(0);
						}
					} else if (cardbookUtils.getSelectedCardsCount() == 1) {
						// force refresh
						wdw_cardbook.displayCard(cardbookRepository.cardbookCards[cardbookRepository.cardbookDisplayCards[aAccountOrCat][myTree.currentIndex].dirPrefId+"::"+cardbookRepository.cardbookDisplayCards[aAccountOrCat][myTree.currentIndex].uid]);
					} else {
						wdw_cardbook.clearCard();
					}
				} else if (cardbookUtils.getPositionOfAccountId(cardbookUtils.getAccountId(aAccountOrCat)) != -1) {
					aAccountOrCat = cardbookUtils.getAccountId(aAccountOrCat);
					myTree.view.selection.select(cardbookUtils.getPositionOfAccountId(aAccountOrCat));
					var myTree = document.getElementById('cardsTree');
					wdw_cardbook.sortCardsTreeCol();
					if (cardbookRepository.cardbookDisplayCards[aAccountOrCat].length == 1) {
						wdw_cardbook.displayCard(cardbookRepository.cardbookCards[cardbookRepository.cardbookDisplayCards[aAccountOrCat][0].dirPrefId+"::"+cardbookRepository.cardbookDisplayCards[aAccountOrCat][0].uid]);
						if (myTree.currentIndex != 0) {
							myTree.view.selection.select(0);
						}
					} else if (cardbookUtils.getSelectedCardsCount() == 1) {
						// force refresh
						wdw_cardbook.displayCard(cardbookRepository.cardbookCards[cardbookRepository.cardbookDisplayCards[aAccountOrCat][myTree.currentIndex].dirPrefId+"::"+cardbookRepository.cardbookDisplayCards[aAccountOrCat][myTree.currentIndex].uid]);
					} else {
						wdw_cardbook.clearCard();
					}
				} else {
					wdw_cardbook.clearAccountOrCat();
					wdw_cardbook.clearCard();
				}
			} else if (myTree.currentIndex != -1) {
				var mySelectedAccount = myTree.view.getCellText(myTree.currentIndex, myTree.columns.getNamedColumn("accountId"));
				if (cardbookRepository.cardbookDisplayCards[mySelectedAccount]) {
					var myTree = document.getElementById('cardsTree');
					wdw_cardbook.sortCardsTreeCol();
					if (cardbookRepository.cardbookDisplayCards[mySelectedAccount].length == 1) {
						wdw_cardbook.displayCard(cardbookRepository.cardbookCards[cardbookRepository.cardbookDisplayCards[mySelectedAccount][0].dirPrefId+"::"+cardbookRepository.cardbookDisplayCards[mySelectedAccount][0].uid]);
						if (myTree.currentIndex != 0) {
							myTree.view.selection.select(0);
						}
					} else if (cardbookUtils.getSelectedCardsCount() == 1) {
						// force refresh
						wdw_cardbook.displayCard(cardbookRepository.cardbookCards[cardbookRepository.cardbookDisplayCards[mySelectedAccount][myTree.currentIndex].dirPrefId+"::"+cardbookRepository.cardbookDisplayCards[mySelectedAccount][myTree.currentIndex].uid]);
					} else {
						wdw_cardbook.clearCard();
					}
				} else {
					wdw_cardbook.clearAccountOrCat();
					wdw_cardbook.clearCard();
				}
			} else {
				if (cardbookRepository.cardbookAccounts) {
					myTree.view.selection.select(0);
				}
				// wdw_cardbook.clearAccountOrCat();
				wdw_cardbook.clearCard();
			}
			wdw_cardbook.updateStatusInformation();
		},

		selectCard: function () {
			var myTree = document.getElementById('cardsTree');
			var numRanges = myTree.view.selection.getRangeCount();
			var start = new Object();
			var end = new Object();
			var numberOfSelectedCard = 0;
			var positionOfSelectedCard = 0;
			for (let i = 0; i < numRanges; i++) {
				myTree.view.selection.getRangeAt(i,start,end);
			    for (let k = start.value; k <= end.value; k++) {
					numberOfSelectedCard++;
					positionOfSelectedCard = k;
				}
			}
			if ( numberOfSelectedCard != 1 ) {
				wdw_cardbook.clearCard();
			} else {
				var mySelectedCard = myTree.view.getCellText(positionOfSelectedCard, myTree.columns.getNamedColumn("dirPrefId"))+"::"+myTree.view.getCellText(positionOfSelectedCard, myTree.columns.getNamedColumn("uid"));
				if (cardbookRepository.cardbookCards[mySelectedCard]) {
					wdw_cardbook.displayCard(cardbookRepository.cardbookCards[mySelectedCard]);
				} else {
					wdw_cardbook.clearCard();
				}
			}
		},

		removeCardFromWindow: function (aCard, aCacheDeletion) {
			try {
				cardbookRepository.removeCardFromRepository(aCard, aCacheDeletion);
				wdw_cardbook.refreshWindow("", aCard, "REMOVE");
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.removeCardFromWindow error : " + e);
			}
		},

		addCardToWindow: function (aCard, aMode, aFileName) {
			try {
				cardbookRepository.addCardToRepository(aCard, aMode, aFileName);
				wdw_cardbook.refreshWindow("", aCard, "ADD");
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.addCardToWindow error : " + e);
			}
		},

		clearAccountOrCat: function () {
			wdw_cardbook.displayAccountOrCat([]);
			var myTree = document.getElementById('accountsOrCatsTree');
			myTree.view.selection.select(-1);
			wdw_cardbook.updateStatusInformation();
		},

		refreshWindow2: function () {
			wdw_cardbook.refreshAccountsInDirTree();
			wdw_cardbook.sortCardsTreeCol();
		},

		refreshWindow: function(aAccountId, aCard, aMode) {
			try {
				var myTree = document.getElementById('accountsOrCatsTree');
				if (myTree.currentIndex != -1) {
					var myCurrentAccountId = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
					var myCurrentDirPrefId = cardbookUtils.getAccountId(myCurrentAccountId);
				} else {
					var myCurrentDirPrefId = -1;
				}

				// Add account or remove Account
				if (aAccountId != null && aAccountId !== undefined && aAccountId != "") {
					if (aMode === "REMOVE") {
						if (cardbookRepository.cardbookAccounts[0]) {
							var firstAccountToSelect = cardbookRepository.cardbookAccounts[0][4];
							for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
								var myAccountId = cardbookRepository.cardbookAccounts[i][4];
								if (cardbookRepository.cardbookDisplayCards[myAccountId]) {
									if (cardbookRepository.cardbookDisplayCards[myAccountId].length > 0) {
										firstAccountToSelect = myAccountId;
										break;
									}
								}
							}
							wdw_cardbook.selectAccountOrCat(firstAccountToSelect);
							wdw_cardbook.refreshAccountsInDirTree();
						} else {
							wdw_cardbook.clearAccountOrCat();
							wdw_cardbook.refreshAccountsInDirTree();
							wdw_cardbook.clearCard();
						}
					} else {
						wdw_cardbook.refreshAccountsInDirTree();
						wdw_cardbook.selectAccountOrCat(aAccountId);
					}
					
				// Add card or remove card
				} else if (aCard.dirPrefId != null && aCard.dirPrefId !== undefined && aCard.dirPrefId != "") {
					// Search mode first
					if (cardbookRepository.cardbookSearchMode === "SEARCH") {
						var myCurrentAccountId = cardbookRepository.cardbookSearchValue;
						if (cardbookRepository.cardbookDisplayCards[myCurrentAccountId]) {
							wdw_cardbook.refreshAccountsInDirTree();
							wdw_cardbook.sortCardsTreeCol();
							var myTree = document.getElementById('cardsTree');
							if (cardbookRepository.cardbookDisplayCards[myCurrentAccountId].length == 1) {
								wdw_cardbook.displayCard(cardbookRepository.cardbookCards[cardbookRepository.cardbookDisplayCards[myCurrentAccountId][0].dirPrefId+"::"+cardbookRepository.cardbookDisplayCards[myCurrentAccountId][0].uid]);
								myTree.view.selection.select(0);
							} else if (cardbookUtils.getSelectedCardsCount() === 0) {
								cardbookUtils.setSelectedCards([aCard.dirPrefId+"::"+aCard.uid]);
								wdw_cardbook.displayCard(aCard);
							}
						} else {
							wdw_cardbook.clearAccountOrCat();
							wdw_cardbook.clearCard();
						}
					// Work inside the same prefId
					} else if (aCard.dirPrefId == myCurrentDirPrefId || myCurrentDirPrefId === -1) {
						wdw_cardbook.refreshAccountsInDirTree();
						wdw_cardbook.sortCardsTreeCol();
						wdw_cardbook.updateStatusInformation();
						if (aMode === "REMOVE") {
							if (cardbookUtils.getSelectedCardsCount() === 0) {
								let nullCard = new cardbookCardParser();
								wdw_cardbook.displayCard(nullCard);
							}
						} else if (cardbookRepository.cardbookDisplayCards[myCurrentAccountId].length !== 0) {
							if (cardbookUtils.getSelectedCardsCount() === 0) {
								cardbookUtils.setSelectedCards([aCard.dirPrefId+"::"+aCard.uid]);
								wdw_cardbook.displayCard(aCard);
							}
						}
					// Work outside the prefId
					} else {
						wdw_cardbook.refreshAccountsInDirTree();
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.refreshWindow error : " + e);
			}
		},

		refreshAccountsInDirTree: function() {
			try {
				if (document.getElementById('accountsOrCatsTree')) {
					cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookDirTree.js"]);
					var myTree = document.getElementById('accountsOrCatsTree');
					cardbookDirTree.childData = cardbookRepository.cardbookAccountsCategories;
					cardbookDirTree.visibleData = cardbookRepository.cardbookAccounts;
					myTree.view = cardbookDirTree;
					if (cardbookRepository.cardbookAccounts.length != 0) {
						wdw_cardbook.sortAccounts();
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.refreshAccountsInDirTree error : " + e);
			}
		},

		clearCard: function () {
			let nullCard = new cardbookCardParser();
			wdw_cardbook.displayCard(nullCard);
		},

		saveCard: function (aCard) {
			try {
				if (aCard != null && aCard !== undefined && aCard != "") {
					var aModifiedCard = aCard;
				} else {
					var aModifiedCard = cardbookUtils.getModifiedCard();
				}
				if (cardbookUtils.validateCategories(aModifiedCard)) {
					cardbookUtils.updateRev(aModifiedCard);
					// New card
					if (aModifiedCard.uid == "") {
						if (cardbookRepository.cardbookSearchMode === "SEARCH") {
							cardbookUtils.formatStringForOutput("cardCreationInSearchMode");
							return;
						}
						var myTree = document.getElementById('accountsOrCatsTree');
						var myCurrentAccountId = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
						var myCurrentDirPrefId = cardbookUtils.getAccountId(myCurrentAccountId);
						cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
						var cardbookPrefService = new cardbookPreferenceService(myCurrentDirPrefId);
						var myCurrentDirPrefIdName = cardbookPrefService.getName();
						var myCurrentDirPrefIdType = cardbookPrefService.getType();
						var myCurrentDirPrefIdUrl = cardbookPrefService.getUrl();

						cardbookUtils.jsInclude(["chrome://cardbook/content/uuid.js"]);
						aModifiedCard.uid = new UUID() + "";
						aModifiedCard.dirPrefId = myCurrentDirPrefId;
						var mySepPosition = myCurrentAccountId.indexOf("::",0);
						if (mySepPosition != -1) {
							var myCategory = myCurrentAccountId.substr(mySepPosition+2,myCurrentAccountId.length);
							aModifiedCard.categories.push(myCategory);
							cardbookUtils.validateCategories(aModifiedCard)
						}

						if (myCurrentDirPrefIdType === "CACHE") {
							wdw_cardbook.addCardToWindow(aModifiedCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aModifiedCard, myCurrentDirPrefIdType));
						} else if (myCurrentDirPrefIdType === "FILE") {
							wdw_cardbook.addCardToWindow(aModifiedCard, "WINDOW");
							cardbookSynchronization.writeCardsToFile(myCurrentDirPrefIdUrl, cardbookRepository.cardbookDisplayCards[aModifiedCard.dirPrefId], true);
						} else {
							cardbookUtils.addTagCreated(aModifiedCard);
							cardbookUtils.addEtag(aModifiedCard, "0");
							wdw_cardbook.addCardToWindow(aModifiedCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aModifiedCard, myCurrentDirPrefIdType));
						}
						cardbookUtils.formatStringForOutput("cardCreatedOK", [myCurrentDirPrefIdName, aModifiedCard.fn]);
					// Existing card
					} else {
						cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
						var cardbookPrefService = new cardbookPreferenceService(aModifiedCard.dirPrefId);
						var myCurrentDirPrefIdName = cardbookPrefService.getName();
						var myCurrentDirPrefIdType = cardbookPrefService.getType();
						var myCurrentDirPrefIdUrl = cardbookPrefService.getUrl();

						var myOldCard = cardbookRepository.cardbookCards[aModifiedCard.dirPrefId+"::"+aModifiedCard.uid];
						if (myCurrentDirPrefIdType === "CACHE") {
							// if aCard and aModifiedCard have the same cached medias
							cardbookUtils.changeMediaFromFileToContent(aModifiedCard);
							wdw_cardbook.removeCardFromWindow(myOldCard, true);
							wdw_cardbook.addCardToWindow(aModifiedCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aModifiedCard, myCurrentDirPrefIdType));
						} else if (myCurrentDirPrefIdType === "FILE") {
							// if aCard and aModifiedCard have the same cached medias
							cardbookUtils.changeMediaFromFileToContent(aModifiedCard);
							wdw_cardbook.removeCardFromWindow(myOldCard, true);
							wdw_cardbook.addCardToWindow(aModifiedCard, "WINDOW");
							cardbookSynchronization.writeCardsToFile(myCurrentDirPrefIdUrl, cardbookRepository.cardbookDisplayCards[aModifiedCard.dirPrefId], true);
						} else {
							// if aCard and aModifiedCard have the same cached medias
							cardbookUtils.changeMediaFromFileToContent(aModifiedCard);
							if (!(cardbookUtils.searchTagCreated(aModifiedCard))) {
								cardbookUtils.addTagUpdated(aModifiedCard);
							}
							wdw_cardbook.removeCardFromWindow(myOldCard, true);
							wdw_cardbook.addCardToWindow(aModifiedCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aModifiedCard, myCurrentDirPrefIdType));
						}
						cardbookUtils.formatStringForOutput("cardUpdatedOK", [myCurrentDirPrefIdName, aModifiedCard.fn]);
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.saveCard error : " + e);
			}
		},

		cancelCard: function () {
			wdw_cardbook.selectCard();
		},

		createCard: function () {
			var myTree = document.getElementById('accountsOrCatsTree');
			if (myTree.currentIndex != -1) {
				wdw_cardbook.setNoSearchMode();
				var myTree = document.getElementById('cardsTree');
				myTree.view.selection.clearSelection();
				wdw_cardbook.clearCard();
				var myMenu = document.getElementById('buttonName');
				wdw_cardbook.addCardInfo(myMenu);
			}
		},

		mergeCards: function () {
			try {
				var listOfSelectedCard = [];
				listOfSelectedCard = cardbookUtils.getCardsFromCards();

				var myArgs = {cardsIn: listOfSelectedCard, cardsOut: [], action: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_mergeCards.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.action == "CREATE") {
					wdw_cardbook.saveCard(myArgs.cardsOut[0]);
				} else if (myArgs.action == "CREATEANDREPLACE") {
					wdw_cardbook.saveCard(myArgs.cardsOut[0]);
					wdw_cardbook.deleteCards(myArgs.cardsIn);
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.deleteCards error : " + e);
			}
		},

		deleteCards: function (aListOfCards) {
			try {
				if (aListOfCards != null && aListOfCards !== undefined && aListOfCards != "") {
					var listOfSelectedCard = aListOfCards;
				} else {
					var listOfSelectedCard = [];
					listOfSelectedCard = cardbookUtils.getCardsFromCards();
				}
				var listOfFileToRewrite = [];

				for (var i = 0; i < listOfSelectedCard.length; i++) {
					cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
					var cardbookPrefService = new cardbookPreferenceService(listOfSelectedCard[i].dirPrefId);
					var myDirPrefIdName = cardbookPrefService.getName();
					var myDirPrefIdType = cardbookPrefService.getType();
					if (myDirPrefIdType === "FILE") {
						if (cardbookUtils.searchTagCreated(listOfSelectedCard[i])) {
							cardbookRepository.removeCardFromRepository(listOfSelectedCard[i], false);
						} else {
							cardbookRepository.removeCardFromRepository(listOfSelectedCard[i], true);
						}
						listOfFileToRewrite.push(listOfSelectedCard[i].dirPrefId);
					} else if (myDirPrefIdType === "CACHE") {
						cardbookRepository.removeCardFromRepository(listOfSelectedCard[i], true);
					} else {
						cardbookUtils.addTagDeleted(listOfSelectedCard[i]);
						cardbookRepository.addCardToCache(listOfSelectedCard[i], "WINDOW", cardbookUtils.getFileCacheNameFromCard(listOfSelectedCard[i]));
						cardbookRepository.removeCardFromRepository(listOfSelectedCard[i], false);
					}
					cardbookUtils.formatStringForOutput("cardDeletedOK", [myDirPrefIdName, listOfSelectedCard[i].fn]);
				}
				
				listOfFileToRewrite = cardbookRepository.arrayUnique(listOfFileToRewrite);
				for (var i = 0; i < listOfFileToRewrite.length; i++) {
					var cardbookPrefService = new cardbookPreferenceService(listOfFileToRewrite[i]);
					var myDirPrefIdUrl = cardbookPrefService.getUrl();
					cardbookSynchronization.writeCardsToFile(myDirPrefIdUrl, cardbookRepository.cardbookDisplayCards[listOfFileToRewrite[i]], true);
				}
				wdw_cardbook.refreshAccountsInDirTree();
				wdw_cardbook.sortCardsTreeCol();
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.deleteCards error : " + e);
			}
		},

		exportCardsFromAccountsOrCats: function (aMenu) {
			try {
				var listOfSelectedCard = [];
				listOfSelectedCard = cardbookUtils.getCardsFromAccountsOrCats();
				if (aMenu.id == "cardbookToolsMenuExportToFile" || aMenu.id == "exportCardsToFileFromAccountsOrCats") {
					var myTree = document.getElementById('accountsOrCatsTree');
					var defaultFileName = myTree.view.getCellText(myTree.currentIndex, {id: "accountName"}) + ".vcf";
					wdw_cardbook.exportCardsToFile(listOfSelectedCard, defaultFileName);
				} else if (aMenu.id == "cardbookToolsMenuExportToDir" || aMenu.id == "exportCardsToDirFromAccountsOrCats") {
					wdw_cardbook.exportCardsToDir(listOfSelectedCard);
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.exportCardsFromAccountsOrCats error : " + e);
			}
		},

		exportCardsFromCards: function (aMenu) {
			try {
				var listOfSelectedCard = [];
				listOfSelectedCard = cardbookUtils.getCardsFromCards();
				if (aMenu.id == "exportCardsToFileFromCards") {
					if (listOfSelectedCard.length == 1) {
						var myTree = document.getElementById('cardsTree');
						var defaultFileName = myTree.view.getCellText(myTree.currentIndex, {id: "fn"}) + ".vcf";
					} else {
						var defaultFileName = "export.vcf";
					}
					wdw_cardbook.exportCardsToFile(listOfSelectedCard, defaultFileName);
				} else if (aMenu.id == "exportCardsToDirFromCards") {
					wdw_cardbook.exportCardsToDir(listOfSelectedCard);
				}
					
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.exportCardsFromCards error : " + e);
			}
		},

		exportCardsToFile: function (aListOfSelectedCard, aDefaultFileName) {
			try {
				var myFile = cardbookUtils.callFilePicker("FileSaveTitle", "SAVE", "VCF", aDefaultFileName);
				if (myFile != null && myFile !== undefined && myFile != "") {
					if (myFile.exists() == false){
						myFile.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
					}
	
					if (cardbookUtils.isTheFileAlreadyOpen(myFile.path)) {
						cardbookUtils.formatStringForOutput("fileAlreadyOpen", [myFile.leafName]);
						return;
					}
	
					cardbookSynchronization.writeCardsToFile(myFile.path, aListOfSelectedCard, true);

					if (aListOfSelectedCard.length > 1) {
						cardbookUtils.formatStringForOutput("exportsOKIntoFile", [myFile.leafName]);
					} else {
						cardbookUtils.formatStringForOutput("exportOKIntoFile", [myFile.leafName]);
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.exportCardsToFile error : " + e);
			}
		},

		exportCardsToDir: function (aListOfSelectedCard) {
			try {
				var myFile = cardbookUtils.callDirPicker("DirSaveTitle");
				if (myFile != null && myFile !== undefined && myFile != "") {
					if (myFile.exists() == false){
						myFile.create( Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774 );
					}
	
					// test if (cardbookUtils.isTheFileAlreadyOpen(myFile.path)) {
					// test 	cardbookUtils.formatStringForOutput("fileAlreadyOpen", [myFile.leafName]);
					// test 	return;
					// test }
	
					cardbookSynchronization.writeCardsToDir(myFile.path, aListOfSelectedCard, true);

					if (aListOfSelectedCard.length > 1) {
						cardbookUtils.formatStringForOutput("exportsOKIntoDir", [myFile.leafName]);
					} else {
						cardbookUtils.formatStringForOutput("exportOKIntoDir", [myFile.leafName]);
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.exportCardsToDir error : " + e);
			}
		},

		importCardsFromFile: function () {
			try {
				var myTree = document.getElementById('accountsOrCatsTree');
				var myTarget = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				var myDirPrefId = cardbookUtils.getAccountId(myTarget);
				var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
				var myDirPrefIdUrl = cardbookPrefService.getUrl();
				var myDirPrefIdName = cardbookPrefService.getName();

				var myFile = cardbookUtils.callFilePicker("fileImportTitle", "OPEN", "VCF");
				if (myFile != null && myFile !== undefined && myFile != "") {
					// search if file is already open
					if (myFile.path == myDirPrefIdUrl) {
						cardbookUtils.formatStringForOutput("exportNotIntoSameFile");
						return;
					}
					cardbookSynchronization.initSync(myDirPrefId);
					cardbookRepository.cardbookFileRequest[myDirPrefId]++;
					cardbookSynchronization.loadFileBackground(myFile, myTarget, "", "WINDOW", wdw_cardbook.refreshWindow2);
					cardbookSynchronization.waitForImportFinished(myDirPrefId, myDirPrefIdName);
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.importCardsFromFile error : " + e);
			}
		},

		importCardsFromDir: function () {
			try {
				var myTree = document.getElementById('accountsOrCatsTree');
				var myTarget = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				var myDirPrefId = cardbookUtils.getAccountId(myTarget);
				var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
				var myDirPrefIdUrl = cardbookPrefService.getUrl();
				var myDirPrefIdName = cardbookPrefService.getName();

				var myDir = cardbookUtils.callDirPicker("dirImportTitle");
				if (myDir != null && myDir !== undefined && myDir != "") {
					// search if dir is already open
					// test if (myFile.path == myDirPrefIdUrl) {
					// test 	cardbookUtils.formatStringForOutput("exportNotIntoSameFile");
					// test 	return;
					// test }
					cardbookSynchronization.initSync(myDirPrefId);
					cardbookRepository.cardbookDirRequest[myDirPrefId]++;
					cardbookSynchronization.loadDir(myDir, myTarget, "", "WINDOW", wdw_cardbook.refreshWindow2);
					cardbookSynchronization.waitForImportFinished(myDirPrefId, myDirPrefIdName);
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.importCardsFromDir error : " + e);
			}
		},

		copyCardsFromAccountsOrCats: function () {
			try {
				var listOfSelectedCard = [];
				listOfSelectedCard = cardbookUtils.getCardsFromAccountsOrCats();
				wdw_cardbook.copyCards(listOfSelectedCard);
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.copyCardsFromAccountsOrCats error : " + e);
			}
		},

		copyCardsFromCards: function () {
			try {
				var listOfSelectedCard = [];
				listOfSelectedCard = cardbookUtils.getCardsFromCards();
				wdw_cardbook.copyCards(listOfSelectedCard);
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.copyCardsFromCards error : " + e);
			}
		},

		copyCards: function (aListOfSelectedCard) {
			try {
				var listOfSelectedUid = [];
				for (var i = 0; i < aListOfSelectedCard.length; i++) {
					listOfSelectedUid.push(aListOfSelectedCard[i].dirPrefId + "::" + aListOfSelectedCard[i].uid);
				}
				let myText = listOfSelectedUid.join("@@@@@");
				if (myText != null && myText !== undefined && myText != "") {
					var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
					var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
					if (listOfSelectedUid.length > 1) {
						var myMessage = strBundle.GetStringFromName("contactsCopied");
					} else {
						var myMessage = strBundle.GetStringFromName("contactCopied");
					}
					cardbookUtils.clipboardSet(myText, myMessage);
				} else {
					wdw_cardbooklog.updateStatusProgressInformation("Nothing selected to be copied");
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.copyCards error : " + e);
			}
		},

		pasteCards: function () {
			try {
				let str = cardbookUtils.clipboardGet();
				if (str) {
					var myTree = document.getElementById('accountsOrCatsTree');
					var myTarget = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
					cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
					var myDirPrefId = cardbookUtils.getAccountId(myTarget);
					var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
					var myDirPrefIdType = cardbookPrefService.getType();
					var myDirPrefIdUrl = cardbookPrefService.getUrl();

					var dataArray = str.split("@@@@@");
					if (dataArray.length) {
						for (var i = 0; i < dataArray.length; i++) {
							if (cardbookRepository.cardbookCards[dataArray[i]]) {
								var myCard = cardbookRepository.cardbookCards[dataArray[i]];
								cardbookSynchronization.importCard(myCard, myTarget);
							} else {
								cardbookUtils.formatStringForOutput("clipboardWrong");
							}
						}
						if (myDirPrefIdType === "FILE") {
							cardbookSynchronization.writeCardsToFile(myDirPrefIdUrl, cardbookRepository.cardbookDisplayCards[myDirPrefId], true);
						}
						wdw_cardbook.refreshAccountsInDirTree();
						wdw_cardbook.sortCardsTreeCol();
					} else {
						cardbookUtils.formatStringForOutput("clipboardEmpty");
					}
				} else {
					cardbookUtils.formatStringForOutput("clipboardEmpty");
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.pasteCards error : " + e);
			}
		},

		chooseActionTree: function (aMenuOrTree) {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			if (aMenuOrTree.id == "emailTreeChildren") {
				var preferEmailEdition = prefs.getBoolPref("extensions.cardbook.preferEmailEdition");
				if (preferEmailEdition) {
					wdw_cardbook.editCardTree(aMenuOrTree);
				} else {
					wdw_cardbook.emailCardFromTree(aMenuOrTree);
				}
			} else if (aMenuOrTree.id == "addressTreeChildren") {
				var preferAddressEdition = prefs.getBoolPref("extensions.cardbook.preferAddressEdition");
				if (preferAddressEdition) {
					wdw_cardbook.editCardTree(aMenuOrTree);
				} else {
					wdw_cardbook.localizeCardFromTree(aMenuOrTree);
				}
			}
		},
		
		emailCardFromTree: function (aMenuOrTree) {
			if (aMenuOrTree.id == "emailemailTree" || aMenuOrTree.id == "emailTreeChildren") {
				var myTree = document.getElementById('emailTree');
				if (myTree.currentIndex != -1) {
					var mySelectedPosition = myTree.currentIndex;
					wdw_cardbook.emailCards(null, [document.getElementById('fnTextBox').value, wdw_cardbook.cardbookeditemails[mySelectedPosition][0][0]], false, "to");
				}
			}
		},
		
		localizeCardFromTree: function (aMenuOrTree) {
			if (aMenuOrTree.id == "localizeaddressTree" || aMenuOrTree.id == "addressTreeChildren") {
				var myTree = document.getElementById('addressTree');
				if (myTree.currentIndex != -1) {
					var mySelectedPosition = myTree.currentIndex;
					wdw_cardbook.localizeCards(null, [wdw_cardbook.cardbookeditadrs[mySelectedPosition][0]]);
				}
			}
		},

		emailCardsFromCards: function (aMenuOrTree) {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var preferEmailPref = prefs.getBoolPref("extensions.cardbook.preferEmailPref");
			var listOfSelectedCard = [];
			if (aMenuOrTree.id == "cardsTreeChildren") {
				var myAction = "to";
				var mySource = aMenuOrTree.id;
			} else {
				var myAction = aMenuOrTree.id.replace("EmailCardsFromAccountsOrCats", "").replace("EmailCardsFromCards", "");
				var mySource = aMenuOrTree.id.replace(myAction, "");
			}
			if (mySource == "EmailCardsFromAccountsOrCats") {
				listOfSelectedCard = cardbookUtils.getCardsFromAccountsOrCats();
			} else {
				listOfSelectedCard = cardbookUtils.getCardsFromCards();
			}
			wdw_cardbook.emailCards(listOfSelectedCard, null, preferEmailPref, myAction);
		},

		localizeCardsFromCards: function (aMenuOrTree) {
			var listOfSelectedCard = [];
			listOfSelectedCard = cardbookUtils.getCardsFromCards();
			wdw_cardbook.localizeCards(listOfSelectedCard, null);
		},

		emailCards: function (aListOfSelectedCard, aListOfSelectedMails, aEmailPref, aMsgField) {
			var listOfEmail = [];
			if (aListOfSelectedCard != null && aListOfSelectedCard !== undefined && aListOfSelectedCard != "") {
				listOfEmail = cardbookUtils.getEmailsFromCards(aListOfSelectedCard, aEmailPref);
			} else if (aListOfSelectedMails != null && aListOfSelectedMails !== undefined && aListOfSelectedMails != "") {
				listOfEmail = [aListOfSelectedMails[0] + " <" + aListOfSelectedMails[1] + ">"];
				cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookMailPopularity.js"]);
				cardbookMailPopularity.updateMailPopularity(aListOfSelectedMails[1]);
			}
			
			if (listOfEmail.length != 0) {
				var msgComposeType = Components.interfaces.nsIMsgCompType;
				var msgComposFormat = Components.interfaces.nsIMsgCompFormat;
				var msgComposeService = Components.classes["@mozilla.org/messengercompose;1"].getService();
				var params = Components.classes["@mozilla.org/messengercompose/composeparams;1"].createInstance(Components.interfaces.nsIMsgComposeParams);
				msgComposeService = msgComposeService.QueryInterface(Components.interfaces.nsIMsgComposeService);
				if (params) {
					params.type = msgComposeType.New;
					params.format = msgComposFormat.Default;
					var composeFields = Components.classes["@mozilla.org/messengercompose/composefields;1"].createInstance(Components.interfaces.nsIMsgCompFields);
					if (composeFields) {
						composeFields[aMsgField] = listOfEmail.join(" , ");
						params.composeFields = composeFields;
						msgComposeService.OpenComposeWindowWithParams(null, params);
					}
				}
			}
		},

		localizeCards: function (aListOfSelectedCard, aListOfSelectedAddresses) {
			var listOfAddresses = [];
			if (aListOfSelectedCard != null && aListOfSelectedCard !== undefined && aListOfSelectedCard != "") {
				listOfAddresses = cardbookUtils.getAddressesFromCards(aListOfSelectedCard);
			} else if (aListOfSelectedAddresses != null && aListOfSelectedAddresses !== undefined && aListOfSelectedAddresses != "") {
				listOfAddresses = JSON.parse(JSON.stringify(aListOfSelectedAddresses));
			}
			
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var localizeEngine = prefs.getComplexValue("extensions.cardbook.localizeEngine", Components.interfaces.nsISupportsString).data;
			var urlEngine = "";
			if (localizeEngine === "GoogleMaps") {
				urlEngine = "https://www.google.com/maps?q=";
			} else if (localizeEngine === "OpenStreetMap") {
				urlEngine = "https://www.openstreetmap.org/search?query=";
			} else if (localizeEngine === "BingMaps") {
				urlEngine = "https://www.bing.com/maps/?q=";
			} else {
				return;
			}

			var localizeTarget = prefs.getComplexValue("extensions.cardbook.localizeTarget", Components.interfaces.nsISupportsString).data;
			for (var i = 0; i < listOfAddresses.length; i++) {
				var url = urlEngine + listOfAddresses[i][2].replace(" ","+") + "+" + listOfAddresses[i][3].replace(" ","+") + "+" +
									listOfAddresses[i][4].replace(" ","+") + "+" + listOfAddresses[i][5].replace(" ","+") + "+" +
									listOfAddresses[i][6].replace(" ","+");
				if (localizeTarget === "in") {
					let tabmail = document.getElementById("tabmail");
					if (!tabmail) {
						// Try opening new tabs in an existing 3pane window
						let mail3PaneWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("mail:3pane");
						if (mail3PaneWindow) {
							tabmail = mail3PaneWindow.document.getElementById("tabmail");
							mail3PaneWindow.focus();
						}
					}
					if (tabmail) {
						tabmail.openTab("contentTab", {contentPage: url});
					} else {
						window.openDialog("chrome://messenger/content/", "_blank","chrome,dialog=no,all", null,
						{ tabType: "contentTab", tabParams: {contentPage: url} });
					}
				} else if (localizeTarget === "out") {
					var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
					var uri = ioService.newURI(url, null, null);
					var externalProtocolService = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"].getService(Components.interfaces.nsIExternalProtocolService);
					externalProtocolService.loadURI(uri, null);
				}
			}
		},

		sortCardsTreeCol: function (aColumn) {
			var myTree = document.getElementById('cardsTree');

			// get selected cards
			var listOfUid = [];
			listOfUid = cardbookUtils.getSelectedCards();

			var columnName;
			var order = myTree.getAttribute("sortDirection") == "ascending" ? 1 : -1;
			
			// if the column is passed and it's already sorted by that column, reverse sort
			if (aColumn) {
				columnName = aColumn.id;
				if (myTree.getAttribute("sortResource") == columnName) {
					order *= -1;
				}
			} else {
				columnName = myTree.getAttribute("sortResource");
			}
			
			if (cardbookRepository.cardbookSearchMode === "SEARCH") {
				var mySelectedAccount = cardbookRepository.cardbookSearchValue;
			} else {
				var myTree = document.getElementById('accountsOrCatsTree');
				if (myTree.currentIndex != -1) {
					var mySelectedAccount = myTree.view.getCellText(myTree.currentIndex, myTree.columns.getNamedColumn("accountId"));
				} else {
					return;
				}
			}
			if (cardbookRepository.cardbookDisplayCards[mySelectedAccount]) {
				cardbookRepository.cardbookDisplayCards[mySelectedAccount].sort(function(a,b) {
					if (a[columnName].toUpperCase() > b[columnName].toUpperCase()) return 1 * order;
					if (a[columnName].toUpperCase() < b[columnName].toUpperCase()) return -1 * order;
					return 0;
				});
			} else {
				return;
			}

			//setting these will make the sort option persist
			var myTree = document.getElementById('cardsTree');
			myTree.setAttribute("sortDirection", order == 1 ? "ascending" : "descending");
			myTree.setAttribute("sortResource", columnName);
			
			wdw_cardbook.displayAccountOrCat(cardbookRepository.cardbookDisplayCards[mySelectedAccount]);
			
			//set the appropriate attributes to show to indicator
			var cols = myTree.getElementsByTagName("treecol");
			for (var i = 0; i < cols.length; i++) {
				cols[i].removeAttribute("sortDirection");
			}
			document.getElementById(columnName).setAttribute("sortDirection", order == 1 ? "ascending" : "descending");

			// select Cards back
			cardbookUtils.setSelectedCards(listOfUid);
		},

		sortListTreeCol: function (aTreeName, aColumn, aSelectedList) {
			if (aTreeName != null && aTreeName !== undefined && aTreeName != "") {
				var myTreeName = aTreeName;
			} else {
				var myTreeName = aColumn.id.replace("Fn", "").replace("Uid", "");
			}
			var myTree = document.getElementById(myTreeName + 'Tree');
			
			// get selected cards
			var listOfUid = {};
			if (!(aSelectedList != null && aSelectedList !== undefined && aSelectedList != "")) {
				listOfUid[myTreeName] = cardbookUtils.getSelectedCardsForList(myTree);
			} else {
				listOfUid[myTreeName] = aSelectedList;
			}

			var columnName;
			var order = myTree.getAttribute("sortDirection") == "ascending" ? 1 : -1;
			
			// if the column is passed and it's already sorted by that column, reverse sort
			if (aColumn) {
				columnName = aColumn.id;
				if (myTree.getAttribute("sortResource") == columnName) {
					order *= -1;
				}
			} else {
				columnName = myTree.getAttribute("sortResource");
			}
			
			if (wdw_cardbook.cardbookeditlists[myTreeName]) {
				wdw_cardbook.cardbookeditlists[myTreeName].sort(function(a,b) {
					if (columnName.indexOf("Fn") >= 0) {
						if (a[1].toUpperCase() > b[1].toUpperCase()) return 1 * order;
						if (a[1].toUpperCase() < b[1].toUpperCase()) return -1 * order;
					} else if (columnName.indexOf("Uid") >= 0) {
						if (a[0].toUpperCase() > b[0].toUpperCase()) return 1 * order;
						if (a[0].toUpperCase() < b[0].toUpperCase()) return -1 * order;
					} else {
						return 0;
					}
				});
			} else {
				return;
			}

			//setting these will make the sort option persist
			myTree.setAttribute("sortDirection", order == 1 ? "ascending" : "descending");
			myTree.setAttribute("sortResource", columnName);

			wdw_cardbook.displayListTrees(myTreeName);

			//set the appropriate attributes to show to indicator
			var cols = myTree.getElementsByTagName("treecol");
			for (var i = 0; i < cols.length; i++) {
				cols[i].removeAttribute("sortDirection");
			}
			document.getElementById(columnName).setAttribute("sortDirection", order == 1 ? "ascending" : "descending");

			// select Cards back
			cardbookUtils.setSelectedCardsForList(myTree, listOfUid[myTreeName]);
		},

		startDrag: function (aEvent, aTreeChildren) {
			try {
				var listOfUid = [];
				cardbookDirTree.dragMode = "dragMode";
				if (aTreeChildren.id == "cardsTreeChildren") {
					var myTree = document.getElementById('cardsTree');
					var numRanges = myTree.view.selection.getRangeCount();
					var start = new Object();
					var end = new Object();
					for (var i = 0; i < numRanges; i++) {
						myTree.view.selection.getRangeAt(i,start,end);
						for (var j = start.value; j <= end.value; j++){
							var myId = myTree.view.getCellText(j, {id: "dirPrefId"})+"::"+myTree.view.getCellText(j, {id: "uid"});
							listOfUid.push(myId);
						}
					}
				} else if (aTreeChildren.id == "accountsOrCatsTreeChildren") {
					var myTree = document.getElementById('accountsOrCatsTree');
					if (cardbookRepository.cardbookSearchMode === "SEARCH") {
						var myAccountPrefId = cardbookRepository.cardbookSearchValue;
					} else {
						var myAccountPrefId = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
					}
					for (var i = 0; i < cardbookRepository.cardbookDisplayCards[myAccountPrefId].length; i++) {
						var myId = cardbookRepository.cardbookDisplayCards[myAccountPrefId][i].dirPrefId+"::"+cardbookRepository.cardbookDisplayCards[myAccountPrefId][i].uid;
						listOfUid.push(myId);
					}
				}
				aEvent.dataTransfer.setData("text/plain", listOfUid.join("@@@@@"));
				// aEvent.dataTransfer.effectAllowed = "copy";
				// aEvent.dataTransfer.dropEffect = "copy";

				var myCanvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
				var myContext = myCanvas.getContext('2d');
				var myImage = new Image();
				var myIconMaxSize = 26;
				var myIconMaxNumber = 5;
				myCanvas.id = 'dragCanvas';
				myCanvas.height = myIconMaxSize;
				// need to know the canvas size before
				if (listOfUid.length >= myIconMaxNumber) {
					var myLength = myIconMaxNumber;
				} else {
					var myLength = listOfUid.length;
				}
				myCanvas.width = (myLength + 1) * myIconMaxSize;
				// concatenate images
				for (var i = 0; i < myLength; i++) {
					var myId = listOfUid[i];
					var myPhoto = cardbookRepository.cardbookCards[myId].photo.localURI;
					if (myPhoto != null && myPhoto !== undefined && myPhoto != "") {
						myImage.src = myPhoto;
					} else {
						myImage.src = "chrome://cardbook/skin/missing_photo_200_214.png";
					}
					myContext.drawImage(myImage, i*myIconMaxSize, 0, myIconMaxSize, myIconMaxSize);
				}
				if (listOfUid.length > myIconMaxNumber) {
					// Concatenate a triangle
					var path=new Path2D();
					path.moveTo(myIconMaxSize*myIconMaxNumber,0);
					path.lineTo(myIconMaxSize*(myIconMaxNumber+1),myIconMaxSize/2);
					path.lineTo(myIconMaxSize*myIconMaxNumber,myIconMaxSize);
					myContext.fill(path);
				}
				aEvent.dataTransfer.setDragImage(myCanvas, 0, 0);
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.startDrag error : " + e);
			}
		},

		dragCards: function (aEvent) {
			cardbookDirTree.dragMode = "";
			var myTree = document.getElementById('accountsOrCatsTree');
			var row = { }, col = { }, child = { };
			myTree.treeBoxObject.getCellAt(aEvent.clientX, aEvent.clientY, row, col, child);
			var myTarget = myTree.view.getCellText(row.value, {id: "accountId"});
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var myDirPrefId = cardbookUtils.getAccountId(myTarget);
			var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
			var myDirPrefIdType = cardbookPrefService.getType();
			var myDirPrefIdUrl = cardbookPrefService.getUrl();
			var myDirPrefIdEnabled = cardbookPrefService.getEnabled();
			
			if (myDirPrefIdEnabled) {
				aEvent.preventDefault();
				var dataArray = aEvent.dataTransfer.getData("text/plain").split("@@@@@");
				if (dataArray.length) {
					for (var i = 0; i < dataArray.length; i++) {
						if (cardbookRepository.cardbookCards[dataArray[i]]) {
							var myCard = cardbookRepository.cardbookCards[dataArray[i]];
							cardbookSynchronization.importCard(myCard, myTarget);
						} else {
							cardbookUtils.formatStringForOutput("draggableWrong");
						}
					}
					if (myDirPrefIdType === "FILE") {
						cardbookSynchronization.writeCardsToFile(myDirPrefIdUrl, cardbookRepository.cardbookDisplayCards[myDirPrefId], true);
					}
					wdw_cardbook.selectAccountOrCat(myDirPrefId);
					wdw_cardbook.refreshAccountsInDirTree();
					wdw_cardbook.sortCardsTreeCol();
				} else {
					cardbookUtils.formatStringForOutput("draggableWrong");
				}
			} else {
				var myDirPrefIdName = cardbookPrefService.getName();
				cardbookUtils.formatStringForOutput("addressbookDisabled", [myDirPrefIdName]);
			}
		},

		addUidToAdded: function (aCardList) {
			var found = false;
			for (var j = 0; j < wdw_cardbook.cardbookeditlists.addedCards.length; j++) {
				if (wdw_cardbook.cardbookeditlists.addedCards[j][0] == aCardList[0]) {
					found = true;
					break;
				}
			}
			if (!found) {
				wdw_cardbook.cardbookeditlists.addedCards.splice(0, 0, [aCardList[0], aCardList[1]]);
			}
		},

		removeUidFromAdded: function (aCardList) {
			function removeCardList(element) {
				return (element[0] != aCardList[0]);
			}
			wdw_cardbook.cardbookeditlists.addedCards = wdw_cardbook.cardbookeditlists.addedCards.filter(removeCardList);
		},

		modifyLists: function (aMenuOrTree) {
			switch (aMenuOrTree.id) {
				case "availableCardsTreeChildren":
					var myAction = "appendlistavailableCardsTree";
					break;
				case "addedCardsTreeChildren":
					var myAction = "deletelistaddedCardsTree";
					break;
				default:
					var myAction = aMenuOrTree.id.replace("Menu", "").replace("Button", "");
					break;
			}
			var myAvailableCardsTree = document.getElementById('availableCardsTree');
			var myAddedCardsTree = document.getElementById('addedCardsTree');
			var myAvailableCards = cardbookUtils.getSelectedCardsForList(myAvailableCardsTree);
			var myAddedCards = cardbookUtils.getSelectedCardsForList(myAddedCardsTree);
			switch (myAction) {
				case "appendlistavailableCardsTree":
					for (var i = 0; i < myAvailableCards.length; i++) {
						wdw_cardbook.addUidToAdded(myAvailableCards[i]);
					}
					break;
				case "deletelistaddedCardsTree":
					for (var i = 0; i < myAddedCards.length; i++) {
						wdw_cardbook.removeUidFromAdded(myAddedCards[i]);
					}
					break;
				default:
					break;
			}
			wdw_cardbook.sortListTreeCol('addedCards', null, myAddedCards);
			wdw_cardbook.searchAvailableCards(myAvailableCards);
		},

		searchAvailableCards: function (aSelectedList) {
			var listOfUid = [];
			if (!(aSelectedList != null && aSelectedList !== undefined && aSelectedList != "")) {
				var myTree = document.getElementById('availableCardsTree');
				listOfUid = cardbookUtils.getSelectedCardsForList(myTree);
			} else {
				listOfUid = aSelectedList;
			}
			var searchValue = document.getElementById('searchAvailableCardsInput').value.replace(/[\s+\-+\.+\,+\;+]/g, "").toUpperCase();
			wdw_cardbook.cardbookeditlists.availableCards = [];
			var myTree = document.getElementById('accountsOrCatsTree');
			if (myTree.currentIndex != -1) {
				var myCurrentAccountId = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
				var myCurrentDirPrefId = cardbookUtils.getAccountId(myCurrentAccountId);
				for (var i = 0; i < cardbookRepository.cardbookCardSearch.length; i++) {
					if (cardbookRepository.cardbookCardSearch[i][0].indexOf(searchValue) >= 0 || searchValue == "") {
						var myCard = cardbookRepository.cardbookCards[cardbookRepository.cardbookCardSearch[i][1]];
						if (myCard.dirPrefId == myCurrentDirPrefId) {
							var found = false;
							for (var j = 0; j < wdw_cardbook.cardbookeditlists.addedCards.length; j++) {
								if (wdw_cardbook.cardbookeditlists.addedCards[j][0].replace("urn:uuid:", "") == myCard.uid) {
									found = true;
									break;
								}
							}
							if (!found) {
								wdw_cardbook.cardbookeditlists.availableCards.push(["urn:uuid:" + myCard.uid, myCard.fn]);
							}
						}
					}
				}
			}
			wdw_cardbook.sortListTreeCol('availableCards', null, listOfUid);
		},

		search: function () {
			wdw_cardbook.setSearchMode();
			cardbookRepository.cardbookSearchValue = document.getElementById('searchInput').value.replace(/[\s+\-+\.+\,+\;+]/g, "").toUpperCase();

			if (cardbookRepository.cardbookSearchValue != "") {
				cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookSearchValue] = [];
				var myTree = document.getElementById('accountsOrCatsTree');
				myTree.view.selection.clearSelection();
				wdw_cardbook.clearAccountOrCat();
				wdw_cardbook.clearCard();
				for (let i = 0; i < cardbookRepository.cardbookCardSearch.length; i++) {
					if (cardbookRepository.cardbookCardSearch[i][0].indexOf(cardbookRepository.cardbookSearchValue) >= 0) {
						var myCard = cardbookRepository.cardbookCards[cardbookRepository.cardbookCardSearch[i][1]];
						cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookSearchValue].push(myCard);
					}
				}
				wdw_cardbook.selectAccountOrCat();
			} else {
				wdw_cardbook.clearAccountOrCat();
				wdw_cardbook.clearCard();
			}
		},

		setSyncControl: function () {
			var nIntervId = setInterval(wdw_cardbook.windowControlShowing, 1000);
		},

		setSearchMode: function () {
			cardbookRepository.cardbookSearchMode = "SEARCH";
			wdw_cardbook.disableCardCreation();
		},

		setNoSearchMode: function () {
			cardbookRepository.cardbookSearchMode = "NOSEARCH";
			cardbookRepository.cardbookSearchValue = "";
			document.getElementById('searchInput').value = "";
			wdw_cardbook.enableCardCreation();
		},

		openLogEdition: function () {
			var myWindow = window.openDialog("chrome://cardbook/content/wdw_logEdition.xul", "", "chrome,modal,resizable,centerscreen");
		},

		openOptionsEdition: function () {
			var myWindow = window.openDialog("chrome://cardbook/content/wdw_cardbookConfiguration.xul", "", "chrome,modal,resizable,centerscreen");
		},

		addAddressbook: function () {
			cardbookRepository.cardbookSyncMode = "SYNC";
			var xulRuntime = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime);
			var myArgs = {serverCallback: wdw_cardbook.createAddressbook};
			var myWindow = window.openDialog("chrome://cardbook/content/addressbooksconfiguration/wdw_addressbooksAdd.xul", "",
											   // Workaround for Bug 1151440 - the HTML color picker won't work
											   // in linux when opened from modal dialog
											   (xulRuntime.OS == 'Linux') ? "chrome,resizable,centerscreen" : "modal,chrome,resizable,centerscreen"
											   , myArgs);
		},
		
		createAddressbook: function (aFinishAction, aFinishParams) {
			if (aFinishAction === "GOOGLE" || aFinishAction === "CARDDAV" || aFinishAction === "APPLE") {
				wdw_cardbook.setNoSearchMode();
				cardbookSynchronization.nullifyMultipleOperations();
				for (var i = 0; i < aFinishParams.length; i++) {
					var serverId = new UUID() + "";
					wdw_cardbook.addAccountToWindow(serverId, aFinishParams[i][3], aFinishAction, aFinishParams[i][2], aFinishParams[i][4], aFinishParams[i][5], true, true);
					wdw_cardbook.loadCssRules();
					cardbookSynchronization.initSync(serverId);
					wdw_cardbook.windowControlShowing();
					cardbookSynchronization.syncAccount(serverId);
				}
			} else if (aFinishAction === "FILE") {
				wdw_cardbook.setNoSearchMode();
				cardbookSynchronization.nullifyMultipleOperations();
				for (var i = 0; i < aFinishParams.length; i++) {
					var serverId = new UUID() + "";
					wdw_cardbook.addAccountToWindow(serverId, aFinishParams[i][3], aFinishAction, aFinishParams[i][2], aFinishParams[i][4], aFinishParams[i][5], true, true);
					wdw_cardbook.loadCssRules();
					cardbookSynchronization.initSync(serverId);
					wdw_cardbook.windowControlShowing();
					cardbookRepository.cardbookFileRequest[serverId]++;
					var myFile = aFinishParams[i][1];
					if (aFinishParams[i][0] === "CREATEFILE") {
						if (myFile.exists()) {
							myFile.remove(true);
						} else {
							myFile.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
						}
					}
					cardbookSynchronization.loadFileBackground(myFile, "", serverId, "WINDOW");
					cardbookSynchronization.waitForSyncFinished(serverId, aFinishParams[i][3]);
				}
			} else {
				cardbookSynchronization.nullifyMultipleOperations();
				cardbookRepository.cardbookSyncMode = "NOSYNC";
			}
		},

		editAddressbook: function () {
			var myTree = document.getElementById('accountsOrCatsTree');
			if (myTree.currentIndex != -1) {
				var myPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				var cardbookPrefService = new cardbookPreferenceService(myPrefId);
				var myPrefIdName = cardbookPrefService.getName();
				var myPrefIdType = cardbookPrefService.getType();
				var myPrefIdUrl = cardbookPrefService.getUrl();
				var myPrefIdUser = cardbookPrefService.getUser();
				var myPrefIdColor = cardbookPrefService.getColor();
				var xulRuntime = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime);
				var myArgs = {serverEditionName: myPrefIdName, serverEditionType: myPrefIdType, serverEditionUrl: myPrefIdUrl, serverEditionUser: myPrefIdUser,
								serverEditionColor: myPrefIdColor, serverEditionId: myPrefId, serverCallback: wdw_cardbook.modifyAddressbook};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_serverEdition.xul", "",
												   // Workaround for Bug 1151440 - the HTML color picker won't work
												   // in linux when opened from modal dialog
												   (xulRuntime.OS == 'Linux') ? "chrome,resizable,centerscreen" : "modal,chrome,resizable,centerscreen"
												   , myArgs);
			}
		},

		removeAddressbook: function () {
			try {
				if (cardbookRepository.cardbookAccounts.length != 0) {
					cardbookRepository.cardbookSyncMode = "SYNC";
					wdw_cardbook.removeAccountFromWindow();
					cardbookRepository.cardbookSyncMode = "NOSYNC";
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.removeAddressbook error : " + e);
			}
		},

		modifyAddressbook: function (aDirPrefId, aName, aColor) {
			cardbookRepository.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
			cardbookPrefService.setName(aName);
			cardbookPrefService.setColor(aColor);
			wdw_cardbook.loadCssRules();
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][4] === aDirPrefId) {
					cardbookRepository.cardbookAccounts[i][0] = aName;
					break;
				}
			}
			wdw_cardbook.refreshAccountsInDirTree();
		},

		enableOrDisableAddressbook: function (aDirPrefId, aValue) {
			cardbookRepository.cardbookSyncMode = "SYNC";
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			if (!(aDirPrefId != null && aDirPrefId !== undefined && aDirPrefId != "")) {
				var myTree = document.getElementById('accountsOrCatsTree');
				if (myTree.currentIndex != -1) {
					aDirPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
					var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
					var aValue = !cardbookPrefService.getEnabled();
				} else {
					return;
				}
			}
			if (!aValue) {
				cardbookUtils.jsInclude(["chrome://cardbook/content/collected/ovl_collected.js"]);
				ovl_collected.removeAccountFromCollected(aDirPrefId);
			}
			var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
			var myDirPrefIdType = cardbookPrefService.getType();
			cardbookPrefService.setEnabled(aValue);
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][4] === aDirPrefId) {
					cardbookRepository.cardbookAccounts[i][6] = aValue;
					break;
				}
			}
			var myDirPrefIdColor = cardbookPrefService.getColor();
			var myDirPrefIdName = cardbookPrefService.getName();
			wdw_cardbook.loadCssRules();
			wdw_cardbook.refreshAccountsInDirTree();
			if (aValue) {
				cardbookSynchronization.initSync(aDirPrefId);
				wdw_cardbook.windowControlShowing();
				if (myDirPrefIdType === "FILE") {
					var myDirPrefIdUrl = cardbookPrefService.getUrl();
					var myFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
					myFile.initWithPath(myDirPrefIdUrl);
					cardbookRepository.cardbookFileRequest[aDirPrefId]++;
					cardbookSynchronization.loadFileBackground(myFile, "", aDirPrefId, "WINDOW");
					cardbookSynchronization.waitForSyncFinished(aDirPrefId, myDirPrefIdName);
				} else if (myDirPrefIdType === "CACHE") {
					cardbookRepository.cardbookDirRequest[aDirPrefId]++;
					var myDir = cardbookRepository.getLocalDirectory();
					myDir.append(cardbookRepository.cardbookCollectedCardsId);
					cardbookSynchronization.loadDir(myDir, "", aDirPrefId, "WINDOW");
					cardbookSynchronization.waitForSyncFinished(aDirPrefId, myDirPrefIdName);
				} else {
					cardbookSynchronization.syncAccount(aDirPrefId);
				}
				cardbookUtils.formatStringForOutput("addressbookEnabled", [myDirPrefIdName]);
			} else {
				cardbookRepository.emptyAccountFromRepository(aDirPrefId);
				wdw_cardbook.windowControlShowing();
				wdw_cardbook.refreshAccountsInDirTree();
				wdw_cardbook.sortCardsTreeCol();
				wdw_cardbook.selectAccountOrCat();
				cardbookRepository.cardbookSyncMode = "NOSYNC";
				cardbookUtils.formatStringForOutput("addressbookDisabled", [myDirPrefIdName]);
			}
		},

		expandOrContractAddressbook: function (aDirPrefId, aValue) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
			var myDirPrefIdType = cardbookPrefService.getType();
			cardbookPrefService.setExpanded(aValue);
		},

		loadCssRules: function () {
			for each (var styleSheet in document.styleSheets) {
				if (styleSheet.href == "chrome://cardbook/skin/cardbookTreeChildrens.css") {
					cardbookRepository.cardbookDynamicCssRules[styleSheet.href] = [];
					cardbookRepository.deleteCssAllRules(styleSheet);
					var createSearchRules = cardbookRepository.isthereSearchRulesToCreate();
					for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
						if (cardbookRepository.cardbookAccounts[i][1]) {
							var dirPrefId = cardbookRepository.cardbookAccounts[i][4];
							cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
							var cardbookPrefService = new cardbookPreferenceService(dirPrefId);
							var color = cardbookPrefService.getColor()
							cardbookRepository.createCssAccountRules(styleSheet, dirPrefId, color);
							if (createSearchRules && cardbookRepository.cardbookAccounts[i][6]) {
								cardbookRepository.createCssCardRules(styleSheet, dirPrefId, color);
							}
						}
					}
					cardbookRepository.reloadCss(styleSheet.href);
				} else if (styleSheet.href == "chrome://cardbook/skin/cardbookTreeCols.css") {
					cardbookRepository.cardbookDynamicCssRules[styleSheet.href] = [];
					cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
					let cardbookPrefService = new cardbookPreferenceService();
					if (cardbookPrefService.getHideHeaders()) {
						cardbookRepository.createCssHeaderRules(styleSheet);
						cardbookRepository.reloadCss(styleSheet.href);
					}
					cardbookRepository.reloadCss(styleSheet.href);
				}
			}
		},

		removeCategory: function () {
			try {
				cardbookRepository.cardbookSyncMode = "SYNC";
				var myTree = document.getElementById('accountsOrCatsTree');
				if (myTree.view.isContainer(myTree.currentIndex)) {
					cardbookRepository.cardbookSyncMode = "NOSYNC";
					return;
				} else {
					var myCategory = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
					var mySepPosition = myCategory.indexOf("::",0);
					if (mySepPosition != -1) {
						var myDirPrefId = myCategory.substr(0, mySepPosition);
						var myCategoryName = myCategory.substr(mySepPosition+2, myCategory.length);
						if (myCategoryName != cardbookRepository.cardbookUncategorizedCards) {
							var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
							var myDirPrefIdName = cardbookPrefService.getName();
							var myDirPrefIdType = cardbookPrefService.getType();
							var myDirPrefIdUrl = cardbookPrefService.getUrl();
							
							var myCards = cardbookRepository.cardbookDisplayCards[myCategory];
							for (var i = 0; i < myCards.length; i++) {
								var myCard = myCards[i];
								if (myDirPrefIdType === "FILE") {
									// if aCard and aModifiedCard have the same cached medias
									cardbookUtils.changeMediaFromFileToContent(myCard);
									cardbookRepository.removeCardFromRepository(myCard, true);
									cardbookRepository.removeCategoryFromCards(myCard, myCategoryName);
									cardbookRepository.addCardToRepository(myCard, "WINDOW");
								} else if (myDirPrefIdType === "CACHE") {
									// if aCard and aModifiedCard have the same cached medias
									cardbookUtils.changeMediaFromFileToContent(myCard);
									cardbookRepository.removeCardFromRepository(myCard, true);
									cardbookRepository.removeCategoryFromCards(myCard, myCategoryName);
									cardbookRepository.addCardToRepository(myCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(myCard, myDirPrefIdType));
								} else {
									// if aCard and aModifiedCard have the same cached medias
									cardbookUtils.changeMediaFromFileToContent(myCard);
									if (!(cardbookUtils.searchTagCreated(myCard))) {
										cardbookUtils.addTagUpdated(myCard);
									}
									cardbookRepository.removeCardFromRepository(myCard, true);
									cardbookRepository.removeCategoryFromCards(myCard, myCategoryName);
									cardbookRepository.addCardToRepository(myCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(myCard, myDirPrefIdType));
								}
								cardbookUtils.formatStringForOutput("cardRemovedFromCategory", [myDirPrefIdName, myCard.fn, myCategoryName]);
							}
							
							cardbookRepository.removeCategoryFromCategories(myDirPrefId, myCategoryName);
							cardbookRepository.removeCategoryFromAccounts(myCategory);
							cardbookRepository.removeCategoryFromDisplay(myCategory);
							if (myDirPrefIdType === "FILE") {
								cardbookSynchronization.writeCardsToFile(myDirPrefIdUrl, cardbookRepository.cardbookDisplayCards[myDirPrefId], true);
							}
						}
					}
					wdw_cardbook.refreshAccountsInDirTree();
					wdw_cardbook.sortCardsTreeCol();
					cardbookRepository.cardbookSyncMode = "NOSYNC";
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.removeCategory error : " + e);
			}
		},

		copyCardTree: function (aMenu) {
			var myResult = "";
			var myTreeName = aMenu.id.replace("copy","");
			var myTree = document.getElementById(myTreeName);
			if (myTree.currentIndex != -1) {
				myColumn = myTree.columns.getFirstColumn();
				if (document.getElementById(myColumn.id).getAttribute("hidden") !== "true") {
					if (myColumn.id !== myTreeName.replace("Tree","Type") && myColumn.id !== myTreeName.replace("Tree","Pref") && myColumn.id !== myTreeName.replace("Tree","PrefWeight")) {
						if (myResult == "") {
							myResult = myTree.view.getCellText(myTree.currentIndex, myColumn);
						} else {
							myResult = myResult + " " + myTree.view.getCellText(myTree.currentIndex, myColumn);
						}
					}
				}
				for (var i = 1; i < myTree.columns.count; i++) {
					myColumn = myColumn.getNext();
					if (document.getElementById(myColumn.id).getAttribute("hidden") !== "true") {
						if (myColumn.id !== myTreeName.replace("Tree","Type") && myColumn.id !== myTreeName.replace("Tree","Pref") && myColumn.id !== myTreeName.replace("Tree","PrefWeight")) {
							if (myResult == "") {
								myResult = myTree.view.getCellText(myTree.currentIndex, myColumn);
							} else {
								myResult = myResult + " " + myTree.view.getCellText(myTree.currentIndex, myColumn);
							}
						}
					}
				}
				if (aMenu.id == "copyaddressTree") {
					myResult = document.getElementById('fnTextBox').value + "\n" + myResult;
				}
				var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
				var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
				var myMessage = strBundle.GetStringFromName("lineCopied");
				cardbookUtils.clipboardSet(myResult, myMessage);
			}
		},

		editCardTree: function (aMenuOrTree) {
			if (aMenuOrTree.id == "editaddressTree" || aMenuOrTree.id == "addressTreeChildren") {
				var myTree = document.getElementById('addressTree');
				if (myTree.currentIndex != -1) {
					var mySelectedPosition = myTree.currentIndex;
					var myArgs = {adrLine: wdw_cardbook.cardbookeditadrs[mySelectedPosition], version: document.getElementById('versionRadiogroup').value,
									action: ""};
					var myWindow = window.openDialog("chrome://cardbook/content/wdw_adrEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
					if (myArgs.action == "SAVE") {
						if (myArgs.adrLine.join("") != "") {
							wdw_cardbook.cardbookeditadrs[mySelectedPosition] = myArgs.adrLine;
						} else {
							wdw_cardbook.cardbookeditadrs.splice(mySelectedPosition, 1);
						}
						wdw_cardbook.displayAddresses(document.getElementById('versionRadiogroup').value);
					}
				}
			}
			else if (aMenuOrTree.id == "edittelTree" || aMenuOrTree.id == "telTreeChildren") {
				var myTree = document.getElementById('telTree');
				if (myTree.currentIndex != -1) {
					var mySelectedPosition = myTree.currentIndex;
					var myArgs = {telLine: wdw_cardbook.cardbookedittels[mySelectedPosition], version: document.getElementById('versionRadiogroup').value,
									action: ""};
					var myWindow = window.openDialog("chrome://cardbook/content/wdw_telEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
					if (myArgs.action == "SAVE") {
						if (myArgs.telLine.join("") != "") {
							wdw_cardbook.cardbookedittels[mySelectedPosition] = myArgs.telLine;
						} else {
							wdw_cardbook.cardbookedittels.splice(mySelectedPosition, 1);
						}
						wdw_cardbook.displayTels(document.getElementById('versionRadiogroup').value);
					}
				}
			} else if (aMenuOrTree.id == "editemailTree" || aMenuOrTree.id == "emailTreeChildren") {
				var myTree = document.getElementById('emailTree');
				if (myTree.currentIndex != -1) {
					var mySelectedPosition = myTree.currentIndex;
					var myArgs = {emailLine: wdw_cardbook.cardbookeditemails[mySelectedPosition], version: document.getElementById('versionRadiogroup').value,
									action: ""};
					var myWindow = window.openDialog("chrome://cardbook/content/wdw_emailEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
					if (myArgs.action == "SAVE") {
						if (myArgs.emailLine.join("") != "") {
							wdw_cardbook.cardbookeditemails[mySelectedPosition] = myArgs.emailLine;
						} else {
							wdw_cardbook.cardbookeditemails.splice(mySelectedPosition, 1);
						}
						wdw_cardbook.displayEmails(document.getElementById('versionRadiogroup').value);
					}
				}
			} else if (aMenuOrTree.id == "editimppTree" || aMenuOrTree.id == "imppTreeChildren") {
				var myTree = document.getElementById('imppTree');
				if (myTree.currentIndex != -1) {
					var mySelectedPosition = myTree.currentIndex;
					var myArgs = {imppLine: wdw_cardbook.cardbookeditimpps[mySelectedPosition], version: document.getElementById('versionRadiogroup').value,
									action: ""};
					var myWindow = window.openDialog("chrome://cardbook/content/wdw_imppEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
					if (myArgs.action == "SAVE") {
						if (myArgs.imppLine.join("") != "") {
							wdw_cardbook.cardbookeditimpps[mySelectedPosition] = myArgs.imppLine;
						} else {
							wdw_cardbook.cardbookeditimpps.splice(mySelectedPosition, 1);
						}
						wdw_cardbook.displayImpps(document.getElementById('versionRadiogroup').value);
					}
				}
			} else if (aMenuOrTree.id == "editurlTree" || aMenuOrTree.id == "urlTreeChildren") {
				var myTree = document.getElementById('urlTree');
				if (myTree.currentIndex != -1) {
					var mySelectedPosition = myTree.currentIndex;
					var myArgs = {urlLine: wdw_cardbook.cardbookediturls[mySelectedPosition], version: document.getElementById('versionRadiogroup').value,
									action: ""};
					var myWindow = window.openDialog("chrome://cardbook/content/wdw_urlEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
					if (myArgs.action == "SAVE") {
						if (myArgs.urlLine.join("") != "") {
							wdw_cardbook.cardbookediturls[mySelectedPosition]= myArgs.urlLine;
						} else {
							wdw_cardbook.cardbookediturls.splice(mySelectedPosition, 1);
						}
						wdw_cardbook.displayUrls(document.getElementById('versionRadiogroup').value);
					}
				}
			}
			if (myArgs.action == "SAVE") {
				wdw_cardbook.saveCard();
			}
		},

		addCardInfo: function (aMenu) {
			if (aMenu.id == "buttonName") {
				var nameList = ["prefixname", "firstname", "othername", "lastname", "suffixname"];
				var myArgs = {fn: document.getElementById('fnTextBox').value, lastname: document.getElementById('lastnameTextBox').value,
								firstname: document.getElementById('firstnameTextBox').value, othername: document.getElementById('othernameTextBox').value,
								prefixname: document.getElementById('prefixnameTextBox').value, suffixname: document.getElementById('suffixnameTextBox').value,
								nickname: document.getElementById('nicknameTextBox').value, customField1NameTextBox: document.getElementById('customField1NameTextBox').value,
								customField2NameTextBox: document.getElementById('customField2NameTextBox').value, action: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_nameEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.action == "SAVE") {
					var myNewN = [myArgs.prefixname, myArgs.firstname, myArgs.othername, myArgs.lastname, myArgs.suffixname];
					document.getElementById('fnTextBox').value = cardbookUtils.getDisplayedName(document.getElementById('fnTextBox').value, myArgs.fn, wdw_cardbook.cardbookeditn, myNewN,
																								wdw_cardbook.cardbookeditorg, wdw_cardbook.cardbookeditorg);
					document.getElementById('lastnameTextBox').value = myArgs.lastname;
					document.getElementById('firstnameTextBox').value = myArgs.firstname;
					document.getElementById('othernameTextBox').value = myArgs.othername;
					document.getElementById('prefixnameTextBox').value = myArgs.prefixname;
					document.getElementById('suffixnameTextBox').value = myArgs.suffixname;
					document.getElementById('nicknameTextBox').value = myArgs.nickname;
					document.getElementById('customField1NameTextBox').value = myArgs.customField1NameTextBox;
					document.getElementById('customField2NameTextBox').value = myArgs.customField2NameTextBox;
					wdw_cardbook.cardbookeditn = JSON.parse(JSON.stringify(myNewN));
				}
			} else if (aMenu.id == "buttonOrg") {
				var myArgs = {org: document.getElementById('orgTextBox').value, title: document.getElementById('titleTextBox').value,
								role: document.getElementById('roleTextBox').value, customField1OrgTextBox: document.getElementById('customField1OrgTextBox').value,
								customField2OrgTextBox: document.getElementById('customField2OrgTextBox').value, action: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_orgEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.action == "SAVE") {
					document.getElementById('fnTextBox').value = cardbookUtils.getDisplayedName(document.getElementById('fnTextBox').value, document.getElementById('fnTextBox').value, wdw_cardbook.cardbookeditn,
																									wdw_cardbook.cardbookeditn, wdw_cardbook.cardbookeditorg, myArgs.org);
					document.getElementById('orgTextBox').value = myArgs.org;
					document.getElementById('titleTextBox').value = myArgs.title;
					document.getElementById('roleTextBox').value = myArgs.role;
					document.getElementById('customField1OrgTextBox').value = myArgs.customField1OrgTextBox;
					document.getElementById('customField2OrgTextBox').value = myArgs.customField2OrgTextBox;
					wdw_cardbook.cardbookeditorg = myArgs.org;
				}
			} else if (aMenu.id == "buttonCategories") {
				var myArgs = {categories: wdw_cardbook.cardbookeditcategories, dirPrefId: document.getElementById('dirPrefIdTextBox').value, action: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_categoriesEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.action == "SAVE") {
					wdw_cardbook.cardbookeditcategories = myArgs.categories;
					wdw_cardbook.displayCategories();
				}
			} else if (aMenu.id == "buttonNote" || aMenu.id == "noteTextBox") {
				var myArgs = {note: document.getElementById('noteTextBox').value,
									action: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_noteEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.action == "SAVE") {
					document.getElementById('noteTextBox').value = myArgs.note;
				}
			} else if (aMenu.id == "buttonBirthday") {
				var myArgs = {bday: document.getElementById('bdayTextBox').value,
									action: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_bdayEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.action == "SAVE") {
					document.getElementById('bdayTextBox').value = myArgs.bday;
				}
			} else if (aMenu.id == "addaddressTree" || aMenu.id == "addressTreeChildren" || aMenu.id == "buttonAddress") {
				var myTree = document.getElementById('addressTree');
				var mySelectedPosition = myTree.currentIndex;
				var myArgs = {adrLine: [ ["", "", "", "", "", "", ""], [""], "", [""] ], version: document.getElementById('versionRadiogroup').value,
									action: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_adrEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.action == "SAVE") {
					if (myArgs.adrLine.join("") != "") {
						wdw_cardbook.cardbookeditadrs.splice(mySelectedPosition+1, 0, myArgs.adrLine);
						wdw_cardbook.displayAddresses(document.getElementById('versionRadiogroup').value);
					}
				}
			} else if (aMenu.id == "addtelTree" || aMenu.id == "telTreeChildren" || aMenu.id == "buttonPhone") {
				var myTree = document.getElementById('telTree');
				var mySelectedPosition = myTree.currentIndex;
				var myArgs = {telLine: [ [""], [""], "", [""] ], version: document.getElementById('versionRadiogroup').value,
									action: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_telEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.action == "SAVE") {
					if (myArgs.telLine.join("") != "") {
						wdw_cardbook.cardbookedittels.splice(mySelectedPosition+1, 0, myArgs.telLine);
						wdw_cardbook.displayTels(document.getElementById('versionRadiogroup').value);
					}
				}
			} else if (aMenu.id == "addemailTree" || aMenu.id == "emailTreeChildren" || aMenu.id == "buttonEmail") {
				var myTree = document.getElementById('emailTree');
				var mySelectedPosition = myTree.currentIndex;
				var myArgs = {emailLine: [ [""], [""], "", [""] ], version: document.getElementById('versionRadiogroup').value,
									action: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_emailEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.action == "SAVE") {
					if (myArgs.emailLine.join("") != "") {
						wdw_cardbook.cardbookeditemails.splice(mySelectedPosition+1, 0, myArgs.emailLine);
						wdw_cardbook.displayEmails(document.getElementById('versionRadiogroup').value);
					}
				}
			} else if (aMenu.id == "addimppTree" || aMenu.id == "imppTreeChildren" || aMenu.id == "buttonImpp") {
				var myTree = document.getElementById('imppTree');
				var mySelectedPosition = myTree.currentIndex;
				var myArgs = {imppLine: [ [""], [""], "", [""] ], version: document.getElementById('versionRadiogroup').value,
									action: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_imppEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.action == "SAVE") {
					if (myArgs.imppLine.join("") != "") {
						wdw_cardbook.cardbookeditimpps.splice(mySelectedPosition+1, 0, myArgs.imppLine);
						wdw_cardbook.displayImpps(document.getElementById('versionRadiogroup').value);
					}
				}
			} else if (aMenu.id == "addurlTree" || aMenu.id == "urlTreeChildren" || aMenu.id == "buttonUrl") {
				var myTree = document.getElementById('urlTree');
				var mySelectedPosition = myTree.currentIndex;
				var myArgs = {urlLine: [ [""], [""], "", [""] ], version: document.getElementById('versionRadiogroup').value,
									action: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_urlEdition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.action == "SAVE") {
					if (myArgs.urlLine.join("") != "") {
						wdw_cardbook.cardbookediturls.splice(mySelectedPosition+1, 0, myArgs.urlLine);
						wdw_cardbook.displayUrls(document.getElementById('versionRadiogroup').value);
					}
				}
			}
			wdw_cardbook.adjustFields();
			if (myArgs.action == "SAVE") {
				wdw_cardbook.saveCard();
			}
		},

		deleteCardTree: function (aMenu) {
			if (aMenu.id == "deleteaddressTree") {
				var myTree = document.getElementById('addressTree');
				wdw_cardbook.cardbookeditadrs.splice(myTree.currentIndex, 1);
				wdw_cardbook.displayAddresses(document.getElementById('versionRadiogroup').value);
			} else if (aMenu.id == "deletetelTree") {
				var myTree = document.getElementById('telTree');
				wdw_cardbook.cardbookedittels.splice(myTree.currentIndex, 1);
				wdw_cardbook.displayTels(document.getElementById('versionRadiogroup').value);
			} else if (aMenu.id == "deleteemailTree") {
				var myTree = document.getElementById('emailTree');
				wdw_cardbook.cardbookeditemails.splice(myTree.currentIndex, 1);
				wdw_cardbook.displayEmails(document.getElementById('versionRadiogroup').value);
			} else if (aMenu.id == "deleteimppTree") {
				var myTree = document.getElementById('imppTree');
				wdw_cardbook.cardbookeditimpps.splice(myTree.currentIndex, 1);
				wdw_cardbook.displayImpps(document.getElementById('versionRadiogroup').value);
			} else if (aMenu.id == "deleteurlTree") {
				var myTree = document.getElementById('urlTree');
				wdw_cardbook.cardbookediturls.splice(myTree.currentIndex, 1);
				wdw_cardbook.displayUrls(document.getElementById('versionRadiogroup').value);
			}
			wdw_cardbook.adjustFields();
			wdw_cardbook.saveCard();
		},

		displayOrHideHeaders: function () {
			for each (var styleSheet in document.styleSheets) {
				if (styleSheet.href == "chrome://cardbook/skin/cardbookTreeCols.css") {
					if (cardbookRepository.cardbookDynamicCssRules[styleSheet.href].length >= 1) {
						cardbookRepository.deleteCssAllRules(styleSheet);
					} else {
						cardbookRepository.createCssHeaderRules(styleSheet);
					}
					cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
					let cardbookPrefService = new cardbookPreferenceService();
					cardbookPrefService.setHideHeaders(!cardbookPrefService.getHideHeaders());
					cardbookRepository.reloadCss(styleSheet.href);
					break;
				}
			}
		},

		addImageCardFromFile: function () {
			if (document.getElementById('photoLocalURITextBox').value == "") {
				var myFile = cardbookUtils.callFilePicker("imageSelectionTitle", "OPEN", "IMAGES");
				var myCard = cardbookRepository.cardbookCards[document.getElementById('dirPrefIdTextBox').value+"::"+document.getElementById('uidTextBox').value];
				var myExtension = cardbookUtils.getExtension(myFile.path);
				var myExtensionLower = myExtension.toLowerCase();
				if (myExtensionLower == "jpg" || myExtensionLower == "jpeg" || myExtensionLower == "png" || myExtensionLower == "gif") {
					var targetFile = cardbookUtils.getMediaCacheFile(myCard.uid, myCard.dirPrefId, myCard.etag, "photo", myExtensionLower);
					var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
					var myFileURISpec = "file:///" + targetFile.path;
					var myFileURI = ioService.newURI(myFileURISpec, null, null);
					var myFile1 = myFileURI.QueryInterface(Components.interfaces.nsIFileURL).file;
					myFile.copyToFollowingLinks(myFile1.parent,myFile1.leafName);
					cardbookUtils.formatStringForOutput("imageSavedToFile", [myFile1.path]);
					wdw_cardbook.addImageCard(myFile1, myCard, myExtensionLower);
				} else {
					cardbookUtils.formatStringForOutput("imageWrongFormat", [myUrlExtension]);
				}
			}
		},

		addImageCardFromUrl: function () {
			if (document.getElementById('photoLocalURITextBox').value == "") {
				var myCard = cardbookRepository.cardbookCards[document.getElementById('dirPrefIdTextBox').value+"::"+document.getElementById('uidTextBox').value];
				var myUrl = cardbookUtils.clipboardGet();
				var myExtension = cardbookUtils.getExtension(myUrl);
				var myExtensionLower = myExtension.toLowerCase();
				if (myExtensionLower == "jpg" || myExtensionLower == "jpeg" || myExtensionLower == "png" || myExtensionLower == "gif") {
					var targetFile = cardbookUtils.getMediaCacheFile(myCard.uid, myCard.dirPrefId, myCard.etag, "photo", myExtensionLower);
					
					Components.utils.import("resource://gre/modules/Downloads.jsm");
					Components.utils.import("resource://gre/modules/Task.jsm");
					try {
						Task.spawn(function () {
							// Fetch a file in the background.
							let download_1 = Downloads.fetch(myUrl, targetFile);
							yield Promise.all([download_1]);
							
							// Do something with the saved files.
							cardbookUtils.formatStringForOutput("urlDownloaded", [myUrl]);
							wdw_cardbook.addImageCard(targetFile, myCard, myExtensionLower);
						});
					}
					catch(e) {
						cardbookUtils.formatStringForOutput("imageErrorWithMessage", [e]);
					}
				} else {
					cardbookUtils.formatStringForOutput("imageWrongFormat", [myUrlExtension]);
				}
			}
		},

		addImageCardFromClipboard: function () {
			if (document.getElementById('photoLocalURITextBox').value == "") {
				var myCard = cardbookRepository.cardbookCards[document.getElementById('dirPrefIdTextBox').value+"::"+document.getElementById('uidTextBox').value];
				var myExtensionLower = "png";
				var targetFile = cardbookUtils.getMediaCacheFile(myCard.uid, myCard.dirPrefId, myCard.etag, "photo", myExtensionLower);
				var myResult = cardbookUtils.clipboardGetImage(targetFile);
				if (myResult) {
					wdw_cardbook.addImageCard(targetFile, myCard, myExtensionLower);
				} else {
					cardbookUtils.formatStringForOutput("imageError");
				}
			}
		},

		purgeImageCache: function (aFileURI) {
			// for images having the same name we have to clear the cached image
			var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
			var uri = ios.newURI(aFileURI,null,null);
			if (uri) {
				var cache = Components.classes["@mozilla.org/image/tools;1"].getService(Components.interfaces.imgITools).getImgCacheForDocument(null);
				try {
					cache.removeEntry(uri);
				} catch(e) {}
			}
		},

		displayImageCard: function (aFileURI) {
			var myImage = document.getElementById('defaultCardImage');
			var myDummyImage = document.getElementById('imageForSizing');
			
			myImage.src = "";
			myDummyImage.src = "";
			wdw_cardbook.purgeImageCache(aFileURI);
			myDummyImage.src = aFileURI;
			myDummyImage.onload = function() {
				var myImageWidth = 170;
				var myImageHeight = 170;
				if (myDummyImage.width >= myDummyImage.height) {
					widthFound = myImageWidth + "px" ;
					heightFound = Math.round(myDummyImage.height * myImageWidth / myDummyImage.width) + "px" ;
				} else {
					widthFound = Math.round(myDummyImage.width * myImageHeight / myDummyImage.height) + "px" ;
					heightFound = myImageHeight + "px" ;
				}
				myImage.width = widthFound;
				myImage.height = heightFound;
				myImage.src = aFileURI;
			}
		},

		addImageCard: function (aFile, aCard, aExtension) {
			if (aFile != null && aFile !== undefined && aFile != "") {
				var aNewCard = new cardbookCardParser();
				cardbookUtils.cloneCard(aCard, aNewCard);
				aNewCard.photo.URI = "";
				aNewCard.photo.localURI = "file:///" + aFile.path;
				aNewCard.photo.extension = aExtension;
				wdw_cardbook.saveCard(aNewCard);
				if (document.getElementById('dirPrefIdTextBox').value+document.getElementById('uidTextBox').value == aCard.dirPrefId+aCard.uid) {
					wdw_cardbook.displayCard(aCard);
				}
			}
		},

		saveImageCard: function () {
			if (document.getElementById('photoLocalURITextBox').value !== "") {
				var myFile = cardbookUtils.callFilePicker("imageSaveTitle", "SAVE", "IMAGES");
				if (myFile != null && myFile !== undefined && myFile != "") {
					var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
					var myFileURISpec = document.getElementById('photoLocalURITextBox').value;
					var myFileURI = ioService.newURI(myFileURISpec, null, null);
					var myFile1 = myFileURI.QueryInterface(Components.interfaces.nsIFileURL).file;
					myFile1.copyToFollowingLinks(myFile.parent,myFile.leafName);
					cardbookUtils.formatStringForOutput("imageSavedToFile", [myFile.path]);
				}
			}
		},

		deleteImageCard: function () {
			document.getElementById('defaultCardImage').src = "chrome://cardbook/skin/missing_photo_200_214.png";
			document.getElementById('photoLocalURITextBox').value = "";
			document.getElementById('photoURITextBox').value = "";
			wdw_cardbook.adjustFields();
			wdw_cardbook.saveCard();
		},

		moveUpCardTree: function (aMenu) {
			if (aMenu.id == "moveUpaddressTree") {
				var myTree = document.getElementById('addressTree');
				var mySelectedPosition = myTree.currentIndex;
				var temp = wdw_cardbook.cardbookeditadrs[mySelectedPosition-1];
				wdw_cardbook.cardbookeditadrs[mySelectedPosition-1] = wdw_cardbook.cardbookeditadrs[mySelectedPosition];
				wdw_cardbook.cardbookeditadrs[mySelectedPosition] = temp;
			} else if (aMenu.id == "moveUptelTree") {
				var myTree = document.getElementById('telTree');
				var mySelectedPosition = myTree.currentIndex;
				var temp = wdw_cardbook.cardbookedittels[mySelectedPosition-1];
				wdw_cardbook.cardbookedittels[mySelectedPosition-1] = wdw_cardbook.cardbookedittels[mySelectedPosition];
				wdw_cardbook.cardbookedittels[mySelectedPosition] = temp;
			} else if (aMenu.id == "moveUpemailTree") {
				var myTree = document.getElementById('emailTree');
				var mySelectedPosition = myTree.currentIndex;
				var temp = wdw_cardbook.cardbookeditemails[mySelectedPosition-1];
				wdw_cardbook.cardbookeditemails[mySelectedPosition-1] = wdw_cardbook.cardbookeditemails[mySelectedPosition];
				wdw_cardbook.cardbookeditemails[mySelectedPosition] = temp;
			} else if (aMenu.id == "moveUpimppTree") {
				var myTree = document.getElementById('imppTree');
				var mySelectedPosition = myTree.currentIndex;
				var temp = wdw_cardbook.cardbookeditimpps[mySelectedPosition-1];
				wdw_cardbook.cardbookeditimpps[mySelectedPosition-1] = wdw_cardbook.cardbookeditimpps[mySelectedPosition];
				wdw_cardbook.cardbookeditimpps[mySelectedPosition] = temp;
			} else if (aMenu.id == "moveUpurlTree") {
				var myTree = document.getElementById('urlTree');
				var mySelectedPosition = myTree.currentIndex;
				var temp = wdw_cardbook.cardbookediturls[mySelectedPosition-1];
				wdw_cardbook.cardbookediturls[mySelectedPosition-1] = wdw_cardbook.cardbookediturls[mySelectedPosition];
				wdw_cardbook.cardbookediturls[mySelectedPosition] = temp;
			}
			myTree.view.selection.select(mySelectedPosition-1);
		},

		moveDownCardTree: function (aMenu) {
			if (aMenu.id == "moveDownaddressTree") {
				var myTree = document.getElementById('addressTree');
				var mySelectedPosition = myTree.currentIndex;
				var temp = wdw_cardbook.cardbookeditadrs[mySelectedPosition+1];
				wdw_cardbook.cardbookeditadrs[mySelectedPosition+1] = wdw_cardbook.cardbookeditadrs[mySelectedPosition];
				wdw_cardbook.cardbookeditadrs[mySelectedPosition] = temp;
			} else if (aMenu.id == "moveDowntelTree") {
				var myTree = document.getElementById('telTree');
				var mySelectedPosition = myTree.currentIndex;
				var temp = wdw_cardbook.cardbookedittels[mySelectedPosition+1];
				wdw_cardbook.cardbookedittels[mySelectedPosition+1] = wdw_cardbook.cardbookedittels[mySelectedPosition];
				wdw_cardbook.cardbookedittels[mySelectedPosition] = temp;
			} else if (aMenu.id == "moveDownemailTree") {
				var myTree = document.getElementById('emailTree');
				var mySelectedPosition = myTree.currentIndex;
				var temp = wdw_cardbook.cardbookeditemails[mySelectedPosition+1];
				wdw_cardbook.cardbookeditemails[mySelectedPosition+1] = wdw_cardbook.cardbookeditemails[mySelectedPosition];
				wdw_cardbook.cardbookeditemails[mySelectedPosition] = temp;
			} else if (aMenu.id == "moveDownimppTree") {
				var myTree = document.getElementById('imppTree');
				var mySelectedPosition = myTree.currentIndex;
				var temp = wdw_cardbook.cardbookeditimpps[mySelectedPosition+1];
				wdw_cardbook.cardbookeditimpps[mySelectedPosition+1] = wdw_cardbook.cardbookeditimpps[mySelectedPosition];
				wdw_cardbook.cardbookeditimpps[mySelectedPosition] = temp;
			} else if (aMenu.id == "moveDownurlTree") {
				var myTree = document.getElementById('urlTree');
				var mySelectedPosition = myTree.currentIndex;
				var temp = wdw_cardbook.cardbookediturls[mySelectedPosition+1];
				wdw_cardbook.cardbookediturls[mySelectedPosition+1] = wdw_cardbook.cardbookediturls[mySelectedPosition];
				wdw_cardbook.cardbookediturls[mySelectedPosition] = temp;
			}
			myTree.view.selection.select(mySelectedPosition+1);
		},

		changeDisplayOrHideHeadersLabel: function (aMenu) {
			var myTree = document.getElementById(aMenu.id.replace("ContextMenu", ""));
			var mySelectedPosition = myTree.currentIndex;

			var strBundle = document.getElementById("cardbook-strings");
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			let cardbookPrefService = new cardbookPreferenceService();
			if (cardbookPrefService.getHideHeaders()) {
				document.getElementById('displayOrHideHeaders' + myTree.id).label=strBundle.getString("displayHeaders");
			} else {
				document.getElementById('displayOrHideHeaders' + myTree.id).label=strBundle.getString("hideHeaders");
			}
		},

		cardTreeContextShowing: function (aMenu) {
			wdw_cardbook.changeDisplayOrHideHeadersLabel(aMenu);
			
			var myTree = document.getElementById(aMenu.id.replace("ContextMenu", ""));
			var mySelectedPosition = myTree.currentIndex;
			var listOfMenu1 = ["add"];
			for (var i = 0; i < listOfMenu1.length; i++) {
				var myMenu = document.getElementById(listOfMenu1[i] + myTree.id);
				if (myMenu) {
					myMenu.disabled=false;
				}
			}
			var listOfMenu2 = ["localize", "email", "edit", "delete"];
			for (var i = 0; i < listOfMenu2.length; i++) {
				var myMenu = document.getElementById(listOfMenu2[i] + myTree.id);
				if (myMenu) {
					if (myTree.view.rowCount == 0) {
						myMenu.disabled=true;
					} else if (myTree.view.rowCount == 1) {
						myMenu.disabled=false;
					} else {
						myMenu.disabled=false;
					}
				}
			}
			var listOfMenu3 = ["moveUp", "moveDown"];
			for (var i = 0; i < listOfMenu3.length; i++) {
				var myMenu = document.getElementById(listOfMenu3[i] + myTree.id);
				if (myMenu) {
					if (myTree.view.rowCount == 0) {
						myMenu.disabled=true;
					} else if (myTree.view.rowCount == 1) {
						myMenu.disabled=true;
					} else {
						myMenu.disabled=false;
					}
				}
			}
			if (mySelectedPosition == 0) {
				document.getElementById('moveUp' + myTree.id).disabled=true;
			} else if (mySelectedPosition == myTree.view.rowCount-1) {
				document.getElementById('moveDown' + myTree.id).disabled=true;
			}
		},

		imageCardContextShowing: function () {
			if (cardbookUtils.getSelectedCardsCount() >= 2 || cardbookUtils.getSelectedCardsCount() == 0) {
				document.getElementById('addImageCardFromFile').disabled=true;
				document.getElementById('addImageCardFromClipboard').disabled=true;
				document.getElementById('addImageCardFromUrl').disabled=true;
				document.getElementById('saveImageCard').disabled=true;
				document.getElementById('deleteImageCard').disabled=true;
			} else if (document.getElementById('defaultCardImage').src == "chrome://cardbook/skin/missing_photo_200_214.png") {
				document.getElementById('addImageCardFromFile').disabled=false;
				document.getElementById('addImageCardFromClipboard').disabled=false;
				document.getElementById('addImageCardFromUrl').disabled=false;
				document.getElementById('saveImageCard').disabled=true;
				document.getElementById('deleteImageCard').disabled=true;
			} else {
				document.getElementById('addImageCardFromFile').disabled=true;
				document.getElementById('addImageCardFromClipboard').disabled=true;
				document.getElementById('addImageCardFromUrl').disabled=true;
				document.getElementById('saveImageCard').disabled=false;
				document.getElementById('deleteImageCard').disabled=false;
			}
		},
	
		cardbookAccountMenuContextShowing: function () {
			var myTree = document.getElementById('accountsOrCatsTree');
			if (myTree.currentIndex != -1) {
				var strBundle = document.getElementById("cardbook-strings");
				var myPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				var cardbookPrefService = new cardbookPreferenceService(myPrefId);
				document.getElementById('cardbookAccountMenuEditServer').disabled=false;
				document.getElementById('cardbookAccountMenuCloseServer').disabled=false;
				document.getElementById('cardbookAccountMenuEnableOrDisableAddressbook').disabled=false;
				document.getElementById('cardbookAccountMenuSyncs').disabled=!cardbookUtils.isThereNetworkAccountToSync();
				if (cardbookPrefService.getEnabled()) {
					if (cardbookPrefService.getType() === "FILE" || cardbookPrefService.getType() === "CACHE") {
						document.getElementById('cardbookAccountMenuSync').disabled=true;
					} else {
						document.getElementById('cardbookAccountMenuSync').disabled=false;
					}
					document.getElementById('cardbookAccountMenuEnableOrDisableAddressbook').label=strBundle.getString("disableFromAccountsOrCats");
				} else {
					document.getElementById('cardbookAccountMenuSync').disabled=true;
					document.getElementById('cardbookAccountMenuEnableOrDisableAddressbook').label=strBundle.getString("enableFromAccountsOrCats");
				}
			} else {
				document.getElementById('cardbookAccountMenuEditServer').disabled=true;
				document.getElementById('cardbookAccountMenuCloseServer').disabled=true;
				document.getElementById('cardbookAccountMenuEnableOrDisableAddressbook').disabled=true;
				document.getElementById('cardbookAccountMenuSyncs').disabled=true;
				document.getElementById('cardbookAccountMenuSync').disabled=true;
			}
		},
	
		cardbookToolsMenuContextShowing: function () {
			var myTree = document.getElementById('accountsOrCatsTree');
			if (myTree.currentIndex != -1) {
				var myPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
				if (cardbookUtils.isMyAccountEnabled(myPrefId)) {
					document.getElementById('cardbookToolsMenuExportToFile').disabled=false;
					document.getElementById('cardbookToolsMenuImportFromFile').disabled=false;
					document.getElementById('cardbookToolsMenuExportToDir').disabled=false;
					document.getElementById('cardbookToolsMenuImportFromDir').disabled=false;
				} else {
					document.getElementById('cardbookToolsMenuExportToFile').disabled=true;
					document.getElementById('cardbookToolsMenuImportFromFile').disabled=true;
					document.getElementById('cardbookToolsMenuExportToDir').disabled=true;
					document.getElementById('cardbookToolsMenuImportFromDir').disabled=true;
				}
			} else {
				document.getElementById('cardbookToolsMenuExportToFile').disabled=true;
				document.getElementById('cardbookToolsMenuImportFromFile').disabled=true;
				document.getElementById('cardbookToolsMenuExportToDir').disabled=true;
				document.getElementById('cardbookToolsMenuImportFromDir').disabled=true;
			}
		},

		accountsOrCatsTreeContextShowing: function () {
			if (cardbookRepository.cardbookSyncMode === "NOSYNC") {
				var strBundle = document.getElementById("cardbook-strings");
				if (document.getElementById('accountsOrCatsTree').view.rowCount == 0) {
					document.getElementById('pasteCardsFromAccountsOrCats').disabled=true;
					document.getElementById('importCardsFromFileFromAccountsOrCats').disabled=true;
					document.getElementById('importCardsFromDirFromAccountsOrCats').disabled=true;
					document.getElementById('editAccountFromAccountsOrCats').disabled=true;
					document.getElementById('removeCatFromAccountsOrCats').disabled=true;
					document.getElementById('enableOrDisableFromAccountsOrCats').disabled=true;
					document.getElementById('syncAccountFromAccountsOrCats').disabled=true;
					document.getElementById('removeAccountFromAccountsOrCats').disabled=true;
				} else {
					var myTree = document.getElementById('accountsOrCatsTree');
					if (myTree.currentIndex != -1) {
						var myPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
						cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
						var cardbookPrefService = new cardbookPreferenceService(myPrefId);
						if (cardbookPrefService.getEnabled()) {
							document.getElementById('pasteCardsFromAccountsOrCats').disabled=false;
							document.getElementById('importCardsFromFileFromAccountsOrCats').disabled=false;
							document.getElementById('importCardsFromDirFromAccountsOrCats').disabled=false;
							document.getElementById('enableOrDisableFromAccountsOrCats').label=strBundle.getString("disableFromAccountsOrCats");
							if (cardbookPrefService.getType() === "FILE" || cardbookPrefService.getType() === "CACHE") {
								document.getElementById('syncAccountFromAccountsOrCats').disabled=true;
							} else {
								document.getElementById('syncAccountFromAccountsOrCats').disabled=false;
							}
						} else {
							document.getElementById('enableOrDisableFromAccountsOrCats').label=strBundle.getString("enableFromAccountsOrCats");
							document.getElementById('pasteCardsFromAccountsOrCats').disabled=true;
							document.getElementById('importCardsFromFileFromAccountsOrCats').disabled=true;
							document.getElementById('importCardsFromDirFromAccountsOrCats').disabled=true;
							document.getElementById('syncAccountFromAccountsOrCats').disabled=true;
						}
						if (myTree.view.isContainer(myTree.currentIndex)) {
							document.getElementById('removeCatFromAccountsOrCats').disabled=true;
						} else {
							document.getElementById('removeCatFromAccountsOrCats').disabled=false;
						}
					} else {
						document.getElementById('removeCatFromAccountsOrCats').disabled=true;
						document.getElementById('pasteCardsFromAccountsOrCats').disabled=true;
						document.getElementById('importCardsFromFileFromAccountsOrCats').disabled=true;
						document.getElementById('importCardsFromDirFromAccountsOrCats').disabled=true;
						document.getElementById('syncAccountFromAccountsOrCats').disabled=true;
					}
					document.getElementById('editAccountFromAccountsOrCats').disabled=false;
					document.getElementById('enableOrDisableFromAccountsOrCats').disabled=false;
					document.getElementById('removeAccountFromAccountsOrCats').disabled=false;
				}
				if (document.getElementById('cardsTree').view.rowCount == 0) {
					document.getElementById('toEmailCardsFromAccountsOrCats').label=strBundle.getString("toEmailCardFromAccountsOrCatsLabel");
					document.getElementById('ccEmailCardsFromAccountsOrCats').label=strBundle.getString("ccEmailCardFromAccountsOrCatsLabel");
					document.getElementById('bccEmailCardsFromAccountsOrCats').label=strBundle.getString("bccEmailCardFromAccountsOrCatsLabel");
					document.getElementById('copyCardsFromAccountsOrCats').label=strBundle.getString("copyCardFromAccountsOrCatsLabel");
					document.getElementById('exportCardsToFileFromAccountsOrCats').label=strBundle.getString("exportCardToFileFromAccountsOrCatsLabel");
					document.getElementById('exportCardsToDirFromAccountsOrCats').label=strBundle.getString("exportCardToDirFromAccountsOrCatsLabel");
					document.getElementById('toEmailCardsFromAccountsOrCats').disabled=true;
					document.getElementById('ccEmailCardsFromAccountsOrCats').disabled=true;
					document.getElementById('bccEmailCardsFromAccountsOrCats').disabled=true;
					document.getElementById('copyCardsFromAccountsOrCats').disabled=true;
					document.getElementById('exportCardsToFileFromAccountsOrCats').disabled=true;
					document.getElementById('exportCardsToDirFromAccountsOrCats').disabled=true;
					document.getElementById('removeCatFromAccountsOrCats').disabled=true;
				} else if (document.getElementById('cardsTree').view.rowCount == 1) {
					document.getElementById('toEmailCardsFromAccountsOrCats').label=strBundle.getString("toEmailCardFromAccountsOrCatsLabel");
					document.getElementById('ccEmailCardsFromAccountsOrCats').label=strBundle.getString("ccEmailCardFromAccountsOrCatsLabel");
					document.getElementById('bccEmailCardsFromAccountsOrCats').label=strBundle.getString("bccEmailCardFromAccountsOrCatsLabel");
					document.getElementById('copyCardsFromAccountsOrCats').label=strBundle.getString("copyCardFromAccountsOrCatsLabel");
					document.getElementById('exportCardsToFileFromAccountsOrCats').label=strBundle.getString("exportCardToFileFromAccountsOrCatsLabel");
					document.getElementById('exportCardsToDirFromAccountsOrCats').label=strBundle.getString("exportCardToDirFromAccountsOrCatsLabel");
					document.getElementById('toEmailCardsFromAccountsOrCats').disabled=false;
					document.getElementById('ccEmailCardsFromAccountsOrCats').disabled=false;
					document.getElementById('bccEmailCardsFromAccountsOrCats').disabled=false;
					document.getElementById('copyCardsFromAccountsOrCats').disabled=false;
					document.getElementById('exportCardsToFileFromAccountsOrCats').disabled=false;
					document.getElementById('exportCardsToDirFromAccountsOrCats').disabled=false;
				} else {
					document.getElementById('toEmailCardsFromAccountsOrCats').label=strBundle.getString("toEmailCardsFromAccountsOrCatsLabel");
					document.getElementById('ccEmailCardsFromAccountsOrCats').label=strBundle.getString("ccEmailCardsFromAccountsOrCatsLabel");
					document.getElementById('bccEmailCardsFromAccountsOrCats').label=strBundle.getString("bccEmailCardsFromAccountsOrCatsLabel");
					document.getElementById('copyCardsFromAccountsOrCats').label=strBundle.getString("copyCardsFromAccountsOrCatsLabel");
					document.getElementById('exportCardsToFileFromAccountsOrCats').label=strBundle.getString("exportCardsToFileFromAccountsOrCatsLabel");
					document.getElementById('exportCardsToDirFromAccountsOrCats').label=strBundle.getString("exportCardsToDirFromAccountsOrCatsLabel");
					document.getElementById('toEmailCardsFromAccountsOrCats').disabled=false;
					document.getElementById('ccEmailCardsFromAccountsOrCats').disabled=false;
					document.getElementById('bccEmailCardsFromAccountsOrCats').disabled=false;
					document.getElementById('copyCardsFromAccountsOrCats').disabled=false;
					document.getElementById('exportCardsToFileFromAccountsOrCats').disabled=false;
					document.getElementById('exportCardsToDirFromAccountsOrCats').disabled=false;
				}
			} else {
				document.getElementById('toEmailCardsFromAccountsOrCats').disabled=true;
				document.getElementById('ccEmailCardsFromAccountsOrCats').disabled=true;
				document.getElementById('bccEmailCardsFromAccountsOrCats').disabled=true;
				document.getElementById('copyCardsFromAccountsOrCats').disabled=true;
				document.getElementById('pasteCardsFromAccountsOrCats').disabled=true;
				document.getElementById('exportCardsToFileFromAccountsOrCats').disabled=true;
				document.getElementById('exportCardsToDirFromAccountsOrCats').disabled=true;
				document.getElementById('importCardsFromFileFromAccountsOrCats').disabled=true;
				document.getElementById('importCardsFromDirFromAccountsOrCats').disabled=true;
				document.getElementById('editAccountFromAccountsOrCats').disabled=true;
				document.getElementById('removeCatFromAccountsOrCats').disabled=true;
				document.getElementById('enableOrDisableFromAccountsOrCats').disabled=true;
				document.getElementById('syncAccountFromAccountsOrCats').disabled=true;
				document.getElementById('removeAccountFromAccountsOrCats').disabled=true;
			}
		},
	
		cardsTreeContextShowing: function () {
			if (cardbookRepository.cardbookSyncMode === "NOSYNC") {
				var strBundle = document.getElementById("cardbook-strings");
				if (cardbookUtils.getSelectedCardsCount() == 0) {
					document.getElementById('toEmailCardsFromCards').label=strBundle.getString("toEmailCardFromCardsLabel");
					document.getElementById('ccEmailCardsFromCards').label=strBundle.getString("ccEmailCardFromCardsLabel");
					document.getElementById('bccEmailCardsFromCards').label=strBundle.getString("bccEmailCardFromCardsLabel");
					document.getElementById('localizeCardsFromCards').label=strBundle.getString("localizeCardFromCardsLabel");
					document.getElementById('copyCardsFromCards').label=strBundle.getString("copyCardFromCardsLabel");
					document.getElementById('pasteCardsFromCards').label=strBundle.getString("pasteCardFromCardsLabel");
					document.getElementById('exportCardsToFileFromCards').label=strBundle.getString("exportCardToFileFromCardsLabel");
					document.getElementById('exportCardsToDirFromCards').label=strBundle.getString("exportCardToDirFromCardsLabel");
					document.getElementById('deleteCardsFromCards').label=strBundle.getString("deleteCardFromCardsLabel");
					document.getElementById('toEmailCardsFromCards').disabled=true;
					document.getElementById('ccEmailCardsFromCards').disabled=true;
					document.getElementById('bccEmailCardsFromCards').disabled=true;
					document.getElementById('localizeCardsFromCards').disabled=true;
					document.getElementById('copyCardsFromCards').disabled=true;
					document.getElementById('pasteCardsFromCards').disabled=true;
					document.getElementById('exportCardsToFileFromCards').disabled=true;
					document.getElementById('exportCardsToDirFromCards').disabled=true;
					document.getElementById('mergeCardsFromCards').disabled=true;
					document.getElementById('deleteCardsFromCards').disabled=true;
				} else if (cardbookUtils.getSelectedCardsCount() == 1) {
					document.getElementById('toEmailCardsFromCards').label=strBundle.getString("toEmailCardFromCardsLabel");
					document.getElementById('ccEmailCardsFromCards').label=strBundle.getString("ccEmailCardFromCardsLabel");
					document.getElementById('bccEmailCardsFromCards').label=strBundle.getString("bccEmailCardFromCardsLabel");
					document.getElementById('localizeCardsFromCards').label=strBundle.getString("localizeCardFromCardsLabel");
					document.getElementById('copyCardsFromCards').label=strBundle.getString("copyCardFromCardsLabel");
					document.getElementById('pasteCardsFromCards').label=strBundle.getString("pasteCardFromCardsLabel");
					document.getElementById('exportCardsToFileFromCards').label=strBundle.getString("exportCardToFileFromCardsLabel");
					document.getElementById('exportCardsToDirFromCards').label=strBundle.getString("exportCardToDirFromCardsLabel");
					document.getElementById('deleteCardsFromCards').label=strBundle.getString("deleteCardFromCardsLabel");
					document.getElementById('toEmailCardsFromCards').disabled=false;
					document.getElementById('ccEmailCardsFromCards').disabled=false;
					document.getElementById('bccEmailCardsFromCards').disabled=false;
					document.getElementById('localizeCardsFromCards').disabled=false;
					document.getElementById('copyCardsFromCards').disabled=false;
					document.getElementById('pasteCardsFromCards').disabled=false;
					document.getElementById('exportCardsToFileFromCards').disabled=false;
					document.getElementById('exportCardsToDirFromCards').disabled=false;
					document.getElementById('mergeCardsFromCards').disabled=true;
					document.getElementById('deleteCardsFromCards').disabled=false;
				} else {
					document.getElementById('toEmailCardsFromCards').label=strBundle.getString("toEmailCardsFromCardsLabel");
					document.getElementById('ccEmailCardsFromCards').label=strBundle.getString("ccEmailCardsFromCardsLabel");
					document.getElementById('bccEmailCardsFromCards').label=strBundle.getString("bccEmailCardsFromCardsLabel");
					document.getElementById('localizeCardsFromCards').label=strBundle.getString("localizeCardsFromCardsLabel");
					document.getElementById('copyCardsFromCards').label=strBundle.getString("copyCardsFromCardsLabel");
					document.getElementById('pasteCardsFromCards').label=strBundle.getString("pasteCardsFromCardsLabel");
					document.getElementById('exportCardsToFileFromCards').label=strBundle.getString("exportCardsToFileFromCardsLabel");
					document.getElementById('exportCardsToDirFromCards').label=strBundle.getString("exportCardsToDirFromCardsLabel");
					document.getElementById('deleteCardsFromCards').label=strBundle.getString("deleteCardsFromCardsLabel");
					document.getElementById('toEmailCardsFromCards').disabled=false;
					document.getElementById('ccEmailCardsFromCards').disabled=false;
					document.getElementById('bccEmailCardsFromCards').disabled=false;
					document.getElementById('localizeCardsFromCards').disabled=false;
					document.getElementById('copyCardsFromCards').disabled=false;
					document.getElementById('pasteCardsFromCards').disabled=false;
					document.getElementById('exportCardsToFileFromCards').disabled=false;
					document.getElementById('exportCardsToDirFromCards').disabled=false;
					document.getElementById('mergeCardsFromCards').disabled=false;
					document.getElementById('deleteCardsFromCards').disabled=false;
				}
			} else {
				document.getElementById('toEmailCardsFromCards').disabled=true;
				document.getElementById('ccEmailCardsFromCards').disabled=true;
				document.getElementById('bccEmailCardsFromCards').disabled=true;
				document.getElementById('localizeCardsFromCards').disabled=true;
				document.getElementById('copyCardsFromCards').disabled=true;
				document.getElementById('pasteCardsFromCards').disabled=true;
				document.getElementById('exportCardsToFileFromCards').disabled=true;
				document.getElementById('exportCardsToDirFromCards').disabled=true;
				document.getElementById('mergeCardsFromCards').disabled=true;
				document.getElementById('deleteCardsFromCards').disabled=true;
			}
			if (cardbookRepository.cardbookSearchMode === "SEARCH") {
				document.getElementById('mergeCardsFromCards').disabled=true;
			}
		},
	
		enableCardCreation: function () {
			if (cardbookRepository.cardbookAccounts.length === 0) {
				wdw_cardbook.disableCardCreation();
			} else {
				document.getElementById('cardbookToolbarCreateUserButton').disabled=false;
			}
		},
	
		enableCardModification: function () {
			if (cardbookRepository.cardbookAccounts.length === 0) {
				wdw_cardbook.disableCardModification();
			} else {
				document.getElementById('buttonName').disabled=false;
				document.getElementById('buttonOrg').disabled=false;
				document.getElementById('buttonCategories').disabled=false;
				document.getElementById('buttonAddress').disabled=false;
				document.getElementById('buttonPhone').disabled=false;
				document.getElementById('buttonEmail').disabled=false;
				document.getElementById('buttonImpp').disabled=false;
				document.getElementById('buttonUrl').disabled=false;
				document.getElementById('buttonNote').disabled=false;
				document.getElementById('buttonBirthday').disabled=false;
				document.getElementById('saveButton').disabled=false;
				document.getElementById('cancelButton').disabled=false;
			}
		},
	
		disableCardCreation: function () {
			document.getElementById('cardbookToolbarCreateUserButton').disabled=true;
		},
		
		disableCardModification: function () {
			document.getElementById('buttonName').disabled=true;
			document.getElementById('buttonOrg').disabled=true;
			document.getElementById('buttonCategories').disabled=true;
			document.getElementById('buttonAddress').disabled=true;
			document.getElementById('buttonPhone').disabled=true;
			document.getElementById('buttonEmail').disabled=true;
			document.getElementById('buttonImpp').disabled=true;
			document.getElementById('buttonUrl').disabled=true;
			document.getElementById('buttonNote').disabled=true;
			document.getElementById('buttonBirthday').disabled=true;
			document.getElementById('saveButton').disabled=true;
			document.getElementById('cancelButton').disabled=true;
		},

		updateStatusProgressInformationField: function() {
			if (cardbookRepository.statusInformation.length === 0) {
				document.getElementById('statusProgressInformation').label = "";
			} else {
				if (cardbookRepository.statusInformation[cardbookRepository.statusInformation.length - 1] == cardbookRepository.statusInformation[cardbookRepository.statusInformation.length - 1].substr(0,150)) {
					document.getElementById('statusProgressInformation').label = cardbookRepository.statusInformation[cardbookRepository.statusInformation.length - 1];
				} else {
					document.getElementById('statusProgressInformation').label = cardbookRepository.statusInformation[cardbookRepository.statusInformation.length - 1].substr(0,147) + "...";
				}
			}
		},
	
		updateStatusInformation: function() {
			var myTree = document.getElementById('accountsOrCatsTree');
			var strBundle = document.getElementById("cardbook-strings");
			if (cardbookRepository.cardbookSearchMode === "SEARCH") {
				var myAccountId = cardbookRepository.cardbookSearchValue;
				if (cardbookRepository.cardbookDisplayCards[myAccountId]) {
					var myMessage = strBundle.getFormattedString("numberContactsFound", [cardbookRepository.cardbookDisplayCards[myAccountId].length]);
				} else {
					var myMessage = "";
				}
			} else {
				try {
					var myAccountId = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
					var myMessage = strBundle.getFormattedString("numberContacts", [cardbookRepository.cardbookDisplayCards[myAccountId].length]);
				}
				catch(e) {
					var myMessage = "";
				}
			}
			document.getElementById('statusInformation').label = myMessage;
		},
	
		windowControlShowing: function () {
			if (cardbookRepository.cardbookAccounts.length === 0) {
				document.getElementById('cardbookToolbarSyncButton').disabled=true;
				wdw_cardbook.disableCardCreation();
				wdw_cardbook.disableCardModification();
			} else {
				if (cardbookRepository.cardbookSyncMode === "SYNC") {
					wdw_cardbook.disableCardCreation();
					wdw_cardbook.disableCardModification();
					document.getElementById('cardbookToolbarSyncButton').disabled=true;
				} else if (cardbookRepository.cardbookSearchMode === "SEARCH") {
					wdw_cardbook.disableCardCreation();
					if (cardbookUtils.getSelectedCardsCount() >= 2 || cardbookUtils.getSelectedCardsCount() == 0) {
						wdw_cardbook.disableCardModification();
					} else {
						wdw_cardbook.enableCardModification();
					}
					document.getElementById('cardbookToolbarSyncButton').disabled=!cardbookUtils.isThereNetworkAccountToSync();
				} else {
					var myTree = document.getElementById('accountsOrCatsTree');
					if (myTree.currentIndex != -1) {
						var myPrefId = cardbookUtils.getAccountId(myTree.view.getCellText(myTree.currentIndex, {id: "accountId"}));
						if (cardbookUtils.isMyAccountEnabled(myPrefId)) {
							wdw_cardbook.enableCardCreation();
							if (cardbookUtils.getSelectedCardsCount() >= 2) {
								wdw_cardbook.disableCardModification();
							} else {
								wdw_cardbook.enableCardModification();
							}
						} else {
							wdw_cardbook.disableCardCreation();
							wdw_cardbook.disableCardModification();
						}
					} else {
						wdw_cardbook.disableCardCreation();
						wdw_cardbook.disableCardModification();
					}
					document.getElementById('cardbookToolbarSyncButton').disabled=!cardbookUtils.isThereNetworkAccountToSync();
				}
			}
	
			if (cardbookRepository.cardbookSyncMode === "SYNC") {
				document.getElementById('cardbookToolbarAddServerButton').disabled=true;
				document.getElementById('accountsOrCatsTreeContextMenu').disabled=true;
				document.getElementById('cardsTreeContextMenu').disabled=true;	
				document.getElementById('cardbookAccountMenu').disabled=true;
				document.getElementById('cardbookToolsMenu').disabled=true;
			} else {
				document.getElementById('cardbookToolbarAddServerButton').disabled=false;
				document.getElementById('accountsOrCatsTreeContextMenu').disabled=false;
				document.getElementById('cardsTreeContextMenu').disabled=false;	
				document.getElementById('cardbookAccountMenu').disabled=false;
				document.getElementById('cardbookToolsMenu').disabled=false;
			}
	
			if (cardbookRepository.cardbookSyncMode === "SYNC") {
				var currentIndex = cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncDone);
				var totalIndex = cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncTotal)
				if (currentIndex === totalIndex) {
					document.getElementById('statusProgessValue').value = 0;
				} else {
					document.getElementById('statusProgessValue').value = Math.round(currentIndex / totalIndex * 100);
				}
			} else {
				document.getElementById('statusProgessValue').value = 0;
			}
	
			wdw_cardbook.updateStatusInformation();
			wdw_cardbook.updateStatusProgressInformationField();
	
			if (cardbookRepository.cardbookSyncMode === "SYNC") {
				wdw_cardbook.cardbookrefresh = true;
				wdw_cardbook.refreshAccountsInDirTree();
				wdw_cardbook.sortCardsTreeCol();
				wdw_cardbook.selectAccountOrCat();
			} else if (wdw_cardbook.cardbookrefresh) {
				wdw_cardbook.cardbookrefresh = false;
				wdw_cardbook.refreshAccountsInDirTree();
				wdw_cardbook.sortCardsTreeCol();
				wdw_cardbook.selectAccountOrCat();
			}
			
			var myTree = document.getElementById('accountsOrCatsTree');
			if (myTree.currentIndex == -1) {
				if (cardbookRepository.cardbookAccounts) {
					myTree.view.selection.select(0);
				}
			}
		}

	};
};