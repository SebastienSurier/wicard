var EXPORTED_SYMBOLS = ["cardbookRepository"];

var cardbookRepository = {
	cardbookAccounts : [],
	cardbookAccountsCategories : {},
	cardbookCards : {},
	cardbookDisplayCards : {},
	cardbookCardSearch : [],
	cardbookCardEmails : {},
	cardbookFileCacheCards : {},

	cardbookMailPopularityIndex : {},

	cardbookDirRequest : {},
	cardbookDirResponse : {},
	cardbookFileRequest : {},
	cardbookFileResponse : {},

	cardbookServerValidation : {},

	cardbookGoogleAccessTokenRequest : {},
	cardbookGoogleAccessTokenResponse : {},
	cardbookGoogleAccessTokenError : {},
	cardbookGoogleRefreshTokenRequest : {},
	cardbookGoogleRefreshTokenResponse : {},
	cardbookGoogleRefreshTokenError : {},
	cardbookServerDiscoveryRequest : {},
	cardbookServerDiscoveryResponse : {},
	cardbookServerDiscoveryError : {},
	cardbookServerSyncRequest : {},
	cardbookServerSyncResponse : {},
	cardbookServerSyncDone : {},
	cardbookServerSyncTotal : {},
	cardbookServerSyncError : {},
	cardbookServerSyncNotUpdated : {},
	cardbookServerSyncNewOnServer : {},
	cardbookServerSyncNewOnDisk : {},
	cardbookServerSyncUpdatedOnServer : {},
	cardbookServerSyncUpdatedOnDisk : {},
	cardbookServerSyncUpdatedOnBoth : {},
	cardbookServerSyncUpdatedOnDiskDeletedOnServer : {},
	cardbookServerSyncDeletedOnDisk : {},
	cardbookServerSyncDeletedOnDiskUpdatedOnServer : {},
	cardbookServerSyncDeletedOnServer : {},
	cardbookServerSyncAgain : {},
	cardbookServerGetRequest : {},
	cardbookServerGetResponse : {},
	cardbookServerGetError : {},
	cardbookServerUpdatedRequest : {},
	cardbookServerUpdatedResponse : {},
	cardbookServerUpdatedError : {},
	cardbookServerCreatedRequest : {},
	cardbookServerCreatedResponse : {},
	cardbookServerCreatedError : {},
	cardbookServerDeletedRequest : {},
	cardbookServerDeletedResponse : {},
	cardbookServerDeletedError : {},
	cardbookImageGetRequest : {},
	cardbookImageGetResponse : {},
	cardbookImageGetError : {},
	cardbookSyncMode : "NOSYNC",

	cardbookSearchMode : "NOSEARCH",
	cardbookSearchValue : "",
	
	lTimerSyncAll : {},
	lTimerImportAll : {},
	lTimerNoSyncModeAll : {},
	
	cardbookDynamicCssRules : {},

	cardbookUncategorizedCards : "",
	cardbookCollectedCards : "",
	cardbookCollectedCardsId : "Collected",
	cardbookImapCards : "",
	cardbookImapCardsId : "ImapBook",
	
	cardbookMailPopularityFile : "mailPopularityIndex.txt",

	customFields : [ 'customField1Name', 'customField2Name', 'customField1Org', 'customField2Org' ],
	customFieldsValue : {},
	customFieldsLabel : {},
									
	statusInformation : [],

	cardbookgdata : {
		CLIENT_ID:                  "779554755808-957jloa2c3c8n0rrm1a5304fkik7onf0.apps.googleusercontent.com",
		CLIENT_SECRET:              "h3NUkhofCKAW2E1X_NKSn4C_",
		REDIRECT_URI:               "urn:ietf:wg:oauth:2.0:oob",
		REDIRECT_TITLE:             "Success code=",
		RESPONSE_TYPE:              "code",
		SCOPE:                      "https://www.googleapis.com/auth/carddav",
		OAUTH_URL:                  "https://accounts.google.com/o/oauth2/auth",
		TOKEN_REQUEST_URL:          "https://accounts.google.com/o/oauth2/token",
		TOKEN_REQUEST_TYPE:         "POST",
		TOKEN_REQUEST_GRANT_TYPE:   "authorization_code",
		REFRESH_REQUEST_URL:        "https://accounts.google.com/o/oauth2/token",
		REFRESH_REQUEST_TYPE:       "POST",
		REFRESH_REQUEST_GRANT_TYPE: "refresh_token",
		AUTH_URL:                   "https://www.google.com/accounts/ClientLogin",
		AUTH_REQUEST_TYPE:          "POST",
		AUTH_SUB_SESSION_URL:       "https://www.google.com/accounts/AuthSubSessionToken",
		AUTH_SUB_SESSION_TYPE:      "GET",
		AUTH_SUB_REVOKE_URL:        "https://www.google.com/accounts/AuthSubRevokeToken",
		AUTH_SUB_REVOKE_TYPE:       "GET",
		GOOGLE_API:                 "https://www.googleapis.com",
	},

	APPLE_API : "https://contacts.icloud.com",
	
	jsInclude: function(files, target) {
		var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
		for (var i = 0; i < files.length; i++) {
			try {
				loader.loadSubScript(files[i], target);
			}
			catch(e) {
				dump("cardbookRepository.jsInclude : failed to include '" + files[i] + "'\n" + e + "\n");
			}
		}
	},
		
    loadCustoms: function () {
		this.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
		var cardbookPrefService = new cardbookPreferenceService();
		var myCustoms = [];
		myCustoms = cardbookPrefService.getAllCustoms();
		for (var i in cardbookRepository.customFields) {
			var found = 0;
			for (var j = 0; j < myCustoms.length; j++) {
				var fieldTemp1 = myCustoms[j].split(":");
				var fieldName = fieldTemp1[0];
				var fieldValue = fieldTemp1[1];
				var fieldLabel = fieldTemp1[2];
				if (!(fieldValue != null && fieldValue !== undefined && fieldValue != "")) {
					var fieldLabel = "";
				}
				if (cardbookRepository.customFields[i] == fieldName) {
					cardbookRepository.customFieldsValue[cardbookRepository.customFields[i]] = fieldValue;
					cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]] = fieldLabel;
					j = myCustoms.length;
					found = 1;
				}
			}
			if (found === 0) {
				cardbookRepository.customFieldsValue[cardbookRepository.customFields[i]] = "";
				cardbookRepository.customFieldsLabel[cardbookRepository.customFields[i]] = "";
			}
		}
	},
		
    setTypes: function () {
		this.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
		var cardbookPrefService = new cardbookPreferenceService();
		var myTypes = [];
		var myOldTypes = [];
		myTypes = cardbookPrefService.getAllTypesCategory();
		// for file opened with version <= 4.0
		for (var i = 0; i < myTypes.length; i++) {
			if (!(myTypes[i].indexOf(".") >= 0)) {
				myOldTypes.push(cardbookPrefService.getTypes(myTypes[i]));
				cardbookPrefService.delTypes(myTypes[i]);
				myTypes.splice(i,1);
				i--;
			}
		}
		for (var i = 0; i < myOldTypes.length; i++) {
				cardbookPrefService.setTypes("address", i, myOldTypes[i]);
				cardbookPrefService.setTypes("email", i, myOldTypes[i]);
				cardbookPrefService.setTypes("tel", i, myOldTypes[i]);
				cardbookPrefService.setTypes("impp", i, myOldTypes[i]);
				cardbookPrefService.setTypes("url", i, myOldTypes[i]);
		}
		// for file opened with version <= 4.8
		var myPhoneTypes = [];
		myTypes = cardbookPrefService.getAllTypesCategory();
		for (var i = 0; i < myTypes.length; i++) {
			if (myTypes[i].indexOf("phone.") >= 0) {
				myPhoneTypes.push(cardbookPrefService.getTypes(myTypes[i]));
				cardbookPrefService.delTypes(myTypes[i]);
				myTypes.splice(i,1);
				i--;
			}
		}
		for (var i = 0; i < myPhoneTypes.length; i++) {
			cardbookPrefService.setTypes("tel", i, myPhoneTypes[i]);
		}
		// for file opened with version <= 4.8
		var notfound = true;
		myTypes = cardbookPrefService.getAllTypesCategory();
		for (var i = 0; i < myTypes.length; i++) {
			if (myTypes[i].indexOf("url.") >= 0) {
				notfound = false;
				break;
			}
		}
		if (notfound) {
			cardbookPrefService.insertUrlSeedTypes();
		}
		// for file opened with version <= 4.8
		var notfound = true;
		myTypes = cardbookPrefService.getAllTypesCategory();
		for (var i = 0; i < myTypes.length; i++) {
			if (myTypes[i].indexOf("tel.") >= 0) {
				notfound = false;
				break;
			}
		}
		if (notfound) {
			cardbookPrefService.insertTelSeedTypes();
		}
		// for file opened with version <= 4.8
		var notfound = true;
		myTypes = cardbookPrefService.getAllTypesCategory();
		for (var i = 0; i < myTypes.length; i++) {
			if (myTypes[i].indexOf("impp.") >= 0) {
				notfound = false;
				break;
			}
		}
		if (notfound) {
			cardbookPrefService.insertImppSeedTypes();
		}
		// for file opened with version <= 4.8
		var notfound = true;
		myTypes = cardbookPrefService.getAllTypesCategory();
		for (var i = 0; i < myTypes.length; i++) {
			if (myTypes[i].indexOf("email.") >= 0) {
				notfound = false;
				break;
			}
		}
		if (notfound) {
			cardbookPrefService.insertEmailSeedTypes();
		}
		// for file opened with version <= 4.8
		var notfound = true;
		myTypes = cardbookPrefService.getAllTypesCategory();
		for (var i = 0; i < myTypes.length; i++) {
			if (myTypes[i].indexOf("address.") >= 0) {
				notfound = false;
				break;
			}
		}
		if (notfound) {
			cardbookPrefService.insertAddressSeedTypes();
		}

	},

	purgeCache: function(aPrefId) {
		var rootDir = cardbookRepository.getLocalDirectory();
		rootDir.append(aPrefId);
		if (rootDir.exists()) {
			rootDir.remove(true);
		}
	},

	setCache: function() {
		// for file opened with version <= 5.2
		this.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
		var cardbookPrefService = new cardbookPreferenceService();
		var result = [];
		result = cardbookPrefService.getAllPrefIds();
		for (let i = 0; i < result.length; i++) {
			var cacheDir = cardbookRepository.getLocalDirectory();
			cacheDir.append(result[i]);
			if (cacheDir.exists() && cacheDir.isDirectory()) {
				cacheDir.append("mediacache");
				if (!(cacheDir.exists() && cacheDir.isDirectory())) {
					cardbookRepository.purgeCache(result[i]);
				}
			}
		}
	},

	getLocalDirectory: function() {
		let directoryService = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);
		// this is a reference to the profile dir (ProfD) now.
		let localDir = directoryService.get("ProfD", Components.interfaces.nsIFile);
		
		localDir.append("cardbook");
		
		if (!localDir.exists() || !localDir.isDirectory()) {
			// read and write permissions to owner and group, read-only for others.
			localDir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);
		}
		return localDir;
	},

	arrayUnique: function (array) {
		var a = array.concat();
		for (var i=0; i<a.length; ++i) {
			for (var j=i+1; j<a.length; ++j) {
				if (a[i] === a[j])
					a.splice(j--, 1);
			}
		}
		return a;
	},
	
	getSearchString: function(aCard) {
		var lResult = "";
		lResult = lResult + aCard.lastname;
		lResult = lResult + aCard.firstname;
		lResult = lResult + aCard.othername;
		lResult = lResult + aCard.prefixname;
		lResult = lResult + aCard.suffixname;
		lResult = lResult + aCard.fn;
		lResult = lResult + aCard.nickname;
		lResult = lResult + aCard.bday;
		lResult = lResult + aCard.fn;
		lResult = lResult + aCard.categories.join();
		for (let i = 0; i < aCard.adr.length; i++) {
			lResult = lResult + aCard.adr[i].join();
		}
		for (let i = 0; i < aCard.tel.length; i++) {
			lResult = lResult + aCard.tel[i].join();
		}
		for (let i = 0; i < aCard.email.length; i++) {
			lResult = lResult + aCard.email[i].join();
		}
		lResult = lResult + aCard.title;
		lResult = lResult + aCard.role;
		lResult = lResult + aCard.org;
		lResult = lResult + aCard.note;
		for (let i = 0; i < aCard.url.length; i++) {
			lResult = lResult + aCard.url[i].join();
		}
		for (let i = 0; i < aCard.impp.length; i++) {
			lResult = lResult + aCard.impp[i].join();
		}
		lResult = lResult.replace(/[\s+\-+\.+\,+\;+]/g, "").toUpperCase();
		return lResult;
	},

	setEmptyContainer: function(aAccountId) {
		if (cardbookRepository.cardbookAccountsCategories[aAccountId]) {
			if (cardbookRepository.cardbookAccountsCategories[aAccountId].length > 0) {
				for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
					if (cardbookRepository.cardbookAccounts[i][4] == aAccountId) {
						cardbookRepository.cardbookAccounts[i][3] = false;
						return;
					}
				}
			} else {
				for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
					if (cardbookRepository.cardbookAccounts[i][4] == aAccountId) {
						cardbookRepository.cardbookAccounts[i][3] = true;
						cardbookRepository.cardbookAccounts[i][2] = false;
						return;
					}
				}
			}
		}
	},
	
	sortCategories: function(aAccountId) {
		cardbookRepository.cardbookAccountsCategories[aAccountId].sort(function (a, b) {
				return a.localeCompare(b, 'en', {'sensitivity': 'base'});
		});
	},
	
	addAccountToRepository: function(aAccountId, aAccountName, aAccountType, aAccountEnabled, aAccountExpanded) {
		var cacheDir = cardbookRepository.getLocalDirectory();
		cacheDir.append(aAccountId);
		if (!cacheDir.exists() || !cacheDir.isDirectory()) {
			cacheDir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);
			cacheDir.append("mediacache");
			cacheDir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);
		}
		cardbookRepository.cardbookAccounts.push([aAccountName, true, aAccountExpanded, true, aAccountId, aAccountType, aAccountEnabled]);
		cardbookRepository.cardbookDisplayCards[aAccountId] = [];
		cardbookRepository.cardbookAccountsCategories[aAccountId] = [];
	},
		
	removeAccountFromRepository: function(aAccountId) {
		this.jsInclude(["chrome://cardbook/content/collected/ovl_collected.js"]);
		ovl_collected.removeAccountFromCollected(aAccountId);

		var cacheDir = cardbookRepository.getLocalDirectory();
		cacheDir.append(aAccountId);
		if (cacheDir.exists() && cacheDir.isDirectory()) {
			cacheDir.remove(true);
		}

		if (cardbookRepository.cardbookAccountsCategories[aAccountId]) {
			for (var i = 0; i < cardbookRepository.cardbookAccountsCategories[aAccountId].length; i++) {
				var myAccountId = aAccountId+"::"+cardbookRepository.cardbookAccountsCategories[aAccountId][i];
				function searchCard1(element) {
					return (element[4] != myAccountId);
				}
				cardbookRepository.cardbookAccounts = cardbookRepository.cardbookAccounts.filter(searchCard1);
			}
			delete cardbookRepository.cardbookAccountsCategories[aAccountId];
		}

		function searchCard2(element) {
			return (element[4] != aAccountId);
		}
		cardbookRepository.cardbookAccounts = cardbookRepository.cardbookAccounts.filter(searchCard2, aAccountId);

		for (var key in cardbookRepository.cardbookCards) {
			if (cardbookRepository.cardbookCards.hasOwnProperty(key)) {
				if (key.indexOf(aAccountId) >= 0) {
					cardbookRepository.removeCardFromSearch(cardbookRepository.cardbookCards[key]);
					cardbookRepository.removeCardFromDisplay(cardbookRepository.cardbookCards[key]);
					delete cardbookRepository.cardbookCards[key];
					delete cardbookRepository.cardbookFileCacheCards[key];
				}
			}
		}
	},
		
	emptyAccountFromRepository: function(aAccountId) {
		if (cardbookRepository.cardbookAccountsCategories[aAccountId]) {
			for (var i = 0; i < cardbookRepository.cardbookAccountsCategories[aAccountId].length; i++) {
				var myAccountId = aAccountId+"::"+cardbookRepository.cardbookAccountsCategories[aAccountId][i];
				function searchCard1(element) {
					return (element[4] != myAccountId);
				}
				cardbookRepository.cardbookAccounts = cardbookRepository.cardbookAccounts.filter(searchCard1);
			}
			cardbookRepository.cardbookAccountsCategories[aAccountId] = [];
		}
		cardbookRepository.setEmptyContainer(aAccountId);

		for (var key in cardbookRepository.cardbookCards) {
			if (cardbookRepository.cardbookCards.hasOwnProperty(key)) {
				if (key.indexOf(aAccountId) >= 0) {
					cardbookRepository.removeCardFromSearch(cardbookRepository.cardbookCards[key]);
					cardbookRepository.removeCardFromDisplay(cardbookRepository.cardbookCards[key]);
					delete cardbookRepository.cardbookCards[key];
					delete cardbookRepository.cardbookFileCacheCards[key];
				}
			}
		}
	},
		
	removeCardFromRepository: function (aCard, aCacheDeletion) {
		try {
			this.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			this.jsInclude(["chrome://cardbook/content/wdw_log.js"]);
			this.jsInclude(["chrome://cardbook/content/cardbookUtils.js"]);
			this.jsInclude(["chrome://cardbook/content/cardbookSynchronization.js"]);
			cardbookRepository.removeCardFromSearch(aCard);
			cardbookRepository.removeCardFromEmails(aCard);
			cardbookRepository.removeCardFromCategories(aCard);
			cardbookRepository.removeCardFromDisplay(aCard);
			if (aCacheDeletion) {
				cardbookRepository.removeCardFromCache(aCard);
			}
			cardbookRepository.removeCardFromList(aCard);
			delete aCard;
		}
		catch (e) {
			wdw_cardbooklog.updateStatusProgressInformation("cardbookRepository.removeCardFromRepository error : " + e);
		}
	},

	addCardToRepository: function (aCard, aMode, aFileName) {
		try {
			this.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			this.jsInclude(["chrome://cardbook/content/wdw_log.js"]);
			this.jsInclude(["chrome://cardbook/content/cardbookUtils.js"]);
			this.jsInclude(["chrome://cardbook/content/cardbookSynchronization.js"]);
			cardbookRepository.addCardToEmails(aCard);
			cardbookRepository.addCardToSearch(aCard);
			cardbookRepository.addCardToList(aCard);
			cardbookRepository.addCardToCache(aCard, aMode, aFileName);
			cardbookRepository.addCardToCategories(aCard);
			cardbookRepository.addCardToDisplay(aCard);
		}
		catch (e) {
			wdw_cardbooklog.updateStatusProgressInformation("cardbookRepository.addCardToRepository error : " + e);
		}
	},

	addCardToList: function(aCard) {
		cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+aCard.uid] = aCard;
	},
		
	removeCardFromList: function(aCard) {
		delete cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+aCard.uid];
	},
		
	addCardToCache: function(aCard, aMode, aFileName) {
		try {
			cardbookSynchronization.cachePutMediaCard(aCard, "photo");
			cardbookSynchronization.cachePutMediaCard(aCard, "logo");
			cardbookSynchronization.cachePutMediaCard(aCard, "sound");

			if (aFileName != null && aFileName !== undefined && aFileName != "") {
				var cacheDir = cardbookRepository.getLocalDirectory();
				cacheDir.append(aCard.dirPrefId);
				cacheDir.append(aFileName);
				if (aMode === "INITIAL") {
					if (!cacheDir.exists()) {
						cardbookSynchronization.writeCardsToFile(cacheDir.path, [aCard], false);
						var myPrefName = cardbookUtils.getPrefNameFromPrefId(aCard.dirPrefId);
						wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " written to cache");
					}
				} else {
					if (cacheDir.exists() && cacheDir.isFile()) {
						cacheDir.remove(true);
					}
					cardbookSynchronization.writeCardsToFile(cacheDir.path, [aCard], false);
					var myPrefName = cardbookUtils.getPrefNameFromPrefId(aCard.dirPrefId);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " written to cache");
				}
				cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId+"::"+aCard.uid] = aFileName;
			}
		}
		catch(e) {
			wdw_cardbooklog.updateStatusProgressInformation("cardbookRepository.addCardToCache error : " + e);
		}
	},

	removeCardFromCache: function(aCard) {
		try {
			cardbookSynchronization.cacheDeleteMediaCard(aCard);
			
			var cacheDir = cardbookRepository.getLocalDirectory();
			cacheDir.append(aCard.dirPrefId);
			cacheDir.append(cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId+"::"+aCard.uid]);
			if (cacheDir.exists() && cacheDir.isFile()) {
				cacheDir.remove(true);
				var myPrefName = cardbookUtils.getPrefNameFromPrefId(aCard.dirPrefId);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " deleted from cache");
			}
			
			delete cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId+"::"+aCard.uid];
		}
		catch(e) {
			wdw_cardbooklog.updateStatusProgressInformation("cardbookRepository.removeCardFromCache error : " + e);
		}
	},

	addCardToCategories: function(aCard) {
		if (aCard.categories.length != 0) {
			cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId] = cardbookRepository.arrayUnique(cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId].concat(aCard.categories));
		} else {
			var uncategorizedCards = cardbookRepository.cardbookUncategorizedCards;
			cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId] = cardbookRepository.arrayUnique(cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId].concat([uncategorizedCards]));
		}
		cardbookRepository.sortCategories(aCard.dirPrefId);
		cardbookRepository.setEmptyContainer(aCard.dirPrefId);
	},
		
	removeCardFromCategories: function(aCard) {
		if (aCard.categories.length != 0) {
			for (var j = 0; j < aCard.categories.length; j++) {
				if (cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId]) {
					function searchCategory(element) {
						return ((element == aCard.categories[j] && cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]].length > 1)
								|| (element != aCard.categories[j]));
					}
					cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId] = cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId].filter(searchCategory);
				}
				
				if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]]) {
					if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]].length === 1) {
						cardbookRepository.removeCategoryFromAccounts(aCard.dirPrefId+"::"+aCard.categories[j]);
					} else if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]].length === 0) {
						cardbookRepository.removeCategoryFromDisplay(aCard.dirPrefId+"::"+aCard.categories[j]);
					}
				}
			}
		} else {
			var uncategorizedCards = cardbookRepository.cardbookUncategorizedCards;
			if (cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId]) {
				function searchCategory(element) {
					return ((element == uncategorizedCards && cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards].length > 1)
							|| (element != uncategorizedCards));
				}
				cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId] = cardbookRepository.cardbookAccountsCategories[aCard.dirPrefId].filter(searchCategory);
			}

			if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards]) {
				if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards].length === 1) {
					cardbookRepository.removeCategoryFromAccounts(aCard.dirPrefId+"::"+uncategorizedCards);
				} else if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards].length === 0) {
					cardbookRepository.removeCategoryFromDisplay(aCard.dirPrefId+"::"+uncategorizedCards);
				}
			}
		}
		cardbookRepository.setEmptyContainer(aCard.dirPrefId);
	},

	removeCategoryFromAccounts: function(aCategory) {
		function searchAccount(element) {
			return (element[4] !== aCategory);
		}
		cardbookRepository.cardbookAccounts = cardbookRepository.cardbookAccounts.filter(searchAccount);
	},

	removeCategoryFromCategories: function(aDirPrefId, aCategoryName) {
		function searchCategory(element) {
			return (element !== aCategoryName);
		}
		cardbookRepository.cardbookAccountsCategories[aDirPrefId] = cardbookRepository.cardbookAccountsCategories[aDirPrefId].filter(searchCategory);
	},

	removeCategoryFromCards: function(aCard, aCategoryName) {
		function searchCategory(element) {
			return (element !== aCategoryName);
		}
		aCard.categories = aCard.categories.filter(searchCategory);
	},

	removeCategoryFromDisplay: function(aCategory) {
		delete cardbookRepository.cardbookDisplayCards[aCategory];
	},

	addCardToDisplay: function(aCard) {
		wdw_cardbooklog.updateStatusProgressInformation("addCardToDisplay=" + JSON.stringify(aCard));
		cardbookRepository.cardbookDisplayCards[aCard.dirPrefId].push(aCard);
		if (aCard.categories.length != 0) {
			for (let j = 0; j < aCard.categories.length; j++) {
				if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]]) {
					cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]].push(aCard);
				} else {
					cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]] = [];
					cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]].push(aCard);
				}
			}
		} else {
			var uncategorizedCards = cardbookRepository.cardbookUncategorizedCards;
			if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards]) {
				cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards].push(aCard);
			} else {
				cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards] = [];
				cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards].push(aCard);
			}
		}
		var myPrefName = cardbookUtils.getPrefNameFromPrefId(aCard.dirPrefId);
		wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " added to display");

		if (cardbookRepository.cardbookSearchMode === "SEARCH") {
			if (cardbookRepository.getSearchString(aCard).indexOf(cardbookRepository.cardbookSearchValue) >= 0) {
				cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookSearchValue].push(aCard);
			}
			wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " added to display search");
		}
	},
	
	removeCardFromDisplay: function(aCard) {
		if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId]) {
			function searchCard(element) {
				return (element.uid != aCard.uid);
			}
			cardbookRepository.cardbookDisplayCards[aCard.dirPrefId] = cardbookRepository.cardbookDisplayCards[aCard.dirPrefId].filter(searchCard);
			if (aCard.categories.length != 0) {
				for (let j = 0; j < aCard.categories.length; j++) {
					if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]]) {
						function searchCard(element) {
							return (element.uid != aCard.uid);
						}
						cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]] = cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+aCard.categories[j]].filter(searchCard);
					}
				}
			} else {
				var uncategorizedCards = cardbookRepository.cardbookUncategorizedCards;
				if (cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards]) {
					function searchCard(element) {
						return (element.uid != aCard.uid);
					}
					cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards] = cardbookRepository.cardbookDisplayCards[aCard.dirPrefId+"::"+uncategorizedCards].filter(searchCard);
				}
			}
			var myPrefName = cardbookUtils.getPrefNameFromPrefId(aCard.dirPrefId);
			wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " deleted from display");
		}
		if (cardbookRepository.cardbookSearchMode === "SEARCH") {
			function searchCard(element) {
				return (element.dirPrefId+"::"+element.uid != aCard.dirPrefId+"::"+aCard.uid);
			}
			cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookSearchValue] = cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookSearchValue].filter(searchCard);
			var myPrefName = cardbookUtils.getPrefNameFromPrefId(aCard.dirPrefId);
			wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " deleted from display search");
		}
	},
	
	addCardToEmails: function(aCard) {
		for (var i = 0; i < aCard.email.length; i++) {
			var myEmail = aCard.email[i][0][0];
			if (myEmail != null && myEmail !== undefined && myEmail != "") {
				if (!cardbookRepository.cardbookCardEmails[aCard.dirPrefId]) {
					cardbookRepository.cardbookCardEmails[aCard.dirPrefId] = [];
				}
				cardbookRepository.cardbookCardEmails[aCard.dirPrefId].push([myEmail.toLowerCase(),aCard.dirPrefId+"::"+aCard.uid]);
			}
		}
		
	},
		
	removeCardFromEmails: function(aCard) {
		if (cardbookRepository.cardbookCardEmails[aCard.dirPrefId]) {
			function searchCard(element) {
				return (element[1] != aCard.dirPrefId+"::"+aCard.uid);
			}
			cardbookRepository.cardbookCardEmails[aCard.dirPrefId] = cardbookRepository.cardbookCardEmails[aCard.dirPrefId].filter(searchCard);
		}
	},

	addCardFromDisplayAndEmail: function (aDirPrefId, aDisplayName, aEmail) {
		if (!(aDisplayName != null && aDisplayName !== undefined && aDisplayName != "")) {
			if (!(aEmail != null && aEmail !== undefined && aEmail != "")) {
				return;
			}
		}
		if (!cardbookRepository.isEmailInPrefIdRegistered(aDirPrefId, aEmail)) {
			this.jsInclude(["chrome://cardbook/content/cardbookCardParser.js", "chrome://cardbook/content/uuid.js"]);
			this.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
			var myDirPrefIdType = cardbookPrefService.getType();
			var myNewCard = new cardbookCardParser();
			myNewCard.uid = new UUID() + "";
			myNewCard.dirPrefId = aDirPrefId;
			myNewCard.fn = aDisplayName;
			if (myNewCard.fn == "") {
				myNewCard.fn = aEmail.substr(0, aEmail.indexOf("@")).replace("."," ").replace("_"," ");
			}
			var emailArray = [ [ [aEmail], [] ,"", [] ] ];
			cardbookUtils.parseEmailsCard(myNewCard, emailArray);
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			myNewCard.version = prefs.getComplexValue("extensions.cardbook.cardCreationVersion", Components.interfaces.nsISupportsString).data;
			cardbookRepository.addCardToRepository(myNewCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(myNewCard, myDirPrefIdType));
		}
	},

	isEmailRegistered: function(aEmail) {
		if (aEmail != null && aEmail !== undefined && aEmail != "") {
			var myTestString = aEmail.toLowerCase();
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][6]) {
					var myDirPrefId = cardbookRepository.cardbookAccounts[i][4];
					if (cardbookRepository.isEmailInPrefIdRegistered(myDirPrefId, aEmail)) {
						return true;
					}
				}
			}
		}
		return false;
	},
		
	isEmailInPrefIdRegistered: function(aDirPrefId, aEmail) {
		if (aEmail != null && aEmail !== undefined && aEmail != "") {
			var myTestString = aEmail.toLowerCase();
			if (cardbookRepository.cardbookCardEmails[aDirPrefId]) {
				for (var j = 0; j < cardbookRepository.cardbookCardEmails[aDirPrefId].length; j++) {
					if (cardbookRepository.cardbookCardEmails[aDirPrefId][j][0] == myTestString) {
						return true;
					}
				}
			}
		}
		return false;
	},
		
	addCardToSearch: function(aCard) {
		cardbookRepository.cardbookCardSearch.push([cardbookRepository.getSearchString(aCard),aCard.dirPrefId+"::"+aCard.uid]);
	},

	removeCardFromSearch: function(aCard) {
		function searchCard(element) {
			return (element[1] != aCard.dirPrefId+"::"+aCard.uid);
		}
		cardbookRepository.cardbookCardSearch = cardbookRepository.cardbookCardSearch.filter(searchCard);
	},
	
	isthereSearchRulesToCreate: function () {
		var todo = 0;
		var allRules = false;
		for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
			if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][6]) {
				todo++;
			}
			if (todo >= 2) {
				allRules = true;
				break;
			}
		}
		return allRules;
	},

	deleteCssAllRules: function (aStyleSheet) {
		for (var i = cardbookRepository.cardbookDynamicCssRules[aStyleSheet.href].length - 1 ; i >= 0; i--) {
			try {
				aStyleSheet.deleteRule(cardbookRepository.cardbookDynamicCssRules[aStyleSheet.href][i]);
			} catch(e) {}
		}
		cardbookRepository.cardbookDynamicCssRules[aStyleSheet.href] = [];
	},

	createCssAccountRules: function (aStyleSheet, aDirPrefId, aColor) {
		var ruleString = ".cardbookTreeChildrenAccountClass treechildren::-moz-tree-cell(accountColor container " + aDirPrefId + ") {}";
		var ruleIndex = aStyleSheet.insertRule(ruleString, aStyleSheet.cssRules.length);
		aStyleSheet.cssRules[ruleIndex].style.backgroundColor = aColor;
		cardbookRepository.cardbookDynamicCssRules[aStyleSheet.href].push(ruleIndex);
	},

	createCssCardRules: function (aStyleSheet, aDirPrefId, aColor) {
		var ruleString = ".cardbookTreeChildrenCardsClass treechildren::-moz-tree-row(SEARCH " + aDirPrefId + ") {}";
		var ruleIndex = aStyleSheet.insertRule(ruleString, aStyleSheet.cssRules.length);
		aStyleSheet.cssRules[ruleIndex].style.backgroundColor = aColor;
		cardbookRepository.cardbookDynamicCssRules[aStyleSheet.href].push(ruleIndex);
	},

	createCssHeaderRules: function (aStyleSheet) {
		var ruleString = ".cardbookTreeChildrenCardClass treecols {}";
		var ruleIndex = aStyleSheet.insertRule(ruleString, aStyleSheet.cssRules.length);
		aStyleSheet.cssRules[ruleIndex].style.height = "0px";
		aStyleSheet.cssRules[ruleIndex].style.overflow = "hidden";
		cardbookRepository.cardbookDynamicCssRules[aStyleSheet.href].push(ruleIndex);
	},

	unregisterCss: function (aChromeUri) {
		var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);
		var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		var uri = ios.newURI(aChromeUri, null, null);
		if (sss.sheetRegistered(uri, sss.AUTHOR_SHEET)) {
			sss.unregisterSheet(uri, sss.AUTHOR_SHEET);
		}
	},

	reloadCss: function (aChromeUri) {
		var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);
		var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		var uri = ios.newURI(aChromeUri, null, null);
		if (sss.sheetRegistered(uri, sss.AUTHOR_SHEET)) {
			sss.unregisterSheet(uri, sss.AUTHOR_SHEET);
		}
		sss.loadAndRegisterSheet(uri, sss.AUTHOR_SHEET);
	},

	validateLook: function (aPrefValue) {
		if (aPrefValue) {
			cardbookRepository.unregisterCss("chrome://cardbook/skin/null.css");
			cardbookRepository.reloadCss("chrome://cardbook/skin/blue.css");
		} else {
			cardbookRepository.unregisterCss("chrome://cardbook/skin/blue.css");
			cardbookRepository.reloadCss("chrome://cardbook/skin/null.css");
		}
	}

};
