if ("undefined" == typeof(wdw_noteEdition)) {
	var wdw_noteEdition = {
		
		load: function () {
			document.getElementById('noteTextBox').value = window.arguments[0].note;
			document.getElementById('noteTextBox').focus();
		},

		save: function () {
			window.arguments[0].note = document.getElementById('noteTextBox').value;
			window.arguments[0].action="SAVE";
			close();
		},

		cancel: function () {
			window.arguments[0].action="CANCEL";
			close();
		}

	};

};