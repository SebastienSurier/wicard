if ("undefined" == typeof(cardbookSynchronization)) {
	var cardbookSynchronization = {

		autoSync: "",
		autoSyncInterval: "",
		autoSyncId: "",

		initRefreshToken: function(aPrefId) {
			cardbookRepository.cardbookServerValidation = {};
			cardbookSynchronization.initMultipleOperations(aPrefId);
		},
		
		initSync: function(aPrefId) {
			cardbookRepository.cardbookSyncMode = "SYNC";
			cardbookSynchronization.initMultipleOperations(aPrefId);
		},
		
		initURLValidation: function(aPrefId) {
			cardbookRepository.cardbookServerValidation = {};
			cardbookSynchronization.initMultipleOperations(aPrefId);
		},
		
		initMultipleOperations: function(aPrefId) {
			cardbookRepository.cardbookGoogleAccessTokenRequest[aPrefId] = 0;
			cardbookRepository.cardbookGoogleAccessTokenResponse[aPrefId] = 0;
			cardbookRepository.cardbookGoogleAccessTokenError[aPrefId] = 0;
			cardbookRepository.cardbookGoogleRefreshTokenRequest[aPrefId] = 0;
			cardbookRepository.cardbookGoogleRefreshTokenResponse[aPrefId] = 0;
			cardbookRepository.cardbookGoogleRefreshTokenError[aPrefId] = 0;
			cardbookRepository.cardbookDirRequest[aPrefId] = 0;
			cardbookRepository.cardbookDirResponse[aPrefId] = 0;
			cardbookRepository.cardbookFileRequest[aPrefId] = 0;
			cardbookRepository.cardbookFileResponse[aPrefId] = 0;
			cardbookRepository.cardbookServerDiscoveryRequest[aPrefId] = 0;
			cardbookRepository.cardbookServerDiscoveryResponse[aPrefId] = 0;
			cardbookRepository.cardbookServerDiscoveryError[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncRequest[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncResponse[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncDone[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncError[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncNotUpdated[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncNewOnServer[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncNewOnDisk[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncUpdatedOnServer[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncUpdatedOnDisk[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncUpdatedOnBoth[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncUpdatedOnDiskDeletedOnServer[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncDeletedOnDisk[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncDeletedOnServer[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncDeletedOnDiskUpdatedOnServer[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncAgain[aPrefId] = false;
			cardbookRepository.cardbookServerGetRequest[aPrefId] = 0;
			cardbookRepository.cardbookServerGetResponse[aPrefId] = 0;
			cardbookRepository.cardbookServerGetError[aPrefId] = 0;
			cardbookRepository.cardbookServerUpdatedRequest[aPrefId] = 0;
			cardbookRepository.cardbookServerUpdatedResponse[aPrefId] = 0;
			cardbookRepository.cardbookServerUpdatedError[aPrefId] = 0;
			cardbookRepository.cardbookServerCreatedRequest[aPrefId] = 0;
			cardbookRepository.cardbookServerCreatedResponse[aPrefId] = 0;
			cardbookRepository.cardbookServerCreatedError[aPrefId] = 0;
			cardbookRepository.cardbookServerDeletedRequest[aPrefId] = 0;
			cardbookRepository.cardbookServerDeletedResponse[aPrefId] = 0;
			cardbookRepository.cardbookServerDeletedError[aPrefId] = 0;
			cardbookRepository.cardbookServerSyncTotal[aPrefId] = 0;
			cardbookRepository.cardbookImageGetRequest[aPrefId] = 0;
			cardbookRepository.cardbookImageGetResponse[aPrefId] = 0;
			cardbookRepository.cardbookImageGetError[aPrefId] = 0;
		},

		nullifyMultipleOperations: function() {
			cardbookRepository.cardbookGoogleAccessTokenRequest = {};
			cardbookRepository.cardbookGoogleAccessTokenResponse = {};
			cardbookRepository.cardbookGoogleAccessTokenError = {};
			cardbookRepository.cardbookGoogleRefreshTokenRequest = {};
			cardbookRepository.cardbookGoogleRefreshTokenResponse = {};
			cardbookRepository.cardbookGoogleRefreshTokenError = {};
			cardbookRepository.cardbookDirRequest = {};
			cardbookRepository.cardbookDirResponse = {};
			cardbookRepository.cardbookFileRequest = {};
			cardbookRepository.cardbookFileResponse = {};
			cardbookRepository.cardbookServerDiscoveryRequest = {};
			cardbookRepository.cardbookServerDiscoveryResponse = {};
			cardbookRepository.cardbookServerDiscoveryError = {};
			cardbookRepository.cardbookServerSyncRequest = {};
			cardbookRepository.cardbookServerSyncResponse = {};
			cardbookRepository.cardbookServerSyncDone = {};
			cardbookRepository.cardbookServerSyncError = {};
			cardbookRepository.cardbookServerSyncNotUpdated = {};
			cardbookRepository.cardbookServerSyncNewOnServer = {};
			cardbookRepository.cardbookServerSyncNewOnDisk = {};
			cardbookRepository.cardbookServerSyncUpdatedOnServer = {};
			cardbookRepository.cardbookServerSyncUpdatedOnDisk = {};
			cardbookRepository.cardbookServerSyncUpdatedOnBoth = {};
			cardbookRepository.cardbookServerSyncUpdatedOnDiskDeletedOnServer = {};
			cardbookRepository.cardbookServerSyncDeletedOnDisk = {};
			cardbookRepository.cardbookServerSyncDeletedOnServer = {};
			cardbookRepository.cardbookServerSyncDeletedOnDiskUpdatedOnServer = {};
			cardbookRepository.cardbookServerSyncAgain = {};
			cardbookRepository.cardbookServerGetRequest = {};
			cardbookRepository.cardbookServerGetResponse = {};
			cardbookRepository.cardbookServerGetError = {};
			cardbookRepository.cardbookServerUpdatedRequest = {};
			cardbookRepository.cardbookServerUpdatedResponse = {};
			cardbookRepository.cardbookServerUpdatedError = {};
			cardbookRepository.cardbookServerCreatedRequest = {};
			cardbookRepository.cardbookServerCreatedResponse = {};
			cardbookRepository.cardbookServerCreatedError = {};
			cardbookRepository.cardbookServerDeletedRequest = {};
			cardbookRepository.cardbookServerDeletedResponse = {};
			cardbookRepository.cardbookServerDeletedError = {};
			cardbookRepository.cardbookServerSyncTotal = {};
			cardbookRepository.cardbookImageGetRequest = {};
			cardbookRepository.cardbookImageGetResponse = {};
			cardbookRepository.cardbookImageGetError = {};
		},

		finishMultipleOperations: function(aPrefId) {
			cardbookSynchronization.initMultipleOperations(aPrefId);
		},

		getRequest: function(aPrefId, aPrefName) {
			if (aPrefId != null && aPrefId !== undefined && aPrefId != "") {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookGoogleAccessTokenRequest : ", cardbookRepository.cardbookGoogleAccessTokenRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookGoogleRefreshTokenRequest : ", cardbookRepository.cardbookGoogleRefreshTokenRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerGetRequest : ", cardbookRepository.cardbookServerGetRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerUpdatedRequest : ", cardbookRepository.cardbookServerUpdatedRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerCreatedRequest : ", cardbookRepository.cardbookServerCreatedRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerDeletedRequest : ", cardbookRepository.cardbookServerDeletedRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookDirRequest : ", cardbookRepository.cardbookDirRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookFileRequest : ", cardbookRepository.cardbookFileRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookImageGetRequest : ", cardbookRepository.cardbookImageGetRequest[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerSyncRequest : ", cardbookRepository.cardbookServerSyncRequest[aPrefId]);
				return cardbookRepository.cardbookGoogleAccessTokenRequest[aPrefId] +
						cardbookRepository.cardbookGoogleRefreshTokenRequest[aPrefId] +
						cardbookRepository.cardbookServerGetRequest[aPrefId] +
						cardbookRepository.cardbookServerUpdatedRequest[aPrefId] +
						cardbookRepository.cardbookServerCreatedRequest[aPrefId] +
						cardbookRepository.cardbookServerDeletedRequest[aPrefId] +
						cardbookRepository.cardbookDirRequest[aPrefId] +
						cardbookRepository.cardbookFileRequest[aPrefId] +
						cardbookRepository.cardbookImageGetRequest[aPrefId] +
						cardbookRepository.cardbookServerSyncRequest[aPrefId];
			} else {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookGoogleAccessTokenRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookGoogleAccessTokenRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookGoogleRefreshTokenRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookGoogleRefreshTokenRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerGetRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerGetRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerUpdatedRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerUpdatedRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerCreatedRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerCreatedRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerDeletedRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerDeletedRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookDirRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookDirRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookFileRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookFileRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookImageGetRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookImageGetRequest));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerSyncRequest : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncRequest));
				return cardbookUtils.sumElements(cardbookRepository.cardbookGoogleAccessTokenRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookGoogleRefreshTokenRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerGetRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerUpdatedRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerCreatedRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerDeletedRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookDirRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookFileRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookImageGetRequest) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncRequest);
			}
		},
		
		getResponse: function(aPrefId, aPrefName) {
			if (aPrefId != null && aPrefId !== undefined && aPrefId != "") {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookGoogleAccessTokenResponse : ", cardbookRepository.cardbookGoogleAccessTokenResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookGoogleRefreshTokenResponse : ", cardbookRepository.cardbookGoogleRefreshTokenResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerGetResponse : ", cardbookRepository.cardbookServerGetResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerUpdatedResponse : ", cardbookRepository.cardbookServerUpdatedResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerCreatedResponse : ", cardbookRepository.cardbookServerCreatedResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerDeletedResponse : ", cardbookRepository.cardbookServerDeletedResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookDirResponse : ", cardbookRepository.cardbookDirResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookFileResponse : ", cardbookRepository.cardbookFileResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookImageGetResponse : ", cardbookRepository.cardbookImageGetResponse[aPrefId]);
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerSyncResponse : ", cardbookRepository.cardbookServerSyncResponse[aPrefId]);
				return cardbookRepository.cardbookGoogleAccessTokenResponse[aPrefId] +
						cardbookRepository.cardbookGoogleRefreshTokenResponse[aPrefId] +
						cardbookRepository.cardbookServerGetResponse[aPrefId] +
						cardbookRepository.cardbookServerUpdatedResponse[aPrefId] +
						cardbookRepository.cardbookServerCreatedResponse[aPrefId] +
						cardbookRepository.cardbookServerDeletedResponse[aPrefId] +
						cardbookRepository.cardbookDirResponse[aPrefId] +
						cardbookRepository.cardbookFileResponse[aPrefId] +
						cardbookRepository.cardbookImageGetResponse[aPrefId] +
						cardbookRepository.cardbookServerSyncResponse[aPrefId];
			} else {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookGoogleAccessTokenResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookGoogleAccessTokenResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookGoogleRefreshTokenResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookGoogleRefreshTokenResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerGetResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerGetResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerUpdatedResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerUpdatedResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerCreatedResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerCreatedResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerDeletedResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerDeletedResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookDirResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookDirResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookFileResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookFileResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookImageGetResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookImageGetResponse));
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerSyncResponse : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncResponse));
				return cardbookUtils.sumElements(cardbookRepository.cardbookGoogleAccessTokenResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookGoogleRefreshTokenResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerGetResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerUpdatedResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerCreatedResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerDeletedResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookDirResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookFileResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookImageGetResponse) +
						cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncResponse);
			}
		},
		
		getDone: function(aPrefId, aPrefName) {
			if (aPrefId != null && aPrefId !== undefined && aPrefId != "") {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerSyncDone : ", cardbookRepository.cardbookServerSyncDone[aPrefId]);
				return cardbookRepository.cardbookServerSyncDone[aPrefId];
			} else {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerSyncDone : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncDone));
				return cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncDone);
			}
		},
		
		getTotal: function(aPrefId, aPrefName) {
			if (aPrefId != null && aPrefId !== undefined && aPrefId != "") {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1(aPrefName + " : debug mode : cardbookRepository.cardbookServerSyncTotal : ", cardbookRepository.cardbookServerSyncTotal[aPrefId]);
				return cardbookRepository.cardbookServerSyncTotal[aPrefId];
			} else {
				wdw_cardbooklog.updateStatusProgressInformationWithDebug1("Total : debug mode : cardbookRepository.cardbookServerSyncTotal : ", cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncTotal));
				return cardbookUtils.sumElements(cardbookRepository.cardbookServerSyncTotal);
			}
		},
		
		finishOpenFile: function(aPrefId, aPrefName) {
			var errorNum = cardbookRepository.cardbookServerUpdatedError[aPrefId] + cardbookRepository.cardbookServerCreatedError[aPrefId];
			if (errorNum === 0) {
				cardbookUtils.formatStringForOutput("allContactsLoadedFromFile", [aPrefName]);
			} else {
				cardbookUtils.formatStringForOutput("notAllContactsLoadedFromFile", [aPrefName, errorNum]);
			}
		},
		
		finishSync: function(aPrefId, aPrefName) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService(aPrefId);
			var myPrefIdType = cardbookPrefService.getType();
			if (myPrefIdType === "GOOGLE" || myPrefIdType === "CARDDAV" || myPrefIdType === "APPLE") {
				var errorNum = cardbookRepository.cardbookGoogleAccessTokenError[aPrefId] + cardbookRepository.cardbookGoogleRefreshTokenError[aPrefId] + cardbookRepository.cardbookServerDiscoveryError[aPrefId] + cardbookRepository.cardbookServerSyncError[aPrefId];
				if (errorNum === 0) {
					cardbookUtils.formatStringForOutput("synchroFinishedResult", [aPrefName]);
					cardbookUtils.formatStringForOutput("synchroCardsUpToDate", [aPrefName, cardbookRepository.cardbookServerSyncNotUpdated[aPrefId]]);
					cardbookUtils.formatStringForOutput("synchroCardsNewOnServer", [aPrefName, cardbookRepository.cardbookServerSyncNewOnServer[aPrefId]]);
					cardbookUtils.formatStringForOutput("synchroCardsUpdatedOnServer", [aPrefName, cardbookRepository.cardbookServerSyncUpdatedOnServer[aPrefId]]);
					cardbookUtils.formatStringForOutput("synchroCardsDeletedOnServer", [aPrefName, cardbookRepository.cardbookServerSyncDeletedOnServer[aPrefId]]);
					cardbookUtils.formatStringForOutput("synchroCardsDeletedOnDisk", [aPrefName, cardbookRepository.cardbookServerSyncDeletedOnDisk[aPrefId]]);
					cardbookUtils.formatStringForOutput("synchroCardsDeletedOnDiskUpdatedOnServer", [aPrefName, cardbookRepository.cardbookServerSyncDeletedOnDiskUpdatedOnServer[aPrefId]]);
					cardbookUtils.formatStringForOutput("synchroCardsNewOnDisk", [aPrefName, cardbookRepository.cardbookServerSyncNewOnDisk[aPrefId]]);
					cardbookUtils.formatStringForOutput("synchroCardsUpdatedOnDisk", [aPrefName, cardbookRepository.cardbookServerSyncUpdatedOnDisk[aPrefId]]);
					cardbookUtils.formatStringForOutput("synchroCardsUpdatedOnBoth", [aPrefName, cardbookRepository.cardbookServerSyncUpdatedOnBoth[aPrefId]]);
					cardbookUtils.formatStringForOutput("synchroCardsUpdatedOnDiskDeletedOnServer", [aPrefName, cardbookRepository.cardbookServerSyncUpdatedOnDiskDeletedOnServer[aPrefId]]);
					var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
					var preferDisk = prefs.getBoolPref("extensions.cardbook.preferDisk");
					if (preferDisk) {
						var success = cardbookRepository.cardbookServerSyncDeletedOnServer[aPrefId] + cardbookRepository.cardbookServerGetResponse[aPrefId] - cardbookRepository.cardbookServerGetError[aPrefId];
					} else {
						var success = cardbookRepository.cardbookServerSyncDeletedOnServer[aPrefId] + cardbookRepository.cardbookServerGetResponse[aPrefId] - cardbookRepository.cardbookServerGetError[aPrefId]
										+ cardbookRepository.cardbookServerSyncUpdatedOnDiskDeletedOnServer[aPrefId];
					}
					cardbookUtils.formatStringForOutput("synchroModifGetOKFromServer", [aPrefName, success]);
					cardbookUtils.formatStringForOutput("synchroModifGetKOFromServer", [aPrefName, cardbookRepository.cardbookServerGetError[aPrefId]]);
					var error = cardbookRepository.cardbookServerCreatedError[aPrefId] + cardbookRepository.cardbookServerUpdatedError[aPrefId] + cardbookRepository.cardbookServerDeletedError[aPrefId];
					var success = cardbookRepository.cardbookServerCreatedResponse[aPrefId] + cardbookRepository.cardbookServerUpdatedResponse[aPrefId] + cardbookRepository.cardbookServerDeletedResponse[aPrefId] - error;
					cardbookUtils.formatStringForOutput("synchroModifPutOKFromServer", [aPrefName, success]);
					cardbookUtils.formatStringForOutput("synchroModifPutKOFromServer", [aPrefName, error]);
					cardbookUtils.formatStringForOutput("imageGetResponse", [aPrefName, cardbookRepository.cardbookImageGetResponse[aPrefId]]);
					cardbookUtils.formatStringForOutput("imageGetError", [aPrefName, cardbookRepository.cardbookImageGetError[aPrefId]]);
				} else {
					cardbookUtils.formatStringForOutput("synchroUnpossible", [aPrefName]);
				}
			} else if (myPrefIdType === "FILE") {
				cardbookUtils.formatStringForOutput("synchroFileFinishedResult", [aPrefName]);
				cardbookUtils.formatStringForOutput("synchroFileCardsOK", [aPrefName, cardbookRepository.cardbookServerSyncDone[aPrefId]]);
				cardbookUtils.formatStringForOutput("synchroFileCardsKO", [aPrefName, cardbookRepository.cardbookServerSyncError[aPrefId]]);
				cardbookUtils.formatStringForOutput("imageGetResponse", [aPrefName, cardbookRepository.cardbookImageGetResponse[aPrefId]]);
				cardbookUtils.formatStringForOutput("imageGetError", [aPrefName, cardbookRepository.cardbookImageGetError[aPrefId]]);
			} else if (myPrefIdType === "CACHE") {
				cardbookUtils.formatStringForOutput("synchroDirFinishedResult", [aPrefName]);
				cardbookUtils.formatStringForOutput("synchroDirCardsOK", [aPrefName, cardbookRepository.cardbookServerSyncDone[aPrefId]]);
				cardbookUtils.formatStringForOutput("synchroDirCardsKO", [aPrefName, cardbookRepository.cardbookServerSyncError[aPrefId]]);
			}
		},
		
		finishImport: function(aPrefId, aPrefName) {
			cardbookUtils.formatStringForOutput("importFinishedResult", [aPrefName]);
			cardbookUtils.formatStringForOutput("importCardsOK", [aPrefName, cardbookRepository.cardbookServerSyncDone[aPrefId]]);
			cardbookUtils.formatStringForOutput("importCardsKO", [aPrefName, cardbookRepository.cardbookServerSyncError[aPrefId]]);
		},
		
		getRootUrl: function (aUrl) {
			try {
				var urlArray1 = aUrl.split("://");
				var urlArray2 = urlArray1[1].split("/");
				return urlArray1[0] + "://" + urlArray2[0];
			}
			catch (e) {
				return "";
			}
		},
		
		// from Sogo
		getFileData: function (afileURI, aConvertion) {
            var content = "";
			var file = afileURI.QueryInterface(Components.interfaces.nsIFileURL).file;

			// Do not work for WEISO... but it works for UTF8
			if (file.exists() && file.isReadable()) {
				var fileStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
	            fileStream.init(file, -1, -1, false);

				if (aConvertion == "UTF8") {
					var converter = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
					converter.init(fileStream, "UTF-8", 1024, 0xFFFD);
					converter.QueryInterface(Components.interfaces.nsIUnicharLineInputStream);
	
					if (converter instanceof Components.interfaces.nsIUnicharLineInputStream) {
						var line = {};
						var cont;
						do {
							cont = converter.readLine(line);
							if (content != null && content !== undefined && content != "") {
								content = content + "\r\n" + line.value;
							} else {
								content = line.value;
							}
						} while (cont);
					}
					converter.close();
				} else {
					let byteStream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
					byteStream.setInputStream(fileStream);
					content = byteStream.readBytes(byteStream.available());
					byteStream.close();
				}

				fileStream.close();
			}
			
			return content;
		},

		// from Sogo
		cleanedUpHref: function(origHref, origUrl) {
			// href might be something like: http://foo:80/bar while this.gURL might
			// be something like: http://foo/bar so we strip the port value if the URLs
			// don't match. eGroupWare sends back such data.
		
			let hrefArray = origHref.split("/");
			let noprefix = false;
			// 		dump("hrefArray: " + hrefArray + "\n");
		
			if (hrefArray[0].substr(0,5) == "https"
				&& hrefArray[2].indexOf(":443") > 0) {
				hrefArray[2] = hrefArray[2].substring(0, hrefArray[2].length-4);
			}
			else if (hrefArray[0].substr(0,4) == "http" && hrefArray[2].indexOf(":80") > 0) {
				hrefArray[2] = hrefArray[2].substring(0, hrefArray[2].length-3);
			} else {
				noprefix = true;
			}
			let href = hrefArray.join("/");
		
			// We also check if this.gURL begins with http{s}:// but NOT href. If
			// that's the case, with servers such as OpenGroupware.org (OGo), we
			// prepend the relevant part.
			//
			// For example, this.gURL could be:
			// http://foo.bar/zidestore/dav/fred/public/Contacts/
			// while href is:
			// /dav/fred/public/Contacts/
			//
			if (noprefix && origUrl.substr(0,4) == "http") {
				let gURLArray = origUrl.split("/");
				href = gURLArray[0] + "//" + gURLArray[2] + href;
			}
		
			// 		dump("Cleaned up href: " + href + "\n");
		
			return href;
		},
		
		// from Sogo
		URLsAreEqual: function(href1, href2) {
			if (href1 == href2) {
				return true;
			}
			
			let resPathComponents1 = href1.split("/");
			let resPathComponents2 = href2.split("/");
	
			return ((resPathComponents1[2] == resPathComponents2[2]) && (resPathComponents1[resPathComponents1.length-2] == resPathComponents2[resPathComponents2.length-2]));
		},

		// from Sogo
		isSupportedVCardType: function(itemType) {
			if (itemType.indexOf("text/x-vcard") == 0 || itemType.indexOf("text/vcard") == 0 ) {
				return true;
			} else {
				return false;
			}
		},

		// from Sogo
		isSupportedVCardListType: function(listType) {
			if (listType.indexOf("text/x-vlist") == 0) {
				return true;
			} else {
				return false;
			}
		},

		// from Sogo
		isSupportedContentType: function(contType) {
			if (cardbookSynchronization.isSupportedVCardType(contType) || cardbookSynchronization.isSupportedVCardListType(contType) ) {
				return true;
			} else {
				return false;
			}
		},
		
		removeCardFromRepoOrWindow: function (aCard, aMode, aCacheDeletion) {
			try {
				if (aMode === "INITIAL") {
					cardbookRepository.removeCardFromRepository(aCard, aCacheDeletion);
				} else {
					wdw_cardbook.removeCardFromWindow(aCard, aCacheDeletion);
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookRepository.removeCardFromRepoOrWindow error : " + e);
			}
		},

		addCardToRepoOrWindow: function (aCard, aMode, aFileName) {
			try {
				if (aMode === "INITIAL") {
					cardbookRepository.addCardToRepository(aCard, aMode, aFileName);
				} else {
					wdw_cardbook.addCardToWindow(aCard, aMode, aFileName);
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookRepository.addCardToRepoOrWindow error : " + e);
			}
		},

		cacheDeleteMediaCard: function(aCard) {
			try {
				var myPrefName = cardbookUtils.getPrefNameFromPrefId(aCard.dirPrefId);
				var mediaName = [ 'photo', 'logo', 'sound' ];

				for (var i in mediaName) {
					var cacheDir = cardbookUtils.getMediaCacheFile(aCard.uid, aCard.dirPrefId, aCard.etag, mediaName[i], aCard[mediaName[i]].extension);
					if (cacheDir.exists() && cacheDir.isFile()) {
						cacheDir.remove(true);
						wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : Contact " + aCard.fn + " " + [mediaName[i]] + " deleted from cache");
					}
				}
			}
			catch(e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.cacheDeleteMediaCard error : " + e);
			}
		},

		cachePutMediaCard: function(aCard, aField) {
			try {
				var myPrefName = cardbookUtils.getPrefNameFromPrefId(aCard.dirPrefId);

				var cacheDir = cardbookUtils.getMediaCacheFile(aCard.uid, aCard.dirPrefId, aCard.etag, aField, aCard[aField].extension);
				if (aCard[aField].value != null && aCard[aField].value !== undefined && aCard[aField].value != "") {
					cardbookSynchronization.writeContentToFile(cacheDir.path, aCard[aField].value, "NOUTF8");
					aCard[aField].localURI = "file:///" + cacheDir.path;
					aCard[aField].value = "";
					aCard[aField].extension = cardbookUtils.getExtension(cacheDir.path);
					wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " " + aField + " written to cache");
				} else if (aCard[aField].localURI != null && aCard[aField].localURI !== undefined && aCard[aField].localURI != "") {
					if (!cacheDir.exists()) {
						var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
						var myFileURI = ioService.newURI(aCard[aField].localURI, null, null);
						var myFile1 = myFileURI.QueryInterface(Components.interfaces.nsIFileURL).file;
						myFile1.copyToFollowingLinks(cacheDir.parent,cacheDir.leafName);
						aCard[aField].localURI = "file:///" + cacheDir.path;
					}
				} else if (aCard[aField].URI != null && aCard[aField].URI !== undefined && aCard[aField].URI != "") {
					if (!cacheDir.exists()) {
						if (aCard[aField].URI.indexOf("http") == 0) {
							cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookWebDAV.js"]);
							var listener_getimage = {
								onDAVQueryComplete: function(status, response, etag) {
									if (status > 199 && status < 400) {
										cardbookUtils.formatStringForOutput("serverCardGetImageOK", [aImageConnection.connDescription, aCard.fn]);
										var cacheDir = cardbookUtils.getMediaCacheFile(aCard.uid, aCard.dirPrefId, aCard.etag, aField, aCard[aField].extension);
										cardbookSynchronization.writeContentToFile(cacheDir.path, response, "NOUTF8");
										aCard[aField].localURI = "file:///" + cacheDir.path;
									} else {
										cardbookRepository.cardbookImageGetError[aCard.dirPrefId]++;
										cardbookUtils.formatStringForOutput("serverCardGetImageFailed", [aImageConnection.connDescription, aCard.fn, aImageConnection.connUrl, status]);
									}
									cardbookRepository.cardbookImageGetResponse[aCard.dirPrefId]++;
								}
							};
							var aDescription = cardbookUtils.getPrefNameFromPrefId(aCard.dirPrefId);
							var aImageConnection = {connPrefId: aCard.dirPrefId, connUrl: aCard[aField].URI, connDescription: aDescription};
							var request = new cardbookWebDAV(aImageConnection, listener_getimage);
							cardbookUtils.formatStringForOutput("serverCardGettingImage", [aImageConnection.connDescription, aCard.fn]);
							cardbookRepository.cardbookImageGetRequest[aCard.dirPrefId]++;
							request.getimage();
						} else {
							var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
							var myFileURI = ioService.newURI(aCard[aField].URI, null, null);
							var fileContent = btoa(cardbookSynchronization.getFileData(myFileURI, "NOUTF8"));
							cardbookSynchronization.writeContentToFile(cacheDir.path, fileContent, "NOUTF8");
							aCard[aField].localURI = "file:///" + cacheDir.path;
							wdw_cardbooklog.updateStatusProgressInformationWithDebug2(myPrefName + " : debug mode : Contact " + aCard.fn + " " + aField + " written to cache");
						}
					} else {
						aCard[aField].localURI = "file:///" + cacheDir.path;
						aCard[aField].value = "";
						aCard[aField].extension = cardbookUtils.getExtension(cacheDir.path);
					}
				}
			}
			catch(e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.cachePutMediaCard error : " + e);
			}
		},

		cacheGetCard: function(aFileName, etag, dirPrefId, aPrefName, aMode) {
			var result = {};
			var cacheDir = cardbookRepository.getLocalDirectory();
			cacheDir.append(dirPrefId);
			cacheDir.append(aFileName);
			
			var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
			var myFileURI = ioService.newURI("file:///" + cacheDir.path, null, null);
			var fileContent = cardbookSynchronization.getFileData(myFileURI, "UTF8");
			
			if (fileContent != null && fileContent !== undefined && fileContent != "") {
				var re = /[\n\u0085\u2028\u2029]|\r\n?/;
				var fileContentArray = fileContent.split(re);
				
				var myServerCard = new cardbookCardParser(fileContent, "", etag, dirPrefId);
				result["servercard"] = myServerCard;
				var myCacheCard = new cardbookCardParser(fileContent, "", "", dirPrefId);
				result["cachecard"] = myCacheCard;
				if (myCacheCard.etag == etag) {
					if (myCacheCard.deleted) {
						result["type"] = "DELETEDONDISK";
						cardbookRepository.cardbookServerSyncDeletedOnDisk[dirPrefId]++;
						cardbookUtils.formatStringForOutput("cardDeletedOnDisk", [aPrefName, myCacheCard.fn]);
					} else if (myCacheCard.updated) {
						result["type"] = "UPDATEDONDISK";
						cardbookRepository.cardbookServerSyncUpdatedOnDisk[dirPrefId]++;
						cardbookUtils.formatStringForOutput("cardUpdatedOnDisk", [aPrefName, myCacheCard.fn]);
					} else {
						result["type"] = "NOTUPDATED";
						if (cardbookRepository.cardbookCards[dirPrefId+"::"+myCacheCard.uid]) {
							result["cachecard"] = cardbookRepository.cardbookCards[dirPrefId+"::"+myCacheCard.uid];
							cardbookUtils.formatStringForOutput("cardAlreadyGetFromCache", [aPrefName, myCacheCard.fn]);
						} else {
							cardbookSynchronization.addCardToRepoOrWindow(myCacheCard, aMode, aFileName);
							cardbookUtils.formatStringForOutput("cardGetFromCache", [aPrefName, myCacheCard.fn]);
						}
						cardbookRepository.cardbookServerSyncDone[dirPrefId]++;
						cardbookRepository.cardbookServerSyncNotUpdated[dirPrefId]++;
					}
				} else if (myCacheCard.deleted) {
					result["type"] = "DELETEDONDISKUPDATEDONSERVER";
					cardbookRepository.cardbookServerSyncDeletedOnDiskUpdatedOnServer[dirPrefId]++;
					cardbookUtils.formatStringForOutput("cardDeletedOnDiskUpdatedOnServer", [aPrefName, myCacheCard.fn]);
				} else if (myCacheCard.updated) {
					result["type"] = "UPDATEDONBOTH";
					cardbookRepository.cardbookServerSyncUpdatedOnBoth[dirPrefId]++;
					cardbookUtils.formatStringForOutput("cardUpdatedOnBoth", [aPrefName, myCacheCard.fn]);
				} else {
					result["type"] = "UPDATEDONSERVER";
					cardbookRepository.cardbookServerSyncUpdatedOnServer[dirPrefId]++;
					cardbookUtils.formatStringForOutput("cardUpdatedOnServer", [aPrefName, myCacheCard.fn, etag, myCacheCard.etag]);
				}
			} else {
				result["type"] = "NEWONSERVER";
				cardbookRepository.cardbookServerSyncNewOnServer[dirPrefId]++;
				cardbookUtils.formatStringForOutput("cardNewOnServer", [aPrefName]);
			}
			return result;
		},

		serverDelete: function(aConnection, aMode, aCard, aPrefIdType) {
			var listener_delete = {
				onDAVQueryComplete: function(status, response) {
					if (status > 199 && status < 400) {
						cardbookUtils.formatStringForOutput("serverCardDeletedFromServer", [aConnection.connDescription, aCard.fn]);
						cardbookSynchronization.removeCardFromRepoOrWindow(aCard, aMode, true);
					} else if (status == 404) {
						cardbookUtils.formatStringForOutput("serverCardNotExistServer", [aConnection.connDescription, aCard.fn]);
						cardbookSynchronization.removeCardFromRepoOrWindow(aCard, aMode, true);
					} else {
						cardbookRepository.cardbookServerDeletedError[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("serverCardDeleteFailed", [aConnection.connDescription, aCard.fn, aConnection.connUrl, status]);
						cardbookUtils.addTagDeleted(aCard);
						cardbookRepository.addCardToCache(aCard, aMode, cardbookUtils.getFileNameFromUrl(aConnection.connUrl));
						if (cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+aCard.uid]) {
							cardbookSynchronization.removeCardFromRepoOrWindow(aCard, aMode, false);
						}
					}
					cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
					cardbookRepository.cardbookServerDeletedResponse[aConnection.connPrefId]++;
				}
			};
			cardbookUtils.nullifyTagModification(aCard);

			var request = new cardbookWebDAV(aConnection, listener_delete);
			cardbookUtils.formatStringForOutput("serverCardSendingDeletion", [aConnection.connDescription, aCard.fn]);
			cardbookRepository.cardbookServerDeletedRequest[aConnection.connPrefId]++;
			request.delete();
		},

		serverUpdate: function(aConnection, aMode, aCard, aModifiedCard, aPrefIdType) {
			var listener_update = {
				onDAVQueryComplete: function(status, response, etag) {
					if (status > 199 && status < 400) {
						if (etag != null && etag !== undefined && etag != "") {
							cardbookUtils.formatStringForOutput("serverCardUpdatedOnServerWithEtag", [aConnection.connDescription, aModifiedCard.fn, etag]);
							cardbookUtils.addEtag(aModifiedCard, etag);
						} else {
							cardbookRepository.cardbookServerSyncAgain[aConnection.connPrefId] = true;
							cardbookUtils.formatStringForOutput("serverCardUpdatedOnServerWithoutEtag", [aConnection.connDescription, aModifiedCard.fn]);
							cardbookUtils.addEtag(aModifiedCard, "0");
						}
						cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
						// if aCard and aCard have the same cached medias
						cardbookUtils.changeMediaFromFileToContent(aModifiedCard);
						cardbookSynchronization.removeCardFromRepoOrWindow(aCard, aMode, true);
						cardbookSynchronization.addCardToRepoOrWindow(aModifiedCard, aMode, cardbookUtils.getFileNameFromUrl(aConnection.connUrl));
					} else if (status == 412 || status == 409) {
						cardbookUtils.addEtag(aModifiedCard, etag);
						cardbookUtils.formatStringForOutput("serverCardUpdateFailed", [aConnection.connDescription, aModifiedCard.fn, aConnection.connUrl, status]);
						cardbookUtils.formatStringForOutput("cardUpdatedOnBoth", [aConnection.connDescription, aModifiedCard.fn]);
						var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
						var preferDisk = prefs.getBoolPref("extensions.cardbook.preferDisk");
						if (preferDisk) {
							cardbookSynchronization.serverUpdate(aConnection, aMode, aCard, aModifiedCard, aPrefIdType);
						} else {
							cardbookSynchronization.serverGet(aConnection, "", aMode);
						}
					} else {
						cardbookUtils.addTagUpdated(aModifiedCard);
						cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerUpdatedError[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("serverCardUpdateFailed", [aConnection.connDescription, aModifiedCard.fn, aConnection.connUrl, status]);
					}
					cardbookRepository.cardbookServerUpdatedResponse[aConnection.connPrefId]++;
				}
			};
			cardbookUtils.nullifyTagModification(aModifiedCard);

			var request = new cardbookWebDAV(aConnection, listener_update, aModifiedCard.etag);
			var cardContent = cardbookUtils.cardToVcardData(aModifiedCard, true);
			cardbookUtils.formatStringForOutput("serverCardSendingUpdate", [aConnection.connDescription, aModifiedCard.fn]);
			cardbookRepository.cardbookServerUpdatedRequest[aConnection.connPrefId]++;
			request.put(cardContent, "text/vcard; charset=utf-8");
		},

		serverCreate: function(aConnection, aMode, aCard, aPrefIdType) {
			var listener_create = {
				onDAVQueryComplete: function(status, response, etag) {
					if (status > 199 && status < 400) {
						if (cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+aCard.uid]) {
							// if aCard and aCard have the same cached medias
							cardbookUtils.changeMediaFromFileToContent(aCard);
							var myOldCard = cardbookRepository.cardbookCards[aCard.dirPrefId+"::"+aCard.uid];
							cardbookSynchronization.removeCardFromRepoOrWindow(myOldCard, aMode, true);
						}
						if (etag != null && etag !== undefined && etag != "") {
							cardbookUtils.formatStringForOutput("serverCardCreatedOnServerWithEtag", [aConnection.connDescription, aCard.fn, etag]);
							cardbookUtils.addEtag(aCard, etag);
							// cardbookRepository.addCardToCache(aCard, aMode, cardbookUtils.getFileNameFromUrl(aConnection.connUrl));
						} else {
							cardbookRepository.cardbookServerSyncAgain[aConnection.connPrefId] = true;
							cardbookUtils.formatStringForOutput("serverCardCreatedOnServerWithoutEtag", [aConnection.connDescription, aCard.fn]);
						}
						cardbookSynchronization.addCardToRepoOrWindow(aCard, aMode, cardbookUtils.getFileNameFromUrl(aConnection.connUrl));
					} else {
						cardbookUtils.addTagCreated(aCard);
						// cardbookRepository.addCardToCache(aCard, aMode, cardbookUtils.getFileNameFromUrl(aConnection.connUrl));
						cardbookRepository.cardbookServerCreatedError[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("serverCardCreateFailed", [aConnection.connDescription, aCard.fn, aConnection.connUrl, status]);
					}
					cardbookRepository.cardbookServerCreatedResponse[aConnection.connPrefId]++;
					cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
				}
			};
			cardbookUtils.prepareCardForCreation(aCard, aPrefIdType, aConnection.connUrl);
			aConnection.connUrl = aCard.cardurl;
			cardbookUtils.nullifyTagModification(aCard);
			cardbookUtils.addEtag(aCard, "0");

			var request = new cardbookWebDAV(aConnection, listener_create, aCard.etag);
			var cardContent = cardbookUtils.cardToVcardData(aCard, true);
			cardbookUtils.formatStringForOutput("serverCardSendingCreate", [aConnection.connDescription, aCard.fn]);
			cardbookRepository.cardbookServerCreatedRequest[aConnection.connPrefId]++;
			request.put(cardContent, "text/vcard; charset=utf-8");
		},

		serverGet: function(aConnection, etag, aMode) {
			var listener_get = {
				onDAVQueryComplete: function(status, response, etag) {
					if (status > 199 && status < 400) {
						var myCard = new cardbookCardParser(response, aConnection.connUrl, etag, aConnection.connPrefId);
						if (cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+myCard.uid]) {
							var myOldCard = cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+myCard.uid];
							cardbookSynchronization.removeCardFromRepoOrWindow(myOldCard, aMode, true);
						}
						cardbookSynchronization.addCardToRepoOrWindow(myCard, aMode, cardbookUtils.getFileNameFromUrl(aConnection.connUrl));
						cardbookUtils.formatStringForOutput("serverCardGetOK", [aConnection.connDescription, myCard.fn]);
					} else {
						cardbookRepository.cardbookServerGetError[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("serverCardGetFailed", [aConnection.connDescription, aConnection.connUrl, status]);
					}
					cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
					cardbookRepository.cardbookServerGetResponse[aConnection.connPrefId]++;
				}
			};
			let request = new cardbookWebDAV(aConnection, listener_get);
			cardbookRepository.cardbookServerGetRequest[aConnection.connPrefId]++;
			request.get("text/vcard");
		},

		getFilesFromCache: function (aPrefId) {
			var cacheDir = cardbookRepository.getLocalDirectory();
			cacheDir.append(aPrefId);
			return cardbookSynchronization.getFilesFromDir(cacheDir.path);
		},

		getFilesFromDir: function (aDirName) {
			var listOfFileName = [];
			try {
				var myDirectory = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				myDirectory.initWithPath(aDirName);
				var files = myDirectory.directoryEntries;
				while (files.hasMoreElements()) {
					var file = files.getNext().QueryInterface(Components.interfaces.nsILocalFile);
					if (file.isFile()) {
						listOfFileName.push(file.leafName);
					}
				}
			} catch(e) {}
			return listOfFileName;
		},

		loadCache: function (aPrefId, aPrefName, aMode) {
			var aListOfFileName = [];
			aListOfFileName = cardbookSynchronization.getFilesFromCache(aPrefId);
			for (var i = 0; i < aListOfFileName.length; i++) {
				myFileName = aListOfFileName[i];
				var cacheDir = cardbookRepository.getLocalDirectory();
				cacheDir.append(aPrefId);
				cacheDir.append(myFileName);
				if (cacheDir.exists() && cacheDir.isFile()) {
	
					var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
					var myFileURI = ioService.newURI("file:///" + cacheDir.path, null, null);
					var fileContent = cardbookSynchronization.getFileData(myFileURI, "UTF8");
						
					if (fileContent != null && fileContent !== undefined && fileContent != "") {
						var re = /[\n\u0085\u2028\u2029]|\r\n?/;
						var fileContentArray = fileContent.split(re);
						try {
							var myCard = new cardbookCardParser(fileContent, "", "", aPrefId);
							if (!(cardbookRepository.cardbookCards[aPrefId+"::"+myCard.uid])) {
								cardbookUtils.formatStringForOutput("cardLoadedFromCache", [aPrefName, myCard.fn]);
								cardbookSynchronization.addCardToRepoOrWindow(myCard, aMode, myFileName);
							}
						}
						catch (e) {
							cacheDir.remove(true);
						}
					} else {
						cacheDir.remove(true);
					}
				}
			}
		},

		loadDir: function (aDir, aTarget, aDirPrefId, aMode, aCallBack) {
			if (aTarget == "") {
				var myDirPrefId = aDirPrefId;
			} else {
				var myDirPrefId = cardbookUtils.getAccountId(aTarget);
			}
			var aListOfFileName = [];
			aListOfFileName = cardbookSynchronization.getFilesFromDir(aDir.path);
			for (var i = 0; i < aListOfFileName.length; i++) {
				var myFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				myFile.initWithPath(aDir.path);
				myFile.append(aListOfFileName[i]);
				if (myFile.exists() && myFile.isFile()) {
	
					var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
					var myFileURI = ioService.newURI("file:///" + myFile.path, null, null);
					var fileContent = cardbookSynchronization.getFileData(myFileURI, "UTF8");
						
					if (fileContent != null && fileContent !== undefined && fileContent != "") {
						var re = /[\n\u0085\u2028\u2029]|\r\n?/;
						var fileContentArray = fileContent.split(re);
						try {
							var myCard = new cardbookCardParser(fileContent, "", "", myDirPrefId);
							cardbookRepository.cardbookFileRequest[myDirPrefId]++;
							cardbookSynchronization.loadFileBackground(myFile, aTarget, aDirPrefId, aMode, aCallBack);
						}
						catch (e) {
							var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
							consoleService.logStringMessage("cardbook error with card : " + fileContent + "\n" + e);
						}
					}
				}
			}
			cardbookRepository.cardbookDirResponse[myDirPrefId]++;
		},

		compareWithCache: function (aPrefIdType, aConnection, aMode, aListOfFileName) {
			for (var i = 0; i < aListOfFileName.length; i++) {
				var cacheDir = cardbookRepository.getLocalDirectory();
				cacheDir.append(aConnection.connPrefId);
				myFileName = aListOfFileName[i];
				cacheDir.append(myFileName);
				if (cacheDir.exists() && cacheDir.isFile()) {
	
					var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
					var myFileURI = ioService.newURI("file:///" + cacheDir.path, null, null);
					var fileContent = cardbookSynchronization.getFileData(myFileURI, "UTF8");
						
					if (fileContent != null && fileContent !== undefined && fileContent != "") {
						var re = /[\n\u0085\u2028\u2029]|\r\n?/;
						var fileContentArray = fileContent.split(re);
						
						try {
							var myCard = new cardbookCardParser(fileContent, "", "", aConnection.connPrefId);
							if (myCard.created) {
								cardbookUtils.formatStringForOutput("cardNewOnDisk", [aConnection.connDescription, myCard.fn]);
								if (aPrefIdType === "GOOGLE") {
									cardbookRepository.cardbookServerSyncAgain[aConnection.connPrefId] = true;
								}
								cardbookRepository.cardbookServerSyncTotal[aConnection.connPrefId]++;
								cardbookRepository.cardbookServerSyncNewOnDisk[aConnection.connPrefId]++;
								var aCreateConnection = JSON.parse(JSON.stringify(aConnection));
								cardbookSynchronization.serverCreate(aCreateConnection, aMode, myCard, aPrefIdType);
							} else if (myCard.updated) {
								cardbookUtils.formatStringForOutput("cardUpdatedOnDiskDeletedOnServer", [aConnection.connDescription, myCard.fn]);
								cardbookRepository.cardbookServerSyncTotal[aConnection.connPrefId]++;
								cardbookRepository.cardbookServerSyncUpdatedOnDiskDeletedOnServer[aConnection.connPrefId]++;
								var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
								var preferDisk = prefs.getBoolPref("extensions.cardbook.preferDisk");
								if (preferDisk) {
									var aCreateConnection = JSON.parse(JSON.stringify(aConnection));
									cardbookSynchronization.serverCreate(aCreateConnection, aMode, myCard, aPrefIdType);
								} else {
									cardbookSynchronization.removeCardFromRepoOrWindow(myCard, aMode, true);
									cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
								}
							} else {
								cardbookRepository.cardbookServerSyncTotal[aConnection.connPrefId]++;
								cardbookUtils.formatStringForOutput("cardDeletedOnServer", [aConnection.connDescription, myCard.fn]);
								cardbookSynchronization.removeCardFromRepoOrWindow(myCard, aMode, true);
								cardbookRepository.cardbookServerSyncDone[aConnection.connPrefId]++;
								cardbookRepository.cardbookServerSyncDeletedOnServer[aConnection.connPrefId]++;
							}
						}
						catch (e) {
							cacheDir.remove(true);
						}
					} else {
						cacheDir.remove(true);
					}
				}
			}
		},

		dealWithCard: function (aCardConnection, aConnection, aMode, aPrefIdType, aUrl, aEtag, aFileName) {
			var searchCardIntoCache = {};
			searchCardIntoCache = cardbookSynchronization.cacheGetCard(aFileName, aEtag, aConnection.connPrefId, aConnection.connDescription, aMode);
			switch (searchCardIntoCache.type) {
				case "NOTUPDATED":
					var myCacheCard = searchCardIntoCache.cachecard;
					myCacheCard.cardurl = aUrl;
					break;
				case "NEWONSERVER":
				case "UPDATEDONSERVER":
					cardbookSynchronization.serverGet(aCardConnection, aEtag, aMode);
					break;
				case "DELETEDONDISK":
					var myCacheCard = searchCardIntoCache.cachecard;
					myCacheCard.cardurl = aUrl;
					cardbookSynchronization.serverDelete(aCardConnection, aMode, myCacheCard, aPrefIdType);
					break;
				case "UPDATEDONDISK":
					var myServerCard = searchCardIntoCache.servercard;
					myServerCard.cardurl = aUrl;
					var myCacheCard = searchCardIntoCache.cachecard;
					myCacheCard.cardurl = aUrl;
					cardbookSynchronization.serverUpdate(aCardConnection, aMode, myCacheCard, myServerCard, aPrefIdType);
					break;
				case "UPDATEDONBOTH":
					var myServerCard = searchCardIntoCache.servercard;
					myServerCard.cardurl = aUrl;
					var myCacheCard = searchCardIntoCache.cachecard;
					myCacheCard.cardurl = aUrl;
					var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
					var preferDisk = prefs.getBoolPref("extensions.cardbook.preferDisk");
					if (preferDisk) {
						cardbookSynchronization.serverUpdate(aCardConnection, aMode, myCacheCard, myServerCard, aPrefIdType);
					} else {
						cardbookSynchronization.serverGet(aCardConnection, aEtag, aMode);
					}
					break;
				case "DELETEDONDISKUPDATEDONSERVER":
					var myServerCard = searchCardIntoCache.servercard;
					myServerCard.cardurl = aUrl;
					var myCacheCard = searchCardIntoCache.cachecard;
					myCacheCard.cardurl = aUrl;
					var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
					var preferDisk = prefs.getBoolPref("extensions.cardbook.preferDisk");
					if (preferDisk) {
						cardbookSynchronization.serverDelete(aCardConnection, aMode, myCacheCard, aPrefIdType);
					} else {
						cardbookSynchronization.removeCardFromRepoOrWindow(myCacheCard, aMode, true);
						cardbookSynchronization.serverGet(aCardConnection, aEtag, aMode);
					}
					break;
				default:
					break;
			}
		},

		googleSyncCards: function(aConnection, aMode, aPrefIdType) {
			var listener_propfind = {
				onDAVQueryComplete: function(status, response) {
					if (status > 199 && status < 400) {
						try {
							var filesFromCache = [];
							var filesFromCache = cardbookSynchronization.getFilesFromCache(aConnection.connPrefId);
							let jsonResponses = response["multistatus"][0]["response"];
							for each (let jsonResponse in jsonResponses) {
								let href = decodeURIComponent(jsonResponse["href"][0]);
								let propstats = jsonResponse["propstat"];
								// 2015.04.27 13:53:48 : href : /carddav/v1/principals/foo.bar@gmail.com/lists/default/
								// 2015.04.27 13:53:48 : propstats : [{status:["HTTP/1.1 200 OK"]}, {status:["HTTP/1.1 404 Not Found"], prop:[{getetag:[null]}]}]
								// 2015.04.27 14:03:54 : href : /carddav/v1/principals/foo.bar@gmail.com/lists/default/69ada43d89c0d90b
								// 2015.04.27 14:03:54 : propstats : [{status:["HTTP/1.1 200 OK"], prop:[{getetag:["\"2014-07-15T13:43:23.997-07:00\""]}]}]
								for each (let propstat in propstats) {
									if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
										if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
											cardbookRepository.cardbookServerSyncTotal[aConnection.connPrefId]++;
											var prop = propstat["prop"][0];
											var etag = prop["getetag"][0];
											var keyArray = href.split("/");
											var key = decodeURIComponent(keyArray[keyArray.length - 1]);
											var myUrl = baseUrl + key;
											var myFileName = cardbookUtils.getFileNameFromUrl(myUrl);
											var aCardConnection = {accessToken: aConnection.accessToken, connPrefId: aConnection.connPrefId, connUrl: myUrl, connDescription: aConnection.connDescription};
											cardbookSynchronization.dealWithCard(aCardConnection, aConnection, aMode, aPrefIdType, myUrl, etag, myFileName);
											function filterFileName(element) {
												return (element != myFileName);
											}
											filesFromCache = filesFromCache.filter(filterFileName);
										}
									}
								}
							}
						cardbookSynchronization.compareWithCache(aPrefIdType, aConnection, aMode, filesFromCache);
						}
						catch(e) {
							cardbookRepository.cardbookServerSyncError[aConnection.connPrefId]++;
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.googleSyncCards error : " + e);
						}
					} else {
						cardbookRepository.cardbookServerSyncError[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "googleSyncCards", aConnection.connUrl, status]);
					}
					cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
				}
			};
			var baseUrl = aConnection.connUrl;
			if (baseUrl.indexOf("/", baseUrl.length -1) === -1) {
				baseUrl = baseUrl + "/";
			}
			cardbookUtils.formatStringForOutput("synchronizationSearchingCards", [aConnection.connDescription]);
            let request = new cardbookWebDAV(aConnection, listener_propfind, "", true);
            request.propfind(["DAV: getetag"]);
		},

		serverSyncCards: function(aConnection, aMode, aPrefIdType) {
			var listener_propfind = {
				onDAVQueryComplete: function(status, response) {
					if (status > 199 && status < 400) {
						try {
							var filesFromCache = [];
							var filesFromCache = cardbookSynchronization.getFilesFromCache(aConnection.connPrefId);
							let jsonResponses = response["multistatus"][0]["response"];
							for each (let jsonResponse in jsonResponses) {
								let href = decodeURIComponent(jsonResponse["href"][0]);
								let propstats = jsonResponse["propstat"];
								// 2015.04.27 14:03:55 : href : /remote.php/carddav/addressbooks/11111/contacts/
								// 2015.04.27 14:03:55 : propstats : [{prop:[{getcontenttype:[null], getetag:[null]}], status:["HTTP/1.1 404 Not Found"]}]
								// 2015.04.27 14:03:55 : href : /remote.php/carddav/addressbooks/11111/contacts/C68894CF-D340-0001-78C3-1E301B4011F5.vcf
								// 2015.04.27 14:03:55 : propstats : [{prop:[{getcontenttype:["text/x-vcard"], getetag:["\"6163e30117192647e1967de751fb5467\""]}], status:["HTTP/1.1 200 OK"]}]
								for each (let propstat in propstats) {
									if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
										if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
											let prop = propstat["prop"][0];
											if (href != aConnection.connUrl) {
												if (typeof(prop["getcontenttype"]) == "undefined") {
													continue;
												}
												if (href.indexOf("/", href.length -1) !== -1) {
													continue;
												}
												let contType = prop["getcontenttype"][0];
												if (cardbookSynchronization.isSupportedContentType(contType)) {
													cardbookRepository.cardbookServerSyncTotal[aConnection.connPrefId]++;
													var etag = prop["getetag"][0];
													var keyArray = href.split("/");
													var key = decodeURIComponent(keyArray[keyArray.length - 1]);
													var myUrl = baseUrl + key;
													var myFileName = cardbookUtils.getFileNameFromUrl(myUrl);
													var aCardConnection = {connPrefId: aConnection.connPrefId, connUrl: myUrl, connDescription: aConnection.connDescription};
													cardbookSynchronization.dealWithCard(aCardConnection, aConnection, aMode, aPrefIdType, myUrl, etag, myFileName); 
													function filterFileName(element) {
														return (element != myFileName);
													}
													filesFromCache = filesFromCache.filter(filterFileName);
												}
											}
										}
									}
								}
							}
						cardbookSynchronization.compareWithCache(aPrefIdType, aConnection, aMode, filesFromCache);
						}
						catch(e) {
							cardbookRepository.cardbookServerSyncError[aConnection.connPrefId]++;
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.serverSyncCards error : " + e);
						}
					} else {
						cardbookRepository.cardbookServerSyncError[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "serverSyncCards", aConnection.connUrl, status]);
					}
					cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
				}
			};
			var baseUrl = aConnection.connUrl;
			if (baseUrl.indexOf("/", baseUrl.length -1) === -1) {
				baseUrl = baseUrl + "/";
			}
			cardbookUtils.formatStringForOutput("synchronizationSearchingCards", [aConnection.connDescription]);
            let request = new cardbookWebDAV(aConnection, listener_propfind, "", true);
            request.propfind(["DAV: getcontenttype", "DAV: getetag"]);
		},

		validateWithoutDiscovery: function(aConnection, aRootUrl) {
			var listener_checkpropfind = {
				onDAVQueryComplete: function(status, response) {
					if (status > 199 && status < 400) {
						try {
							let jsonResponses = response["multistatus"][0]["response"];
							for each (let jsonResponse in jsonResponses) {
								let href = decodeURIComponent(jsonResponse["href"][0]);
								if (href[href.length - 1] != '/') {
									href += '/';
								}
								let propstats = jsonResponse["propstat"];
								for each (let propstat in propstats) {
									if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
										if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
											let prop = propstat["prop"][0];
											if (prop["resourcetype"] != null && prop["resourcetype"] !== undefined && prop["resourcetype"] != "") {
												let rsrcType = prop["resourcetype"][0];
												wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : rsrcType found : " + rsrcType.toSource());
												if (rsrcType["vcard-collection"] || rsrcType["addressbook"]) {
													var displayname = "";
													if (prop["displayname"] != null && prop["displayname"] !== undefined && prop["displayname"] != "") {
														displayname = prop["displayname"][0];
													}
													wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : href found : " + href);
													wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : displayname found : " + displayname);
													if (href.indexOf(aRootUrl) >= 0 ) {
														aConnection.connUrl = href;
													} else {
														aConnection.connUrl = aRootUrl + href;
													}
													cardbookRepository.cardbookServerValidation[aRootUrl].push([displayname, aConnection.connUrl]);
												}
											}
										}
									}
								}
							}
						}
						catch(e) {
							cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.validateWithoutDiscovery error : " + e);
						}
					} else {
						cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "validateWithoutDiscovery", aConnection.connUrl, status]);
					}
					cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
				}
			};
			if (aConnection.connUrl[aConnection.connUrl.length - 1] != '/') {
				aConnection.connUrl += '/';
			}
			cardbookRepository.cardbookServerDiscoveryRequest[aConnection.connPrefId]++;
			cardbookRepository.cardbookServerValidation[aRootUrl] = [];
			cardbookUtils.formatStringForOutput("synchronizationRequestDiscovery", [aConnection.connDescription, aConnection.connUrl]);
			var request = new cardbookWebDAV(aConnection, listener_checkpropfind, "", true);
			request.propfind(["DAV: resourcetype", "DAV: displayname"], true);
		},

		discoverPhase3: function(aConnection, aRootUrl, aOperationType, aParams) {
			var listener_checkpropfind = {
				onDAVQueryComplete: function(status, response) {
					if (status > 199 && status < 400) {
						try {
							let jsonResponses = response["multistatus"][0]["response"];
							// first : try to determine if there are multiples addressbooks
							var allAddressbooks = [];
							for each (let jsonResponse in jsonResponses) {
								let href = decodeURIComponent(jsonResponse["href"][0]);
								if (href[href.length - 1] != '/') {
									href += '/';
								}
								let propstats = jsonResponse["propstat"];
								for each (let propstat in propstats) {
									if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
										if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
											let prop = propstat["prop"][0];
											if (prop["resourcetype"] != null && prop["resourcetype"] !== undefined && prop["resourcetype"] != "") {
												let rsrcType = prop["resourcetype"][0];
												if (rsrcType["vcard-collection"] || rsrcType["addressbook"]) {
													if (href.indexOf(aRootUrl) >= 0 ) {
														aConnection.connUrl = href;
													} else {
														aConnection.connUrl = aRootUrl + href;
													}
													allAddressbooks.push(aConnection.connUrl);
												}
											}
										}
									}
								}
							}
							if (allAddressbooks.length > 1 && aOperationType !== "GETDISPLAYNAME") {
								var strBundle = document.getElementById("cardbook-strings");
								var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
								var multipleAddressBooksTitle = strBundle.getString("multipleAddressBooksTitle");
								var multipleAddressBooksMsg = strBundle.getFormattedString("multipleAddressBooksMsg", [aRootUrl]) + "\r\n\r\n" + allAddressbooks.join("\r\n");
								prompts.alert(null, multipleAddressBooksTitle, multipleAddressBooksMsg);
								cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
								cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
							} else {
								for each (let jsonResponse in jsonResponses) {
									let href = decodeURIComponent(jsonResponse["href"][0]);
									if (href[href.length - 1] != '/') {
										href += '/';
									}
									let propstats = jsonResponse["propstat"];
									for each (let propstat in propstats) {
										if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
											if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
												let prop = propstat["prop"][0];
												if (prop["resourcetype"] != null && prop["resourcetype"] !== undefined && prop["resourcetype"] != "") {
													let rsrcType = prop["resourcetype"][0];
													wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : rsrcType found : " + rsrcType.toSource());
													if (rsrcType["vcard-collection"] || rsrcType["addressbook"]) {
														var displayname = "";
														if (prop["displayname"] != null && prop["displayname"] !== undefined && prop["displayname"] != "") {
															displayname = prop["displayname"][0];
														}
														wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : href found : " + href);
														wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : displayname found : " + displayname);
														if (href.indexOf("http") == 0 ) {
															aConnection.connUrl = href;
														} else {
															aConnection.connUrl = aRootUrl + href;
														}
														if (aOperationType == "GETDISPLAYNAME") {
															cardbookRepository.cardbookServerValidation[aRootUrl].push([displayname, aConnection.connUrl]);
														} else if (aOperationType == "SYNCGOOGLE") {
															cardbookSynchronization.googleSyncCards(aConnection, aParams.aMode, aParams.aPrefIdType);
														} else if (aOperationType == "SYNCSERVER") {
															cardbookSynchronization.serverSyncCards(aConnection, aParams.aMode, aParams.aPrefIdType);
														}
													}
												}
											}
										}
									}
								}
							}
						}
						catch(e) {
							cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.discoverPhase3 error : " + e);
						}
					} else {
						cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "discoverPhase3", aConnection.connUrl, status]);
					}
					cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
				}
			};
			if (aConnection.connUrl[aConnection.connUrl.length - 1] != '/') {
				aConnection.connUrl += '/';
			}
			cardbookRepository.cardbookServerDiscoveryRequest[aConnection.connPrefId]++;
			cardbookRepository.cardbookServerValidation[aRootUrl] = [];
			cardbookUtils.formatStringForOutput("synchronizationRequestDiscovery3", [aConnection.connDescription, aConnection.connUrl]);
			var request = new cardbookWebDAV(aConnection, listener_checkpropfind, "", true);
			request.propfind(["DAV: resourcetype", "DAV: displayname"], true);
		},

		discoverPhase2: function(aConnection, aRootUrl, aOperationType, aParams) {
			var listener_checkpropfind = {
				onDAVQueryComplete: function(status, response) {
					if (status > 199 && status < 400) {
						try {
							let jsonResponses = response["multistatus"][0]["response"];
							for each (let jsonResponse in jsonResponses) {
								let propstats = jsonResponse["propstat"];
								for each (let propstat in propstats) {
									if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
										if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
											let prop = propstat["prop"][0];
											let rsrcType = prop["addressbook-home-set"][0];
											let href = decodeURIComponent(rsrcType["href"][0]);
											if (href[href.length - 1] != '/') {
												href += '/';
											}
											wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : addressbook-home-set found : " + href);
											if (href.indexOf("http") == 0 ) {
												aConnection.connUrl = href;
											} else {
												aConnection.connUrl = aRootUrl + href;
											}
											cardbookSynchronization.discoverPhase3(aConnection, aRootUrl, aOperationType, aParams);
										}
									}
								}
							}
						}
						catch(e) {
							cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.discoverPhase2 error : " + e);
						}
					} else {
						cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "discoverPhase2", aConnection.connUrl, status]);
					}
					cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
				}
			};
			if (aConnection.connUrl[aConnection.connUrl.length - 1] != '/') {
				aConnection.connUrl += '/';
			}
			cardbookRepository.cardbookServerDiscoveryRequest[aConnection.connPrefId]++;
			cardbookUtils.formatStringForOutput("synchronizationRequestDiscovery2", [aConnection.connDescription, aConnection.connUrl]);
			var request = new cardbookWebDAV(aConnection, listener_checkpropfind, "", true);
			request.propfind(["urn:ietf:params:xml:ns:carddav addressbook-home-set"], false);
		},

		discoverPhase1: function(aConnection, aOperationType, aParams) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookWebDAV.js"]);
			var listener_checkpropfind = {
				onDAVQueryComplete: function(status, response) {
					if (status > 199 && status < 400) {
						try {
							let jsonResponses = response["multistatus"][0]["response"];
							for each (let jsonResponse in jsonResponses) {
								let propstats = jsonResponse["propstat"];
								for each (let propstat in propstats) {
									if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
										if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
											let prop = propstat["prop"][0];
											let rsrcType = prop["current-user-principal"][0];
											let href = decodeURIComponent(rsrcType["href"][0]);
											if (href[href.length - 1] != '/') {
												href += '/';
											}
											wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : current-user-principal found : " + href);
											aConnection.connUrl = aRootUrl + href;
											cardbookSynchronization.discoverPhase2(aConnection, aRootUrl, aOperationType, aParams);
										}
									}
								}
							}
						}
						catch(e) {
							cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.discoverPhase1 error : " + e);
						}
					} else {
						cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "discoverPhase1", aConnection.connUrl, status]);
					}
					cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
				}
			};
			if (aConnection.connUrl[aConnection.connUrl.length - 1] != '/') {
				aConnection.connUrl += '/';
			}
			var aRootUrl = cardbookSynchronization.getRootUrl(aConnection.connUrl);
			if (aRootUrl + '/' === aConnection.connUrl) {
				cardbookRepository.cardbookServerDiscoveryRequest[aConnection.connPrefId]++;
				if (aConnection.connPrefIdType !== "APPLE") {
					aConnection.connUrl = aConnection.connUrl + '.well-known/carddav';
				}
				cardbookUtils.formatStringForOutput("synchronizationRequestDiscovery1", [aConnection.connDescription, aConnection.connUrl]);
				var request = new cardbookWebDAV(aConnection, listener_checkpropfind, "", true);
				request.propfind(["DAV: current-user-principal"], false);
			} else {
				if (aOperationType == "GETDISPLAYNAME") {
					cardbookSynchronization.validateWithoutDiscovery(aConnection, aRootUrl);
				} else if (aOperationType == "SYNCGOOGLE") {
					cardbookSynchronization.googleSyncCards(aConnection, aParams.aMode, aParams.aPrefIdType);
				} else if (aOperationType == "SYNCSERVER") {
					cardbookSynchronization.serverSyncCards(aConnection, aParams.aMode, aParams.aPrefIdType);
				}
			}
		},

		discoverApple: function(aConnection, aOperationType, aParams) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookWebDAV.js"]);
			var listener_checkpropfind = {
				onDAVQueryComplete: function(status, response) {
					if (status > 199 && status < 400) {
						try {
							let jsonResponses = response["multistatus"][0]["response"];
							for each (let jsonResponse in jsonResponses) {
								let propstats = jsonResponse["propstat"];
								for each (let propstat in propstats) {
									if (propstat["status"][0].indexOf("HTTP/1.1 200") == 0) {
										if (propstat["prop"] != null && propstat["prop"] !== undefined && propstat["prop"] != "") {
											let prop = propstat["prop"][0];
											let rsrcType = prop["current-user-principal"][0];
											let href = decodeURIComponent(rsrcType["href"][0]);
											if (href[href.length - 1] != '/') {
												href += '/';
											}
											wdw_cardbooklog.updateStatusProgressInformationWithDebug2(aConnection.connDescription + " : current-user-principal found : " + href);
											aConnection.connUrl = aRootUrl + href;
											if (aOperationType == "GETDISPLAYNAME") {
												cardbookRepository.cardbookServerValidation[aRootUrl].push(['', aConnection.connUrl]);
											} else if (aOperationType == "SYNCSERVER") {
												cardbookSynchronization.serverSyncCards(aConnection, aParams.aMode, aParams.aPrefIdType);
											}
										}
									}
								}
							}
						}
						catch(e) {
							cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.discoverPhase1 error : " + e);
						}
					} else {
						cardbookRepository.cardbookServerDiscoveryError[aConnection.connPrefId]++;
						cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "discoverPhase1", aConnection.connUrl, status]);
					}
					cardbookRepository.cardbookServerDiscoveryResponse[aConnection.connPrefId]++;
				}
			};
			if (aConnection.connUrl[aConnection.connUrl.length - 1] != '/') {
				aConnection.connUrl += '/';
			}
			var aRootUrl = cardbookSynchronization.getRootUrl(aConnection.connUrl);
			if (aRootUrl + '/' === aConnection.connUrl) {
				cardbookRepository.cardbookServerDiscoveryRequest[aConnection.connPrefId]++;
				cardbookUtils.formatStringForOutput("synchronizationRequestDiscovery1", [aConnection.connDescription, aConnection.connUrl]);
				var request = new cardbookWebDAV(aConnection, listener_checkpropfind, "", true);
				request.propfind(["DAV: current-user-principal"], false);
			} else {
				if (aOperationType == "GETDISPLAYNAME") {
					cardbookSynchronization.validateWithoutDiscovery(aConnection, aRootUrl);
				} else if (aOperationType == "SYNCSERVER") {
					cardbookSynchronization.serverSyncCards(aConnection, aParams.aMode, aParams.aPrefIdType);
				}
			}
		},

		googleGetAccessToken: function(aConnection, aCode, aOperationType, aParams) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookWebDAV.js"]);
			var listener_getAccessToken = {
				onDAVQueryComplete: function(status, response) {
					if (status > 199 && status < 400) {
						try {
							cardbookUtils.formatStringForOutput("googleAccessTokenOK", [aConnection.connDescription, response]);
							var responseText = JSON.parse(response);
							aConnection.accessToken = responseText.token_type + " " + responseText.access_token;
							aConnection.connUrl = cardbookRepository.cardbookgdata.GOOGLE_API;
							cardbookSynchronization.discoverPhase1(aConnection, aOperationType, aParams);
						}
						catch(e) {
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
							cardbookRepository.cardbookGoogleAccessTokenError[aConnection.connPrefId]++;
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.googleGetAccessToken error : " + e);
						}
					} else {
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "googleGetAccessToken", aConnection.connUrl, status]);
						if (status == 400 || status == 401) {
							cardbookUtils.formatStringForOutput("googleGetNewRefreshToken", [aConnection.connDescription, aConnection.connUrl]);
							cardbookSynchronization.requestNewRefreshToken(aConnection, cardbookSynchronization.googleGetAccessToken, aOperationType, aParams);
						} else {
							cardbookRepository.cardbookServerSyncResponse[aConnection.connPrefId]++;
							cardbookRepository.cardbookGoogleAccessTokenError[aConnection.connPrefId]++;
						}
					}
					cardbookRepository.cardbookGoogleAccessTokenResponse[aConnection.connPrefId]++;
				}
			};
			cardbookUtils.formatStringForOutput("googleRequestAccessToken", [aConnection.connDescription, aConnection.connUrl]);
			cardbookRepository.cardbookGoogleAccessTokenRequest[aConnection.connPrefId]++;
			aConnection.accessToken = "NOACCESSTOKEN";
			let params = {"refresh_token": aCode, "client_id": cardbookRepository.cardbookgdata.CLIENT_ID, "client_secret": cardbookRepository.cardbookgdata.CLIENT_SECRET, "grant_type": cardbookRepository.cardbookgdata.REFRESH_REQUEST_GRANT_TYPE};
			let headers = { "content-type": "application/x-www-form-urlencoded", "GData-Version": "3" };
			let request = new cardbookWebDAV(aConnection, listener_getAccessToken);
			request.googleToken(cardbookRepository.cardbookgdata.REFRESH_REQUEST_TYPE, params, headers);
		},

		googleGetRefreshToken: function(aConnection, aCode, aCallback) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookWebDAV.js"]);
			var listener_getRefreshToken = {
				onDAVQueryComplete: function(status, response) {
					if (status > 199 && status < 400) {
						try {
							cardbookUtils.formatStringForOutput("googleRefreshTokenOK", [aConnection.connDescription, response]);
							if (aCallback) {
								aCallback(JSON.parse(response));
							}
						}
						catch(e) {
							cardbookRepository.cardbookGoogleRefreshTokenError[aConnection.connPrefId]++;
							wdw_cardbooklog.updateStatusProgressInformation(aConnection.connDescription + " : cardbookSynchronization.googleGetRefreshToken error : " + e);
						}
					} else {
						cardbookRepository.cardbookGoogleRefreshTokenError[aConnection.connPrefId]++;
						cardbookUtils.formatStringForOutput("synchronizationFailed", [aConnection.connDescription, "googleGetRefreshToken", aConnection.connUrl, status]);
					}
					cardbookRepository.cardbookGoogleRefreshTokenResponse[aConnection.connPrefId]++;
				}
			};
			cardbookUtils.formatStringForOutput("googleRequestRefreshToken", [aConnection.connDescription, aConnection.connUrl]);
			let params = {"code": aCode, "client_id": cardbookRepository.cardbookgdata.CLIENT_ID, "client_secret": cardbookRepository.cardbookgdata.CLIENT_SECRET, "redirect_uri": cardbookRepository.cardbookgdata.REDIRECT_URI, "grant_type": cardbookRepository.cardbookgdata.TOKEN_REQUEST_GRANT_TYPE};
			let headers = { "content-type": "application/x-www-form-urlencoded", "GData-Version": "3" };
			let request = new cardbookWebDAV(aConnection, listener_getRefreshToken);
			request.googleToken(cardbookRepository.cardbookgdata.REFRESH_REQUEST_TYPE, params, headers);
		},

		requestNewRefreshToken: function (aConnection, aCallback, aOperationType, aParams) {
			cardbookRepository.cardbookGoogleRefreshTokenRequest[aConnection.connPrefId]++;
			cardbookUtils.jsInclude(["chrome://cardbook/content/addressbooksconfiguration/wdw_newGoogleToken.js"]);
			var myArgs = {dirPrefId: aConnection.connPrefId};
			var wizard = window.openDialog("chrome://cardbook/content/addressbooksconfiguration/wdw_newGoogleToken.xul", "", "chrome,resizable,scrollbars=no,status=no", myArgs);
			wizard.addEventListener("load", function onloadListener() {
				// var strBundle = document.getElementById("cardbook-strings");
				// var myWindowTitle = strBundle.getString("NewGoogleTokenTitle");
				wizard.title = wizard.title + " totot";
				var browser = wizard.document.getElementById("browser");
				var url = cardbookSynchronization.getOAuthURL(aConnection.connUser);
				browser.loadURI(url);
				lTimerCheckTitle = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
				lTimerCheckTitle.initWithCallback({ notify: function(lTimerCheckTitle) {
							var title = browser.contentTitle;
							if (title && title.indexOf(cardbookRepository.cardbookgdata.REDIRECT_TITLE) === 0) {
								var myCode = title.substring(cardbookRepository.cardbookgdata.REDIRECT_TITLE.length);
								cardbookUtils.formatStringForOutput("googleNewRefreshTokenOK", [aConnection.connDescription, myCode]);
								browser.loadURI("");
								var connection = {connUser: "", connUrl: cardbookRepository.cardbookgdata.TOKEN_REQUEST_URL, connPrefId: aConnection.connPrefId, connDescription: aConnection.connDescription};
								cardbookSynchronization.googleGetRefreshToken(connection, myCode, function callback(aResponse) {
																										wizard.close();
																										cardbookPasswordManager.removeAccount(aConnection.connUser);
																										cardbookPasswordManager.addAccount(aConnection.connUser, "", aResponse.refresh_token);
																										if (aCallback != null && aCallback !== undefined && aCallback != "") {
																											aCallback(aConnection, aResponse.refresh_token, aOperationType, aParams);
																										}
																										});
							}
						}
						}, 1000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
			});
		},

		getOAuthURL: function (aEmail) {
			return cardbookRepository.cardbookgdata.OAUTH_URL +
			"?response_type=" + cardbookRepository.cardbookgdata.RESPONSE_TYPE +
			"&client_id=" + cardbookRepository.cardbookgdata.CLIENT_ID +
			"&redirect_uri=" + cardbookRepository.cardbookgdata.REDIRECT_URI +
			"&scope=" + cardbookRepository.cardbookgdata.SCOPE +
			"&login_hint=" + cardbookRepository.aEmail;
		},

		setPeriodicSyncControl: function () {
			var nIntervId = setInterval(cardbookSynchronization.setPeriodicSync, 1000);
		},

		setPeriodicSync: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookSynchronization.js", "chrome://cardbook/content/wdw_log.js"]);
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);

			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var autoSync = prefs.getBoolPref("extensions.cardbook.autoSync");
			var autoSyncInterval = prefs.getComplexValue("extensions.cardbook.autoSyncInterval", Components.interfaces.nsISupportsString).data;
			if ((cardbookSynchronization.autoSync == "") ||
				(cardbookSynchronization.autoSync != autoSync || cardbookSynchronization.autoSyncInterval != autoSyncInterval)) {
				var autoSyncIntervalMs = autoSyncInterval * 60 * 1000;
				if (cardbookSynchronization.autoSyncId != null && cardbookSynchronization.autoSyncId !== undefined && cardbookSynchronization.autoSyncId != "") {
					cardbookUtils.formatStringForOutput("periodicSyncDeleting", [cardbookSynchronization.autoSyncId]);
					clearInterval(cardbookSynchronization.autoSyncId);
					cardbookSynchronization.autoSyncId = "";
				}
				
				if (autoSync) {
					cardbookSynchronization.autoSyncId = setInterval(cardbookSynchronization.syncAccounts, autoSyncIntervalMs);
					cardbookUtils.formatStringForOutput("periodicSyncSetting", [autoSyncIntervalMs, cardbookSynchronization.autoSyncId]);
				}
				cardbookSynchronization.autoSync = autoSync;
				cardbookSynchronization.autoSyncInterval = autoSyncInterval;
			}
		},

		syncAccounts: function () {
			cardbookUtils.formatStringForOutput("periodicSyncSyncing");
			if (cardbookRepository.cardbookSyncMode === "NOSYNC") {
				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				cardbookUtils.jsInclude(["chrome://cardbook/content/wdw_cardbook.js"]);
				var cardbookPrefService = new cardbookPreferenceService();
				var result = [];
				result = cardbookPrefService.getAllPrefIds();
				for (let i = 0; i < result.length; i++) {
					var myPrefId = result[i];
					var cardbookPrefService1 = new cardbookPreferenceService(myPrefId);
					if (cardbookPrefService1.getType() !== "FILE" &&cardbookPrefService1.getType() !== "CACHE" && cardbookPrefService1.getEnabled()) {
						cardbookSynchronization.initSync(myPrefId);
						cardbookSynchronization.syncAccount(myPrefId);
					}
				}
			}
		},

		syncAccount: function (aPrefId) {
			try {
				cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookWebDAV.js"]);
				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookPasswordManager.js"]);
				var cardbookPrefService = new cardbookPreferenceService(aPrefId);
				var myPrefIdType = cardbookPrefService.getType();
				var myPrefIdUrl = cardbookPrefService.getUrl();
				var myPrefIdName = cardbookPrefService.getName();
				var myPrefIdUser = cardbookPrefService.getUser();
				var myPrefEnabled = cardbookPrefService.getEnabled();
				if (myPrefEnabled) {
					if (myPrefIdType === "GOOGLE" || myPrefIdType === "CARDDAV" || myPrefIdType === "APPLE") {
						cardbookRepository.cardbookServerSyncRequest[aPrefId]++;
						var params = {aMode: "WINDOW", aPrefIdType: myPrefIdType};
						if (myPrefIdType === "GOOGLE" ) {
							var connection = {connUser: myPrefIdUser, connPrefId: aPrefId, connPrefIdType: myPrefIdType, connUrl: cardbookRepository.cardbookgdata.REFRESH_REQUEST_URL, connDescription: myPrefIdName};
							var myCode = cardbookPasswordManager.getPassword(myPrefIdUser, myPrefIdUrl);
							cardbookSynchronization.googleGetAccessToken(connection, myCode, "SYNCGOOGLE", params);
						} else {
							var connection = {connPrefId: aPrefId, connPrefIdType: myPrefIdType, connUrl: myPrefIdUrl, connDescription: myPrefIdName};
							cardbookSynchronization.discoverPhase1(connection, "SYNCSERVER", params);
						}
						cardbookSynchronization.waitForSyncFinished(aPrefId, myPrefIdName);
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.syncAccount error : " + e);
			}
		},

		waitForSyncFinished: function (aPrefId, aPrefName) {
			cardbookRepository.lTimerSyncAll[aPrefId] = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			var lTimerSync = cardbookRepository.lTimerSyncAll[aPrefId];
			lTimerSync.initWithCallback({ notify: function(lTimerSync) {
						var request = cardbookSynchronization.getRequest(aPrefId, aPrefName) + cardbookSynchronization.getTotal(aPrefId, aPrefName);
						var response = cardbookSynchronization.getResponse(aPrefId, aPrefName) + cardbookSynchronization.getDone(aPrefId, aPrefName);
						if (request == response) {
							cardbookSynchronization.finishSync(aPrefId, aPrefName);
							if (cardbookRepository.cardbookServerSyncAgain[aPrefId]) {
								cardbookSynchronization.finishMultipleOperations(aPrefId);
								cardbookUtils.formatStringForOutput("synchroForcedToResync", [aPrefName]);
								cardbookSynchronization.syncAccount(aPrefId);
							} else {
								cardbookSynchronization.finishMultipleOperations(aPrefId);
								var total = cardbookSynchronization.getRequest() + cardbookSynchronization.getTotal() + cardbookSynchronization.getResponse() + cardbookSynchronization.getDone();
								if (total === 0) {
									cardbookRepository.cardbookSyncMode = "NOSYNC";
									cardbookUtils.formatStringForOutput("synchroAllFinished");
								}
							}
							lTimerSync.cancel();
						}
					}
					}, 1000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
		},

		waitForImportFinished: function (aPrefId, aPrefName) {
			cardbookRepository.lTimerImportAll[aPrefId] = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			var lTimerImport = cardbookRepository.lTimerImportAll[aPrefId];
			lTimerImport.initWithCallback({ notify: function(lTimerImport) {
						var request = cardbookSynchronization.getRequest(aPrefId, aPrefName) + cardbookSynchronization.getTotal(aPrefId, aPrefName);
						var response = cardbookSynchronization.getResponse(aPrefId, aPrefName) + cardbookSynchronization.getDone(aPrefId, aPrefName);
						if (request == response) {
							cardbookSynchronization.finishImport(aPrefId, aPrefName);
							cardbookSynchronization.finishMultipleOperations(aPrefId);
							var total = cardbookSynchronization.getRequest() + cardbookSynchronization.getTotal() + cardbookSynchronization.getResponse() + cardbookSynchronization.getDone();
							if (total === 0) {
								cardbookRepository.cardbookSyncMode = "NOSYNC";
								cardbookUtils.formatStringForOutput("importAllFinished");
							}
							lTimerImport.cancel();
						}
					}
					}, 1000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
		},

		loadAccounts: function () {
			cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookWebDAV.js", "chrome://cardbook/content/cardbookCardParser.js"]);
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js", "chrome://cardbook/content/cardbookPasswordManager.js"]);
			cardbookRepository.cardbookSearchMode = "NOSEARCH";
			if (cardbookRepository.cardbookSyncMode == "NOSYNC") {
				cardbookRepository.cardbookAccounts = [];
				cardbookRepository.cardbookAccountsCategories = {};
				cardbookRepository.cardbookDisplayCards = {};
				cardbookRepository.cardbookFileCacheCards = {};
				cardbookRepository.cardbookCards = {};
				cardbookRepository.cardbookCardSearch = [];
	
				var cardbookPrefService = new cardbookPreferenceService();
				var result = [];
				result = cardbookPrefService.getAllPrefIds();
				for (let i = 0; i < result.length; i++) {
					var myPrefId = result[i];
					var cardbookPrefService1 = new cardbookPreferenceService(myPrefId);
					var myPrefType = cardbookPrefService1.getType();
					var myPrefName = cardbookPrefService1.getName();
					var myPrefUrl = cardbookPrefService1.getUrl();
					var myPrefUser = cardbookPrefService1.getUser();
					var myPrefEnabled = cardbookPrefService1.getEnabled();
					var myPrefExpanded = cardbookPrefService1.getExpanded();
					if (myPrefName == "") {
						cardbookPrefService1.delBranch();
					} else {
						cardbookRepository.addAccountToRepository(myPrefId, myPrefName, myPrefType, myPrefEnabled, myPrefExpanded);
					}
				}
				result = cardbookPrefService.getAllPrefIds();
				for (let i = 0; i < result.length; i++) {
					var myPrefId = result[i];
					var cardbookPrefService1 = new cardbookPreferenceService(myPrefId);
					var myPrefType = cardbookPrefService1.getType();
					var myPrefName = cardbookPrefService1.getName();
					var myPrefUrl = cardbookPrefService1.getUrl();
					var myPrefUser = cardbookPrefService1.getUser();
					var myPrefEnabled = cardbookPrefService1.getEnabled();
					if (myPrefEnabled) {
						cardbookSynchronization.initSync(myPrefId);
						if (myPrefType === "GOOGLE" || myPrefType === "CARDDAV" || myPrefType === "APPLE") {
							cardbookRepository.cardbookServerSyncRequest[myPrefId]++;
							var params = {aMode: "INITIAL", aPrefIdType: myPrefType};
							cardbookSynchronization.loadCache(myPrefId, myPrefName, params.aMode);
							if (myPrefType === "GOOGLE" ) {
								var connection = {connUser: myPrefUser, connPrefId: myPrefId, connPrefIdType: myPrefType, connUrl: cardbookRepository.cardbookgdata.REFRESH_REQUEST_URL, connDescription: myPrefName};
								var myCode = cardbookPasswordManager.getPassword(myPrefUser, myPrefUrl);
								cardbookSynchronization.googleGetAccessToken(connection, myCode, "SYNCGOOGLE", params);
							} else {
								var connection = {connPrefId: myPrefId, connPrefIdType: myPrefType, connUrl: myPrefUrl, connDescription: myPrefName};
								cardbookSynchronization.discoverPhase1(connection, "SYNCSERVER", params);
							}
						} else if (myPrefType === "FILE") {
							cardbookRepository.cardbookFileRequest[myPrefId]++;
							var myFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
							myFile.initWithPath(myPrefUrl);
							cardbookSynchronization.loadFileBackground(myFile, "", myPrefId, "INITIAL");
						} else if (myPrefType === "CACHE") {
							cardbookRepository.cardbookDirRequest[myPrefId]++;
							var myDir = cardbookRepository.getLocalDirectory();
							myDir.append(cardbookRepository.cardbookCollectedCardsId);
							cardbookSynchronization.loadDir(myDir, "", myPrefId, "INITIAL");
							var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
							var emailsCollection = prefs.getComplexValue("extensions.cardbook.emailsCollection", Components.interfaces.nsISupportsString).data;
							if (emailsCollection == "init") {
								cardbookUtils.jsInclude(["chrome://cardbook/content/collected/ovl_collected.js"]);
								ovl_collected.addAccountToCollected(cardbookRepository.cardbookCollectedCardsId);
							}
						}
						cardbookSynchronization.waitForSyncFinished(myPrefId, myPrefName);
					}
				}
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var emailsCollection = prefs.getComplexValue("extensions.cardbook.emailsCollection", Components.interfaces.nsISupportsString).data;
				if (emailsCollection == "init") {
					cardbookUtils.jsInclude(["chrome://cardbook/content/uuid.js", "chrome://cardbook/content/collected/ovl_collected.js"]);
					ovl_collected.addCollectedAccount();
					ovl_collected.loadCollectedAccount();
				}
			}
			
			cardbookSynchronization.setPeriodicSyncControl();
		},

		loadFile: function (aFile, aTarget, aFileId, aMode, aCallBack) {
			try {
				var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
				var myFileURI = ioService.newURI("file:///" + aFile.path, null, null);
				var fileContent = cardbookSynchronization.getFileData(myFileURI, "UTF8");

				if (aTarget == "") {
					var myDirPrefId = aFileId;
				} else {
					var myDirPrefId = cardbookUtils.getAccountId(aTarget);
				}
				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				var cardbookPrefService = new cardbookPreferenceService(myDirPrefId);
				var myPrefIdType = cardbookPrefService.getType();
				var myPrefIdName = cardbookPrefService.getName();
				var myPrefIdUrl = cardbookPrefService.getUrl();
				
				if (fileContent != null && fileContent !== undefined && fileContent != "") {
					var re = /[\n\u0085\u2028\u2029]|\r\n?/;
					var fileContentArray = fileContent.split(re);
					var cardContent = "";

					for (let i = 0; i < fileContentArray.length; i++) {
						if (fileContentArray[i] == "BEGIN:VCARD") {
							cardbookRepository.cardbookServerSyncTotal[myDirPrefId]++;
						}
					}
					for (let i = 0; i < fileContentArray.length; i++) {
						if (fileContentArray[i] == "BEGIN:VCARD") {
							cardContent = fileContentArray[i];
						} else if (fileContentArray[i] == "END:VCARD") {
							cardContent = cardContent + "\r\n" + fileContentArray[i];
							try {
								var myCard = new cardbookCardParser(cardContent, "", "", aFileId);
							}
							catch (e) {
								cardbookUtils.formatStringForOutput("parsingCardError", [myPrefIdName, cardContent]);
								cardbookRepository.cardbookServerSyncError[myDirPrefId]++;
								cardbookRepository.cardbookServerSyncDone[myDirPrefId]++;
								continue;
							}
							if (myCard.version == "") {
								if (aTarget == "") {
									cardbookRepository.cardbookServerSyncError[myDirPrefId]++;
									cardbookRepository.cardbookServerSyncDone[myDirPrefId]++;
								}
							} else {
								if (aTarget == "") {
									if (cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+myCard.uid]) {
										var myOldCard = cardbookRepository.cardbookCards[myCard.dirPrefId+"::"+myCard.uid];
										// if aCard and aModifiedCard have the same cached medias
										cardbookUtils.changeMediaFromFileToContent(myCard);
										cardbookRepository.removeCardFromRepository(myOldCard, true);
									}
									if (myPrefIdType === "CACHE") {
										cardbookRepository.addCardToRepository(myCard, aMode, aFile.leafName);
									} else if (myPrefIdType === "FILE") {
										myCard.cardurl = "";
										cardbookRepository.addCardToRepository(myCard, aMode);
									}
								} else {
									cardbookSynchronization.importCard(myCard, aTarget);
									delete myCard;
								}
								cardbookRepository.cardbookServerSyncDone[myDirPrefId]++;
							}
							cardContent = "";
						} else if (fileContentArray[i] == "") {
							continue;
						} else {
							cardContent = cardContent + "\r\n" + fileContentArray[i];
						}
					}
					if (aTarget != null && aTarget !== undefined && aTarget != "") {
						if (myPrefIdType === "FILE") {
							cardbookSynchronization.writeCardsToFile(myPrefIdUrl, cardbookRepository.cardbookDisplayCards[myDirPrefId], true);
						}
					}
					if (aCallBack) {
						aCallBack();
					}
				} else {
					cardbookRepository.cardbookAccountsCategories[aTarget]=[];
					cardbookRepository.cardbookDisplayCards[aTarget]=[];
					cardbookUtils.formatStringForOutput("fileEmpty", [aFile.path]);
				}
				cardbookRepository.cardbookFileResponse[myDirPrefId]++;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.loadFile error : " + e);
			}
		},

		loadFileBackground: function (aFile, aTarget, aFileId, aMode, aCallBack) {
			lTimerLoadFile = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			lTimerLoadFile.initWithCallback({ notify: function(lTimerLoadFile) { cardbookSynchronization.loadFile(aFile, aTarget, aFileId, aMode, aCallBack)} }, 1000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
		},

		importCard: function (aCard, aTarget) {
			try {
				cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookWebDAV.js", "chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				var myCurrentDirPrefId = cardbookUtils.getAccountId(aTarget);
				let cardbookPrefService = new cardbookPreferenceService(myCurrentDirPrefId);
				var myCurrentDirPrefIdType = cardbookPrefService.getType();
				var myCurrentDirPrefIdName = cardbookPrefService.getName();
				var myCurrentDirPrefIdUrl = cardbookPrefService.getUrl();

				var aNewCard = new cardbookCardParser();
				cardbookUtils.cloneCard(aCard, aNewCard);
				aNewCard.dirPrefId = myCurrentDirPrefId;
				var mySepPosition = aTarget.indexOf("::",0);
				if (mySepPosition != -1) {
					var myCategory = aTarget.substr(mySepPosition+2,aTarget.length);
					if (myCategory != cardbookRepository.cardbookUncategorizedCards) {
						aNewCard.categories.push(myCategory);
						cardbookUtils.validateCategories(aNewCard)
					} else {
						aNewCard.categories = [];
					}
				}
				// between accounts
				if (myCurrentDirPrefId != aCard.dirPrefId) {
					// Existing card
					if (cardbookRepository.cardbookCards[myCurrentDirPrefId+"::"+aNewCard.uid]) {
						var myUpdatedCard = cardbookRepository.cardbookCards[myCurrentDirPrefId+"::"+aNewCard.uid];
						if (myCurrentDirPrefIdType === "FILE") {
							// if aCard and aCard have the same cached medias
							cardbookUtils.changeMediaFromFileToContent(aNewCard);
							cardbookRepository.removeCardFromRepository(myUpdatedCard, true);
							cardbookUtils.nullifyTagModification(aNewCard);
							cardbookUtils.nullifyEtag(aNewCard);
							aNewCard.cardurl = "";
							cardbookRepository.addCardToRepository(aNewCard, "WINDOW");
						} else if (myCurrentDirPrefIdType === "CACHE") {
							// if aCard and aCard have the same cached medias
							cardbookUtils.changeMediaFromFileToContent(aNewCard);
							cardbookRepository.removeCardFromRepository(myUpdatedCard, true);
							cardbookUtils.nullifyTagModification(aNewCard);
							cardbookUtils.nullifyEtag(aNewCard);
							cardbookRepository.addCardToRepository(aNewCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aNewCard, myCurrentDirPrefIdType));
						} else {
							// if aCard and aCard have the same cached medias
							cardbookUtils.changeMediaFromFileToContent(aNewCard);
							if (!(cardbookUtils.searchTagCreated(aNewCard))) {
								cardbookUtils.addTagUpdated(aNewCard);
							}
							cardbookUtils.addEtag(aNewCard, myUpdatedCard.etag);
							cardbookRepository.removeCardFromRepository(myUpdatedCard, true);
							cardbookRepository.addCardToRepository(aNewCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aNewCard, myCurrentDirPrefIdType));
						}
						cardbookUtils.formatStringForOutput("cardUpdatedOK", [myCurrentDirPrefIdName, aNewCard.fn]);
					// New card
					} else {
						if (myCurrentDirPrefIdType === "FILE") {
							cardbookUtils.nullifyTagModification(aNewCard);
							cardbookUtils.nullifyEtag(aNewCard);
							aNewCard.cardurl = "";
							cardbookRepository.addCardToRepository(aNewCard, "WINDOW");
						} else if (myCurrentDirPrefIdType === "CACHE") {
							cardbookUtils.nullifyTagModification(aNewCard);
							cardbookUtils.nullifyEtag(aNewCard);
							cardbookRepository.addCardToRepository(aNewCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aNewCard, myCurrentDirPrefIdType));
						} else {
							cardbookUtils.addTagCreated(aNewCard);
							cardbookUtils.addEtag(aNewCard, "0");
							cardbookRepository.addCardToRepository(aNewCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aNewCard, myCurrentDirPrefIdType));
						}
						cardbookUtils.formatStringForOutput("cardCreatedOK", [myCurrentDirPrefIdName, aNewCard.fn]);
					}
				} else {
					// inside same account
					if (myCurrentDirPrefIdType === "FILE") {
						// if aCard and aCard have the same cached medias
						cardbookUtils.changeMediaFromFileToContent(aNewCard);
						cardbookRepository.removeCardFromRepository(aCard, true);
						cardbookUtils.nullifyTagModification(aNewCard);
						cardbookUtils.nullifyEtag(aNewCard);
						aNewCard.cardurl = "";
						cardbookRepository.addCardToRepository(aNewCard, "WINDOW");
					} else if (myCurrentDirPrefIdType === "CACHE") {
						// if aCard and aCard have the same cached medias
						cardbookUtils.changeMediaFromFileToContent(aNewCard);
						cardbookRepository.removeCardFromRepository(aCard, true);
						cardbookUtils.nullifyTagModification(aNewCard);
						cardbookUtils.nullifyEtag(aNewCard);
						cardbookRepository.addCardToRepository(aNewCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aNewCard, myCurrentDirPrefIdType));
					} else {
						// if aCard and aCard have the same cached medias
						cardbookUtils.changeMediaFromFileToContent(aNewCard);
						if (!(cardbookUtils.searchTagCreated(aNewCard))) {
							cardbookUtils.addTagUpdated(aNewCard);
						}
						cardbookRepository.removeCardFromRepository(aCard, true);
						cardbookRepository.addCardToRepository(aNewCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(aNewCard, myCurrentDirPrefIdType));
					}
					
					// inside same account to a category
					if (aTarget != aCard.dirPrefId) {
						if (myCategory && myCategory != cardbookRepository.cardbookUncategorizedCards) {
							cardbookUtils.formatStringForOutput("cardAddedToCategory", [myCurrentDirPrefIdName, aNewCard.fn, myCategory]);
						} else {
							cardbookUtils.formatStringForOutput("cardRemovedFromAllCategory", [myCurrentDirPrefIdName, aNewCard.fn]);
						}
					// inside same account
					} else {
						cardbookUtils.formatStringForOutput("cardUpdatedOK", [myCurrentDirPrefIdName, aNewCard.fn]);
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.importCard error : " + e);
			}
		},

		getMediaContentForCard: function(aCard, aType, aMediaConversion) {
			try {
				var result = "";
				if (aMediaConversion) {
					if (aCard[aType].URI != null && aCard[aType].URI !== undefined && aCard[aType].URI != "") {
						result = "VALUE=uri:" + aCard[aType].URI;
					} else if (aCard[aType].localURI != null && aCard[aType].localURI !== undefined && aCard[aType].localURI != "") {
						result = "VALUE=uri:" + aCard[aType].localURI;
						var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
						var myFileURI = ioService.newURI(aCard[aType].localURI, null, null);
						var content = btoa(cardbookSynchronization.getFileData(myFileURI, "NOUTF8"));
						if (aCard.version === "4.0") {
							if (aCard[aType].extension != "") {
								result = "data:image/" + aCard[aType].extension + ";base64," + content;
							} else {
								result = "base64," + content;
							}
						} else if (aCard.version === "3.0") {
							if (aCard[aType].extension != "") {
								result = "ENCODING=b;TYPE=" + aCard[aType].extension + ":" + content;
							} else {
								result = "ENCODING=b:" + content;
							}
						}
					}
				} else {
					if (aCard[aType].URI != null && aCard[aType].URI !== undefined && aCard[aType].URI != "") {
						result = "VALUE=uri:" + aCard[aType].URI;
					} else if (aCard[aType].localURI != null && aCard[aType].localURI !== undefined && aCard[aType].localURI != "") {
						result = "VALUE=uri:" + aCard[aType].localURI;
					}
				}
				return result;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.getMediaContentForCard error : " + e);
			}
		},

		writeCardsToFile: function (aFileName, aListofCard, aMediaConversion) {
			try {
				var output = cardbookUtils.getDataForUpdatingFile(aListofCard, aMediaConversion);

				cardbookSynchronization.writeContentToFile(aFileName, output, "UTF8");
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.writeCardsToFile error : " + e);
			}
		},

		writeCardsToDir: function (aDirName, aListofCard, aMediaConversion) {
			try {
				var myDirectory = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				for (var i = 0; i < aListofCard.length; i++) {
					var myCard = aListofCard[i];
					myDirectory.initWithPath(aDirName);
					var myFile = myDirectory;
					myFile.append(myCard.fn + ".vcf");
					if (myFile.exists() == false){
						myFile.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
					}
					cardbookSynchronization.writeContentToFile(myFile.path, cardbookUtils.cardToVcardData(myCard, aMediaConversion), "UTF8");
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.writeCardsToDir error : " + e);
			}
		},

		writeContentToFile: function (aFileName, aContent, aConvertion) {
			try {
				var myFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				myFile.initWithPath(aFileName);

				var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
				outputStream.init(myFile, 0x02 | 0x08 | 0x20, 0666, 0);

				if (aConvertion === "UTF8") {
					var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
					converter.init(outputStream, "UTF-8", 0, 0);
					converter.writeString(aContent);
					converter.close();
				} else {
					var result = outputStream.write(aContent, aContent.length);
				}
				
				outputStream.close();
				wdw_cardbooklog.updateStatusProgressInformationWithDebug2("debug mode : file rewrited : " + aFileName);
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookSynchronization.writeContentToFile error : filename : " + aFileName + ", error : " + e);
			}
		}

	};

};