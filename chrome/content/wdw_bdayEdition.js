if ("undefined" == typeof(wdw_bdayEdition)) {
	var wdw_bdayEdition = {
		
		load: function () {
			document.getElementById('bdayTextBox').value = window.arguments[0].bday;
			document.getElementById('bdayTextBox').focus();
		},

		save: function () {
			window.arguments[0].bday = document.getElementById('bdayTextBox').value;
			window.arguments[0].action="SAVE";
			close();
		},

		cancel: function () {
			window.arguments[0].action="CANCEL";
			close();
		}

	};

};