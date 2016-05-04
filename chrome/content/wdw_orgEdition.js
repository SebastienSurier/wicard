if ("undefined" == typeof(wdw_orgEdition)) {
	var wdw_orgEdition = {
		
		displayCustoms: function () {
			if (cardbookRepository.customFieldsLabel['customField1Org'] != null && cardbookRepository.customFieldsLabel['customField1Org'] !== undefined && cardbookRepository.customFieldsLabel['customField1Org'] != "") {
				document.getElementById('customField1OrgLabel').setAttribute('hidden', 'false');
				document.getElementById('customField1OrgTextBox').setAttribute('hidden', 'false');
			} else {
				document.getElementById('customField1OrgLabel').setAttribute('hidden', 'true');
				document.getElementById('customField1OrgTextBox').setAttribute('hidden', 'true');
			}
			if (cardbookRepository.customFieldsLabel['customField2Org'] != null && cardbookRepository.customFieldsLabel['customField2Org'] !== undefined && cardbookRepository.customFieldsLabel['customField2Org'] != "") {
				document.getElementById('customField2OrgLabel').setAttribute('hidden', 'false');
				document.getElementById('customField2OrgTextBox').setAttribute('hidden', 'false');
			} else {
				document.getElementById('customField2OrgLabel').setAttribute('hidden', 'true');
				document.getElementById('customField2OrgTextBox').setAttribute('hidden', 'true');
			}
		},

		load: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			document.getElementById('orgTextBox').value = window.arguments[0].org;
			document.getElementById('titleTextBox').value = window.arguments[0].title;
			document.getElementById('roleTextBox').value = window.arguments[0].role;
			document.getElementById('customField1OrgTextBox').value = window.arguments[0].customField1OrgTextBox;
			document.getElementById('customField2OrgTextBox').value = window.arguments[0].customField2OrgTextBox;
			document.getElementById('customField1OrgLabel').value = cardbookRepository.customFieldsLabel['customField1Org'];
			document.getElementById('customField2OrgLabel').value = cardbookRepository.customFieldsLabel['customField2Org'];
			document.getElementById('orgTextBox').focus();
			wdw_orgEdition.displayCustoms();
		},

		save: function () {
			window.arguments[0].org = document.getElementById('orgTextBox').value;
			window.arguments[0].title = document.getElementById('titleTextBox').value;
			window.arguments[0].role = document.getElementById('roleTextBox').value;
			window.arguments[0].customField1OrgTextBox = document.getElementById('customField1OrgTextBox').value;
			window.arguments[0].customField2OrgTextBox = document.getElementById('customField2OrgTextBox').value;
			window.arguments[0].action="SAVE";
			close();
		},

		cancel: function () {
			window.arguments[0].action="CANCEL";
			close();
		}

	};

};