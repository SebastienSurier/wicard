

if ("undefined" == typeof(cardbookImap)) {
	var cardbookImap = {
		imapAccounts : [],
		imapFolders : [],
		syncImapAccount : {},
		syncImapFolder : {},
		draftFolder : {},
		message: {},
		aModifiedCard: {},

		// permettra d'ecrire un message en fonction de la modification subit
		writeModification: function(aCard, modification) {
			
			var myPrefId = cardbookUtils.getAccountId(cardbookRepository.cardbookImapCardsId);
			var cardbookPrefService = new cardbookPreferenceService(myPrefId);
			var dirPrefIdName = cardbookPrefService.getName();
			var dirPrefIdUrl = cardbookPrefService.getUrl();  // imap dir
			cardbookImap.loadSyncData(dirPrefIdUrl);
			//cardbookUtils.addTagFromImapSync(aCard);
			var cacheDir = cardbookRepository.getLocalDirectory();
			cacheDir.append(aCard.dirPrefId);

			var card = cardbookUtils.cardToVcardData(aCard, true);
			wdw_cardbooklog.updateStatusProgressInformation(JSON.stringify(aCard));
			switch (modification) {
				case "CREATE":
					console.log(' detection CREATE');
					wdw_cardbooklog.updateStatusProgressInformation('detection CREATE');
					cardbookImap.createMsg('CREATE', cacheDir.path + "/", aCard.uid, card);
			
					break;
				case "UPDATE":
					console.log('detection UPDATE');
					wdw_cardbooklog.updateStatusProgressInformation('detection UPDATE');
					cardbookImap.createMsg('UPDATE', cacheDir.path + "/", aCard.uid, card);

					break;
				case "DELETE":
					console.log('detection DELETE');
					wdw_cardbooklog.updateStatusProgressInformation('detection DELETE');

					cardbookImap.createMsg('DELETE', cacheDir.path + "/", aCard.uid, card);

					break;
				default:
					console.log('ERREUR cardbookImap');
					wdw_cardbooklog.updateStatusProgressInformation('cardbookImap.writeModification error.');
					break;
			}
		},

		loadSyncData: function(url) {
			cardbookImap.getAccounts();
			for (var i = 0; i < cardbookImap.imapAccounts.length; i++) {
				var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"]
                        .getService(Components.interfaces.nsIMsgAccountManager);
            	var accounts = acctMgr.accounts;
	            if (accounts.queryElementAt) {
				  // Gecko 17+
					for (var i = 0; i < accounts.length; i++) {
					    var account = accounts.queryElementAt(i, Components.interfaces.nsIMsgAccount);
					    if (account.incomingServer.localStoreType === "imap") {
					    	var rootFolder = account.incomingServer.rootFolder; 
							if (rootFolder.hasSubFolders) {
								var subFolders = rootFolder.subFolders; 
								while(subFolders.hasMoreElements()) {
									var folder = subFolders.getNext().QueryInterface(Components.interfaces.nsIMsgFolder);
									if (folder.getFlag(0x00000400)) {
										cardbookImap.draftFolder = folder;
									}
									if ((folder.folderURL+"/") === url) {
										cardbookImap.syncImapFolder = folder;
										cardbookImap.syncImapAccount = cardbookImap.imapAccounts[i];
									}
								}
							}
						}
					}
				}
			} 
		},

		// rempli le tableau 'imapAccounts' avec les comptes trouvés
		getAccounts: function() {
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
		},

		searchAccounts: function() {
			cardbookImap.getAccounts();
			console.log('searchAccounts');
			wdw_cardbooklog.updateStatusProgressInformation('searchAccounts');
			cardbookImap.displayAccounts();
		},

		// rempli le tableau 'imapFolders' avec les dossiers trouvés pour le compte selectionné
		searchFolders: function(accountIndex) {
			cardbookImap.imapFolders = [];
			cardbookImap.syncImapAccount = cardbookImap.imapAccounts[accountIndex];
			
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
								}
							}
						}
				    }
				}
			} else {
				wdw_cardbooklog.updateStatusProgressInformation('Gecko < 17');
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
			cardbookImap.syncImapFolder = cardbookImap.imapFolders[index];
			wdw_addressbooksAdd.checklocationNetwork();
		},

		removeTmpDir: function(path) {
			var tmpDir = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
			tmpDir.initWithPath(path);
			tmpDir.remove(true);
		},

		// creer notre message 
		createMsg: function(objet, path, uidCard, card) { 
			Components.utils.import("resource:///modules/mailServices.js");
			var params = Components.classes["@mozilla.org/messengercompose/composeparams;1"].createInstance(Components.interfaces.nsIMsgComposeParams);
			var composeFields = params.composeFields = Components.classes["@mozilla.org/messengercompose/composefields;1"].createInstance(Components.interfaces.nsIMsgCompFields);
			var securityInfo = params.composeFields.securityInfo = Components.classes["@mozilla.org/messenger-smime/composefields;1"].createInstance(Components.interfaces.nsIMsgSMIMECompFields);
			
			composeFields.QueryInterface( Components.interfaces.nsIMsgCompFields);
  			composeFields.characterSet = 'UTF-8';
  			composeFields.messageId = objet + " " + uidCard;
  			composeFields.subject = objet + " card : Don't remove and keep this message in the " + cardbookImap.syncImapFolder.name;
			composeFields.body = JSON.stringify(card);

			wdw_cardbooklog.updateStatusProgressInformation("messageId = " + composeFields.messageId);
			  
			var attachment = Components.classes["@mozilla.org/messengercompose/attachment;1"].createInstance(Components.interfaces.nsIMsgAttachment);
			//attachment.url = "Users/Seb/Desktop/C7177945-3070-0001-3FA5-11EACA901E4A.vcf";
			//attachment.url = path + uidCard+".vcf";

			// attachment.name = "test.vcf";
			// composeFields.addAttachment(attachment);

			composeFields.bodyIsAsciiOnly = true;
			composeFields.forcePlainText = true;
			composeFields.attachVCard = false;
			
			securityInfo.requireEncryptMessage=false;
			securityInfo.signMessage=false; 
			
			var msgInit = MailServices.compose.initCompose(params);
			var identity = MailServices.accounts.FindAccountForServer(cardbookImap.syncImapAccount.incomingServer.rootFolder.server);
			msgInit.SendMsg(Components.interfaces.nsIMsgCompDeliverMode.SaveAsDraft, identity.defaultIdentity, identity.key, null, null);
			wdw_cardbooklog.updateStatusProgressInformation('createMsg');
			lTimerLoadFile = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			lTimerLoadFile.initWithCallback({ notify: function(lTimerLoadFile) { cardbookImap.moveMsgToFolder()} }, 2000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
		},

		// deplace le message du draft vers notre repertoire selectionné
		moveMsgToFolder: function() {
			// msg, srcFolder /*draft*/
			
			var msg = cardbookImap.draftFolder.messages;
			while (msg.hasMoreElements()) {
				
				var unMsg = msg.getNext().QueryInterface(Components.interfaces.nsIMsgDBHdr);
				var tab = unMsg.subject.split(" : ");
				if (tab[1] ===  "Don't remove and keep this message in the " + cardbookImap.syncImapFolder.name) {
					wdw_cardbooklog.updateStatusProgressInformation('moveMsgToFolder 1 = un msg pour la synchro = ' + unMsg.subject);
					var messages = Components.classes["@mozilla.org/array;1"].createInstance(Components.interfaces.nsIMutableArray);
					messages.appendElement(unMsg, false);
				    // move the message
				    cardbookImap.syncImapFolder.copyMessages(cardbookImap.draftFolder, messages, true, null, null, false, false); 
				} else {
					wdw_cardbooklog.updateStatusProgressInformation('moveMsgToFolder 1 = un msg du brouillon = ' + unMsg.subject);
				}
				wdw_cardbooklog.updateStatusProgressInformation('moveMsgToFolder 2');
			}
			
		},    

		getMsgBody: function(aMessageHeader)  {  
			var messenger = Components.classes["@mozilla.org/messenger;1"].createInstance(Components.interfaces.nsIMessenger);  
			var listener = Components.classes["@mozilla.org/network/sync-stream-listener;1"].createInstance(Components.interfaces.nsISyncStreamListener);  
			var uri = aMessageHeader.folder.getUriForMsg(aMessageHeader);  
			messenger.messageServiceFromURI(uri).streamMessage(uri, listener, null, null, false, "");  
			var folder = aMessageHeader.folder;  
			var txt = folder.getMsgTextFromStream(listener.inputStream, aMessageHeader.Charset, 65536, 32768, false, true, { });  
			var tab = txt.split("\\r\\n");
			var texte = "";
			for (var i = 0; i < tab.length; i++) {
				texte = texte + tab[i] + "\r\n";
			}
			texte = texte.split("\"").join("");
			wdw_cardbooklog.updateStatusProgressInformation("getMsgBody = " + JSON.stringify(texte));
			return texte;
		}, 

		syncAccount: function() {
			wdw_cardbooklog.updateStatusProgressInformation('Sync Imap');
			var myPrefId = cardbookUtils.getAccountId(cardbookRepository.cardbookImapCardsId);
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService(myPrefId);
			//var dirPrefIdName = cardbookPrefService.getName();
			//var dirPrefIdType = cardbookPrefService.getType();
			var dirPrefIdUrl = cardbookPrefService.getUrl();  // imap dir
			var date = new Date();
			var lastImapSync = cardbookPrefService.getLastImapSync();
			cardbookPrefService.setLastImapSync(date.getTime());
			cardbookImap.loadSyncData(dirPrefIdUrl);

			var messages = cardbookImap.syncImapFolder.messages;
			while (messages.hasMoreElements()) {  // lit les messages mails
				var unMsg = messages.getNext().QueryInterface(Components.interfaces.nsIMsgDBHdr);
				var dateMsg = JSON.stringify(unMsg.date).substring(0,lastImapSync.length);
				if (dateMsg >= lastImapSync) {
					wdw_cardbooklog.updateStatusProgressInformation('messsage plus recent dateMsg= ' + dateMsg + ' dateSync= ' + lastImapSync);
					var body = cardbookImap.getMsgBody(unMsg);
					cardbookImap.message = unMsg;



					var cacheDir = cardbookRepository.getLocalDirectory();
					cacheDir.append(cardbookRepository.cardbookImapCardsId);
					if (cacheDir.exists() && cacheDir.isDirectory()) {
						cacheDir.append("tmp");
						var tmpPath = cacheDir.path;
						if (cacheDir.exists() == false){
						 	cacheDir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);
						}
						cacheDir.append(cardbookImap.message.messageId + ".vcf");
						if (cacheDir.exists() == false){
							cacheDir.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
						}
						cardbookSynchronization.writeContentToFile(cacheDir.path, body, "UTF8");
						var cardMsg = new cardbookCardParser(body, "", "", myPrefId);
						//wdw_cardbooklog.updateStatusProgressInformation("body= " + body);
						//wdw_cardbooklog.updateStatusProgressInformation("my card= " + JSON.stringify(myCard));
						//cardbookSynchronization.writeCardsToFile(cacheDir.path, myCard, "UTF8");
						


						// var saveto = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
						// saveto.initWithPath("/Users/Seb/Library/Thunderbird/Profiles/343h4otp.default/cardbook/ImapBook/tmp");

						// var uri = unMsg.folder.getUriForMsg(unMsg); 

						// wdw_cardbooklog.updateStatusProgressInformation('DDD ' + uri);
						// var messenger = Components.classes["@mozilla.org/messenger;1"].createInstance(Components.interfaces.nsIMessenger);  
						// var file = messenger.saveAttachmentToFolder("contentType", "url", cardbookImap.message.messageId + ".vcf", uri, saveto);

						//wdw_cardbooklog.updateStatusProgressInformation(JSON.stringify(saveto));

						wdw_cardbooklog.updateStatusProgressInformation('Avant' + cacheDir.path);
						cardbookImap.readModification(cardMsg);
						cardbookImap.removeTmpDir(tmpPath);
					}
					
					
					
					wdw_cardbooklog.updateStatusProgressInformation('Apres');
				} else {
					wdw_cardbooklog.updateStatusProgressInformation('message plus vieu ' + unMsg.subject + " - " + body);
				}
			}
		}, 

		// permet de lire un message recu
		readModification: function(cardMsg) {
			wdw_cardbooklog.updateStatusProgressInformation("readModification");
			var messageId = cardbookImap.message.messageId; 
			var tab = messageId.split(" ");
			var modification = tab[0];
			var uidMsg = tab[1];
			var isFound = false;
			var cardLocal;
			cardbookUtils.addTagFromImapSync(cardMsg);
			wdw_cardbooklog.updateStatusProgressInformation(JSON.stringify(messageId) + 'modif= ' + modification + " - uid = " + uidMsg);
			if (uidMsg != null && uidMsg !== undefined && uidMsg != "") {
				cardLocal = cardbookImap.searchCard(uidMsg);

				if (cardLocal != null && cardLocal !== undefined && cardLocal != "") {
					wdw_cardbooklog.updateStatusProgressInformation('card trouvée' + JSON.stringify(cardLocal));
					isFound = true;
				} else {
					wdw_cardbooklog.updateStatusProgressInformation('card non trouvée');
				}

				switch (modification) {
					case "CREATE":
						console.log(' read CREATE');
						wdw_cardbooklog.updateStatusProgressInformation('read CREATE');
						if (!isFound) {
							wdw_cardbooklog.updateStatusProgressInformation("il faut ajouter la card ici");
							cardbookImap.createCard(cardMsg);
						} else {
							wdw_cardbooklog.updateStatusProgressInformation('ERROR : il existe déjà  une card avec cet UID = ' + uidMsg);
						}
						
				
						break;
					case "UPDATE":
						console.log('read UPDATE');
						wdw_cardbooklog.updateStatusProgressInformation('read UPDATE');
						if (isFound) {
							wdw_cardbooklog.updateStatusProgressInformation("il faut fusionner les card ici");
							cardbookImap.updateCard(cardLocal, cardMsg);
						} else {
							wdw_cardbooklog.updateStatusProgressInformation("aucune card trouvée avec l'UID = " + uidMsg + "Elle vient d'être ajoutée");
							cardbookImap.createCard(cardMsg);
						}

						break;
					case "DELETE":
						console.log('read DELETE');
						wdw_cardbooklog.updateStatusProgressInformation('read DELETE');
						if (isFound) {
							wdw_cardbooklog.updateStatusProgressInformation("il faut supprimer la card ici");
							cardbookImap.deleteCard(cardLocal);
						} else {
							wdw_cardbooklog.updateStatusProgressInformation("ERROR : aucune card trouvée avec l'UID = " + uidMsg);
						}
						

						break;
					default:
						console.log('ERREUR cardbookImap');
						wdw_cardbooklog.updateStatusProgressInformation('cardbookImap.readModification error. : erreur recuperation type de modification');
						break;
				}
			} else {
				wdw_cardbooklog.updateStatusProgressInformation('cardbookImap.readModification error. : erreur recuperation UID');
			}
		},



		searchCard: function(uid) {
			var card = "";
			for (var i = 0; i < cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookImapCardsId].length; i++) {
				card = cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookImapCardsId][i];
				if (card.uid === uid) {
					wdw_cardbooklog.updateStatusProgressInformation('searchCard3= la card existe' + JSON.stringify(card));
					cardbookImap.aModifiedCard = card;
					return card;
				} else {
					wdw_cardbooklog.updateStatusProgressInformation("searchCard3= la card n'existe pas");
					cardbookImap.aModifiedCard = null;
				}
			}
			return "";
		}, 

		createCard: function(cardMsg) {
			try {
				wdw_cardbook.saveCard(cardMsg);
			} catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookImap.createCard error : " + e);
			}
		},

		updateCard: function(cardLocal, cardMsg) {
			try {
				var aListOfCards = [];
				aListOfCards.push(cardMsg);
				aListOfCards.push(cardLocal);


				var myArgs = {cardsIn: aListOfCards, cardsOut: [], action: ""};
				var myWindow = window.openDialog("chrome://cardbook/content/wdw_mergeCards.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
				if (myArgs.action == "CREATE") {
					wdw_cardbook.saveCard(myArgs.cardsOut[0]);
				} else if (myArgs.action == "CREATEANDREPLACE") {
					wdw_cardbook.saveCard(myArgs.cardsOut[0]);
					wdw_cardbook.deleteCards(myArgs.cardsIn);
				}
			} catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookImap.updateCard error : " + e);
			}
		},

		deleteCard: function(card) {
			try {
				var aListOfCards = [];
				aListOfCards.push(card);
				wdw_cardbook.deleteCards(aListOfCards, "FROMIMAP");
			} catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookImap.deleteCard error : " + e);
			}
		},

	}
}