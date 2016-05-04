if ("undefined" == typeof(cardbookMailPopularity)) {
	var cardbookMailPopularity = {

		updateMailPopularity: function (aEmail) {
			var listOfEmails = [];
			listOfEmails = cardbookUtils.getDisplayNameAndEmail(aEmail);
			for (var i = 0; i < listOfEmails.length; i++) {
				if (listOfEmails[i][1] == "") {
					continue;
				}
				if (cardbookRepository.cardbookMailPopularityIndex[listOfEmails[i][1]]) {
					cardbookRepository.cardbookMailPopularityIndex[listOfEmails[i][1]]++;
				} else {
					cardbookRepository.cardbookMailPopularityIndex[listOfEmails[i][1]] = 1;
				}
			}
			cardbookMailPopularity.writeBackgroundMailPopularity();
		},

		loadMailPopularity: function () {
			var cacheDir = cardbookRepository.getLocalDirectory();
			cacheDir.append(cardbookRepository.cardbookMailPopularityFile);
			
			if (cacheDir.exists()) {
				var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
				var myFileURI = ioService.newURI("file:///" + cacheDir.path, null, null);
				var fileContent = cardbookSynchronization.getFileData(myFileURI, "UTF8");
				
				var re = /[\n\u0085\u2028\u2029]|\r\n?/;
				var fileContentArray = fileContent.split(re);
				for (var i = 0; i < fileContentArray.length; i++) {
					var mySepPosition = fileContentArray[i].indexOf(":",0);
					var myEmail = fileContentArray[i].substr(0,mySepPosition);
					var myCount = fileContentArray[i].substr(mySepPosition+1,fileContentArray[i].length);
					if (myEmail != null && myEmail !== undefined && myEmail != "") {
						if (myCount != null && myCount !== undefined && myCount != "" && myCount != "0") {
							cardbookRepository.cardbookMailPopularityIndex[myEmail] = myCount;
						}
					}
				}
			}
		},

		lTimerLoad : null,
		lEventTimerLoad : { notify: function(lTimerLoad) {
			cardbookMailPopularity.loadMailPopularity();
		}
		},
		
		loadBackgroundMailPopularity: function () {
			cardbookMailPopularity.lTimerLoad = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			cardbookMailPopularity.lTimerLoad.initWithCallback(cardbookMailPopularity.lEventTimerLoad, 1000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
		},

		writeMailPopularity: function () {
			var cacheDir = cardbookRepository.getLocalDirectory();
			cacheDir.append(cardbookRepository.cardbookMailPopularityFile);
			
			if (!cacheDir.exists()) {
				// read and write permissions to owner and group, read-only for others.
				cacheDir.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
			}
			if (cacheDir.exists()) {
				var sortable = [];
				for (var mail in cardbookRepository.cardbookMailPopularityIndex) {
					sortable.push([mail, cardbookRepository.cardbookMailPopularityIndex[mail]]);
				}
				sortable.sort(function(a, b) {return b[1] - a[1]});

				var writable = [];
				for (var i = 0; i < sortable.length; i++) {
					var myEmail = sortable[i][0];
					var myCount = sortable[i][1];
					if (myEmail != null && myEmail !== undefined && myEmail != "") {
						if (myCount != null && myCount !== undefined && myCount != "" && myCount != "0") {
							writable.push([sortable[i].join(":").toLowerCase()]);
						}
					}
				}
				cardbookSynchronization.writeContentToFile(cacheDir.path, writable.join("\r\n"), "UTF8");
				wdw_cardbooklog.updateStatusProgressInformationWithDebug2("debug mode : Mail popularity writed to : " + cacheDir.path);
			}
		},

		lTimerWrite : null,
		lEventTimerWrite : { notify: function(lTimerWrite) {
			cardbookMailPopularity.writeMailPopularity();
		}
		},
		
		writeBackgroundMailPopularity: function () {
			cardbookMailPopularity.lTimerWrite = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			cardbookMailPopularity.lTimerWrite.initWithCallback(cardbookMailPopularity.lEventTimerWrite, 1000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
		},

		removeMailPopularity: function () {
			var cacheDir = cardbookRepository.getLocalDirectory();
			cacheDir.append(cardbookRepository.cardbookMailPopularityFile);
			
			if (cacheDir.exists() && cacheDir.isFile()) {
				cacheDir.remove(true);
			}
		}

	};

};