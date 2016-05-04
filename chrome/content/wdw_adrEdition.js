if ("undefined" == typeof(wdw_adrEdition)) {
	var wdw_adrEdition = {
		
		load: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			document.getElementById('adrPostOfficeTextBox').value = cardbookUtils.undefinedToBlank(window.arguments[0].adrLine[0][0]);
			document.getElementById('adrExtendedAddrTextBox').value = cardbookUtils.undefinedToBlank(window.arguments[0].adrLine[0][1]);
			document.getElementById('adrStreetTextBox').value = cardbookUtils.undefinedToBlank(window.arguments[0].adrLine[0][2]);
			document.getElementById('adrLocalityTextBox').value = cardbookUtils.undefinedToBlank(window.arguments[0].adrLine[0][3]);
			document.getElementById('adrRegionTextBox').value = cardbookUtils.undefinedToBlank(window.arguments[0].adrLine[0][4]);
			document.getElementById('adrPostalCodeTextBox').value = cardbookUtils.undefinedToBlank(window.arguments[0].adrLine[0][5]);
			document.getElementById('adrCountryTextBox').value = cardbookUtils.undefinedToBlank(window.arguments[0].adrLine[0][6]);
			cardbookTypes.loadTypes("address", window.arguments[0].adrLine[1], window.arguments[0].adrLine[2], window.arguments[0].adrLine[3], window.arguments[0].version);
			document.getElementById('adrStreetTextBox').focus();
		},

		save: function () {
			if (cardbookTypes.validateTypes()) {
				window.arguments[0].adrLine[0][0] = document.getElementById('adrPostOfficeTextBox').value;
				window.arguments[0].adrLine[0][1] = document.getElementById('adrExtendedAddrTextBox').value;
				window.arguments[0].adrLine[0][2] = document.getElementById('adrStreetTextBox').value;
				window.arguments[0].adrLine[0][3] = document.getElementById('adrLocalityTextBox').value;
				window.arguments[0].adrLine[0][4] = document.getElementById('adrRegionTextBox').value;
				window.arguments[0].adrLine[0][5] = document.getElementById('adrPostalCodeTextBox').value;
				window.arguments[0].adrLine[0][6] = document.getElementById('adrCountryTextBox').value;
				var parsedTypes = cardbookTypes.getParsedTypes("address", window.arguments[0].adrLine[2]);
				window.arguments[0].adrLine[1] = parsedTypes.types;
				window.arguments[0].adrLine[2] = parsedTypes.pgName;
				window.arguments[0].adrLine[3] = parsedTypes.pgValue;
				window.arguments[0].action = "SAVE";
				close();
			}
		},

		cancel: function () {
			window.arguments[0].action = "CANCEL";
			close();
		}

	};

};