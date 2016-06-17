if ("undefined" == typeof(wdw_addressbooksAdd)) {
	var wdw_addressbooksAdd = {

		gType : "",
		gTypeFile : "",
		gFile : "",
		gFinishParams : [],
		gValidateURL : false,
		gValidateDescription : "Validation module",

		loadWizard: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			let stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			let strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidatingLabel");
		},

		checkRequired: function () {
			var canAdvance = true;
			var curPage = document.getElementById('addressbook-wizard').currentPage;
			if (curPage) {
				let eList = curPage.getElementsByAttribute('required', 'true');
				for (let i = 0; i < eList.length && canAdvance; ++i) {
					canAdvance = (eList[i].value != "");
				}
				document.getElementById('addressbook-wizard').canAdvance = canAdvance;
			}
		},

		initialAdvance: function () {
			var type = document.getElementById('addressbookType').selectedItem.value;
			var page = document.getElementsByAttribute('pageid', 'initialPage')[0];
			if (type == 'local') {
				page.next = 'locationComputerPage';
			} else {
				page.next = 'locationNetworkPage';
				cardbookImap.searchAccounts();
			}
		},

		locationComputerPageTypeSelect: function () {
			document.getElementById('locationComputerPageURI').value = "";
			wdw_addressbooksAdd.checkRequired();
		},

		locationComputerPageTypeAdvance: function () {
			var type = document.getElementById('locationComputerPageType').selectedItem.value;
			wdw_addressbooksAdd.gType = "FILE";
			if (type == 'open') {
				wdw_addressbooksAdd.gTypeFile = "OPENFILE";
			} else {
				wdw_addressbooksAdd.gTypeFile = "CREATEFILE";
			}
		},

		searchFile: function () {
			var type = document.getElementById('locationComputerPageType').selectedItem.value;
			if (type == 'open') {
				var myFile = cardbookUtils.callFilePicker("fileSelectionTitle", "OPEN", "VCF");
			} else {
				var myFile = cardbookUtils.callFilePicker("fileCreationTitle", "SAVE", "VCF");
			}

			if (myFile != null && myFile !== undefined && myFile != "") {
				// search if file is already open
				if (cardbookUtils.isTheFileAlreadyOpen(myFile.path)) {
					var strBundle = document.getElementById("cardbook-strings");
					var fileAlreadyOpenMsg = strBundle.getFormattedString("fileAlreadyOpen", [myFile.path]);
					var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
					prompts.alert(null, null, fileAlreadyOpenMsg);
					return;
				} else {
					document.getElementById('locationComputerPageURI').value = myFile.path;
					wdw_addressbooksAdd.gFile = myFile;
				}
			}
			wdw_addressbooksAdd.checkRequired();
		},

		checklocationNetwork: function () {
			document.getElementById('resultValidation').hidden = true;
			var canValidate = true;
			var curPage = document.getElementById('addressbook-wizard').currentPage;
			if (curPage) {
				if (wdw_addressbooksAdd.gValidateURL) {
					document.getElementById('addressbook-wizard').canAdvance = wdw_addressbooksAdd.gValidateURL;
				} else {
					document.getElementById('addressbook-wizard').canAdvance = wdw_addressbooksAdd.gValidateURL;
					let eList = curPage.getElementsByAttribute('required', 'true');
					for (let i = 0; i < eList.length && canValidate; ++i) {
						canValidate = (eList[i].value != "");
					}
					document.getElementById('validateButton').disabled = !canValidate;
				}
			}
		},

		locationNetworkPageTypeSelect: function () {
			wdw_addressbooksAdd.gValidateURL = false;
			document.getElementById('locationNetworkPageURI').value = "";
			document.getElementById('locationNetworkPageUsername').value = "";
			document.getElementById('locationNetworkPagePassword').value = "";
			
			var type = document.getElementById('locationNetworkPageType').selectedItem.value;
			if (type == 'IMAP') {
				document.getElementById('locationNetworkPageImapAccountLabel').disabled=false;
				document.getElementById('locationNetworkPageImapAccount').disabled=false;
				document.getElementById('locationNetworkPageImapAccount').setAttribute('required', 'true');
				document.getElementById('locationNetworkPageImapFolderLabel').disabled=false;
				document.getElementById('locationNetworkPageImapFolder').disabled=false;
				document.getElementById('locationNetworkPageImapFolder').setAttribute('required', 'true');
				document.getElementById('locationNetworkPageUriLabel').disabled=true;
				document.getElementById('locationNetworkPageURI').disabled=true;
				document.getElementById('locationNetworkPageURI').setAttribute('required', 'false');
				document.getElementById('locationNetworkPageUsernameLabel').disabled=true;
				document.getElementById('locationNetworkPageUsername').disabled=true;
				document.getElementById('locationNetworkPageUsername').setAttribute('required', 'false');
				document.getElementById('locationNetworkPagePasswordLabel').disabled=true;
				document.getElementById('locationNetworkPagePassword').disabled=true;
				document.getElementById('locationNetworkPagePassword').setAttribute('required', 'false');
				document.getElementById('locationNetworkPagePasswordCheckBox').disabled=true;
			} else if (type == 'GOOGLE') {
				document.getElementById('locationNetworkPageImapAccountLabel').disabled=true;
				document.getElementById('locationNetworkPageImapAccount').disabled=true;
				document.getElementById('locationNetworkPageImapAccount').setAttribute('required', 'false');
				document.getElementById('locationNetworkPageImapFolderLabel').disabled=true;
				document.getElementById('locationNetworkPageImapFolder').disabled=true;
				document.getElementById('locationNetworkPageImapFolder').setAttribute('required', 'false');
				document.getElementById('locationNetworkPageUsernameLabel').disabled=false;
				document.getElementById('locationNetworkPageUsername').disabled=false;
				document.getElementById('locationNetworkPageUsername').setAttribute('required', 'true');
				document.getElementById('locationNetworkPageUriLabel').disabled=true;
				document.getElementById('locationNetworkPageURI').disabled=true;
				document.getElementById('locationNetworkPageURI').setAttribute('required', 'false');
				document.getElementById('locationNetworkPagePasswordLabel').disabled=true;
				document.getElementById('locationNetworkPagePassword').disabled=true;
				document.getElementById('locationNetworkPagePassword').setAttribute('required', 'false');
				document.getElementById('locationNetworkPagePasswordCheckBox').disabled=true;
			} else if (type == 'APPLE') {
				document.getElementById('locationNetworkPageImapAccountLabel').disabled=true;
				document.getElementById('locationNetworkPageImapAccount').disabled=true;
				document.getElementById('locationNetworkPageImapAccount').setAttribute('required', 'false');
				document.getElementById('locationNetworkPageImapFolderLabel').disabled=true;
				document.getElementById('locationNetworkPageImapFolder').disabled=true;
				document.getElementById('locationNetworkPageImapFolder').setAttribute('required', 'false');
				document.getElementById('locationNetworkPageUsernameLabel').disabled=false;
				document.getElementById('locationNetworkPageUsername').disabled=false;
				document.getElementById('locationNetworkPageUsername').setAttribute('required', 'true');
				document.getElementById('locationNetworkPageUriLabel').disabled=true;
				document.getElementById('locationNetworkPageURI').disabled=true;
				document.getElementById('locationNetworkPageURI').setAttribute('required', 'false');
				document.getElementById('locationNetworkPagePasswordLabel').disabled=false;
				document.getElementById('locationNetworkPagePassword').disabled=false;
				document.getElementById('locationNetworkPagePassword').setAttribute('required', 'true');
				document.getElementById('locationNetworkPagePasswordCheckBox').disabled=false;
			} else {
				document.getElementById('locationNetworkPageImapAccountLabel').disabled=true;
				document.getElementById('locationNetworkPageImapAccount').disabled=true;
				document.getElementById('locationNetworkPageImapAccount').setAttribute('required', 'false');
				document.getElementById('locationNetworkPageImapFolderLabel').disabled=true;
				document.getElementById('locationNetworkPageImapFolder').disabled=true;
				document.getElementById('locationNetworkPageImapFolder').setAttribute('required', 'false');
				document.getElementById('locationNetworkPageUsernameLabel').disabled=false;
				document.getElementById('locationNetworkPageUsername').disabled=false;
				document.getElementById('locationNetworkPageUsername').setAttribute('required', 'true');
				document.getElementById('locationNetworkPageUriLabel').disabled=false;
				document.getElementById('locationNetworkPageURI').disabled=false;
				document.getElementById('locationNetworkPageURI').setAttribute('required', 'true');
				document.getElementById('locationNetworkPagePasswordLabel').disabled=false;
				document.getElementById('locationNetworkPagePassword').disabled=false;
				document.getElementById('locationNetworkPagePassword').setAttribute('required', 'true');
				document.getElementById('locationNetworkPagePasswordCheckBox').disabled=false;
			}
			wdw_addressbooksAdd.checklocationNetwork();
		},

		locationNetworkPageTextboxInput: function () {
			wdw_addressbooksAdd.gValidateURL = false;
			wdw_addressbooksAdd.checklocationNetwork();
		},

		locationNetworkPageTypeAdvance: function () {
			wdw_addressbooksAdd.gType = document.getElementById('locationNetworkPageType').selectedItem.value;
		},

		showPassword: function () {
			var passwordType = document.getElementById('locationNetworkPagePassword').type;
			if (passwordType != "password") {
				document.getElementById('locationNetworkPagePassword').type = "password";
			} else {
				document.getElementById('locationNetworkPagePassword').type = "";
			}
		},

		validateURL: function () {
			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidatingLabel");
			document.getElementById('resultValidation').hidden = false;
			document.getElementById('validateButton').disabled = true;
			
			var type = document.getElementById('locationNetworkPageType').selectedItem.value;
			var username = document.getElementById('locationNetworkPageUsername').value;
			var password = document.getElementById('locationNetworkPagePassword').value;
			if (type == 'IMAP') {
				//TODO IMAP en construction
				var url = cardbookImap.getUrl();
			} else if (type == 'GOOGLE') {
				var url = cardbookRepository.cardbookgdata.GOOGLE_API;
			} else if (type == 'APPLE') {
				var url = cardbookRepository.APPLE_API;
			} else {
				var url = document.getElementById('locationNetworkPageURI').value;
			}
			
			if (cardbookSynchronization.getRootUrl(url) == "") {
				document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidatingURLFailedLabel") + " : " + url;
				return;
			}

			cardbookUtils.jsInclude(["chrome://cardbook/content/uuid.js"]);
			var dirPrefId = new UUID() + "";
			if (type == 'IMAP') {
				//TODO IMAP en construction
				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				let cardbookPrefService = new cardbookPreferenceService(dirPrefId);
				cardbookPrefService.setId(dirPrefId);
				cardbookPrefService.setUrl(url);
				cardbookSynchronization.initURLValidation(dirPrefId);
				cardbookRepository.cardbookServerSyncRequest[dirPrefId]++;
				document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidationOKLabel");
				wdw_addressbooksAdd.gValidateURL = true;
				document.getElementById('addressbook-wizard').canAdvance = true;
				//wdw_addressbooksAdd.waitForDiscoveryFinished(dirPrefId);

			} else if (type == 'GOOGLE') {
				cardbookSynchronization.initRefreshToken(dirPrefId);
				cardbookRepository.cardbookServerSyncRequest[dirPrefId]++;
				var connection = {connUser: username, connPrefId: dirPrefId, connDescription: wdw_addressbooksAdd.gValidateDescription};
				cardbookSynchronization.requestNewRefreshToken(connection);
				wdw_addressbooksAdd.waitForRefreshTokenFinished(dirPrefId);
			} else {
				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				let cardbookPrefService = new cardbookPreferenceService(dirPrefId);
				cardbookPrefService.setId(dirPrefId);
				cardbookPrefService.setUrl(url);

				cardbookPasswordManager.removeAccount(username, url);
				cardbookPasswordManager.addAccount(username, url, password);
				
				cardbookSynchronization.initURLValidation(dirPrefId);
				cardbookRepository.cardbookServerSyncRequest[dirPrefId]++;
				var connection = {connUser: username, connPrefId: dirPrefId, connPrefIdType: type, connUrl: url, connDescription: wdw_addressbooksAdd.gValidateDescription};
				cardbookSynchronization.discoverPhase1(connection, "GETDISPLAYNAME");
				wdw_addressbooksAdd.waitForDiscoveryFinished(dirPrefId);
			}
		},

		waitForDiscoveryFinished: function (aPrefId) {
			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			lTimerDiscovery = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			lTimerDiscovery.initWithCallback({ notify: function(lTimerDiscovery) {
						wdw_cardbooklog.updateStatusProgressInformationWithDebug1(wdw_addressbooksAdd.gValidateDescription + " : debug mode : cardbookRepository.cardbookServerDiscoveryRequest : ", cardbookRepository.cardbookServerDiscoveryRequest[aPrefId]);
						wdw_cardbooklog.updateStatusProgressInformationWithDebug1(wdw_addressbooksAdd.gValidateDescription + " : debug mode : cardbookRepository.cardbookServerDiscoveryResponse : ", cardbookRepository.cardbookServerDiscoveryResponse[aPrefId]);
						wdw_cardbooklog.updateStatusProgressInformationWithDebug1(wdw_addressbooksAdd.gValidateDescription + " : debug mode : cardbookRepository.cardbookServerDiscoveryError : ", cardbookRepository.cardbookServerDiscoveryError[aPrefId]);
						wdw_cardbooklog.updateStatusProgressInformationWithDebug1(wdw_addressbooksAdd.gValidateDescription + " : debug mode : cardbookRepository.cardbookServerValidation : ", cardbookRepository.cardbookServerValidation);
						if (cardbookRepository.cardbookServerDiscoveryError[aPrefId]  >= 1) {
							document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidationFailedLabel");
							document.getElementById('validateButton').disabled = false;
							cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
							let cardbookPrefService = new cardbookPreferenceService(aPrefId);
							cardbookPrefService.delBranch();
							lTimerDiscovery.cancel();
						} else if (cardbookRepository.cardbookServerDiscoveryRequest[aPrefId] !== cardbookRepository.cardbookServerDiscoveryResponse[aPrefId] || cardbookRepository.cardbookServerDiscoveryResponse[aPrefId] === 0) {
							document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidatingLabel") + " : " + cardbookRepository.cardbookServerDiscoveryResponse[aPrefId] + "/4";
						} else {
							cardbookSynchronization.finishMultipleOperations(aPrefId);
							document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidationFailedLabel");
							wdw_addressbooksAdd.gValidateURL = false;
							// searching if ctag have been found
							for (var url in cardbookRepository.cardbookServerValidation) {
								for (var i = 0; i < cardbookRepository.cardbookServerValidation[url].length; i++) {
									document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidationOKLabel");
									wdw_addressbooksAdd.gValidateURL = true;
									wdw_addressbooksAdd.checklocationNetwork();
									break;
								}
								var page = document.getElementsByAttribute('pageid', 'locationNetworkPage')[0];
								if (cardbookRepository.cardbookServerValidation[url].length > 1) {
									page.next = 'namesPage';
								} else {
									page.next = 'namePage';
								}
							}
							document.getElementById('validateButton').disabled = false;
							cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
							let cardbookPrefService = new cardbookPreferenceService(aPrefId);
							cardbookPrefService.delBranch();
							lTimerDiscovery.cancel();
						}
					}
					}, 1000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
		},

		waitForRefreshTokenFinished: function (aPrefId) {
			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			lTimerRefreshToken = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			lTimerRefreshToken.initWithCallback({ notify: function(lTimerRefreshToken) {
						if (cardbookRepository.cardbookGoogleRefreshTokenError[aPrefId]  >= 1) {
							document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidationFailedLabel");
							lTimerRefreshToken.cancel();
							document.getElementById('validateButton').disabled = false;
						} else if (cardbookRepository.cardbookGoogleRefreshTokenResponse[aPrefId] !== 1) {
							document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidatingLabel");
						} else {
							cardbookSynchronization.finishMultipleOperations(aPrefId);
							document.getElementById('resultValidation').value = strBundle.GetStringFromName("ValidationOKLabel");
							document.getElementById('validateButton').disabled = false;
							wdw_addressbooksAdd.gValidateURL = true;
							wdw_addressbooksAdd.checklocationNetwork();
							lTimerRefreshToken.cancel();
						}
					}
					}, 1000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
		},

		onSuccessfulAuthentication: function (aResponse) {
			var username = document.getElementById('locationNetworkPageUsername').value;
			cardbookPasswordManager.removeAccount(username);
			cardbookPasswordManager.addAccount(username, "", aResponse.refresh_token);
			var wizard = document.getElementById("addressbook-wizard");
			wizard.canAdvance = true;
			wizard.advance();
		},

		loadName: function () {
			var aTextbox = document.getElementById('namePageName');
			if (wdw_addressbooksAdd.gType == 'FILE') {
				aTextbox.value = wdw_addressbooksAdd.gFile.leafName;
			} else {
				for (var url in cardbookRepository.cardbookServerValidation) {
					aTextbox.value = cardbookUtils.undefinedToBlank(cardbookRepository.cardbookServerValidation[url][0][0]);
				}
			}
			var aTextbox = document.getElementById('serverColorInput');
			aTextbox.value = "#A8C2E1";
			wdw_addressbooksAdd.checkRequired();
		},

		loadNames: function () {
			var aListRows = document.getElementById('namesVbox');

			while (aListRows.firstChild) {
				aListRows.removeChild(aListRows.firstChild);
			}
			for (var url in cardbookRepository.cardbookServerValidation) {
				for (var i = 0; i < cardbookRepository.cardbookServerValidation[url].length; i++) {
					var aRow = document.createElement('row');
					aListRows.appendChild(aRow);
					aRow.setAttribute('align', 'center');
					aRow.setAttribute('flex', '1');
					
					var aColorbox =  document.createElementNS("http://www.w3.org/1999/xhtml","input");
					aRow.appendChild(aColorbox);
					aColorbox.setAttribute('id', 'serverColorInput' + i);
					aColorbox.setAttribute('class', "small-margin");
					aColorbox.setAttribute('type', "color");
					aColorbox.value = "#A8C2E1";

					var aCheckbox = document.createElement('checkbox');
					aRow.appendChild(aCheckbox);
					aCheckbox.setAttribute('checked', true);
					aCheckbox.setAttribute('id', 'namesCheckbox' + i);
					aCheckbox.addEventListener("command", function()
						{
							var aTextBox = document.getElementById('namesTextbox' + this.id.replace("namesCheckbox",""));
							if (this.checked) {
								aTextBox.setAttribute('required', true);
							} else {
								aTextBox.setAttribute('required', false);
							}
							wdw_addressbooksAdd.checkRequired();
						}, false);

					var aTextbox = document.createElement('textbox');
					aRow.appendChild(aTextbox);
					aTextbox.setAttribute('id', 'namesTextbox' + i);
					aTextbox.setAttribute('required', true);
					aTextbox.value = cardbookRepository.cardbookServerValidation[url][i][0];
					aTextbox.addEventListener("input", function()
						{
							wdw_addressbooksAdd.checkRequired();
						}, false);
				}
			}
			wdw_addressbooksAdd.checkRequired();
		},

		createAddressbook: function () {
			var username = document.getElementById('locationNetworkPageUsername').value;
			var password = document.getElementById('locationNetworkPagePassword').value;
			var name = document.getElementById('namePageName').value;
			var color = document.getElementById('serverColorInput').value;
			if (wdw_addressbooksAdd.gType == 'IMAP') {
				var url = cardbookImap.getUrl();
				wdw_addressbooksAdd.gFinishParams.push([wdw_addressbooksAdd.gTypeFile, wdw_addressbooksAdd.gFile, url, name, username, color]);
			} else if (wdw_addressbooksAdd.gType == 'GOOGLE') {
				var url = cardbookRepository.cardbookgdata.GOOGLE_API;
				wdw_addressbooksAdd.gFinishParams.push([wdw_addressbooksAdd.gTypeFile, wdw_addressbooksAdd.gFile, url, name, username, color]);
			} else if (wdw_addressbooksAdd.gType == 'APPLE') {
				var url = cardbookRepository.APPLE_API;
				wdw_addressbooksAdd.gFinishParams.push([wdw_addressbooksAdd.gTypeFile, wdw_addressbooksAdd.gFile, url, name, username, color]);
			} else if (wdw_addressbooksAdd.gType == 'CARDDAV') {
				for (var url in cardbookRepository.cardbookServerValidation) {
					if (cardbookRepository.cardbookServerValidation[url].length > 1) {
						for (var i = 0; i < cardbookRepository.cardbookServerValidation[url].length; i++) {
							var aCheckbox = document.getElementById('namesCheckbox' + i);
							var aAddressbookName = document.getElementById('namesTextbox' + i).value;
							var aAddressbookColor = document.getElementById('serverColorInput' + i).value;
							if (aCheckbox.checked) {
								wdw_addressbooksAdd.gFinishParams.push([wdw_addressbooksAdd.gTypeFile, wdw_addressbooksAdd.gFile, cardbookRepository.cardbookServerValidation[url][i][1],
																		aAddressbookName, username, aAddressbookColor]);
							}
						}
					} else {
						wdw_addressbooksAdd.gFinishParams.push([wdw_addressbooksAdd.gTypeFile, wdw_addressbooksAdd.gFile, document.getElementById('locationNetworkPageURI').value, name, username, color]);
					}
				}
			} else if (wdw_addressbooksAdd.gType == 'FILE') {
				var url = document.getElementById('locationComputerPageURI').value;
				wdw_addressbooksAdd.gFinishParams.push([wdw_addressbooksAdd.gTypeFile, wdw_addressbooksAdd.gFile, url, name, username, color]);
			}
		},

		setCanRewindFalse: function () {
		   document.getElementById('addressbook-wizard').canRewind = false;
		},

		cancelWizard: function () {
			wdw_addressbooksAdd.gType = "";
			wdw_addressbooksAdd.closeWizard();
		},

		closeWizard: function () {
			// addAddressbook in wdw_cardbook.js
			window.arguments[0].serverCallback(wdw_addressbooksAdd.gType, wdw_addressbooksAdd.gFinishParams);
		}

	};

};