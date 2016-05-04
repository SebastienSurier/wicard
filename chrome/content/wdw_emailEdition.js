if ("undefined" == typeof(wdw_emailEdition)) {
	var wdw_emailEdition = {
		
		load: function () {
			document.getElementById('emailValueTextBox').value = cardbookUtils.undefinedToBlank(window.arguments[0].emailLine[0][0]);
			document.getElementById('emailValueTextBox').focus();
			cardbookTypes.loadTypes("email", window.arguments[0].emailLine[1], window.arguments[0].emailLine[2], window.arguments[0].emailLine[3], window.arguments[0].version);
		},

		save: function () {
			if (cardbookTypes.validateTypes()) {
				window.arguments[0].emailLine[0][0] = document.getElementById('emailValueTextBox').value;
				var parsedTypes = cardbookTypes.getParsedTypes("email", window.arguments[0].emailLine[2]);
				window.arguments[0].emailLine[1] = parsedTypes.types;
				window.arguments[0].emailLine[2] = parsedTypes.pgName;
				window.arguments[0].emailLine[3] = parsedTypes.pgValue;
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