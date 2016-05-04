if ("undefined" == typeof(wdw_cardbookConfigurationTypes)) {
	var wdw_cardbookConfigurationTypes = {
		
		load: function () {
			document.getElementById('typeTextBox').value = window.arguments[0].type;
		},

		save: function () {
			window.arguments[0].type = document.getElementById('typeTextBox').value;
			window.arguments[0].typeAction="SAVE";
			close();
		},

		cancel: function () {
			window.arguments[0].typeAction="CANCEL";
			close();
		}

	};

};