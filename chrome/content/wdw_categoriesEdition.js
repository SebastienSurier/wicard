if ("undefined" == typeof(wdw_categoriesEdition)) {
	var wdw_categoriesEdition = {
		
		getCategories: function () {
			var aListBox = document.getElementById('categoriesListbox');
			var myCategoryList = [];
		
			for (var i=0; i<aListBox.itemCount; i++) {
				var aItem = aListBox.getItemAtIndex(i);
				var aItemChecked = aItem.getAttribute('checked');
				aItemChecked = typeof aItemChecked == "boolean" ? aItemChecked : (aItemChecked == 'true' ? true : false);
				if (aItemChecked) {
					myCategoryList.push(aItem.getAttribute('value'));
				}
			}
			
			var aTextBox = document.getElementById('categoryTextbox');
			if (aTextBox.value != "") {
				myCategoryList.push(aTextBox.value);
			}

			return myCategoryList;
		},

		loadCategories: function (aDirPrefId, aCategoryList) {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			var aListBox = document.getElementById('categoriesListbox');
			while (aListBox.hasChildNodes()) {
				aListBox.removeChild(aListBox.firstChild);
			}
			for (var i = 0; i < cardbookRepository.cardbookAccountsCategories[aDirPrefId].length; i++) {
				if (cardbookRepository.cardbookAccountsCategories[aDirPrefId][i] != cardbookRepository.cardbookUncategorizedCards) {
					var aItem = aListBox.appendItem(cardbookRepository.cardbookAccountsCategories[aDirPrefId][i], cardbookRepository.cardbookAccountsCategories[aDirPrefId][i]);
					aItem.setAttribute('id', cardbookRepository.cardbookAccountsCategories[aDirPrefId][i]);
					aItem.setAttribute('type', 'checkbox');
				}
			}
			for (var i = 0; i < aCategoryList.length; i++) {
				if (document.getElementById(aCategoryList[i])) {
					var aItem = document.getElementById(aCategoryList[i]);
					aItem.setAttribute('checked', true);
				}
			}
		},

		load: function () {
			wdw_categoriesEdition.loadCategories(window.arguments[0].dirPrefId, window.arguments[0].categories);
			document.getElementById('categoryTextbox').value = "";
			document.getElementById('categoryTextbox').focus();
		},

		save: function () {
			window.arguments[0].categories = wdw_categoriesEdition.getCategories();
			window.arguments[0].action="SAVE";
			close();
		},

		cancel: function () {
			window.arguments[0].action="CANCEL";
			close();
		}

	};

};