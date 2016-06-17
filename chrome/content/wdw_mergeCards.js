if ("undefined" == typeof(wdw_mergeCards)) {
	var wdw_mergeCards = {
		arrayField: {},
		version: "",
		
		validateLook: function (aPrefValue) {
			if (aPrefValue) {
				cardbookRepository.unregisterCss("chrome://cardbook/skin/mergeSelectedNull.css");
				cardbookRepository.reloadCss("chrome://cardbook/skin/mergeSelectedBlue.css");
			} else {
				cardbookRepository.unregisterCss("chrome://cardbook/skin/mergeSelectedBlue.css");
				cardbookRepository.reloadCss("chrome://cardbook/skin/mergeSelectedNull.css");
			}
		},

		createCheckBox1: function (aRow, aName, aValue) {
			var aCheckbox = document.createElement('checkbox');
			aRow.appendChild(aCheckbox);
			aCheckbox.setAttribute('id', aName);
			aCheckbox.setAttribute('checked', aValue);
			aCheckbox.setAttribute('flex', '1');
			aCheckbox.addEventListener("command", function() {
				var field = this.id.replace(/Checkbox.*/,"");
				var number = this.id.replace(/.*Checkbox/,"");
				if (this.checked) {
					var k = 0;
					while(document.getElementById(field + 'Checkbox' + k)) {
						if (k != number) {
							var aCheckbox = document.getElementById(field + 'Checkbox' + k);
							aCheckbox.setAttribute('checked', false);
						}
						k++;
					}
				}
				var k = 0;
				while(document.getElementById(field + 'Textbox' + k)) {
					var aTextbox = document.getElementById(field + 'Textbox' + k);
					if (k != number) {
						aTextbox.setAttribute('mergeSelected', 'false');
					} else {
						if (this.checked) {
							aTextbox.setAttribute('mergeSelected', 'true');
						} else {
							aTextbox.setAttribute('mergeSelected', 'false');
						}
					}
					k++;
				}
			}, false);
		},

		createCheckBox2: function (aRow, aName, aValue) {
			var aCheckbox = document.createElement('checkbox');
			aRow.appendChild(aCheckbox);
			aCheckbox.setAttribute('id', aName);
			aCheckbox.setAttribute('checked', aValue);
			aCheckbox.setAttribute('flex', '1');
			aCheckbox.addEventListener("command", function() {
				var field = this.id.replace(/Checkbox.*/,"");
				var number = this.id.replace(/.*Checkbox/,"");
				var k = 0;
				while(document.getElementById(field + 'Textbox' + k)) {
					var aTextbox = document.getElementById(field + 'Textbox' + k);
					if (this.checked) {
						aTextbox.setAttribute('mergeSelected', 'true');
					} else {
						aTextbox.setAttribute('mergeSelected', 'false');
					}
					k++;
				}
			}, false);
		},

		createTextBox: function (aRow, aName, aValue, aSelected, aDisabled, aArrayValue) {
			var aTextbox = document.createElement('textbox');
			aRow.appendChild(aTextbox);
			aTextbox.setAttribute('id', aName);
			aTextbox.setAttribute('value', aValue);
			aTextbox.setAttribute('flex', '1');
			if (aDisabled) {
				function editField(event) {
					var fieldAndNumber = this.id.replace(/Textbox.*/,"");
					var field = this.id.replace(/[0-9]*Textbox.*/,"");
					var myArgs = {version: wdw_mergeCards.version, action: ""};
					var firstArg = field + "Line";
					myArgs[firstArg] = wdw_mergeCards.arrayField[fieldAndNumber];
					var myWindow = window.openDialog("chrome://cardbook/content/wdw_" + field + "Edition.xul", "", "chrome,modal,resizable,centerscreen", myArgs);
					wdw_mergeCards.arrayField[fieldAndNumber] = myArgs[firstArg];
					if (this.id == fieldAndNumber + 'Textbox0') {
						this.value = wdw_mergeCards.arrayField[fieldAndNumber][1].join(",");
						var mySecondTextbox = document.getElementById(fieldAndNumber + 'Textbox1')
						mySecondTextbox.setAttribute('value', wdw_mergeCards.arrayField[fieldAndNumber][0].join(","));
					} else {
						this.value = wdw_mergeCards.arrayField[fieldAndNumber][0].join(",");
						var mySecondTextbox = document.getElementById(fieldAndNumber + 'Textbox0')
						mySecondTextbox.setAttribute('value', wdw_mergeCards.arrayField[fieldAndNumber][1].join(","));
					}
				};
				aTextbox.addEventListener("click", editField, false);
				aTextbox.addEventListener("input", editField, false);
			}
			if (aArrayValue) {
				var field = aName.replace(/Textbox.*/,"");
				wdw_mergeCards.arrayField[field] = aArrayValue;
			}
			aTextbox.setAttribute('mergeSelected', aSelected);
		},

		createMultilineTextBox: function (aRow, aName, aValue, aSelected) {
			var aTextbox = document.createElement('textbox');
			aRow.appendChild(aTextbox);
			aTextbox.setAttribute('multiline', true);
			aTextbox.setAttribute('wrap', 'virtual');
			aTextbox.setAttribute('id', aName);
			aTextbox.setAttribute('value', aValue);
			aTextbox.setAttribute('flex', '1');
			aTextbox.setAttribute('mergeSelected', aSelected);
		},

		createImageBox: function (aRow, aName, aValue, aSelected) {
			var aVbox = wdw_mergeCards.createVbox(aRow);
			aVbox.setAttribute("width", "170px");
			var aHbox = wdw_mergeCards.createHbox(aVbox);
			aHbox.setAttribute("height", "170px");
			var aImageForSizing =  document.createElementNS("http://www.w3.org/1999/xhtml","img");
			aHbox.appendChild(aImageForSizing);
			aImageForSizing.setAttribute('id', aName + "ForSizing");
			aImageForSizing.setAttribute('hidden', "true");
			var aImage = document.createElement('image');
			aHbox.appendChild(aImage);
			aImage.setAttribute('id', aName + "Displayed");
			wdw_mergeCards.arrayField[aName] = aValue;

			aImage.src = "";
			aImageForSizing.src = "";
			aImageForSizing.addEventListener("load", function() {
				var myImageWidth = 170;
				var myImageHeight = 170;
				if (this.width >= this.height) {
					widthFound = myImageWidth + "px" ;
					heightFound = Math.round(this.height * myImageWidth / this.width) + "px" ;
				} else {
					widthFound = Math.round(this.width * myImageHeight / this.height) + "px" ;
					heightFound = myImageHeight + "px" ;
				}
				var field = this.id.replace(/ForSizing.*/,"");
				var myImage = document.getElementById(field + "Displayed");
				myImage.setAttribute("width", widthFound);
				myImage.setAttribute("height", heightFound);
				myImage.setAttribute("src", this.src);
			}, false);
			aImageForSizing.src = aValue;
		},

		createLabel: function (aRow, aName, aValue) {
			var aLabel = document.createElement('label');
			aRow.appendChild(aLabel);
			aLabel.setAttribute('id', aName);
			var stringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
			var strBundle = stringBundleService.createBundle("chrome://cardbook/locale/cardbook.properties");
			aLabel.setAttribute('value', strBundle.GetStringFromName(aValue));
		},

		createRow: function (aParent) {
			var aRow = document.createElement('row');
			aParent.appendChild(aRow);
			aRow.setAttribute('align', 'center');
			aRow.setAttribute('flex', '1');
			return aRow
		},

		createHbox: function (aParent) {
			var aHbox = document.createElement('hbox');
			aParent.appendChild(aHbox);
			aHbox.setAttribute('align', 'center');
			aHbox.setAttribute('flex', '1');
			return aHbox
		},

		createVbox: function (aParent) {
			var aHbox = document.createElement('vbox');
			aParent.appendChild(aHbox);
			aHbox.setAttribute('align', 'center');
			aHbox.setAttribute('flex', '1');
			return aHbox
		},

		createVersionRow: function (aParent, aListOfCards) {
			var aRow = document.createElement('row');
			aParent.appendChild(aRow);
			wdw_mergeCards.createLabel(aRow, 'versionLabel', "versionLabel");
			wdw_mergeCards.createHbox(aRow);
			var aRadioGroup = document.createElement('radiogroup');
			aRow.appendChild(aRadioGroup);
			aRadioGroup.setAttribute('orient', 'horizontal');
			aRadioGroup.setAttribute('id', 'version');
			var aRadio = document.createElement('radio');
			aRadioGroup.appendChild(aRadio);
			aRadio.setAttribute('value', '3.0');
			aRadio.setAttribute('label', '3.0');
			var aRadio = document.createElement('radio');
			aRadioGroup.appendChild(aRadio);
			aRadio.setAttribute('value', '4.0');
			aRadio.setAttribute('label', '4.0');
			var version = "";
			var multiples = false;
			for (var i = 0; i < aListOfCards.length; i++) {
				if (version == "") {
					version = aListOfCards[i].version;
				} else if (version != aListOfCards[i].version) {
					multiples = true;
				}
			}
			if (multiples) {
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var versionFromPref = prefs.getComplexValue("extensions.cardbook.cardCreationVersion", Components.interfaces.nsISupportsString).data;
				aRadioGroup.value = versionFromPref;
				wdw_mergeCards.version = versionFromPref;
			} else {
				aRadioGroup.value = version;
				wdw_mergeCards.version = version;
			}
		},

		addRowFromArray: function (aListOfCards, aField) {
			for (var i = 0; i < aListOfCards.length; i++) {
				if (aListOfCards[i][aField].length != 0) {
					return true;
				}
			}
			return false;
		},
		
		addRowFromPhoto: function (aListOfCards, aField) {
			for (var i = 0; i < aListOfCards.length; i++) {
				if (aListOfCards[i][aField].localURI != "") {
					return true;
				}
			}
			return false;
		},
		
		isValueNew: function (aListOfValue) {
			return (aListOfValue.length === cardbookRepository.arrayUnique(aListOfValue).length);
		},

		load: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var defaultLook = prefs.getBoolPref("extensions.cardbook.defaultLook");
			wdw_mergeCards.validateLook(defaultLook);
			var fromImap = false;
			if (window.arguments[0].imap != null && window.arguments[0].imap !== undefined) {
				fromImap = window.arguments[0].imap;
			}
			if (fromImap) {
				var strBundle = document.getElementById("cardbook-strings");
				document.getElementById('createEditionLabel').label=strBundle.getString("updateEditionLabel");
				document.getElementById('createAndReplaceEditionLabel').hidden = true;
			}
			
			listOfCards = window.arguments[0].cardsIn;
			var aListRows = document.getElementById('fieldsVbox');
			listOfFields = [ 'photo' ];
			for (var i in listOfFields) {
				if (wdw_mergeCards.addRowFromPhoto(listOfCards, listOfFields[i])) {
					var aRow = wdw_mergeCards.createRow(aListRows);
					wdw_mergeCards.createLabel(aRow, listOfFields[i] + 'Label' + j, listOfFields[i] + 'Label');
					var selected = true;
					var count = 0;
					for (var j = 0; j < listOfCards.length; j++) {
						if (listOfCards[j][listOfFields[i]].localURI != "") {
							wdw_mergeCards.createCheckBox1(aRow, listOfFields[i] + 'Checkbox' + count, selected);
							wdw_mergeCards.createImageBox(aRow, listOfFields[i] + 'Textbox' + count, listOfCards[j][listOfFields[i]].localURI, selected, false);
							selected = false;
							count++;
						} else {
							wdw_mergeCards.createHbox(aRow);
							wdw_mergeCards.createHbox(aRow);
						}
					}
				}
			}
			wdw_mergeCards.createVersionRow(aListRows, listOfCards);
			listOfFields = [ 'fn', 'lastname', 'firstname', 'othername', 'prefixname', 'suffixname', 'nickname', 'bday', 'org', 'title', 'role' ];
			for (var i in listOfFields) {
				if (wdw_mergeCards.addRowFromArray(listOfCards, listOfFields[i])) {
					var aRow = wdw_mergeCards.createRow(aListRows);
					wdw_mergeCards.createLabel(aRow, listOfFields[i] + 'Label' + j, listOfFields[i] + 'Label');
					var selected = true;
					var count = 0;
					for (var j = 0; j < listOfCards.length; j++) {
						if (listOfCards[j][listOfFields[i]]) {
							wdw_mergeCards.createCheckBox1(aRow, listOfFields[i] + 'Checkbox' + count, selected);
							wdw_mergeCards.createTextBox(aRow, listOfFields[i] + 'Textbox' + count, listOfCards[j][listOfFields[i]], selected, false);
							selected = false;
							count++;
						} else {
							wdw_mergeCards.createHbox(aRow);
							wdw_mergeCards.createHbox(aRow);
						}
					}
				}
			}
			listOfFields = [ 'categories' ];
			for (var i in listOfFields) {
				if (wdw_mergeCards.addRowFromArray(listOfCards, listOfFields[i])) {
					var length = 0
					for (var j = 0; j < listOfCards.length; j++) {
						if (length < listOfCards[j][listOfFields[i]].length) {
							length = listOfCards[j][listOfFields[i]].length;
						}
					}
					var count = 0;
					var arrayOfValues = [];
					for (var j = 0; j < length; j++) {
						var aRow = wdw_mergeCards.createRow(aListRows);
						wdw_mergeCards.createLabel(aRow, listOfFields[i] + 'Label' + j, listOfFields[i] + 'Label');
						for (var k = 0; k < listOfCards.length; k++) {
							if (listOfCards[k][listOfFields[i]][j]) {
								arrayOfValues.push(listOfCards[k][listOfFields[i]][j]);
								var selected = false;
								if (wdw_mergeCards.isValueNew(arrayOfValues)) {
									selected = true;
								}
								wdw_mergeCards.createCheckBox2(aRow, listOfFields[i] + count + 'Checkbox0', selected);
								wdw_mergeCards.createTextBox(aRow, listOfFields[i] + count + 'Textbox0', listOfCards[k][listOfFields[i]][j], selected, false, listOfCards[k][listOfFields[i]][j]);
								arrayOfValues = cardbookRepository.arrayUnique(arrayOfValues);
								count++;
							} else {
								wdw_mergeCards.createHbox(aRow);
								wdw_mergeCards.createHbox(aRow);
							}
						}
					}
				}
			}
			listOfFields = [ 'email' , 'tel', 'adr', 'impp', 'url' ];
			for (var i in listOfFields) {
				if (wdw_mergeCards.addRowFromArray(listOfCards, listOfFields[i])) {
					var length = 0
					for (var j = 0; j < listOfCards.length; j++) {
						if (length < listOfCards[j][listOfFields[i]].length) {
							length = listOfCards[j][listOfFields[i]].length;
						}
					}
					var count = 0;
					for (var j = 0; j < length; j++) {
						var aRow = wdw_mergeCards.createRow(aListRows);
						wdw_mergeCards.createLabel(aRow, listOfFields[i] + 'Label' + j, listOfFields[i] + 'Label');
						for (var k = 0; k < listOfCards.length; k++) {
							if (listOfCards[k][listOfFields[i]][j]) {
								wdw_mergeCards.createCheckBox2(aRow, listOfFields[i] + count + 'Checkbox0', true);
								var aHbox = wdw_mergeCards.createHbox(aRow);
								wdw_mergeCards.createTextBox(aHbox, listOfFields[i] + count + 'Textbox0', listOfCards[k][listOfFields[i]][j][1].join(","), true, true);
								wdw_mergeCards.createTextBox(aHbox, listOfFields[i] + count + 'Textbox1', listOfCards[k][listOfFields[i]][j][0].join(","), true, true, listOfCards[k][listOfFields[i]][j]);
								count++;
							} else {
								wdw_mergeCards.createHbox(aRow);
								wdw_mergeCards.createHbox(aRow);
							}
						}
					}
				}
			}
			listOfFields = [ 'note' ];
			for (var i in listOfFields) {
				if (wdw_mergeCards.addRowFromArray(listOfCards, listOfFields[i])) {
					var aRow = wdw_mergeCards.createRow(aListRows);
					wdw_mergeCards.createLabel(aRow, listOfFields[i] + 'Label' + j, listOfFields[i] + 'Label');
					var selected = true;
					var count = 0;
					for (var j = 0; j < listOfCards.length; j++) {
						if (listOfCards[j][listOfFields[i]]) {
							wdw_mergeCards.createCheckBox1(aRow, listOfFields[i] + 'Checkbox' + count, selected);
							wdw_mergeCards.createMultilineTextBox(aRow, listOfFields[i] + 'Textbox' + count, listOfCards[j][listOfFields[i]], selected, false);
							selected = false;
							count++;
						} else {
							wdw_mergeCards.createHbox(aRow);
							wdw_mergeCards.createHbox(aRow);
						}
					}
				}
			}
		},

		save: function () {
			listOfCards = window.arguments[0].cardsIn;
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			var myNewCard = new cardbookCardParser();
			myNewCard.dirPrefId = listOfCards[0].dirPrefId;
			myNewCard.version = wdw_mergeCards.version;
			listOfFields = [ 'fn', 'lastname', 'firstname', 'othername', 'prefixname', 'suffixname', 'nickname', 'bday', 'org', 'title', 'role', 'note' ];
			for (var i in listOfFields) {
				j = 0;
				while (true) {
					if (document.getElementById(listOfFields[i] + 'Checkbox' + j)) {
						var myCheckBox = document.getElementById(listOfFields[i] + 'Checkbox' + j);
						if (myCheckBox.checked) {
							myNewCard[listOfFields[i]] = document.getElementById(listOfFields[i] + 'Textbox' + j).value;
						}
					} else {
						break;
					}
					j++;
				}
			}
			listOfFields = [ 'categories' ];
			for (var i in listOfFields) {
				j = 0;
				while (true) {
					if (document.getElementById(listOfFields[i] + j + 'Checkbox0')) {
						var myCheckBox = document.getElementById(listOfFields[i] + j + 'Checkbox0');
						if (myCheckBox.checked) {
							myNewCard[listOfFields[i]].push(wdw_mergeCards.arrayField[listOfFields[i] + j]);
						}
					} else {
						break;
					}
					j++;
				}
				myNewCard[listOfFields[i]] = cardbookRepository.arrayUnique(myNewCard[listOfFields[i]]);
			}
			listOfFields = [ 'email' , 'tel', 'adr', 'impp', 'url' ];
			for (var i in listOfFields) {
				j = 0;
				while (true) {
					if (document.getElementById(listOfFields[i] + j + 'Checkbox0')) {
						var myCheckBox = document.getElementById(listOfFields[i] + j + 'Checkbox0');
						if (myCheckBox.checked) {
							myNewCard[listOfFields[i]].push(wdw_mergeCards.arrayField[listOfFields[i] + j]);
						}
					} else {
						break;
					}
					j++;
				}
			}
			listOfFields = [ 'photo' ];
			for (var i in listOfFields) {
				j = 0;
				while (true) {
					if (document.getElementById(listOfFields[i] + 'Checkbox' + j)) {
						var myCheckBox = document.getElementById(listOfFields[i] + 'Checkbox' + j);
						if (myCheckBox.checked) {
							myNewCard[listOfFields[i]].localURI = wdw_mergeCards.arrayField[listOfFields[i] + 'Textbox' + j];
						}
					} else {
						break;
					}
					j++;
				}
			}
			cardbookUtils.parseAdrsCard(myNewCard, myNewCard.adr);
			cardbookUtils.parseTelsCard(myNewCard, myNewCard.tel);
			cardbookUtils.parseEmailsCard(myNewCard, myNewCard.email);
			window.arguments[0].cardsOut = [myNewCard];
			close();
		},

		create: function () {
			window.arguments[0].action = "CREATE";
			wdw_mergeCards.save();
		},

		createAndReplace: function () {
			window.arguments[0].action = "CREATEANDREPLACE";
			wdw_mergeCards.save();
		},

		cancel: function () {
			window.arguments[0].action = "CANCEL";
			close();
		}

	};

};