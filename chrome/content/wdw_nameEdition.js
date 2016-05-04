if ("undefined" == typeof(wdw_nameEdition)) {
	var wdw_nameEdition = {
		
		displayCustoms: function () {
			if (cardbookRepository.customFieldsLabel['customField1Name'] != null && cardbookRepository.customFieldsLabel['customField1Name'] !== undefined && cardbookRepository.customFieldsLabel['customField1Name'] != "") {
				document.getElementById('customField1NameLabel').setAttribute('hidden', 'false');
				document.getElementById('customField1NameTextBox').setAttribute('hidden', 'false');
			} else {
				document.getElementById('customField1NameLabel').setAttribute('hidden', 'true');
				document.getElementById('customField1NameTextBox').setAttribute('hidden', 'true');
			}
			if (cardbookRepository.customFieldsLabel['customField2Name'] != null && cardbookRepository.customFieldsLabel['customField2Name'] !== undefined && cardbookRepository.customFieldsLabel['customField2Name'] != "") {
				document.getElementById('customField2NameLabel').setAttribute('hidden', 'false');
				document.getElementById('customField2NameTextBox').setAttribute('hidden', 'false');
			} else {
				document.getElementById('customField2NameLabel').setAttribute('hidden', 'true');
				document.getElementById('customField2NameTextBox').setAttribute('hidden', 'true');
			}
		},

		load: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			document.getElementById('fnTextBox').value = window.arguments[0].fn;
			document.getElementById('lastnameTextBox').value = window.arguments[0].lastname;
			document.getElementById('firstnameTextBox').value = window.arguments[0].firstname;
			document.getElementById('othernameTextBox').value = window.arguments[0].othername;
			document.getElementById('suffixnameTextBox').value = window.arguments[0].suffixname;
			document.getElementById('prefixnameTextBox').value = window.arguments[0].prefixname;
			document.getElementById('nicknameTextBox').value = window.arguments[0].nickname;
			document.getElementById('customField1NameTextBox').value = window.arguments[0].customField1NameTextBox;
			document.getElementById('customField2NameTextBox').value = window.arguments[0].customField2NameTextBox;
			document.getElementById('customField1NameLabel').value = cardbookRepository.customFieldsLabel['customField1Name'];
			document.getElementById('customField2NameLabel').value = cardbookRepository.customFieldsLabel['customField2Name'];
			document.getElementById('lastnameTextBox').focus();
			wdw_nameEdition.displayCustoms();
		},

		save: function () {
			window.arguments[0].fn = document.getElementById('fnTextBox').value;
			window.arguments[0].lastname = document.getElementById('lastnameTextBox').value;
			window.arguments[0].firstname = document.getElementById('firstnameTextBox').value;
			window.arguments[0].othername = document.getElementById('othernameTextBox').value;
			window.arguments[0].suffixname = document.getElementById('suffixnameTextBox').value;
			window.arguments[0].prefixname = document.getElementById('prefixnameTextBox').value;
			window.arguments[0].nickname = document.getElementById('nicknameTextBox').value;
			window.arguments[0].customField1NameTextBox = document.getElementById('customField1NameTextBox').value;
			window.arguments[0].customField2NameTextBox = document.getElementById('customField2NameTextBox').value;
			window.arguments[0].action="SAVE";
			close();
		},

		cancel: function () {
			window.arguments[0].action="CANCEL";
			close();
		}

	};

};