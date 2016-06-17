

if ("undefined" == typeof(cardbookImap)) {
	var cardbookImap = {
		imapAccounts : [],
		imapFolders : [],
		syncImapAccount : {},
		syncImapFolder : {},
		draftFolder : {},
		message: {},
		repeatTime: 2000,


		/*****************************************/
		/** BEGIN : Use to add addressbook Imap **/
		/*****************************************/

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
				wdw_cardbooklog.updateStatusProgressInformation('ERROR : Gecko < 17');
			}
		},

		searchAccounts: function() {
			wdw_cardbooklog.updateStatusProgressInformation('searchAccounts');
			cardbookImap.getAccounts();
			cardbookImap.displayAccounts();
		},

		// rempli le tableau 'imapFolders' avec les dossiers trouvés pour le compte selectionné
		searchFolders: function(accountIndex) {
			wdw_cardbooklog.updateStatusProgressInformation('searchFolders');
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
				    	cardbookImap.exploreFolder(rootFolder, null, i);
				    }
				}
			} else {
				wdw_cardbooklog.updateStatusProgressInformation('ERROR : Gecko < 17');
			}
			cardbookImap.displayFolders();
		},

		exploreFolder(rootFolder, url, i) {
			if (rootFolder.hasSubFolders) {
				var subFolders = rootFolder.subFolders; 
				while(subFolders.hasMoreElements()) {
					var folder = subFolders.getNext().QueryInterface(Components.interfaces.nsIMsgFolder);
					cardbookImap.exploreFolder(folder, url, i);
					cardbookImap.imapFolders.push(folder);
					if (folder.getFlag(0x00000400)) {
						cardbookImap.draftFolder = folder;
					}
					if (url !== null && (folder.folderURL+"/") === url) {
						cardbookImap.syncImapFolder = folder;
						cardbookImap.syncImapAccount = cardbookImap.imapAccounts[i];
					}
				}
			}
		},

		// modifie le xul pour afficher la liste des comptes 
		displayAccounts: function() {
			wdw_cardbooklog.updateStatusProgressInformation('displayAccounts');
			const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
			var menupopup = document.getElementById('locationNetworkPageImapAccountPopup');
			var menulist = document.getElementById('locationNetworkPageImapAccount');
			var docfrag = document.createDocumentFragment();


			// vide le memupopup
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
		},

		// modifie le xul pour afficher la liste des dossiers 
		displayFolders: function() {
			wdw_cardbooklog.updateStatusProgressInformation('displayFolders');
			const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
			var menupopup = document.getElementById('locationNetworkPageImapFolderPopup');
			var menulist = document.getElementById('locationNetworkPageImapFolder');
			var docfrag = document.createDocumentFragment();

			// vide le memupopup
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
		}, 

		// retourne l'url du dossier Imap de synchronisation
		getUrl: function() {
			 return cardbookImap.syncImapFolder.folderURL;
		},

		// enregistre dans l'objet le compte et le dossier selctionnés
		saveSync: function(index) {
			cardbookImap.syncImapFolder = cardbookImap.imapFolders[index]; 
			wdw_addressbooksAdd.checklocationNetwork();
		},

		/***************************************/
		/** END : Use to add addressbook Imap **/
		/***************************************/


		/***********************************/
		/** Load data for synchronization **/
		/***********************************/

		loadSyncData: function(url) {
			wdw_cardbooklog.updateStatusProgressInformation('cardbookImap.loadSyncData');
			cardbookImap.getAccounts();
			for (var i = 0; i < cardbookImap.imapAccounts.length; i++) {
				var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"]
                        .getService(Components.interfaces.nsIMsgAccountManager);
            	var accounts = acctMgr.accounts;
	            if (accounts.queryElementAt) {
				  // Gecko 17+
					for (var j = 0; j < accounts.length; j++) {
					    var account = accounts.queryElementAt(j, Components.interfaces.nsIMsgAccount);
					    if (account.incomingServer.localStoreType === "imap") {
					    	var rootFolder = account.incomingServer.rootFolder; 
							cardbookImap.exploreFolder(rootFolder, url, i);
						}
					}
				}
			} 
		},


		/***********************************/
		/** BEGIN : Use to sync with Imap **/
		/***********************************/

		/************************/
		/** Write modification **/
		/************************/

		// permet d'ecrire un message en fonction de la modification subit
		writeModification: function(aCard, modification) {
			var myPrefId = cardbookUtils.getAccountId(cardbookRepository.cardbookImapCardsId);
			var cardbookPrefService = new cardbookPreferenceService(myPrefId);
			var dirPrefIdName = cardbookPrefService.getName();
			var dirPrefIdUrl = cardbookPrefService.getUrl();  // imap dir
			cardbookImap.loadSyncData(dirPrefIdUrl);
			var cacheDir = cardbookRepository.getLocalDirectory();
			cacheDir.append(aCard.dirPrefId);
			var cardData = cardbookUtils.cardToVcardData(aCard, true);
			var networkLinkService = Components.classes["@mozilla.org/network/network-link-service;1"].getService(Components.interfaces.nsINetworkLinkService);           

            wdw_cardbooklog.updateStatusProgressInformation('detection ' + modification);
            if (networkLinkService.isLinkUp) {
            	wdw_cardbooklog.updateStatusProgressInformation('writeModification connexion');
				cardbookImap.createMsg(modification, aCard.uid, cardData);
				lTimerLoadFile = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
				lTimerLoadFile.initWithCallback({ notify: function(lTimerLoadFile) { cardbookImap.moveMsgToFolder()} }, 2000, Components.interfaces.nsITimer.TYPE_ONE_SHOT); 
				lTimerLoadFile.initWithCallback({ notify: function(lTimerLoadFile) { cardbookImap.moveMsgToFolder()} }, cardbookImap.repeatTime, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK); 
			} else {
				wdw_cardbooklog.updateStatusProgressInformation('writeModification pas de connexion');
				cardbookImap.saveInFile(modification, aCard.uid, cardData);
				lTimerLoadFile = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
				lTimerLoadFile.initWithCallback({ notify: function(lTimerLoadFile) { cardbookImap.detectConnexion()} }, 2000, Components.interfaces.nsITimer.TYPE_ONE_SHOT); 
				lTimerLoadFile.initWithCallback({ notify: function(lTimerLoadFile) { cardbookImap.detectConnexion()} }, cardbookImap.repeatTime, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK); 
			}
		},

		// creer notre message et l'envoie dans le brouillon
		createMsg: function(objet, uidCard, cardData) { 
			wdw_cardbooklog.updateStatusProgressInformation("createMsg" + JSON.stringify(cardData));
			
			try {
				Components.utils.import("resource:///modules/mailServices.js");
				var params = Components.classes["@mozilla.org/messengercompose/composeparams;1"].createInstance(Components.interfaces.nsIMsgComposeParams);
				var composeFields = params.composeFields = Components.classes["@mozilla.org/messengercompose/composefields;1"].createInstance(Components.interfaces.nsIMsgCompFields);
				var securityInfo = params.composeFields.securityInfo = Components.classes["@mozilla.org/messenger-smime/composefields;1"].createInstance(Components.interfaces.nsIMsgSMIMECompFields);
				
				composeFields.QueryInterface( Components.interfaces.nsIMsgCompFields);
	  			composeFields.characterSet = 'UTF-8';
	  			composeFields.messageId = objet + " " + uidCard;
	  			composeFields.subject = objet + " card : Don't remove and keep this message in the " + cardbookImap.syncImapFolder.name;
				var body = JSON.stringify(cardData);
				body = body.split(" ").join("@###@");
				composeFields.body = body;
				composeFields.bodyIsAsciiOnly = true;
				composeFields.forcePlainText = true;
				composeFields.attachVCard = false;
				
				securityInfo.requireEncryptMessage=false;
				securityInfo.signMessage=false; 
				
				var msgInit = MailServices.compose.initCompose(params);  //nsIMsgCompose
				var identity = MailServices.accounts.FindAccountForServer(cardbookImap.syncImapAccount.incomingServer.rootFolder.server);
				msgInit.SendMsg(Components.interfaces.nsIMsgCompDeliverMode.SaveAsDraft, identity.defaultIdentity, identity.key, null, null);
				lTimerLoadFile = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
				lTimerLoadFile.initWithCallback({ notify: function(lTimerLoadFile) { cardbookImap.moveMsgToFolder()} }, 2000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
				lTimerLoadFile.initWithCallback({ notify: function(lTimerLoadFile) { cardbookImap.moveMsgToFolder()} }, cardbookImap.repeatTime, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK); //TYPE_ONE_SHOT TYPE_REPEATING_SLACK
			} catch(e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookImap.createMsg error : " + e);
			}
		},

		// deplace le message du draft vers notre repertoire selectionné
		moveMsgToFolder: function() {
			wdw_cardbooklog.updateStatusProgressInformation('moveMsgToFolder');
			try {
				var msg = cardbookImap.draftFolder.messages;
				if (msg !== undefined) {
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
					}
				}
			} catch(e) {
				wdw_cardbooklog.updateStatusProgressInformation("wdw_cardbook.moveMsgToFolder error : " + e);
			}
		},   

		// Synchronise le carnet d'adresse 
		syncAccount: function(stopTime, rebuild) {
			wdw_cardbooklog.updateStatusProgressInformation('SyncAccount Imap');
			var networkLinkService = Components.classes["@mozilla.org/network/network-link-service;1"].getService(Components.interfaces.nsINetworkLinkService);
			if (networkLinkService.isLinkUp) {
				var myPrefId = cardbookUtils.getAccountId(cardbookRepository.cardbookImapCardsId);
				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				var cardbookPrefService = new cardbookPreferenceService(myPrefId);
				var dirPrefIdUrl = cardbookPrefService.getUrl();  // imap dir
				var date = new Date();
				var lastImapSync = cardbookPrefService.getLastImapSync();
				cardbookPrefService.setLastImapSync(date.getTime());
				cardbookImap.loadSyncData(dirPrefIdUrl);


				if (stopTime != null && stopTime !== undefined && stopTime != "") {
					var maxTime = stopTime;
				} else {
					var maxTime = "9999999999999";
				}

				var listOfMsg = [];
				var messages = cardbookImap.syncImapFolder.messages;
				while (messages.hasMoreElements()) { 
					var unMsg = messages.getNext().QueryInterface(Components.interfaces.nsIMsgDBHdr);
					listOfMsg.push(unMsg);
				}

				listOfMsg.sort(function(a, b) {
					if (a.date < b.date)
						return -1;
					if (a.date > b.date)
						return 1;
					return 0;
				});

				for (var i = 0; i < listOfMsg.length; i++) {
					var unMsg = listOfMsg[i];
					var dateMsg = JSON.stringify(unMsg.date).substring(0,lastImapSync.length);
					if (dateMsg >= lastImapSync && dateMsg <= maxTime) {
						wdw_cardbooklog.updateStatusProgressInformation('messsage plus recent dateMsg= ' + JSON.stringify(unMsg.date) + ' dateSync= ' + lastImapSync + ' maxTime= ' + maxTime);
						var body = cardbookImap.getMsgBody(unMsg);
						cardbookImap.message = unMsg;
						var cardMsg = new cardbookCardParser(body, "", "", myPrefId);
						cardbookImap.readModification(cardMsg, rebuild);
					} else {
						wdw_cardbooklog.updateStatusProgressInformation('message plus vieu ' + unMsg.subject + " - " + body);
					}
				}
			} else {
				wdw_cardbooklog.updateStatusProgressInformation('Synchronisation impossible, la connexion internet est requise');
			}
		}, 


		/***********************/
		/** Read modification **/
		/***********************/

		// permet de lire un message recu
		readModification: function(cardMsg, rebuild) {

			var messageId = cardbookImap.message.messageId; 
			var tab = messageId.split(" ");
			var modification = tab[0];
			var uidMsg = tab[1];
			var isFound = false;
			var cardLocal;
			
			if (uidMsg != null && uidMsg !== undefined && uidMsg != "") {
				cardLocal = cardbookImap.searchCard(uidMsg);

				if (cardLocal != null && cardLocal !== undefined && cardLocal != "") 
					isFound = true;

				switch (modification) {
					case "CREATE":
						wdw_cardbooklog.updateStatusProgressInformation('read CREATE');
						if (!isFound) {
							wdw_cardbooklog.updateStatusProgressInformation("il faut ajouter la card ici");
							cardbookUtils.addTagFromImapSync(cardMsg);
							cardbookImap.createCard(cardMsg);
						} else {
							wdw_cardbooklog.updateStatusProgressInformation('ERROR : il existe déjà  une card avec cet UID = ' + uidMsg);
						}
						break;
					
					case "UPDATE":
						wdw_cardbooklog.updateStatusProgressInformation('read UPDATE');
						if (isFound) {
							cardbookUtils.addTagFromImapSync(cardLocal);
							wdw_cardbooklog.updateStatusProgressInformation("il faut fusionner les card ici");
							if (rebuild)  {// la cardMsg prend le dessus
								cardbookImap.affectChange(cardLocal, cardMsg);
								cardbookImap.createCard(cardLocal);
							} else {
							cardbookImap.updateCard(cardLocal, cardMsg);
							}
						} else {
							wdw_cardbooklog.updateStatusProgressInformation("aucune card trouvée avec l'UID = " + uidMsg + ". Elle vient d'être ajoutée");
							cardbookUtils.addTagFromImapSync(cardMsg);
							cardbookImap.createCard(cardMsg);
						}
						break;
					
					case "DELETE":
						wdw_cardbooklog.updateStatusProgressInformation('read DELETE');
						if (isFound) {
							wdw_cardbooklog.updateStatusProgressInformation("il faut supprimer la card ici");
							cardbookUtils.addTagFromImapSync(cardLocal);
							cardbookImap.deleteCard(cardLocal);
						} else {
							wdw_cardbooklog.updateStatusProgressInformation("ERROR : aucune card trouvée avec l'UID = " + uidMsg);
						}
						break;
					
					default:
						wdw_cardbooklog.updateStatusProgressInformation('cardbookImap.readModification error. : erreur recuperation type de modification');
						break;
				}
			} else {
				wdw_cardbooklog.updateStatusProgressInformation('cardbookImap.readModification error. : erreur recuperation UID');
			}
		},

		// recupere le corp du message 
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
			texte = texte.split("@###@").join(" ");
			wdw_cardbooklog.updateStatusProgressInformation("getMsgBody = " + JSON.stringify(texte));
			return texte;
		}, 

		// cherche une card avec son uid
		searchCard: function(uid) {
			var card = "";
			for (var i = 0; i < cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookImapCardsId].length; i++) {
				card = cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookImapCardsId][i];
				if (card.uid === uid) {
					wdw_cardbooklog.updateStatusProgressInformation('searchCard: la card existe' + JSON.stringify(card));
					return card;
				} else {
					wdw_cardbooklog.updateStatusProgressInformation("searchCard: la card n'existe pas");
				}
			}
			return card;
		}, 


		createCard: function(card) {
			try {
				wdw_cardbook.saveCard(card);
			} catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookImap.createCard error : " + e);
			}
		},

		updateCard: function(cardLocal, cardMsg) {
			try {
				var conflict = cardbookImap.fusionCard(cardLocal, cardMsg);

				wdw_cardbooklog.updateStatusProgressInformation("conflit = " + conflict);
				if (conflict) {
					var aListOfCards = [];
					aListOfCards.push(cardLocal);
					aListOfCards.push(cardMsg);

					var myArgs = {cardsIn: aListOfCards, cardsOut: [], action: "", imap: true};
					var myWindow = window.openDialog("chrome://cardbook/content/wdw_mergeCards.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
					if (myArgs.action == "CREATE") {
						cardbookImap.affectChange(cardLocal, myArgs.cardsOut[0]);
						wdw_cardbook.saveCard(cardLocal);
						// else if normalement jamais utilisé
					} else if (myArgs.action == "CREATEANDREPLACE") {
						cardbookImap.affectChange(cardLocal, myArgs.cardsOut[0]);
						wdw_cardbook.saveCard(cardLocal);
					}
				} else {
					wdw_cardbook.saveCard(cardLocal);
				}
			} catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookImap.updateCard error : " + e);
			}
		},

		deleteCard: function(card) {
			try {
				var aListOfCards = [];
				aListOfCards.push(card);
				wdw_cardbook.deleteCards(aListOfCards);
			} catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookImap.deleteCard error : " + e);
			}
		},

		// permet la fusion de 2 cards
		fusionCard: function(cardLocal, cardMsg) {
			var conflict = 0;
			cardMsg.fn = ""; // le nom affiché reste propre à l'ordinateur local
			
			if (cardLocal.lastname !== "" && cardMsg.lastname !== "" && cardLocal.lastname !== cardMsg.lastname) {
				// conflit
				conflict++;
			} else {
				cardLocal.lastname = cardMsg.lastname;
				cardMsg.lastname = "";
			}
			if (cardLocal.firstname !== "" && cardMsg.firstname !== "" && cardLocal.firstname !== cardMsg.firstname) {
				// conflit
				conflict++;
			} else {
				cardLocal.firstname = cardMsg.firstname;
				cardMsg.firstname = "";
			}
			if (cardLocal.othername !== "" && cardMsg.othername !== "" && cardLocal.othername !== cardMsg.othername) {
				// conflit
				conflict++;
			} else {
				cardLocal.othername = cardMsg.othername;
				cardMsg.othername = "";
			}
			if (cardLocal.prefixname !== "" && cardMsg.prefixname !== "" && cardLocal.prefixname !== cardMsg.prefixname) {
				// conflit
				conflict++;
			} else {
				cardLocal.prefixname = cardMsg.prefixname;
				cardMsg.prefixname = "";
			}
			if (cardLocal.suffixname !== "" && cardMsg.suffixname !== "" && cardLocal.suffixname !== cardMsg.suffixname) {
				// conflit
				conflict++;
			} else {
				cardLocal.suffixname = cardMsg.suffixname;
				cardMsg.suffixname = "";
			}
			if (cardLocal.nickname !== "" && cardMsg.nickname !== "" && cardLocal.nickname !== cardMsg.nickname) {
				// conflit
				conflict++;
			} else {
				cardLocal.nickname = cardMsg.nickname;
				cardMsg.nickname = "";
			}
			if (cardLocal.bday !== "" && cardMsg.bday !== "" && cardLocal.bday !== cardMsg.bday) {
				// conflit
				conflict++;
			} else {
				cardLocal.bday = cardMsg.bday;
				cardMsg.bday = "";
			}
			if (cardLocal.org !== "" && cardMsg.org !== "" && cardLocal.org !== cardMsg.org) {
				// conflit
				conflict++;
			} else {
				cardLocal.org = cardMsg.org;
				cardMsg.org = "";
			}
			if (cardLocal.title !== "" && cardMsg.title !== "" && cardLocal.title !== cardMsg.title) {
				// conflit
				conflict++;
			} else {
				cardLocal.title = cardMsg.title;
				cardMsg.title = "";
			}
			if (cardLocal.role !== "" && cardMsg.role !== "" && cardLocal.role !== cardMsg.role) {
				// conflit
				conflict++;
			} else {
				cardLocal.role = cardMsg.role;
				cardMsg.role = "";
			}
			if (cardLocal.note !== "" && cardMsg.note !== "" && cardLocal.note !== cardMsg.note) {
				// conflit
				conflict++;
			} else {
				cardLocal.note = cardMsg.note;
				cardMsg.note = "";
			}
			if (cardLocal.note !== "" && cardMsg.note !== "" && cardLocal.note !== cardMsg.note) {
				// conflit
				conflict++;
			} else {
				cardLocal.note = cardMsg.note;
				cardMsg.note = "";
			}

			// les tableaux //
			if (JSON.stringify(cardLocal.tel) !== "[]" && JSON.stringify(cardMsg.tel) !== "[]" && JSON.stringify(cardLocal.tel) !== JSON.stringify(cardMsg.tel)) {
				 cardLocal.tel = cardbookImap.fusionArray(cardLocal.tel, cardMsg.tel);
				 cardMsg.tel  = [];
			} else {
				cardLocal.tel = cardMsg.tel;
				cardMsg.tel = [];
			}			
			if (JSON.stringify(cardLocal.categories) !== "[]" && JSON.stringify(cardMsg.categories) !== "[]" && JSON.stringify(cardLocal.categories) !== JSON.stringify(cardMsg.categories)) {
				cardLocal.categories = cardbookImap.fusionArray(cardLocal.categories, cardMsg.categories);
				cardMsg.categories  = [];
			} else {
				cardLocal.categories = cardMsg.categories;
				cardMsg.categories = [];
			}
			if (JSON.stringify(cardLocal.email) !== "[]" && JSON.stringify(cardMsg.email) !== "[]" && JSON.stringify(cardLocal.email) !== JSON.stringify(cardMsg.email)) {
				cardLocal.email = cardbookImap.fusionArray(cardLocal.email, cardMsg.email);
				cardMsg.email  = [];
			} else {
				cardLocal.email = cardMsg.email;
				cardMsg.email = [];
			}
			if (JSON.stringify(cardLocal.adr) !== "[]" && JSON.stringify(cardMsg.adr) !== "[]" && JSON.stringify(cardLocal.adr) !== JSON.stringify(cardMsg.adr)) {
				cardLocal.adr = cardbookImap.fusionArray(cardLocal.adr, cardMsg.adr);
				cardMsg.adr = [];
			} else {
				cardLocal.adr = cardMsg.adr;
				cardMsg.adr = [];
			}
			if (JSON.stringify(cardLocal.impp) !== "[]" && JSON.stringify(cardMsg.impp) !== "[]" && JSON.stringify(cardLocal.impp) !== JSON.stringify(cardMsg.impp)) {
				cardLocal.impp = cardbookImap.fusionArray(cardLocal.impp, cardMsg.impp);
				cardMsg.impp = [];
			} else {
				cardLocal.impp = cardMsg.impp;
				cardMsg.impp = [];
			}
			if (JSON.stringify(cardLocal.url) !== "[]" && JSON.stringify(cardMsg.url) !== "[]" && JSON.stringify(cardLocal.url) !== JSON.stringify(cardMsg.url)) {
				cardLocal.url = cardbookImap.fusionArray(cardLocal.url, cardMsg.url);
				cardMsg.url = [];
			} else {
				cardLocal.url = cardMsg.url;
				cardMsg.url = [];
			}

			return (conflict > 0);

		},

		// permet la fusion de 2 tableaux
		fusionArray: function(arrayLocal, arrayMsg) {
			var arrayLocalOfMsg = arrayMsg;
			for (var i = 0; i < arrayLocal.length; i++) {
				for (var j = 0; j < arrayMsg.length; j++) {
					if (JSON.stringify(arrayLocal[i]) === JSON.stringify(arrayMsg[j])) 
						arrayLocalOfMsg.splice(j, 1);
				}
			}
			for (var i = 0; i < arrayLocalOfMsg.length; i++) {
				arrayLocal.push(arrayLocalOfMsg[i]);
			}
			return arrayLocal;
		},

		affectChange: function(cardLocal, cardOut) {
			cardLocal.lastname = cardOut.lastname;
			cardLocal.firstname = cardOut.firstname;
			cardLocal.othername = cardOut.othername;
			cardLocal.prefixname = cardOut.prefixname;
			cardLocal.suffixname = cardOut.suffixname;
			cardLocal.nickname = cardOut.nickname;
			cardLocal.bday = cardOut.bday;
			cardLocal.org = cardOut.org;
			cardLocal.title = cardOut.title;
			cardLocal.role = cardOut.role;
			cardLocal.note = cardOut.note;
			cardLocal.note = cardOut.note;
			cardLocal.tel = cardOut.tel;
			cardLocal.categories = cardOut.categories;
			cardLocal.email = cardOut.email;
			cardLocal.adr = cardOut.adr;
			cardLocal.impp = cardOut.impp;
			cardLocal.url = cardOut.url;
		},

		// permet de reconstruire le carnet d'adresse 
		rebuildAddressbook: function() {
			wdw_cardbooklog.updateStatusProgressInformation('rebuildAddressbook');
			var networkLinkService = Components.classes["@mozilla.org/network/network-link-service;1"].getService(Components.interfaces.nsINetworkLinkService);
			if (networkLinkService.isLinkUp) {
				var aListOfCards = [];
				for (var i = 0; i < cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookImapCardsId].length; i++) {
					var card = cardbookRepository.cardbookDisplayCards[cardbookRepository.cardbookImapCardsId][i];
					cardbookUtils.addTagFromImapSync(card);
					aListOfCards.push(card);
				}
				var date = new Date();
				var stopTime = date.getTime();
				if (aListOfCards.length > 0) 
					wdw_cardbook.deleteCards(aListOfCards);

				var myPrefId = cardbookUtils.getAccountId(cardbookRepository.cardbookImapCardsId);
				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				var cardbookPrefService = new cardbookPreferenceService(myPrefId);
				var dirPrefIdUrl = cardbookPrefService.getUrl();  // imap dir

				cardbookPrefService.setLastImapSync("1111111111111");
				var lastImapSync = cardbookPrefService.getLastImapSync();

				cardbookImap.syncAccount(stopTime, true);
			} else {
				wdw_cardbooklog.updateStatusProgressInformation("Reconstruction du carnet d'adresses impossible, la connexion internet est requise");
			}
		},


		/******************/
		/** Mode offline **/
		/******************/
		
		// save les messages dans un fichier .json
		saveInFile: function(objet, uidCard, cardData) { 
			try {
				var cacheDir = cardbookRepository.getLocalDirectory();
				cacheDir.append(cardbookRepository.cardbookImapCardsId);
				if (cacheDir.exists() && cacheDir.isDirectory()) {
					cacheDir.append("saveMessages");
					if (!cacheDir.exists()){
					 	cacheDir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);
					}
					cacheDir.append("saveMessages.json");
					if (!cacheDir.exists()){
						cacheDir.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420);
					}
					var fileString = cardbookImap.readFile(cacheDir);
					wdw_cardbooklog.updateStatusProgressInformation("cardbookImap.saveInFile = " + JSON.stringify(fileString));
					var cardString = JSON.stringify(cardData);
					cardString = cardString.split("\\r\\n").join("#@@@#");
					cardString = cardString.split(" ").join("@###@");
					cardString = cardString.split("\"").join("");
					var obj = {"objet": objet, "uidCard": uidCard, "card": cardString};
					cardbookSynchronization.writeContentToFile(cacheDir.path, fileString + JSON.stringify(obj), "UTF8");
				}
			} catch(e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookImap.saveInFile error : " + e);
			}
		},

		readFile: function(cacheDir) {
			var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
			inputStream.init(cacheDir, -1, -1, 0);
			var converterInputStream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
			converterInputStream.init(inputStream, "UTF-8", 0, 0);
			converterInputStream.QueryInterface(Components.interfaces.nsIUnicharLineInputStream);
			var line = {};
			var lineString = "";
			var again;
			do {
				again = converterInputStream.readLine(line);
				lineString = lineString + JSON.stringify(line);
				lineString = lineString.split("\\").join("");
				lineString = lineString.split("{\"value\":\"").join("");
				lineString = lineString.substring(0,lineString.length-2);
			}while(again);
			if (lineString !== "") {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookImap.readFile deja une line");
				lineString = lineString + "\n"; 
			}
			converterInputStream.close();
			inputStream.close();
			return lineString;
		},

		// charge les msg sauvegardés
		loadMsgSave: function() {
			wdw_cardbooklog.updateStatusProgressInformation("cardbookImap.loadMsgSave");
			try {
				var myPrefId = cardbookUtils.getAccountId(cardbookRepository.cardbookImapCardsId);
				cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
				var cardbookPrefService = new cardbookPreferenceService(myPrefId);
				var dirPrefIdUrl = cardbookPrefService.getUrl();  // imap dir
				cardbookImap.loadSyncData(dirPrefIdUrl);
				var cacheDir = cardbookRepository.getLocalDirectory();
				cacheDir.append(cardbookRepository.cardbookImapCardsId);
				if (cacheDir.exists() && cacheDir.isDirectory()) {
					cacheDir.append("saveMessages");
					var dirPath = cacheDir.path;
					if (cacheDir.exists() && cacheDir.isDirectory()){
						cacheDir.append("saveMessages.json");
						if (cacheDir.exists()){
							var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
							inputStream.init(cacheDir, -1, -1, 0);
							var converterInputStream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
							converterInputStream.init(inputStream, "UTF-8", 0, 0);
							converterInputStream.QueryInterface(Components.interfaces.nsIUnicharLineInputStream);
							var line = {};
							var again;
							do {
								again = converterInputStream.readLine(line);
								wdw_cardbooklog.updateStatusProgressInformation("cardbookImap.loadMsgSave= " + JSON.stringify(line));
								var lineString = JSON.stringify(line);
								lineString = lineString.split("\\").join("");
								lineString = lineString.split("{\"value\":\"").join("");
								lineString = lineString.split("#@@@#").join("\\r\\n");
								lineString = lineString.split("@###@").join(" ");
								lineString = lineString.substring(0,lineString.length-2);
								var obj = JSON.parse(lineString);
								cardbookImap.createMsg(obj.objet, obj.uidCard, obj.card);
							}while(again);
							converterInputStream.close();
							inputStream.close();
							cardbookImap.removeDir(dirPath);
						}
					}
				}
			} catch(e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookImap.loadMsgSave error : " + e);
			}
		},

		// supprime le répertoire temporaire
		removeDir: function(path) {
			var dir = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
			dir.initWithPath(path);
			dir.remove(true);
		}, 

		// detecte une connexion et charge les msg sauvegardés
		detectConnexion: function() {
			wdw_cardbooklog.updateStatusProgressInformation("detectConnexion");
			var networkLinkService = Components.classes["@mozilla.org/network/network-link-service;1"].getService(Components.interfaces.nsINetworkLinkService);
			if (networkLinkService.isLinkUp) {
				cardbookImap.loadMsgSave();
				lTimerLoadFile = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
				lTimerLoadFile.initWithCallback({ notify: function(lTimerLoadFile) { cardbookImap.moveMsgToFolder()} }, 2000, Components.interfaces.nsITimer.TYPE_ONE_SHOT); 
				lTimerLoadFile.initWithCallback({ notify: function(lTimerLoadFile) { cardbookImap.moveMsgToFolder()} }, cardbookImap.repeatTime, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK); 
			} else {
				lTimerLoadFile = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
				lTimerLoadFile.initWithCallback({ notify: function(lTimerLoadFile) { cardbookImap.detectConnexion()} }, cardbookImap.repeatTime, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK); 
			}
		},

	}
}