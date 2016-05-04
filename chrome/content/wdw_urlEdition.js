if ("undefined" == typeof(wdw_urlEdition)) {
	var wdw_urlEdition = {
		
		load: function () {
			document.getElementById('urlValueTextBox').value = window.arguments[0].urlLine[0][0];
			document.getElementById('urlValueTextBox').focus();
			cardbookTypes.loadTypes("url", window.arguments[0].urlLine[1], window.arguments[0].urlLine[2], window.arguments[0].urlLine[3], window.arguments[0].version);
		},

		save: function () {
			if (cardbookTypes.validateTypes()) {
				window.arguments[0].urlLine[0][0] = document.getElementById('urlValueTextBox').value;
				var parsedTypes = cardbookTypes.getParsedTypes("url", window.arguments[0].urlLine[2]);
				window.arguments[0].urlLine[1] = parsedTypes.types;
				window.arguments[0].urlLine[2] = parsedTypes.pgName;
				window.arguments[0].urlLine[3] = parsedTypes.pgValue;
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