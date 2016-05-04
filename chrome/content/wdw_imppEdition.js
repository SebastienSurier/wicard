if ("undefined" == typeof(wdw_imppEdition)) {
	var wdw_imppEdition = {
		
		load: function () {
			document.getElementById('imppValueTextBox').value = cardbookUtils.undefinedToBlank(window.arguments[0].imppLine[0][0]);
			document.getElementById('imppValueTextBox').focus();
			cardbookTypes.loadTypes("impp", window.arguments[0].imppLine[1], window.arguments[0].imppLine[2], window.arguments[0].imppLine[3], window.arguments[0].version);
		},

		save: function () {
			if (cardbookTypes.validateTypes()) {
				window.arguments[0].imppLine[0][0] = document.getElementById('imppValueTextBox').value;
				var parsedTypes = cardbookTypes.getParsedTypes("impp", window.arguments[0].imppLine[2]);
				window.arguments[0].imppLine[1] = parsedTypes.types;
				window.arguments[0].imppLine[2] = parsedTypes.pgName;
				window.arguments[0].imppLine[3] = parsedTypes.pgValue;
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