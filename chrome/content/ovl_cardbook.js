if ("undefined" == typeof(cardbookTabType)) {
	var cardbookTabType = {
		name: "cardbookTab",
		perTabPanel: "vbox",
		lastBrowserId: 0,
		get loadingTabString() {
			delete this.loadingTabString;
			return this.loadingTabString = document.getElementById("bundle_messenger").getString("loadingTab");
		},
	
		modes: {
			cardbookTab: {
				type: "cardbookTab",
				maxTabs: 1,
			}
		},
		
		openTab: function onTabOpened(aTab, aArgs) {
			if (!"contentPage" in aArgs)
				throw("contentPage must be specified");
	
			// First clone the page and set up the basics.
			let clone = document.getElementById("contentTab").firstChild.cloneNode(true);
	
			clone.setAttribute("id", "cardbookTab" + this.lastBrowserId);
			clone.setAttribute("collapsed", false);
	
			aTab.panel.appendChild(clone);
	
			// Start setting up the browser.
			aTab.browser = aTab.panel.getElementsByTagName("browser")[0];
	
			// As we're opening this tab, showTab may not get called, so set
			// the type according to if we're opening in background or not.
			let background = ("background" in aArgs) && aArgs.background;
			aTab.browser.setAttribute("type", background ? "content-targetable" :
														 "content-primary");
	
			aTab.browser.setAttribute("id", "cardbookTabBrowser" + this.lastBrowserId);
	
			// aTab.browser.setAttribute("onclick",
				// "clickHandler" in aArgs && aArgs.clickHandler ?
				// aArgs.clickHandler : "specialTabs.defaultClickHandler(event);");
	
			// Now initialise the find bar.
			aTab.findbar = aTab.panel.getElementsByTagName("findbar")[0];
			aTab.findbar.setAttribute("browserid", "cardbookTabBrowser" + this.lastBrowserId);
	
			// Default to reload being disabled.
			aTab.reloadEnabled = false;
			
			// Set tabNode attibute
			// aTab.tabNode.setAttribute("TabType","AddressBook");
			aTab.tabNode.setAttribute("TabType","cardbookTabType");
			// aTab.tabNode.setAttribute("image","chrome://cardbook/skin/cardbook_16_16.png") ;
			
			// Now set up the listeners.
			this._setUpTitleListener(aTab);
			this._setUpCloseWindowListener(aTab);
	
			// Create a filter and hook it up to our browser
			let filter = Components.classes["@mozilla.org/appshell/component/browser-status-filter;1"]
								 .createInstance(Components.interfaces.nsIWebProgress);
			aTab.filter = filter;
			aTab.browser.webProgress.addProgressListener(filter, Components.interfaces.nsIWebProgress.NOTIFY_ALL);
	
			// Wire up a progress listener to the filter for this browser
			aTab.progressListener = new tabProgressListener(aTab, false);
	
			filter.addProgressListener(aTab.progressListener, Components.interfaces.nsIWebProgress.NOTIFY_ALL);
	
			// Now start loading the content.
			aTab.title = this.loadingTabString;
	
			aTab.browser.loadURI(aArgs.contentPage);
	
			//Change folder in case of reload
			if( "folderInd" in aArgs)
			{
				aTab.browser.addEventListener("DOMContentLoaded", function(e) {
					aTab.browser.contentWindow.dirTree.builder.root.view.selection.select(aArgs.folderInd);
				}, false);
			}
	
			this.lastBrowserId++;
		},

		closeTab: function onTabClosed(aTab) {
			aTab.browser.removeEventListener("DOMTitleChanged",
										   aTab.titleListener, true);
			aTab.browser.removeEventListener("DOMWindowClose",
										   aTab.closeListener, true);
			aTab.browser.webProgress.removeProgressListener(aTab.filter);
			aTab.filter.removeProgressListener(aTab.progressListener);
			aTab.browser.destroy();
		},
		
		saveTabState: function onSaveTabState(aTab) {
			aTab.browser.setAttribute("type", "content-targetable");
		},
		
		showTab: function onShowTab(aTab) {
			aTab.browser.setAttribute("type", "content-primary");
		},
		
		persistTab: function onPersistTab(aTab) {
			if (aTab.browser.currentURI.spec == "about:blank")
			return null;
	
			let onClick = aTab.browser.getAttribute("onclick");
			
			return {
				tabURI: aTab.browser.currentURI.spec,
				clickHandler: onClick ? onClick : null,
	/*			folderInd: aTab.browser.contentWindow.dirTree.currentIndex*/
			};
		},
		
		restoreTab: function onRestoreTab(aTabmail, aPersistedState) {
			aTabmail.openTab("cardbookTab", { contentPage: aPersistedState.tabURI,
										   clickHandler: aPersistedState.clickHandler,
/*									   folderInd: aPersistedState.folderInd,*/
										   background: true } );
		},
		
		
		supportsCommand: function supportsCommand(aCommand, aTab) {
			switch (aCommand) {
				case "cmd_fullZoomReduce":
				case "cmd_fullZoomEnlarge":
				case "cmd_fullZoomReset":
				case "cmd_fullZoomToggle":
				case "cmd_find":
				case "cmd_findAgain":
				case "cmd_findPrevious":
				case "cmd_printSetup":
				case "cmd_print":
				case "button_print":
				case "cmd_stop":
				case "cmd_reload":
				// XXX print preview not currently supported - bug 497994 to implement.
				// case "cmd_printpreview":
					return true;
				default:
					return false;
			}
		},
		
		isCommandEnabled: function isCommandEnabled(aCommand, aTab) {
			switch (aCommand) {
				case "cmd_fullZoomReduce":
				case "cmd_fullZoomEnlarge":
				case "cmd_fullZoomReset":
				case "cmd_fullZoomToggle":
				case "cmd_find":
				case "cmd_findAgain":
				case "cmd_findPrevious":
				case "cmd_printSetup":
				case "cmd_print":
				case "button_print":
				// XXX print preview not currently supported - bug 497994 to implement.
				// case "cmd_printpreview":
					return true;
				case "cmd_reload":
					return aTab.reloadEnabled;
				case "cmd_stop":
					return aTab.busy;
				default:
					return false;
			}
		},
		
		doCommand: function isCommandEnabled(aCommand, aTab) {
			switch (aCommand) {
				case "cmd_fullZoomReduce":
					ZoomManager.reduce();
					break;
				case "cmd_fullZoomEnlarge":
					ZoomManager.enlarge();
					break;
				case "cmd_fullZoomReset":
					ZoomManager.reset();
					break;
				case "cmd_fullZoomToggle":
					ZoomManager.toggleZoom();
					break;
				case "cmd_find":
					aTab.findbar.onFindCommand();
					break;
				case "cmd_findAgain":
					aTab.findbar.onFindAgainCommand(false);
					break;
				case "cmd_findPrevious":
					aTab.findbar.onFindAgainCommand(true);
					break;
				case "cmd_printSetup":
					PrintUtils.showPageSetup();
					break;
				case "cmd_print":
					PrintUtils.print();
					break;
				// XXX print preview not currently supported - bug 497994 to implement.
				//case "cmd_printpreview":
				//  PrintUtils.printPreview();
				//  break;
				case "cmd_stop":
					aTab.browser.stop();
					break;
				case "cmd_reload":
					aTab.browser.reload();
				break;
			}
		},
		
		getBrowser: function getBrowser(aTab) {
			return aTab.browser;
		},
		
	   // Internal function used to set up the title listener on a content tab.
	   _setUpTitleListener: function setUpTitleListener(aTab) {
		 function onDOMTitleChanged(aEvent) {
		   aTab.title = aTab.browser.contentTitle;
		   document.getElementById("tabmail").setTabTitle(aTab);
		 }
		 // Save the function we'll use as listener so we can remove it later.
		 aTab.titleListener = onDOMTitleChanged;
		 // Add the listener.
		 aTab.browser.addEventListener("DOMTitleChanged", aTab.titleListener, true);
	   },

		 /**
		  * Internal function used to set up the close window listener on a content
		  * tab.
		  */
	   _setUpCloseWindowListener: function setUpCloseWindowListener(aTab) {
		 function onDOMWindowClose(aEvent) {
		   if (!aEvent.isTrusted)
			 return;

		   // Redirect any window.close events to closing the tab. As a 3-pane tab
		   // must be open, we don't need to worry about being the last tab open.
		   document.getElementById("tabmail").closeTab(aTab);
		   aEvent.preventDefault();
		 }
		 // Save the function we'll use as listener so we can remove it later.
		 aTab.closeListener = onDOMWindowClose;
		 // Add the listener.
		 aTab.browser.addEventListener("DOMWindowClose", aTab.closeListener, true);
	   }
	};
};

if ("undefined" == typeof(ovl_cardbook)) {
	var ovl_cardbook = {
		openCreateWindow: function(aDirPrefId) {
			try {
				var myPopupNode = document.popupNode;
				var myEmailNode = findEmailNodeFromPopupNode(myPopupNode, 'emailAddressPopup');
				var myEmail = myEmailNode.getAttribute('emailAddress');
				var myName = myEmailNode.getAttribute('displayName');
				if (myName == "") {
					myName = myEmail.substr(0, myEmail.indexOf("@")).replace("."," ").replace("_"," ");
				}
				var myArgs = {dirPrefId: aDirPrefId, fn: myName,
								email: myEmail,
								emailLine: [ [""], [""] ,"", [""] ], categories: [],
								quickCreationAction: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/quickCreation/wdw_quickCreation.xul", "", "chrome,modal=yes,resizable=yes,centerscreen", myArgs);
				if (myArgs.quickCreationAction == "SAVE") {
					cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
					var cardbookPrefService = new cardbookPreferenceService(myArgs.dirPrefId);
					var myDirPrefIdType = cardbookPrefService.getType();
					var myDirPrefIdName = cardbookPrefService.getName();
					var myDirPrefIdUrl = cardbookPrefService.getUrl();
					if (myArgs.uid != null && myArgs.uid !== undefined && myArgs.uid != "") {
						var myCard = cardbookRepository.cardbookCards[myArgs.dirPrefId+"::"+myArgs.uid];
						var emailArray = [];
						emailArray = JSON.parse(JSON.stringify(myCard.email));
						emailArray.push(myArgs.emailLine);
						cardbookUtils.parseEmailsCard(myCard, emailArray);
						cardbookSynchronization.importCard(myCard, myArgs.dirPrefId);
					} else {
						var myNewCard = new cardbookCardParser();
						cardbookUtils.jsInclude(["chrome://cardbook/content/uuid.js"]);
						myNewCard.uid = new UUID() + "";
						myNewCard.dirPrefId = myArgs.dirPrefId;

						myNewCard.fn = myArgs.fn;
						myNewCard.lastname = myArgs.lastname;
						myNewCard.firstname = myArgs.firstname;
						myNewCard.othername = myArgs.othername;
						myNewCard.suffixname = myArgs.suffixname;
						myNewCard.prefixname = myArgs.prefixname;
						myNewCard.nickname = myArgs.nickname;
						myNewCard.customField1NameTextBox = myArgs.customField1NameTextBox;
						myNewCard.customField2NameTextBox = myArgs.customField2NameTextBox;
						myNewCard.org = myArgs.org;
						myNewCard.title = myArgs.title;
						myNewCard.role = myArgs.role;
						myNewCard.customField1OrgTextBox = myArgs.customField1OrgTextBox;
						myNewCard.customField2OrgTextBox = myArgs.customField2OrgTextBox;
						cardbookUtils.parseEmailsCard(myNewCard, [myArgs.emailLine]);
						myNewCard.categories = myArgs.categories;
						myNewCard.version = myArgs.version;;
						cardbookUtils.addTagCreated(myNewCard);
						cardbookUtils.addEtag(myNewCard, "0");

						Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
						cardbookRepository.addCardToRepository(myNewCard, "WINDOW", cardbookUtils.getFileCacheNameFromCard(myNewCard, myDirPrefIdType));
					}
					if (myDirPrefIdType === "FILE") {
						cardbookSynchronization.writeCardsToFile(myDirPrefIdUrl, cardbookRepository.cardbookDisplayCards[myArgs.dirPrefId], true);
					}
					
					var myEmailNode = findEmailNodeFromPopupNode(myPopupNode, 'emailAddressPopup');
					var myEmail = myEmailNode.getAttribute('emailAddress');
					UpdateEmailNodeDetails(myEmail, myEmailNode);
				}
			}
			catch (e) {
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
				var errorTitle = "openCreateWindow";
				prompts.alert(null, errorTitle, e);
			}
		},

		addToCardbookMenuSubMenu: function() {
			try {
				var myPopup = document.getElementById("addToCardbookMenuPopup");
				while (myPopup.hasChildNodes()) {
					myPopup.removeChild(myPopup.firstChild);
				}
				for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
					if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][6]) {
						var menuItem = document.createElement("menuitem");
						menuItem.setAttribute("id", cardbookRepository.cardbookAccounts[i][4]);
						menuItem.addEventListener("command", function()
							{
								ovl_cardbook.openCreateWindow(this.id);
							}, false);
						menuItem.setAttribute("label", cardbookRepository.cardbookAccounts[i][0]);
						myPopup.appendChild(menuItem);
					}
				}
			}
			catch (e) {
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
				var errorTitle = "addToCardbookMenuSubMenu";
				prompts.alert(null, errorTitle, e);
			}
		},

		open: function() {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var panesView = prefs.getComplexValue("extensions.cardbook.panesView", Components.interfaces.nsISupportsString).data;
			var myWindow = "";
			if (panesView === "classical") {
				myWindow = "chrome://cardbook/content/wdw_cardbook.xul";
			} else if (panesView === "modern") {
				myWindow = "chrome://cardbook/content/wdw_cardbook1.xul";
			} else {
				myWindow = "chrome://cardbook/content/wdw_cardbook.xul";
			}
			document.getElementById('tabmail').openTab('cardbookTab', {contentPage: myWindow});
		}
	};
};

window.addEventListener("load", function(e) {
	let tabmail = document.getElementById('tabmail');
	if (tabmail) {
		tabmail.registerTabType(cardbookTabType);
	}

	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	var firstRun = prefs.getBoolPref("extensions.cardbook.firstRun");

	if (firstRun) {
		var toolbar = document.getElementById("mail-bar3");
		if (toolbar) {
			var toolbarItems = toolbar.currentSet.split(",");
			var found = false;
			for (var i=0; i<toolbarItems.length; i++) {
				if (toolbarItems[i] == "cardbookToolbarButton") {
					found = true;
					break;
				}
			}
			if (!found) {
				toolbar.insertItem("cardbookToolbarButton");
				toolbar.setAttribute("currentset", toolbar.currentSet);
				document.persist(toolbar.id, "currentset");
			}
		}
		prefs.setBoolPref("extensions.cardbook.firstRun", false);
	}
}, false);

Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
