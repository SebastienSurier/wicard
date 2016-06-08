if ("undefined" == typeof(cardbookUtils)) {
	var cardbookUtils = {
		
		jsInclude: function(files, target) {
			var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
			for (var i = 0; i < files.length; i++) {
				try {
					loader.loadSubScript(files[i], target);
				}
				catch(e) {
					dump("cardbookUtils.jsInclude : failed to include '" + files[i] + "'\n" + e + "\n");
				}
			}
		},
		
		sumElements: function (aObject) {
			var sum = 0;
			for (var i in aObject) {
				sum = sum + aObject[i];
			}
			return sum;
		},
		
		arrayUnique2D: function (aArray) {
			for (var i=0; i<aArray.length; i++) {
				var listI = aArray[i];
				loopJ: for (var j=0; j<aArray.length; j++) {
					var listJ = aArray[j];
					if (listI === listJ) continue; //Ignore itself
					for (var k=listJ.length; k>=0; k--) {
						if (listJ[k] !== listI[k]) continue loopJ;
					}
					// At this point, their values are equal.
					aArray.splice(j, 1);
				}
			}
			return aArray;
		},
		
		splitLine: function (vString) {
			var lLineLength = 75;
			var lResult = "";
			while (vString.length) {
				if (lResult == "") {
					lResult = vString.substr(0, lLineLength);
					vString = vString.substr(lLineLength);
				} else {
					lResult = lResult + "\r\n " + vString.substr(0, lLineLength - 1);
					vString = vString.substr(lLineLength - 1);
				}
			}
			return lResult;
		},
	
		undefinedToBlank: function (vString1) {
			if (vString1 != null && vString1 !== undefined && vString1 != "") {
				return vString1;
			} else {
				return "";
			}
		},

		notNull: function (vArray1, vArray2) {
			var vString1 = vArray1.join("");
			if (vString1 != null && vString1 !== undefined && vString1 != "") {
				return vArray1;
			} else {
				return vArray2;
			}
		},

		appendArrayToVcardData: function (aInitialValue, aField, aVersion, aArray) {
			var aResultValue = aInitialValue;
			for (let i = 0; i < aArray.length; i++) {
				if (aArray[i][2] != null && aArray[i][2] !== undefined && aArray[i][2] != "") {
					var lString = "";
					if (cardbookUtils.getPrefBooleanFromTypes(aArray[i][1])) {
						lString = "TYPE=PREF:";
					} else {
						lString = "";
					}
					aResultValue = this.appendToVcardData(aResultValue, aArray[i][2] + "." + aField, false, lString + this.escapeArrays2(aArray[i][0]).join(";"));
					aResultValue = this.appendToVcardData(aResultValue, aArray[i][2] + ".X-ABLABEL", false, aArray[i][3][0]);
				} else {
					var lString = "TYPE=" + aArray[i][1].join(";TYPE=") + ":";
					lString = lString.replace(/TYPE=PREF=[0-9]*/ig,"TYPE=PREF");
					aResultValue = this.appendToVcardData(aResultValue, aField, false, lString.replace("TYPE=:","") + this.escapeArrays2(aArray[i][0]).join(";"));
				}
			}
			return aResultValue;
		},
		
		appendToVcardData: function (vString1, vString2, vBool1, vString3) {
			var lResult = "";
			if (vBool1) {
				lResult = vString1 + vString2 + "\r\n";
			} else {
				if (vString3 != null && vString3 !== undefined && vString3 != "") {
					if (vString2 != null && vString2 !== undefined && vString2 != "") {
						var lString4 = vString3.toUpperCase();
						if (lString4.indexOf("TYPE=") != -1 || lString4.indexOf("PREF") != -1 || lString4.indexOf("ENCODING=") != -1 || lString4.indexOf("VALUE=") != -1) {
							lResult = vString1 + this.splitLine(vString2 + ";" + vString3) + "\r\n";
						} else {
							lResult = vString1 + this.splitLine(vString2 + ":" + vString3) + "\r\n";
						}
					} else {
						lResult = vString1 + this.splitLine(vString3) + "\r\n";
					}
				} else {
					lResult = vString1;
				}
			}
			return lResult;
		},
		
		escapeString: function (vString) {
			return vString.replace(/\\;/g,"@ESCAPEDSEMICOLON@").replace(/\\,/g,"@ESCAPEDCOMMA@");
		},
	
		escapeArray: function (vArray) {
			for (let i = 0; i<vArray.length; i++){
				if (vArray[i] && vArray[i] != ""){
					vArray[i] = vArray[i].replace(/\\;/g,"@ESCAPEDSEMICOLON@").replace(/\\,/g,"@ESCAPEDCOMMA@");
				}
			}
			return vArray;
		},
	
		replaceArrayComma: function (vArray) {
			vArrayNew = [];
			vArrayNew = JSON.parse(JSON.stringify(vArray));
			for (let i = 0; i<vArrayNew.length; i++){
				if (vArrayNew[i] && vArrayNew[i] != ""){
					vArrayNew[i] = vArrayNew[i].replace(/\\n/g,"\n").replace(/,/g,"\n");
				}
			}
			return vArrayNew;
		},
	
		escapeArrayComma: function (vArray) {
			vArrayNew = [];
			vArrayNew = JSON.parse(JSON.stringify(vArray));
			for (let i = 0; i<vArrayNew.length; i++){
				if (vArrayNew[i] && vArrayNew[i] != ""){
					vArrayNew[i] = vArrayNew[i].replace(/,/g,"@ESCAPEDCOMMA@");
				}
			}
			return vArrayNew;
		},
	
		unescapeArrayComma1: function (vArray) {
			vArrayNew = [];
			vArrayNew = JSON.parse(JSON.stringify(vArray));
			for (let i = 0; i<vArrayNew.length; i++){
				if (vArrayNew[i] && vArrayNew[i] != ""){
					vArrayNew[i] = vArrayNew[i].replace(/@ESCAPEDCOMMA@/g,"\\,");
				}
			}
			return vArrayNew;
		},
	
		unescapeArrayComma2: function (vArray) {
			vArrayNew = [];
			vArrayNew = JSON.parse(JSON.stringify(vArray));
			for (let i = 0; i<vArrayNew.length; i++){
				if (vArrayNew[i] && vArrayNew[i] != ""){
					vArrayNew[i] = vArrayNew[i].replace(/@ESCAPEDCOMMA@/g,"\,");
				}
			}
			return vArrayNew;
		},
	
		unescapeString: function (vString) {
			return vString.replace(/@ESCAPEDSEMICOLON@/g,";").replace(/\\;/g,";").replace(/@ESCAPEDCOMMA@/g,",").replace(/\\,/g,",");
		},
	
		unescapeArray: function (vArray) {
			for (let i = 0; i<vArray.length; i++){
				if (vArray[i] && vArray[i] != ""){
					vArray[i] = vArray[i].replace(/@ESCAPEDSEMICOLON@/g,";").replace(/\\;/g,";").replace(/@ESCAPEDCOMMA@/g,",").replace(/\\,/g,",");
				}
			}
			return vArray;
		},
	
		escapeStrings: function (vString) {
			return vString.replace(/;/g,"\\;").replace(/,/g,"\\,").split("\n").join("\\n");
		},

		escapeArrays2: function (vArray) {
			vArrayNew = [];
			vArrayNew = JSON.parse(JSON.stringify(vArray));
			for (let i = 0; i<vArrayNew.length; i++){
				if (vArrayNew[i] && vArrayNew[i] != ""){
					vArrayNew[i] = this.escapeStrings(vArrayNew[i]);
				}
			}
			return vArrayNew;
		},

		cleanArray: function (vArray) {
			var newArray = [];
			for(let i = 0; i<vArray.length; i++){
				if (vArray[i] && vArray[i] != ""){
					newArray.push(vArray[i]);
				}
			}
			return newArray;
		},
		
		parseArray: function (vArray) {
			var lTemp = "";
			for (let vArrayIndex = 0; vArrayIndex < vArray.length; vArrayIndex++) {
				if ( vArrayIndex === 0 ) {
					lTemp = this.cleanArray(vArray[vArrayIndex]).join(" ");
				} else {
					lTemp = lTemp + "\n" + this.cleanArray(vArray[vArrayIndex]).join(" ");
				}
			}
			return lTemp;
		},
		
		parseArrayByType: function (vArray) {
			var lTemp1 = "";
			for (let i = 0; i < vArray.length; i++) {
				var vType = vArray[i][1];
				lTemp1 = lTemp1 + vType.join(",") + " : " + vArray[i][0].join(" ") + "\n";
			}
			return lTemp1;
		},
		
		cardToVcardData: function (vCard, aMediaConversion) {
			if (vCard.uid == "") {
				return "";
			}
			var vCardData = "";
			vCardData = this.appendToVcardData(vCardData,"BEGIN:VCARD",true,"");
			vCardData = this.appendToVcardData(vCardData,"VERSION",false,vCard.version);
			vCardData = this.appendToVcardData(vCardData,"PRODID",false,vCard.prodid);
			vCardData = this.appendToVcardData(vCardData,"UID",false,vCard.uid);
			vCardData = this.appendToVcardData(vCardData,"CATEGORIES",false,this.unescapeArrayComma1(this.escapeArrayComma(vCard.categories)).join(","));
			if (vCard.version == "3.0") {
				vCardData = this.appendToVcardData(vCardData,"N",false,this.escapeStrings(vCard.lastname) + ";" + this.escapeStrings(vCard.firstname) + ";" +
														this.escapeStrings(vCard.othername) + ";" + this.escapeStrings(vCard.prefixname) + ";" + this.escapeStrings(vCard.suffixname));
			} else if (!(vCard.lastname == "" && vCard.firstname == "" && vCard.othername == "" && vCard.prefixname == "" && vCard.suffixname == "")) {
				vCardData = this.appendToVcardData(vCardData,"N",false,this.escapeStrings(vCard.lastname) + ";" + this.escapeStrings(vCard.firstname) + ";" +
														this.escapeStrings(vCard.othername) + ";" + this.escapeStrings(vCard.prefixname) + ";" + this.escapeStrings(vCard.suffixname));
			}
			vCardData = this.appendToVcardData(vCardData,"FN",false,this.escapeStrings(vCard.fn));
			vCardData = this.appendToVcardData(vCardData,"NICKNAME",false,this.escapeStrings(vCard.nickname));
			vCardData = this.appendToVcardData(vCardData,"SORT-STRING",false,vCard.sortstring);
			vCardData = this.appendToVcardData(vCardData,"BDAY",false,vCard.bday);
			vCardData = this.appendToVcardData(vCardData,"TITLE",false,this.escapeStrings(vCard.title));
			vCardData = this.appendToVcardData(vCardData,"ROLE",false,this.escapeStrings(vCard.role));
			vCardData = this.appendToVcardData(vCardData,"ORG",false,this.escapeStrings(vCard.org));
			vCardData = this.appendToVcardData(vCardData,"CLASS",false,vCard.class1);
			vCardData = this.appendToVcardData(vCardData,"REV",false,vCard.rev);

			vCardData = this.appendArrayToVcardData(vCardData, "ADR", vCard.version, vCard.adr);
			vCardData = this.appendArrayToVcardData(vCardData, "TEL", vCard.version, vCard.tel);
			vCardData = this.appendArrayToVcardData(vCardData, "EMAIL", vCard.version, vCard.email);
			vCardData = this.appendArrayToVcardData(vCardData, "URL", vCard.version, vCard.url);
			vCardData = this.appendArrayToVcardData(vCardData, "IMPP", vCard.version, vCard.impp);

			vCardData = this.appendToVcardData(vCardData,"NOTE",false,this.escapeStrings(vCard.note));
			vCardData = this.appendToVcardData(vCardData,"GEO",false,vCard.geo);
			vCardData = this.appendToVcardData(vCardData,"MAILER",false,vCard.mailer);
			
			if (vCard.version == "4.0") {
				vCardData = this.appendToVcardData(vCardData,"KIND",false,vCard.kind);
				for (let i = 0; i < vCard.member.length; i++) {
					vCardData = this.appendToVcardData(vCardData,"MEMBER",false,vCard.member[i]);
				}
			}

			vCardData = this.appendToVcardData(vCardData,"PHOTO",false,cardbookSynchronization.getMediaContentForCard(vCard, "photo", aMediaConversion));
			vCardData = this.appendToVcardData(vCardData,"LOGO",false,cardbookSynchronization.getMediaContentForCard(vCard, "logo", aMediaConversion));
			vCardData = this.appendToVcardData(vCardData,"SOUND",false,cardbookSynchronization.getMediaContentForCard(vCard, "sound", aMediaConversion));
			
			vCardData = this.appendToVcardData(vCardData,"AGENT",false,vCard.agent);
			vCardData = this.appendToVcardData(vCardData,"TZ",false,this.escapeStrings(vCard.tz));
			vCardData = this.appendToVcardData(vCardData,"KEY",false,vCard.key);

			for (let i = 0; i < vCard.others.length; i++) {
				vCardData = this.appendToVcardData(vCardData,"",false,vCard.others[i]);
			}

			vCardData = this.appendToVcardData(vCardData,"END:VCARD",true,"");

			return vCardData;
		},

		getDisplayedName: function(aOldFn, aNewFn, aOldN, aNewN, aOldOrg, aNewOrg) {
			var fnString = "";
			if (aOldFn == "" ) {
				if (aNewFn == "") {
					fnString = cardbookUtils.cleanArray(aNewN).join(" ");
					if (fnString == "" ) {
						fnString = cardbookUtils.cleanArray(aOldN).join(" ");
						if (fnString == "" ) {
							fnString = aNewOrg;
							if (fnString == "" ) {
								fnString = aOldOrg;
							}
						}
					}
				} else {
					fnString = aNewFn;
				}
			} else {
				if (aNewFn == "" || aNewFn == aOldFn) {
					if (cardbookUtils.cleanArray(aOldN).join(" ") == aOldFn) {
						fnString = cardbookUtils.cleanArray(aNewN).join(" ");
						if (fnString == "" ) {
							fnString = aNewOrg;
						}
					} else if (aOldOrg == aOldFn) {
						fnString = aNewOrg;
					} else {
						fnString = aOldFn;
					}
				} else {
					fnString = aNewFn;
				}
			}
			return fnString;
		},

		parseLists: function(aCard, aMemberLines, aKindValue) {
			if (aCard.version == "4.0") {
				for (var i = 0; i < aMemberLines.length; i++) {
					if (i === 0) {
						if (aKindValue != null && aKindValue !== undefined && aKindValue != "") {
							aCard.kind = aKindValue;
						} else {
							aCard.kind = "group";
						}
					}
					aCard.member.push(aMemberLines[i][0]);
				}
			} else if (aCard.version == "3.0") {
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var kindCustom = prefs.getComplexValue("extensions.cardbook.kindCustom", Components.interfaces.nsISupportsString).data;
				var memberCustom = prefs.getComplexValue("extensions.cardbook.memberCustom", Components.interfaces.nsISupportsString).data;
				for (var i = 0; i < aCard.others.length; i++) {
					localDelim1 = aCard.others[i].indexOf(":",0);
					if (localDelim1 >= 0) {
						var header = aCard.others[i].substr(0,localDelim1);
						var trailer = aCard.others[i].substr(localDelim1+1,aCard.others[i].length);
						if (header == kindCustom || header == memberCustom) {
							aCard.others.splice(i, 1);
							i--;
							continue;
						}
					}
				}
				for (var i = 0; i < aMemberLines.length; i++) {
					if (i === 0) {
						if (aKindValue != null && aKindValue !== undefined && aKindValue != "") {
							aCard.others.push(kindCustom + ":" + aKindValue);
						} else {
							aCard.others.push(kindCustom + ":group");
						}
					}
					aCard.others.push(memberCustom + ":" + aMemberLines[i][0]);
				}
			}
		},

		parseAdrsCard: function(aCard, aAdrLines) {
			for (var i = 0; i < aAdrLines.length; i++) {
				let value = aAdrLines[i][0];
				let type = aAdrLines[i][1];
				for (var j = 0; j < type.length; j++) {
					switch (type[j].toUpperCase()) {
						case "HOME":
							if (aCard.disphomeadr == "") {
								aCard.disphomeadr = cardbookUtils.parseArray([value]);
							} else {
								aCard.disphomeadr = aCard.disphomeadr + "\n" + cardbookUtils.parseArray([value]);
							}
							break;
						case "WORK":
							if (aCard.dispworkadr == "") {
								aCard.dispworkadr = cardbookUtils.parseArray([value]);
							} else {
								aCard.dispworkadr = aCard.dispworkadr + "\n" + cardbookUtils.parseArray([value]);
							}
							break;
					}
				}
				if (aCard.dispadr == "") {
					aCard.dispadr = cardbookUtils.parseArray([value]);
				} else {
					aCard.dispadr = aCard.dispadr + "\n" + cardbookUtils.parseArray([value]);
				}
			}
			aCard.adr = aAdrLines;
		},

		parseEmailsCard: function(aCard, aEmailLines) {
			for (var i = 0; i < aEmailLines.length; i++) {
				let value = aEmailLines[i][0][0];
				let type = aEmailLines[i][1];
				for (var j = 0; j < type.length; j++) {
					switch (type[j].toUpperCase()) {
						case "HOME":
							if (aCard.disphomeemail == "") {
								aCard.disphomeemail = value;
							} else {
								aCard.disphomeemail = aCard.disphomeemail + "\n" + value;
							}
							break;
						case "WORK":
							if (aCard.dispworkemail == "") {
								aCard.dispworkemail = value;
							} else {
								aCard.dispworkemail = aCard.dispworkemail + "\n" + value;
							}
							break;
					}
				}
				if (aCard.dispemail == "") {
					aCard.dispemail = value;
				} else {
					aCard.dispemail = aCard.dispemail + "\n" + value;
				}
			}
			aCard.email = aEmailLines;
		},

		parseTelsCard: function(aCard, aTelLines) {
			for (var i = 0; i < aTelLines.length; i++) {
				let value = aTelLines[i][0][0];
				let type = aTelLines[i][1];
				for (var j = 0; j < type.length; j++) {
					switch (type[j].toUpperCase()) {
						case "HOME":
							if (aCard.disphometel == "") {
								aCard.disphometel = value;
							} else {
								aCard.disphometel = aCard.disphometel + "\n" + value;
							}
							break;
						case "WORK":
							if (aCard.dispworktel == "") {
								aCard.dispworktel = value;
							} else {
								aCard.dispworktel = aCard.dispworktel + "\n" + value;
							}
							break;
						case "CELL":
							if (aCard.dispcelltel == "") {
								aCard.dispcelltel = value;
							} else {
								aCard.dispcelltel = aCard.dispcelltel + "\n" + value;
							}
							break;
					}
				}
				if (aCard.disptel == "") {
					aCard.disptel = value;
				} else {
					aCard.disptel = aCard.disptel + "\n" + value;
				}
			}
			aCard.tel = aTelLines;
		},

		getModifiedCard: function() {
			let aCard = new cardbookCardParser();

			aCard.dirPrefId = document.getElementById('dirPrefIdTextBox').value;
			aCard.cardurl = document.getElementById('cardurlTextBox').value;
			aCard.etag = document.getElementById('etagTextBox').value;
			aCard.version = document.getElementById('versionRadiogroup').value;
			aCard.bday = document.getElementById('bdayTextBox').value;
			aCard.geo = document.getElementById('geoTextBox').value;
			aCard.title = document.getElementById('titleTextBox').value;
			aCard.role = document.getElementById('roleTextBox').value;
			aCard.org = document.getElementById('orgTextBox').value;
			aCard.nickname = document.getElementById('nicknameTextBox').value;
			aCard.mailer = document.getElementById('mailerTextBox').value;
			aCard.note = document.getElementById('noteTextBox').value;
			aCard.prodid = document.getElementById('prodidTextBox').value;
			aCard.sortstring = document.getElementById('sortstringTextBox').value;
			aCard.uid = document.getElementById('uidTextBox').value;
			aCard.class1 = document.getElementById('class1TextBox').value;
			aCard.lastname = document.getElementById('lastnameTextBox').value;
			aCard.firstname = document.getElementById('firstnameTextBox').value;
			aCard.othername = document.getElementById('othernameTextBox').value;
			aCard.prefixname = document.getElementById('prefixnameTextBox').value;
			aCard.suffixname = document.getElementById('suffixnameTextBox').value;
			aCard.dispn = aCard.lastname + ";" + aCard.firstname + ";" + aCard.othername + ";" + aCard.prefixname + ";" + aCard.suffixname;
			aCard.fn = document.getElementById('fnTextBox').value;
			
			aCard.categories = wdw_cardbook.cardbookeditcategories;
			aCard.tz = document.getElementById('tzTextBox').value;
			aCard.agent = document.getElementById('agentTextBox').value;
			aCard.key = document.getElementById('keyTextBox').value;

			aCard.photo.localURI = document.getElementById('photoLocalURITextBox').value;
			aCard.logo.localURI = document.getElementById('logoLocalURITextBox').value;
			aCard.sound.localURI = document.getElementById('soundLocalURITextBox').value;
			aCard.photo.URI = document.getElementById('photoURITextBox').value;
			aCard.logo.URI = document.getElementById('logoURITextBox').value;
			aCard.sound.URI = document.getElementById('soundURITextBox').value;
			aCard.photo.extension = wdw_cardbook.cardbookeditphoto.extension;
			aCard.photo.types = wdw_cardbook.cardbookeditphoto.types;
			aCard.logo.extension = wdw_cardbook.cardbookeditlogo.extension;
			aCard.logo.types = wdw_cardbook.cardbookeditlogo.types;
			aCard.sound.extension = wdw_cardbook.cardbookeditsound.extension;
			aCard.sound.types = wdw_cardbook.cardbookeditsound.types;

			cardbookUtils.parseAdrsCard(aCard, wdw_cardbook.cardbookeditadrs);
			cardbookUtils.parseTelsCard(aCard, wdw_cardbook.cardbookedittels);
			cardbookUtils.parseEmailsCard(aCard, wdw_cardbook.cardbookeditemails);

			aCard.impp = wdw_cardbook.cardbookeditimpps;
			aCard.dispimpp = cardbookUtils.parseArrayByType(aCard.impp)

			aCard.url = wdw_cardbook.cardbookediturls;
			aCard.dispurl = cardbookUtils.parseArrayByType(aCard.url)
			
			var othersTemp1 = [];
			for (var i in cardbookRepository.customFields) {
				var customValue = document.getElementById(cardbookRepository.customFields[i] + 'TextBox').value
				if (customValue != null && customValue !== undefined && customValue != "") {
					othersTemp1.push(cardbookRepository.customFieldsValue[cardbookRepository.customFields[i]] + ":" + customValue);
				}
			}
			var re = /[\n\u0085\u2028\u2029]|\r\n?/;
			var othersTemp3 = [];
			var othersTemp2 = document.getElementById('othersTextBox').value;
			if (othersTemp2 != null && othersTemp2 !== undefined && othersTemp2 != "") {
				othersTemp3 = othersTemp2.split(re);
			}
			aCard.others = othersTemp1.concat(othersTemp3);

			cardbookUtils.parseLists(aCard, wdw_cardbook.cardbookeditlists.addedCards, document.getElementById('kindTextBox').value);

			return aCard;
		},

		cloneCard: function(sourceCard, targetCard) {
			targetCard.dirPrefId = sourceCard.dirPrefId;
			targetCard.cardurl = sourceCard.cardurl;
			targetCard.etag = sourceCard.etag;
	
			targetCard.lastname = sourceCard.lastname;
			targetCard.firstname = sourceCard.firstname;
			targetCard.othername = sourceCard.othername;
			targetCard.prefixname = sourceCard.prefixname;
			targetCard.suffixname = sourceCard.suffixname;
			targetCard.fn = sourceCard.fn;
			targetCard.nickname = sourceCard.nickname;
			targetCard.bday = sourceCard.bday;

			targetCard.adr = JSON.parse(JSON.stringify(sourceCard.adr));
			targetCard.tel = JSON.parse(JSON.stringify(sourceCard.tel));
			targetCard.email = JSON.parse(JSON.stringify(sourceCard.email));
			targetCard.url = JSON.parse(JSON.stringify(sourceCard.url));
			targetCard.impp = JSON.parse(JSON.stringify(sourceCard.impp));
			targetCard.categories = JSON.parse(JSON.stringify(sourceCard.categories));

			targetCard.mailer = sourceCard.mailer;
			targetCard.tz = sourceCard.tz;
			targetCard.geo = sourceCard.geo;
			targetCard.title = sourceCard.title;
			targetCard.role = sourceCard.role;
			targetCard.agent = sourceCard.agent;
			targetCard.org = sourceCard.org;
			targetCard.note = sourceCard.note;
			targetCard.prodid = sourceCard.prodid;
			targetCard.sortstring = sourceCard.sortstring;
			targetCard.uid = sourceCard.uid;
			cardbookUtils.updateRev(targetCard);

			targetCard.member = JSON.parse(JSON.stringify(sourceCard.member));
			targetCard.kind = sourceCard.kind;

			targetCard.photo = JSON.parse(JSON.stringify(sourceCard.photo));
			targetCard.logo = JSON.parse(JSON.stringify(sourceCard.logo));
			targetCard.sound = JSON.parse(JSON.stringify(sourceCard.sound));

			targetCard.version = sourceCard.version;
			targetCard.class1 = sourceCard.class1;
			targetCard.key = sourceCard.key;

			targetCard.updated = sourceCard.updated;
			targetCard.created = sourceCard.created;
			targetCard.deleted = sourceCard.deleted;

			targetCard.others = sourceCard.others;
			
			targetCard.dispn = sourceCard.dispn;
			targetCard.dispadr = sourceCard.dispadr;
			targetCard.disphomeadr = sourceCard.disphomeadr;
			targetCard.dispworkadr = sourceCard.dispworkadr;
			targetCard.disptel = sourceCard.disptel;
			targetCard.disphometel = sourceCard.disphometel;
			targetCard.dispworktel = sourceCard.dispworktel;
			targetCard.dispcelltel = sourceCard.dispcelltel;
			targetCard.dispemail = sourceCard.dispemail;
			targetCard.disphomeemail = sourceCard.disphomeemail;
			targetCard.dispworkemail = sourceCard.dispworkemail;
			targetCard.dispimpp = sourceCard.dispimpp;
			targetCard.dispurl = sourceCard.dispurl;
		},

		getPrefBooleanFromTypes: function(aArray) {
			function getPrefs(element) {
				return (element.toUpperCase().replace(/PREF=[0-9]*/i,"PREF") == "PREF");
			}
			if (aArray.filter(getPrefs).length == 0) {
				return false;
			} else {
				return true;
			}
		},

		getPrefValueFromTypes: function(aArray, aVersion) {
			if (aVersion == "3.0") {
				return "";
			} else {
				function getPrefs(element) {
					return (element.toUpperCase().replace(/PREF=[0-9]*/i,"PREF") == "PREF");
				}
				return aArray.filter(getPrefs).join(",").replace(/PREF=/g,"").replace(/PREF/g,"");
			}
		},

		getTypesFromTypes: function(aPGLabelArray, aArray) {
			function deletePrefs(element) {
				return !(element.toUpperCase().replace(/PREF=[0-9]*/i,"PREF") == "PREF");
			}
			return cardbookUtils.notNull(aPGLabelArray, aArray.filter(deletePrefs).join(","));
		},

		getDataForUpdatingFile: function(aList, aMediaConversion) {
			var dataForExport = "";
			var k = 0;
			for (var i = 0; i < aList.length; i++) {
				if (k === 0) {
					dataForExport = cardbookUtils.cardToVcardData(aList[i], aMediaConversion);
					k = 1;
				} else {
					dataForExport = dataForExport + "\r\n" + cardbookUtils.cardToVcardData(aList[i], aMediaConversion);
				}
			}
			return dataForExport;
		},

		getSelectedCardsForList: function (aTree) {
			var myTreeName = aTree.id.replace("Tree", "");
			var listOfUid = [];
			var numRanges = aTree.view.selection.getRangeCount();
			var start = new Object();
			var end = new Object();
			for (var i = 0; i < numRanges; i++) {
				aTree.view.selection.getRangeAt(i,start,end);
				for (var j = start.value; j <= end.value; j++){
					listOfUid.push([aTree.view.getCellText(j, {id: myTreeName + "Uid"}), aTree.view.getCellText(j, {id: myTreeName + "Fn"})]);
				}
			}
			return listOfUid;
		},

		setSelectedCardsForList: function (aTree, aListOfUid) {
			var myTreeName = aTree.id.replace("Tree", "");
			for (let i = 0; i < aTree.view.rowCount; i++) {
				for (let j = 0; j < aListOfUid.length; j++) {
					if (aTree.view.getCellText(i, {id: myTreeName + "Uid"}) == aListOfUid[j][0]) {
						aTree.view.selection.rangedSelect(i,i,true);
						break;
					}
				}
			}
		},

		getSelectedCards: function () {
			var myTree = document.getElementById('cardsTree');
			var listOfUid = [];
			var numRanges = myTree.view.selection.getRangeCount();
			var start = new Object();
			var end = new Object();
			for (var i = 0; i < numRanges; i++) {
				myTree.view.selection.getRangeAt(i,start,end);
				for (var j = start.value; j <= end.value; j++){
					listOfUid.push(myTree.view.getCellText(j, {id: "dirPrefId"})+"::"+myTree.view.getCellText(j, {id: "uid"}));
				}
			}
			return listOfUid;
		},

		getSelectedCardsCount: function () {
			var listOfUid = [];
			listOfUid = cardbookUtils.getSelectedCards();
			return listOfUid.length;
		},

		setSelectedCards: function (aListOfUid) {
			var myTree = document.getElementById('cardsTree');
			for (let i = 0; i < myTree.view.rowCount; i++) {
				for (let j = 0; j < aListOfUid.length; j++) {
					if (myTree.view.getCellText(i, {id: "dirPrefId"})+"::"+myTree.view.getCellText(i, {id: "uid"}) == aListOfUid[j]) {
						myTree.view.selection.rangedSelect(i,i,true);
						myTree.boxObject.scrollToRow(i);
						break;
					}
				}
			}
		},

		validateCategories: function(aCard) {
			var newArray = [];
			newArray = this.cleanArray(cardbookRepository.arrayUnique(this.unescapeArrayComma2(this.escapeArrayComma(aCard.categories).join(",").replace(/;/g,",").split(","))));
			aCard.categories = newArray;
			return true;
		},
		
		getAccountId: function(aPrefId) {
			var mySepPosition = aPrefId.indexOf("::",0);
			if (mySepPosition != -1) {
				return aPrefId.substr(0,mySepPosition);
			} else {
				return aPrefId;
			}
		},

		getPositionOfAccountId: function(aAccountId) {
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][4] == aAccountId) {
					return i;
				}
			}
			return -1;
		},

		isThereNetworkAccountToSync: function() {
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][5] != "FILE" && cardbookRepository.cardbookAccounts[i][5] != "CACHE" && cardbookRepository.cardbookAccounts[i][6]) {
					return true;
				}
			}
			return false;
		},

		isTheFileAlreadyOpen: function(aAccountPath) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][1] && cardbookRepository.cardbookAccounts[i][5] == "FILE") {
					var cardbookPrefService = new cardbookPreferenceService(cardbookRepository.cardbookAccounts[i][4]);
					if (cardbookPrefService.getUrl() == aAccountPath) {
						return true;
					}
				}
			}
			return false;
		},

		isToggleOpen: function(aPrefId) {
			for (var i = 0; i < cardbookRepository.cardbookAccounts.length; i++) {
				if (cardbookRepository.cardbookAccounts[i][4] == aPrefId) {
					if (cardbookRepository.cardbookAccounts[i][2]) {
						return true;
					} else {
						return false;
					}
				}
			}
			return false;
		},

		searchTagCreated: function(aCard) {
			for (var i = 0; i < aCard.others.length; i++) {
				if (aCard.others[i].indexOf("X-THUNDERBIRD-MODIFICATION:CREATED") >= 0) {
					return true;
				}
			}
			return false;
		},

		searchTagUpdated: function(aCard) {
			for (var i = 0; i < aCard.others.length; i++) {
				if (aCard.others[i].indexOf("X-THUNDERBIRD-MODIFICATION:UPDATED") >= 0) {
					return true;
				}
			}
			return false;
		},

		searchTagDeleted: function(aCard) {
			for (var i = 0; i < aCard.others.length; i++) {
				if (aCard.others[i].indexOf("X-THUNDERBIRD-MODIFICATION:DELETED") >= 0) {
					return true;
				}
			}
			return false;
		},

		searchTagFromImapSync: function(aCard) {
			for (var i = 0; i < aCard.others.length; i++) {
				if (aCard.others[i].indexOf("X-THUNDERBIRD-MODIFICATION:FROMIMAPSYNC") >= 0) {
					return true;
				}
			}
			return false;
		},

		addTagCreated: function(aCard) {
			cardbookUtils.nullifyTagModification(aCard);
			aCard.others.push("X-THUNDERBIRD-MODIFICATION:CREATED");
		},

		addTagUpdated: function(aCard) {
			cardbookUtils.nullifyTagModification(aCard);
			aCard.others.push("X-THUNDERBIRD-MODIFICATION:UPDATED");
		},

		addTagDeleted: function(aCard) {
			cardbookUtils.nullifyTagModification(aCard);
			aCard.others.push("X-THUNDERBIRD-MODIFICATION:DELETED");
		},

		addTagFromImapSync: function(aCard) {
			cardbookUtils.nullifyTagModification(aCard);
			aCard.others.push("X-THUNDERBIRD-MODIFICATION:FROMIMAPSYNC");
		},

		nullifyTagModification: function(aCard) {
			function removeTagModification(element) {
				return (element.indexOf("X-THUNDERBIRD-MODIFICATION:") == -1);
			}
			aCard.others = aCard.others.filter(removeTagModification);
		},

		updateRev: function(aCard) {
			var sysdate = new Date();
			var year = sysdate.getFullYear();
			var month = ("0" + (sysdate.getMonth() + 1)).slice(-2);
			var day = ("0" + sysdate.getDate()).slice(-2);
			var hour = ("0" + sysdate.getHours()).slice(-2);
			var min = ("0" + sysdate.getMinutes()).slice(-2);
			var sec = ("0" + sysdate.getSeconds()).slice(-2);
			aCard.rev = year + month + day + "T" + hour + min + sec + "Z";
		},

		addEtag: function(aCard, aEtag) {
			if (!(aEtag != null && aEtag !== undefined && aEtag != "")) {
				aEtag = "0";
			} else {
				var cardbookPrefService = new cardbookPreferenceService(aCard.dirPrefId);
				var myPrefType = cardbookPrefService.getType();
				if (myPrefType != "FILE" || myPrefType != "CACHE") {
					cardbookUtils.nullifyEtag(aCard);
					aCard.others.push("X-THUNDERBIRD-ETAG:" + aEtag);
					aCard.etag = aEtag;
				}
			}
		},

		nullifyEtag: function(aCard) {
			function removeEtag(element) {
				return (element.indexOf("X-THUNDERBIRD-ETAG:") == -1);
			}
			aCard.others = aCard.others.filter(removeEtag);
			aCard.etag = "";
		},

		prepareCardForCreation: function(aCard, aPrefType, aUrl) {
			if (aUrl[aUrl.length - 1] != '/') {
				aUrl += '/';
			}
			if (aPrefType === "GOOGLE") {
				aCard.cardurl = aUrl + aCard.uid;
			} else {
				aCard.cardurl = aUrl + aCard.uid + ".vcf";
			}
		},
		
		getCardsFromAccountsOrCats: function () {
			try {
				var listOfSelectedCard = [];
				var myTree = document.getElementById('accountsOrCatsTree');
				if (cardbookRepository.cardbookSearchMode === "SEARCH") {
					var myAccountPrefId = cardbookRepository.cardbookSearchValue;
				} else {
					var myAccountPrefId = myTree.view.getCellText(myTree.currentIndex, {id: "accountId"});
				}
				for (var i = 0; i < cardbookRepository.cardbookDisplayCards[myAccountPrefId].length; i++) {
					listOfSelectedCard.push(cardbookRepository.cardbookDisplayCards[myAccountPrefId][i]);
				}
				return listOfSelectedCard;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.getCardsFromAccountsOrCats error : " + e);
			}
		},

		getCardsFromCards: function () {
			try {
				var listOfSelectedCard = [];
				var myTree = document.getElementById('cardsTree');
				var numRanges = myTree.view.selection.getRangeCount();
				var start = new Object();
				var end = new Object();
				for (var i = 0; i < numRanges; i++) {
					myTree.view.selection.getRangeAt(i,start,end);
					for (var j = start.value; j <= end.value; j++){
						listOfSelectedCard.push(cardbookRepository.cardbookCards[myTree.view.getCellText(j, {id: "dirPrefId"})+"::"+myTree.view.getCellText(j, {id: "uid"})]);
					}
				}
				return listOfSelectedCard;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.getCardsFromCards error : " + e);
			}
		},

		getMediaCacheFile: function (aUid, aDirPrefId, aEtag, aType, aExtension) {
			try {
				var mediaFile = cardbookRepository.getLocalDirectory();
				mediaFile.append(aDirPrefId);
				mediaFile.append("mediacache");
				if (!mediaFile.exists() || !mediaFile.isDirectory()) {
					// read and write permissions to owner and group, read-only for others.
					mediaFile.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);
				}
				var fileName = aUid + "." + aEtag + "." + aType + "." + aExtension;
				fileName = fileName.replace(/([^a-z0-9.]+)/gi, '-');
				mediaFile.append(fileName);
				return mediaFile;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.getMediaCacheFile error : " + e);
			}
		},

		changeMediaFromFileToContent: function (aCard) {
			try {
				var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
				var mediaName = [ 'photo', 'logo', 'sound' ];

				for (var i in mediaName) {
					if (aCard[mediaName[i]].localURI != null && aCard[mediaName[i]].localURI !== undefined && aCard[mediaName[i]].localURI != "") {
						var myFileURISpec = aCard[mediaName[i]].localURI.replace("VALUE=uri:","");
						if (myFileURISpec.indexOf("file:///") === 0) {
							var myFileURI = ioService.newURI(myFileURISpec, null, null);
							aCard[mediaName[i]].value = cardbookSynchronization.getFileData(myFileURI, "NOUTF8");
							aCard[mediaName[i]].localURI = "";
						}
					}
				}
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.changeMediaFromFileToContent error : " + e);
			}
		},

		clipboardSet: function (aText, aMessage) {
			let ss = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
			if (!ss)
				return;
	
			let trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
			if (!trans)
				return;
	
			let clipid = Components.interfaces.nsIClipboard;
			let clipboard   = Components.classes['@mozilla.org/widget/clipboard;1'].getService(clipid);
			if (!clipboard)
				return;
	
			ss.data = aText;
			trans.addDataFlavor('text/unicode');
			trans.setTransferData('text/unicode', ss, aText.length * 2);
			clipboard.setData(trans, null, clipid.kGlobalClipboard);
			
			if (aMessage != null && aMessage !== undefined && aMessage != "") {
				wdw_cardbooklog.updateStatusProgressInformation(aMessage);
			}
		},

		clipboardGet: function () {
			try {
				let clipboard = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);
	
				let trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
				trans.addDataFlavor("text/unicode");
	
				clipboard.getData(trans, clipboard.kGlobalClipboard);
	
				let str       = {};
				let strLength = {};
	
				trans.getTransferData("text/unicode", str, strLength);
				if (str)
					str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
	
				return str ? str.data.substring(0, strLength.value / 2) : null;
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.clipboardGet error : " + e);
			}
		},

		clipboardGetImage: function(aFile) {
			var extension = "png";
			var clip = Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard);
			var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
			trans.addDataFlavor("image/" + extension);
			clip.getData(trans,clip.kGlobalClipboard);
			var data = {};
			var dataLength = {};
			trans.getTransferData("image/" + extension,data,dataLength);
			if (data && data.value) {
				// remove an existing image (overwrite)
				if (aFile.exists()) {
					aFile.remove(true);
				}
				aFile.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
				var outStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
				outStream.init(aFile, 0x04 | 0x08 | 0x20, -1, 0); // readwrite, create, truncate
				var inputStream = data.value.QueryInterface(Components.interfaces.nsIInputStream)
				var binInputStream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
				binInputStream.setInputStream(inputStream);
				try {
					while(true) {
						var len = Math.min(512,binInputStream.available());
						if (len == 0) break;
						var data = binInputStream.readBytes(len);
						if (!data || !data.length) break; outStream.write(data, data.length);
					}
				}
				catch(e) { return false; }
				try {
					inputStream.close();
					binInputStream.close();
					outStream.close();
				}
				catch(e) { return false; }
			} else {
				return false;
			}
			return true;
		},

		callFilePicker: function (aTitle, aMode, aType, aDefaultFileName) {
			try {
				var strBundle = document.getElementById("cardbook-strings");
				var myWindowTitle = strBundle.getString(aTitle);
				var nsIFilePicker = Components.interfaces.nsIFilePicker;
				var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
				if (aMode === "SAVE") {
					fp.init(window, myWindowTitle, nsIFilePicker.modeSave);
				} else if (aMode === "OPEN") {
					fp.init(window, myWindowTitle, nsIFilePicker.modeOpen);
				}
				if (aType === "VCF") {
					fp.appendFilter("VCF File","*.vcf");
				} else if (aType === "IMAGES") {
					fp.appendFilters(nsIFilePicker.filterImages);
				}
				fp.appendFilters(fp.filterAll);
				if (aDefaultFileName != null && aDefaultFileName !== undefined && aDefaultFileName != "") {
					fp.defaultString = aDefaultFileName;
				}
				var ret = fp.show();
				if (ret == nsIFilePicker.returnOK || ret == nsIFilePicker.returnReplace) {
					return fp.file;
				}
				return "";
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.callFilePicker error : " + e);
			}
		},

		callDirPicker: function (aTitle) {
			try {
				var strBundle = document.getElementById("cardbook-strings");
				var myWindowTitle = strBundle.getString(aTitle);
				var nsIFilePicker = Components.interfaces.nsIFilePicker;
				var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
				fp.init(window, myWindowTitle, nsIFilePicker.modeGetFolder);
				var ret = fp.show();
				if (ret == nsIFilePicker.returnOK || ret == nsIFilePicker.returnReplace) {
					return fp.file;
				}
				return "";
			}
			catch (e) {
				wdw_cardbooklog.updateStatusProgressInformation("cardbookUtils.callDirPicker error : " + e);
			}
		},

		getExtension: function (aFile) {
			var myFileArray = aFile.split(".");
			if (myFileArray.length == 1) {
				var myExtension = "";
			} else {
				var myExtension = myFileArray[myFileArray.length-1];
			}
			return myExtension;
		},
			
		getPrefNameFromPrefId: function(aPrefId) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			let cardbookPrefService = new cardbookPreferenceService(aPrefId);
			return cardbookPrefService.getName();
		},
		
		getFileNameFromUrl: function(aUrl) {
			var keyArray = aUrl.split("/");
			var key = decodeURIComponent(keyArray[keyArray.length - 1]);
			return key.replace(/([^a-z0-9@.]+)/gi, '-');
		},

		getFileCacheNameFromCard: function(aCard, aPrefIdType) {
			if (cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId+"::"+aCard.uid]) {
				return cardbookRepository.cardbookFileCacheCards[aCard.dirPrefId+"::"+aCard.uid];
			} else {
				if (aCard.cardurl != null && aCard.cardurl !== undefined && aCard.cardurl != "") {
					return cardbookUtils.getFileNameFromUrl(aCard.cardurl);
				} else {
					if (aPrefIdType === "GOOGLE") {
						return cardbookUtils.getFileNameFromUrl(aCard.uid);
					} else {
						return cardbookUtils.getFileNameFromUrl(aCard.uid) + ".vcf";
					}
				}
			}
		},

		isMyAccountEnabled: function(aDirPrefId) {
			cardbookUtils.jsInclude(["chrome://cardbook/content/preferences/cardbookPreferences.js"]);
			var cardbookPrefService = new cardbookPreferenceService(aDirPrefId);
			return cardbookPrefService.getEnabled();
		},

		getDisplayNameAndEmail: function (aEmails) {
			var result = [];
			var listOfEmails = [];
			listOfEmails = aEmails.split(/,|\;/);
			for (var i = 0; i < listOfEmails.length; i++) {
				if (listOfEmails[i].indexOf("<") > 0 && listOfEmails[i].indexOf(">") > 0) {
					var myCleanEmail = listOfEmails[i].replace(/>/g,"").replace(/\\/g,"").replace(/\"/g,"");
					var myDisplayName = ""
					var myEmail = ""
					var listOfStrings1 = [];
					listOfStrings1 = myCleanEmail.split(/</);
					myEmail = listOfStrings1[1];
					var listOfStrings2 = [];
					listOfStrings2 = listOfStrings1[0].split(/[\s]+/);
					for (var j = 0; j < listOfStrings2.length; j++) {
						if (listOfStrings2[j] != "") {
							if (myDisplayName == "") {
								myDisplayName = listOfStrings2[j];
							} else {
								myDisplayName = myDisplayName + " " + listOfStrings2[j];
							}
						}
					}
				} else {
					var myCleanEmail = listOfEmails[i].replace(/</g,"").replace(/>/g,"").replace(/\\/g,"").replace(/\"/g,"");
					var myDisplayName = ""
					var myEmail = ""
					var listOfStrings = [];
					listOfStrings = myCleanEmail.split(/[\s]+/);
					for (var j = 0; j < listOfStrings.length; j++) {
						if (listOfStrings[j].indexOf("@") >= 0) {
							myEmail = listOfStrings[j];
						} else {
							if (listOfStrings[j] != "") {
								if (myDisplayName == "") {
									myDisplayName = listOfStrings[j];
								} else {
									myDisplayName = myDisplayName + " " + listOfStrings[j];
								}
							}
						}
					}
				}
				if (myEmail == "") {
					myEmail = myDisplayName;
				} else {
					myEmail = myEmail.replace(/[\s+]/g, "").toLowerCase();
				}
				result.push([myDisplayName, myEmail]);
			}
			return result;
		},
				
		formatFnForEmail: function (aFn) {
			return aFn.replace(/;/g,"").replace(/,/g,"").replace(/</g,"").replace(/>/g,"");
		},

		getEmailsFromCards: function (aListOfCards, aEmailPref) {
			var listOfEmail = [];
			cardbookUtils.jsInclude(["chrome://cardbook/content/cardbookMailPopularity.js", "chrome://cardbook/content/cardbookSynchronization.js", "chrome://cardbook/content/wdw_log.js"]);
			if (aListOfCards != null && aListOfCards !== undefined && aListOfCards != "") {
				for (var i = 0; i < aListOfCards.length; i++) {
					var notfoundOnePrefEmail = true;
					var listOfPrefEmail = [];
					var myPrefValue;
					var myOldPrefValue = 0;
					for (var j = 0; j < aListOfCards[i].email.length; j++) {
						var email = aListOfCards[i].email[j][0][0];
						var emailText = cardbookUtils.formatFnForEmail(aListOfCards[i].fn) + " <" + email + ">";
						if (aEmailPref) {
							for (var k = 0; k < aListOfCards[i].email[j][1].length; k++) {
								if (aListOfCards[i].email[j][1][k].toUpperCase().indexOf("PREF") >= 0) {
									if (aListOfCards[i].email[j][1][k].toUpperCase().indexOf("PREF=") >= 0) {
										myPrefValue = aListOfCards[i].email[j][1][k].toUpperCase().replace("PREF=","");
									} else {
										myPrefValue = 1;
									}
									if (myPrefValue == myOldPrefValue || myOldPrefValue === 0) {
										listOfPrefEmail.push([emailText, email]);
										myOldPrefValue = myPrefValue;
									} else if (myPrefValue < myOldPrefValue) {
										listOfPrefEmail = [];
										listOfPrefEmail.push([emailText, email]);
										myOldPrefValue = myPrefValue;
									}
									notfoundOnePrefEmail = false;
								}
							}
						} else {
							listOfEmail.push(emailText);
							cardbookMailPopularity.updateMailPopularity(email);
							notfoundOnePrefEmail = false;
						}
					}
					if (notfoundOnePrefEmail) {
						for (var j = 0; j < aListOfCards[i].email.length; j++) {
							var email = aListOfCards[i].email[j][0][0];
							var emailText = cardbookUtils.formatFnForEmail(aListOfCards[i].fn) + " <" + email + ">";
							listOfEmail.push(emailText);
							cardbookMailPopularity.updateMailPopularity(email);
						}
					} else {
						for (var j = 0; j < listOfPrefEmail.length; j++) {
							listOfEmail.push(listOfPrefEmail[j][0]);
							cardbookMailPopularity.updateMailPopularity(listOfPrefEmail[j][1]);
						}
					}
				}
			}
			return listOfEmail;
		},

		getAddressesFromCards: function (aListOfCards) {
			var listOfAddresses= [];
			if (aListOfCards != null && aListOfCards !== undefined && aListOfCards != "") {
				for (var i = 0; i < aListOfCards.length; i++) {
					for (var j = 0; j < aListOfCards[i].adr.length; j++) {
						var adress = aListOfCards[i].adr[j][0];
						listOfAddresses.push(adress);
					}
				}
			}
			return listOfAddresses;
		},

		isMyCardAList: function (aCard) {
			if (aCard.version == "4.0") {
				return (aCard.kind.toLowerCase() == 'group');
			} else if (aCard.version == "3.0") {
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var kindCustom = prefs.getComplexValue("extensions.cardbook.kindCustom", Components.interfaces.nsISupportsString).data;
				for (var i = 0; i < aCard.others.length; i++) {
					var localDelim1 = aCard.others[i].indexOf(":",0);
					if (localDelim1 >= 0) {
						var header = aCard.others[i].substr(0,localDelim1);
						if (header == kindCustom) {
							var trailer = aCard.others[i].substr(localDelim1+1,aCard.others[i].length);
							return (trailer.toLowerCase() == 'group');
						}
					}
				}
			}
			return false;
		},

		formatStringForOutput: function (aStringCode, aValuesArray) {
			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			if (aValuesArray) {
				wdw_cardbooklog.updateStatusProgressInformation(strBundle.formatStringFromName(aStringCode, aValuesArray, aValuesArray.length));
			} else {
				wdw_cardbooklog.updateStatusProgressInformation(strBundle.GetStringFromName(aStringCode));
			}
		}

	};
};