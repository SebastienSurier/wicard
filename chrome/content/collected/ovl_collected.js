if ("undefined" == typeof(ovl_collected)) {
	var ovl_collected = {
		
		addCardFromEmail: function (aDirPrefId, aEmails) {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			var listOfEmails = [];
			listOfEmails = cardbookUtils.getDisplayNameAndEmail(aEmails);
			for (var i = 0; i < listOfEmails.length; i++) {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug2(cardbookUtils.getPrefNameFromPrefId(aDirPrefId) + " : debug mode : trying to collect contact " + listOfEmails[i][0]);
				cardbookRepository.addCardFromDisplayAndEmail(aDirPrefId, listOfEmails[i][0], listOfEmails[i][1]);
			}
		},
				
		collectToCardbook: function () {
			var msgtype = document.getElementById("msgcomposeWindow").getAttribute("msgtype");
			if (msgtype != Components.interfaces.nsIMsgCompDeliverMode.Now && msgtype != Components.interfaces.nsIMsgCompDeliverMode.Later) {
				return;
			}
			Components.utils.import("resource:///modules/jsmime.jsm");
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var emailsCollection = prefs.getComplexValue("extensions.cardbook.emailsCollection", Components.interfaces.nsISupportsString).data;
			wdw_cardbooklog.updateStatusProgressInformationWithDebug2("debug mode : start of emails collection : " + emailsCollection);
			if (emailsCollection != "") {
				var emailsCollectionList = [];
				emailsCollectionList = emailsCollection.split(',');
				for (var i = 0; i < emailsCollectionList.length; i++) {
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(cardbookUtils.getPrefNameFromPrefId(emailsCollectionList[i]) + " : debug mode : start of emails collection ...");
					var myFields = gMsgCompose.compFields;
					var listToCollect = ["replyTo", "to", "cc", "fcc", "bcc", "followupTo"];
					for (var j = 0; j < listToCollect.length; j++) {
						if (myFields[listToCollect[j]]) {
							if (myFields[listToCollect[j]] != null && myFields[listToCollect[j]] !== undefined && myFields[listToCollect[j]] != "") {
								ovl_collected.addCardFromEmail(emailsCollectionList[i], jsmime.headerparser.decodeRFC2047Words(myFields[listToCollect[j]]));
							}
						}
					}
				}
			}
		},

		loadCollectedAccount: function () {
			Components.utils.import("resource:///modules/jsmime.jsm");
			var contactManager = Components.classes["@mozilla.org/abmanager;1"].getService(Components.interfaces.nsIAbManager);
			var contacts = contactManager.directories;
			while ( contacts.hasMoreElements() ) {
				var contact = contacts.getNext().QueryInterface(Components.interfaces.nsIAbDirectory);
				 if (contact.dirPrefId == "ldap_2.servers.history") {
					var abCardsEnumerator = contact.childCards;
					while (abCardsEnumerator.hasMoreElements()) {
						var abCard = abCardsEnumerator.getNext();
						abCard = abCard.QueryInterface(Components.interfaces.nsIAbCard);
						ovl_collected.addCardFromEmail(cardbookRepository.cardbookCollectedCardsId, jsmime.headerparser.decodeRFC2047Words(abCard.getProperty("DisplayName","")) + " <" + abCard.getProperty("PrimaryEmail","") + ">");
					}
				 }
			}
		},

		loadImapAccount: function () {
			Components.utils.import("resource:///modules/jsmime.jsm");
			var contactManager = Components.classes["@mozilla.org/abmanager;1"].getService(Components.interfaces.nsIAbManager);
			var contacts = contactManager.directories;
			while ( contacts.hasMoreElements() ) {
				var contact = contacts.getNext().QueryInterface(Components.interfaces.nsIAbDirectory);
				 if (contact.dirPrefId == "ldap_2.servers.history") {
					var abCardsEnumerator = contact.childCards;
					while (abCardsEnumerator.hasMoreElements()) {
						var abCard = abCardsEnumerator.getNext();
						abCard = abCard.QueryInterface(Components.interfaces.nsIAbCard);
						ovl_collected.addCardFromEmail(cardbookRepository.cardbookImapCardsId, jsmime.headerparser.decodeRFC2047Words(abCard.getProperty("DisplayName","")) + " <" + abCard.getProperty("PrimaryEmail","") + ">");
					}
				 }
			}
		},
				
		removeAccountFromCollected: function (aDirPrefId) {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var emailsCollection = prefs.getComplexValue("extensions.cardbook.emailsCollection", Components.interfaces.nsISupportsString).data;
			var emailsCollectionList = [];
			emailsCollectionList = emailsCollection.split(',');
			function filterAccount(element) {
				return (element != aDirPrefId);
			}
			emailsCollectionList = emailsCollectionList.filter(filterAccount);
			var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			str.data = emailsCollectionList.join(',');
			prefs.setComplexValue("extensions.cardbook.emailsCollection", Components.interfaces.nsISupportsString, str);
		},

		addAccountToCollected: function (aDirPrefId) {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var emailsCollection = prefs.getComplexValue("extensions.cardbook.emailsCollection", Components.interfaces.nsISupportsString).data;
			var emailsCollectionList = [];
			emailsCollectionList = emailsCollection.split(',');
			emailsCollectionList.push(aDirPrefId);
			function filterAccount(element) {
				return (element != 'init');
			}
			emailsCollectionList = emailsCollectionList.filter(filterAccount);
			var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			str.data = emailsCollectionList.join(',');
			prefs.setComplexValue("extensions.cardbook.emailsCollection", Components.interfaces.nsISupportsString, str);
		},

		addCollectedAccount: function() {
			var cacheDir = cardbookRepository.getLocalDirectory();
			cacheDir.append(cardbookRepository.cardbookCollectedCardsId);
	
			cardbookRepository.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			let cardbookPrefService = new cardbookPreferenceService(cardbookRepository.cardbookCollectedCardsId);
			cardbookPrefService.setId(cardbookRepository.cardbookCollectedCardsId);
			cardbookPrefService.setName(cardbookRepository.cardbookCollectedCards);
			cardbookPrefService.setType("CACHE");
			cardbookPrefService.setUrl(cacheDir.path);
			cardbookPrefService.setUser("");
			cardbookPrefService.setColor("#A8C2E1");
			cardbookPrefService.setEnabled(true);
			cardbookPrefService.setExpanded(true);
			
			ovl_collected.addAccountToCollected(cardbookRepository.cardbookCollectedCardsId);
			cardbookRepository.addAccountToRepository(cardbookRepository.cardbookCollectedCardsId, cardbookRepository.cardbookCollectedCards, "CACHE", true, true);
			cardbookMailPopularity.removeMailPopularity();
		},

		addImapAccount: function() {
			var cacheDir = cardbookRepository.getLocalDirectory();
			cacheDir.append(cardbookRepository.cardbookImapCardsId);
	
			cardbookRepository.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			let cardbookPrefService = new cardbookPreferenceService(cardbookRepository.cardbookImapCardsId);
			cardbookPrefService.setId(cardbookRepository.cardbookImapCardsId);
			cardbookPrefService.setName(cardbookRepository.cardbookImapCards);
			cardbookPrefService.setType("IMAP");
			cardbookPrefService.setUrl(cacheDir.path);
			cardbookPrefService.setUser("");
			cardbookPrefService.setColor("#A8C2E1");
			cardbookPrefService.setEnabled(true);
			cardbookPrefService.setExpanded(true);
			
			ovl_collected.addAccountToCollected(cardbookRepository.cardbookImapCardsId);
			cardbookRepository.addAccountToRepository(cardbookRepository.cardbookImapCardsId, cardbookRepository.cardbookImapCards, "IMAP", true, true);
			cardbookMailPopularity.removeMailPopularity();
		}
		
	}
};

window.addEventListener("compose-send-message", function(e) { ovl_collected.collectToCardbook(e); }, true);
