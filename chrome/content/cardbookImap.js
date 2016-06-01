

if ("undefined" == typeof(cardbookImap)) {
	var cardbookImap = {
		imapAccounts : [],
		imapFolders : [],
		syncAccount : {},
		syncFolder : {},
		draftFolder : {},

		// permettra d'ecrire un message en fonction de la modification subit
		writeModification: function(aCard, modification) {
			switch (modification) {
				case "CREATE":
					console.log(' detection CREATE');
					wdw_cardbooklog.updateStatusProgressInformation('detection CREATE');
					break;
				case "UPDATE":
					console.log('detection UPDATE');
					wdw_cardbooklog.updateStatusProgressInformation('detection UPDATE');
					break;
				case "DELETE":
					console.log('detection DELETE');
					wdw_cardbooklog.updateStatusProgressInformation('detection DELETE');
					break;
				default:
					console.log('ERREUR cardbookImap');
					wdw_cardbooklog.updateStatusProgressInformation('ERREUR cardbookImap');
					break;
			}
		},

		//test ne sert a rien 
		test: function() {
			console.log('test');
			wdw_cardbooklog.updateStatusProgressInformation('test');
			//var test = JSON.parse(localStorage.getItem('syncFolder'));
			//wdw_cardbooklog.updateStatusProgressInformation(test);

		},

		// rempli le tableau 'imapAccounts' avec les comptes trouvés
		searchAccounts: function() {
			cardbookImap.imapAccounts = [];
			var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"]
                        .getService(Components.interfaces.nsIMsgAccountManager);
            var accounts = acctMgr.accounts;
            if (accounts.queryElementAt) {
			  // Gecko 17+
				for (var i = 0; i < accounts.length; i++) {
				    var account = accounts.queryElementAt(i, Components.interfaces.nsIMsgAccount);
				    if (account.incomingServer.localStoreType === "imap") {
				    	cardbookImap.imapAccounts.push(account);
				    }
				}
			} else {
			 	 // Gecko < 17
				for (var i = 0; i < accounts.Count(); i++) {
					var account = accounts.QueryElementAt(i, Components.interfaces.nsIMsgAccount);
					wdw_cardbooklog.updateStatusProgressInformation('Gecko < 17');
				}
			}
			console.log('searchAccounts');
			wdw_cardbooklog.updateStatusProgressInformation('searchAccounts');
			cardbookImap.displayAccounts();
		},

		// rempli le tableau 'imapFolders' avec les dossiers trouvés pour le compte selectionné
		searchFolders: function(accountIndex) {
			cardbookImap.imapFolders = [];
			cardbookImap.syncAccount = cardbookImap.imapAccounts[accountIndex];
			
			var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"]
                        .getService(Components.interfaces.nsIMsgAccountManager);
            var accounts = acctMgr.accounts;
            if (accounts.queryElementAt) {
			  // Gecko 17+
				for (var i = 0; i < accounts.length; i++) {
				    var account = accounts.queryElementAt(i, Components.interfaces.nsIMsgAccount);
				    if (account.incomingServer.localStoreType === "imap" && account.incomingServer.username === cardbookImap.imapAccounts[accountIndex].incomingServer.username) {
				    	var rootFolder = account.incomingServer.rootFolder; 
						if (rootFolder.hasSubFolders) {
							var subFolders = rootFolder.subFolders; 
							while(subFolders.hasMoreElements()) {
								var folder = subFolders.getNext().QueryInterface(Components.interfaces.nsIMsgFolder);
								cardbookImap.imapFolders.push(folder);
								if (folder.getFlag(0x00000400)) {
									cardbookImap.draftFolder = folder;
									wdw_cardbooklog.updateStatusProgressInformation("draft");
								} else {
									wdw_cardbooklog.updateStatusProgressInformation("non draft");
								}
								wdw_cardbooklog.updateStatusProgressInformation(folder.folderURL);
								wdw_cardbooklog.updateStatusProgressInformation(folder.flags);
							}
						}
				    }
				}
			} else {
			 	 // Gecko < 17
				for (var i = 0; i < accounts.Count(); i++) {
					var account = accounts.QueryElementAt(i, Components.interfaces.nsIMsgAccount);
					wdw_cardbooklog.updateStatusProgressInformation('Gecko < 17');
				}
			}
			wdw_cardbooklog.updateStatusProgressInformation('searchFolders');
			cardbookImap.displayFolders();
		},

		// modifie le xul pour afficher la liste des comptes 
		displayAccounts: function() {
			const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
			var menupopup = document.getElementById('locationNetworkPageImapAccountPopup');
			var menulist = document.getElementById('locationNetworkPageImapAccount');
			var docfrag = document.createDocumentFragment();


			//vide le memupopup
			while(menupopup.hasChildNodes())
  				menupopup.removeChild(menupopup.firstChild);

  			for( var account in cardbookImap.imapAccounts) {
				var item = document.createElementNS(XUL_NS,'menuitem');
				item.setAttribute('label', cardbookImap.imapAccounts[account].incomingServer.username);
				item.setAttribute('value', cardbookImap.imapAccounts[account].incomingServer.username);
				docfrag.appendChild(item);	
			}
			menupopup.appendChild(docfrag);
			menulist.setAttribute('selectedIndex', 0);	
			wdw_cardbooklog.updateStatusProgressInformation('displayAccounts');

		},

		// modifie le xul pour afficher la liste des dossiers 
		displayFolders: function() {
			const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
			var menupopup = document.getElementById('locationNetworkPageImapFolderPopup');
			var menulist = document.getElementById('locationNetworkPageImapFolder');
			var docfrag = document.createDocumentFragment();

			//vide le memupopup
			while(menupopup.hasChildNodes())
  				menupopup.removeChild(menupopup.firstChild);

  			wdw_cardbooklog.updateStatusProgressInformation(cardbookImap.imapFolders.length);
  			for( var folder in cardbookImap.imapFolders) {
				var item = document.createElementNS(XUL_NS,'menuitem');
				wdw_cardbooklog.updateStatusProgressInformation(cardbookImap.imapFolders[folder].prettiestName);
				item.setAttribute('label', cardbookImap.imapFolders[folder].prettiestName);
				item.setAttribute('value', cardbookImap.imapFolders[folder].prettiestName);
				docfrag.appendChild(item);	
			}
			menupopup.appendChild(docfrag);
			menulist.setAttribute('selectedIndex', 0);
			wdw_cardbooklog.updateStatusProgressInformation('displayFolders');
		}, 

		// enregistre dans l'objet le compte et le dossier selctionnés
		saveSync: function(index) {
			cardbookImap.syncFolder = cardbookImap.imapFolders[index];
			wdw_cardbooklog.updateStatusProgressInformation("saveSync = " + cardbookImap.syncFolder + " - " + cardbookImap.syncAccount);
			var cacheDir = cardbookRepository.getLocalDirectory();
			wdw_cardbooklog.updateStatusProgressInformation("cacheDir = " + cacheDir);
			//document.getElementById('validateButton').disabled = false;
			wdw_addressbooksAdd.checklocationNetwork();
			wdw_cardbooklog.updateStatusProgressInformation('createMsg 0');
			//var cache = window.caches;
			//localStorage.setItem('syncFolder', JSON.stringify(cardbookImap.syncFolder));
			//wdw_cardbooklog.updateStatusProgressInformation(JSON.stringify(cardbookImap.syncFolder.folderURL));
			//cardbookImap.writeFile(JSON.stringify(cardbookImap.syncFolder.folderURL));
			//cardbookImap.reaeFile();
			//cardbookImap.createMsg();
		},

		// creer notre message 
		createMsg: function () { 
			Components.utils.import("resource:///modules/mailServices.js");
			wdw_cardbooklog.updateStatusProgressInformation('createMsg 1' + cardbookImap.syncFolder.username);
			var params = Components.classes["@mozilla.org/messengercompose/composeparams;1"].createInstance(Components.interfaces.nsIMsgComposeParams);
			var composeFields = params.composeFields = Components.classes["@mozilla.org/messengercompose/composefields;1"].createInstance(Components.interfaces.nsIMsgCompFields);
			var securityInfo = params.composeFields.securityInfo = Components.classes["@mozilla.org/messenger-smime/composefields;1"].createInstance(Components.interfaces.nsIMsgSMIMECompFields);
			wdw_cardbooklog.updateStatusProgressInformation('createMsg 11');
			
			composeFields.QueryInterface( Components.interfaces.nsIMsgCompFields);
  			composeFields.characterSet = 'UTF-8';
  			composeFields.messageId = cardbookImap.getMsgId("test");
  			composeFields.subject = 'Cardbook: test creation message';
			composeFields.body = 'TEST CREATION';
			composeFields.bodyIsAsciiOnly = true;
			composeFields.forcePlainText = true;
			composeFields.attachVCard = false;
			
			securityInfo.requireEncryptMessage=false;
			securityInfo.signMessage=false; 
			
			wdw_cardbooklog.updateStatusProgressInformation('createMsg 12');

			var msgInit = MailServices.compose.initCompose(params);
			wdw_cardbooklog.updateStatusProgressInformation('createMsg 13');
			var identity = MailServices.accounts.FindAccountForServer(cardbookImap.syncAccount.incomingServer.rootFolder.server);
			wdw_cardbooklog.updateStatusProgressInformation('createMsg 14');
			msgInit.SendMsg(Components.interfaces.nsIMsgCompDeliverMode.SaveAsDraft, identity.defaultIdentity, identity.key, null, null);
			wdw_cardbooklog.updateStatusProgressInformation('createMsg 2');
			cardbookImap.moveMsgToFolder();
		},

		// deplace le message du draft vers notre repoertoire selectionné
		moveMsgToFolder: function() {
			// msg, srcFolder /*draft*/
			
			var msg = cardbookImap.draftFolder.messages;
			wdw_cardbooklog.updateStatusProgressInformation(msg.length);
			while (msg.hasMoreElements()) {
				var unMsg = msg.getNext().QueryInterface(Components.interfaces.nsIMsgDBHdr);
			}
			var messages = Components.classes["@mozilla.org/array;1"].createInstance(Components.interfaces.nsIMutableArray);
			messages.appendElement(unMsg, false);
		    // move the message
		    cardbookImap.syncFolder.copyMessages(cardbookImap.draftFolder, messages, true, null, null, false, false); 
			wdw_cardbooklog.updateStatusProgressInformation('moveMsgToFolder');
		},    

		// sert à rien pour l'instant 
		getMsgId: function(name) {
			return encodeURI(name+'@Cardbook');
		},

		// recupere l'url de notre dossier de synchronisation
		getUrl: function () {
			return cardbookImap.syncFolder.folderURL;
		}
	}
}