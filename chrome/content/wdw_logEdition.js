if ("undefined" == typeof(wdw_logEdition)) {
	var wdw_logEdition = {
		
		load: function () {
			Components.utils.import("chrome://cardbook/content/cardbookRepository.js");
			var myLogArray = cardbookRepository.statusInformation;

			var myTreeView = {
				rowCount : myLogArray.length,
				getCellText : function(row,column){
					if (column.id == "logEditionLine") return myLogArray[row];
					else return myLogArray[row];
				}
			}
			document.getElementById('logEditionTree').view = myTreeView;
		},

		clipboard: function () {
			try {
				var myTree = document.getElementById('logEditionTree');
				var myLogArray = [];
				var numRanges = myTree.view.selection.getRangeCount();
				if (numRanges > 0) {
					for (var i = 0; i < numRanges; i++) {
						var start = new Object();
						var end = new Object();
						myTree.view.selection.getRangeAt(i,start,end);
						for (var j = start.value; j <= end.value; j++){
							myLogArray.push(myTree.view.getCellText(j, {id: "logEditionLine"}));
						}
					}
					cardbookUtils.clipboardSet(myLogArray.join("\n"));
				}
			}
			catch (e) {
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
				var errorTitle = "clipboard error";
				prompts.alert(null, errorTitle, e);
			}
		},

		flush: function () {
			cardbookRepository.statusInformation = [];
			wdw_logEdition.load();
		},

		cancel: function () {
			close();
		}

	};

};