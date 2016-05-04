if ("undefined" == typeof(wdw_telEdition)) {
	var wdw_telEdition = {
		
		load: function () {
			document.getElementById('telValueTextBox').value = cardbookUtils.undefinedToBlank(window.arguments[0].telLine[0][0]);
			document.getElementById('telValueTextBox').focus();
			cardbookTypes.loadTypes("tel", window.arguments[0].telLine[1], window.arguments[0].telLine[2], window.arguments[0].telLine[3], window.arguments[0].version);
		},

		save: function () {
			if (cardbookTypes.validateTypes()) {
				window.arguments[0].telLine[0][0] = document.getElementById('telValueTextBox').value;
				var parsedTypes = cardbookTypes.getParsedTypes("tel", window.arguments[0].telLine[2]);
				window.arguments[0].telLine[1] = parsedTypes.types;
				window.arguments[0].telLine[2] = parsedTypes.pgName;
				window.arguments[0].telLine[3] = parsedTypes.pgValue;
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