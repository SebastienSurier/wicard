function cardbookPreferenceService(uniqueId) {
    this.mPreferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    this.prefCardbookRoot = "extensions.cardbook.";
    this.prefCardbookData = this.prefCardbookRoot + "data.";
    this.prefCardbookTypes = this.prefCardbookRoot + "types.";
    this.prefCardbookCustoms = this.prefCardbookRoot + "customs.";
    this.prefPath = this.prefCardbookData + uniqueId + ".";
}

cardbookPreferenceService.prototype = {
    mPreferencesService: null,
    prefPath: null,

	_arrayUnique: function (array) {
		var a = array.concat();
		for(var i=0; i<a.length; ++i) {
			for(var j=i+1; j<a.length; ++j) {
				if(a[i] === a[j])
					a.splice(j--, 1);
			}
		}
		return a;
	},
	
    _getBoolRootPref: function (prefName) {
		try {
			let value = this.mPreferencesService.getBoolPref(prefName);
			return value;
		}
		catch(e) {
			return false;
		}
    },

    _getBoolPref: function (prefName) {
		try {
			let value = this.mPreferencesService.getBoolPref(this.prefPath + prefName);
			return value;
		}
		catch(e) {
			return false;
		}
    },

    _setBoolRootPref: function (prefName, value) {
		try {
			this.mPreferencesService.setBoolPref(prefName, value);
		}
		catch(e) {
			dump("cardbookPreferenceService._setBoolRootPref : failed to set" + prefName + "\n" + e + "\n");
		}
    },

    _setBoolPref: function (prefName, value) {
		try {
			this.mPreferencesService.setBoolPref(this.prefPath + prefName, value);
		}
		catch(e) {
			dump("cardbookPreferenceService._setBoolPref : failed to set" + this.prefPath + prefName + "\n" + e + "\n");
		}
    },

    _getPref: function (prefName) {
		try {
			let value = this.mPreferencesService.getComplexValue(this.prefPath + prefName, Components.interfaces.nsISupportsString).data;
			return value;
		}
		catch(e) {
			return "";
		}
    },

    _setPref: function (prefName, value) {
		try {
			var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			str.data = value;
			this.mPreferencesService.setComplexValue(this.prefPath + prefName, Components.interfaces.nsISupportsString, str);
		}
		catch(e) {
			dump("cardbookPreferenceService._setPref : failed to set" + this.prefPath + prefName + "\n" + e + "\n");
		}
    },

    insertAddressSeedTypes: function () {
		this.setTypes("address",1,"HOME");
		this.setTypes("address",2,"WORK");
    },

    insertEmailSeedTypes: function () {
		this.setTypes("email",1,"HOME");
		this.setTypes("email",2,"WORK");
    },

    insertImppSeedTypes: function () {
		this.setTypes("impp",1,"HOME");
		this.setTypes("impp",1,"WORK");
    },

    insertTelSeedTypes: function () {
		this.setTypes("tel",1,"CELL");
		this.setTypes("tel",2,"FAX");
		this.setTypes("tel",3,"HOME");
		this.setTypes("tel",4,"WORK");
    },

    insertUrlSeedTypes: function () {
		this.setTypes("url",1,"HOME");
		this.setTypes("url",2,"WORK");
    },

    getAllTypesCategory: function () {
		try {
			var count = {};
			var finalResult = [];
			var result = this.mPreferencesService.getChildList(this.prefCardbookTypes, count);
			
			for (let i = 0; i < result.length; i++) {
				finalResult.push(result[i].replace(this.prefCardbookTypes,""));
			}
			finalResult = this._arrayUnique(finalResult);
			finalResult = finalResult.sort(function(a,b) {
				return a[0].localeCompare(b[0], 'en', {'sensitivity': 'base'});
			});
			return finalResult;
		}
		catch(e) {
			dump("cardbookPreferenceService.getAllTypesCategory error : " + e + "\n");
		}
    },

    getAllTypes: function () {
		try {
			var count = {};
			var finalResult = {};
			var result = this.mPreferencesService.getChildList(this.prefCardbookTypes, count);
			
			for (let i = 0; i < result.length; i++) {
				var prefName = result[i].replace(this.prefCardbookTypes, "");
				var prefValue = this.getTypes(prefName);
				var typeName = prefName.substring(0, prefName.indexOf("."));
				if (!(finalResult[typeName] != null && finalResult[typeName] !== undefined && finalResult[typeName] != "")) {
					finalResult[typeName] = [];
				}
				finalResult[typeName].push(prefValue);
			}
			return finalResult;
		}
		catch(e) {
			dump("cardbookPreferenceService.getAllTypes error : " + e + "\n");
		}
    },

    getAllTypesByType: function (aType) {
		try {
			var count = {};
			var finalResult = [];
			var result = this.mPreferencesService.getChildList(this.prefCardbookTypes + aType + ".", count);
			
			for (let i = 0; i < result.length; i++) {
				var prefName = result[i].replace(this.prefCardbookTypes, "");
				finalResult.push(this.getTypes(prefName));
			}
			finalResult = this._arrayUnique(finalResult);
			finalResult = finalResult.sort(function(a,b) {
				return a[0].localeCompare(b[0], 'en', {'sensitivity': 'base'});
			});
			return finalResult;
		}
		catch(e) {
			dump("cardbookPreferenceService.getAllTypesByType error : " + e + "\n");
		}
    },

    getAllCustoms: function () {
		try {
			let count = {};
			let finalResult = [];
			let result = this.mPreferencesService.getChildList(this.prefCardbookCustoms, count);
			for (let i = 0; i < result.length; i++) {
				finalResult.push(result[i].replace(this.prefCardbookCustoms,"") + ":" + this.getCustoms(result[i]));
			}
			return this._arrayUnique(finalResult);
		}
		catch(e) {
			dump("cardbookPreferenceService.getAllCustoms error : " + e + "\n");
		}
    },

    getAllPrefIds: function () {
		try {
			let count = {};
			let finalResult = [];
			let result = this.mPreferencesService.getChildList(this.prefCardbookData, count);
			for (let i = 0; i < result.length; i++) {
				result[i] = result[i].replace(this.prefCardbookData,"");
				finalResult.push(result[i].substring(0, result[i].indexOf(".")));
			}
			return this._arrayUnique(finalResult);
		}
		catch(e) {
			dump("cardbookPreferenceService.getAllPrefIds error : " + e + "\n");
		}
    },

    getTypes: function (prefName) {
		try {
			let value = this.mPreferencesService.getComplexValue(this.prefCardbookTypes + prefName, Components.interfaces.nsISupportsString).data;
			return value;
		}
		catch(e) {
			dump("cardbookPreferenceService.getTypes : failed to get" + this.prefCardbookTypes + prefName + "\n" + e + "\n");
		}
    },

    setTypes: function (aType, prefName, value) {
		try {
			var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			str.data = value;
			this.mPreferencesService.setComplexValue(this.prefCardbookTypes + aType + "." + prefName, Components.interfaces.nsISupportsString, str);
		}
		catch(e) {
			dump("cardbookPreferenceService.setTypes : failed to set" + this.prefCardbookTypes + aType + "." + prefName + "\n" + e + "\n");
		}
    },

    delTypes: function (aType) {
		try {
			if (aType != null && aType !== undefined && aType != "") {
				this.mPreferencesService.deleteBranch(this.prefCardbookTypes + aType);
			} else {
				this.mPreferencesService.deleteBranch(this.prefCardbookTypes);
			}
		}
		catch(e) {
			dump("cardbookPreferenceService.delTypes : failed to delete" + this.prefCardbookTypes + aType + "\n" + e + "\n");
		}
    },

    getCustoms: function (prefName) {
		try {
			let value = this.mPreferencesService.getComplexValue(prefName, Components.interfaces.nsISupportsString).data;
			return value;
		}
		catch(e) {
			dump("cardbookPreferenceService.getCustoms : failed to get" + prefName + "\n" + e + "\n");
		}
    },

    setCustoms: function (prefName, value) {
		try {
			var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			str.data = value;
			this.mPreferencesService.setComplexValue(this.prefCardbookCustoms + prefName, Components.interfaces.nsISupportsString, str);
		}
		catch(e) {
			dump("cardbookPreferenceService.setCustoms : failed to set" + this.prefCardbookCustoms + prefName + "\n" + e + "\n");
		}
    },

    delCustoms: function () {
		try {
			this.mPreferencesService.deleteBranch(this.prefCardbookCustoms);
		}
		catch(e) {
			dump("cardbookPreferenceService.delCustoms : failed to delete" + this.prefCardbookCustoms + "\n" + e + "\n");
		}
    },

    getId: function () {
        let id = this._getPref("id");
        return id;
    },

    setId: function (id) {
        this._setPref("id", id);
    },

    getName: function () {
        let name = this._getPref("name");
        return name;
    },

    setName: function (name) {
        this._setPref("name", name);
    },

    getUrl: function () {
        let url = this._getPref("url");
        let type = this._getPref("type");
        if (type !== "FILE") {
			if (url) {
				if (url[url.length - 1] != '/') {
					url += '/';
				}
			}
			return url;
		// for file opened with version <= 3.7
		} else {
			if (url !== "0") {
				return url;
			} else {
				let newUrl = this._getPref("name");
				this.setUrl(newUrl);
				return newUrl;
			}
		}
    },

    setUrl: function (url) {
        this._setPref("url", url);
    },

    getUser: function () {
        let user = this._getPref("user");
        return user;
    },

    setUser: function (user) {
        this._setPref("user", user);
    },

    getType: function () {
        let type = this._getPref("type");
        return type;
    },

    setType: function (type) {
        this._setPref("type", type);
    },

    getEnabled: function () {
        let enabled = this._getBoolPref("enabled");
        if (enabled === false) return false;
        else return true;
    },

    setEnabled: function (enabled) {
        this._setBoolPref("enabled", enabled);
    },

    getExpanded: function () {
        let expanded = this._getBoolPref("expanded");
        if (expanded === false) return false;
        else return true;
    },

    setExpanded: function (expanded) {
        this._setBoolPref("expanded", expanded);
    },

   getColor: function () {
        let color = this._getPref("color");
        if (color != null && color !== undefined && color != "") {
        	return color;
        } else {
        	return "#A8C2E1";
        }
    },

    setColor: function (color) {
        this._setPref("color", color);
    },

    getHideHeaders: function () {
        let hideheaders = this._getBoolRootPref("extensions.cardbook.hideheaders");
        if (hideheaders === true) return true;
        else return false;
    },

    setHideHeaders: function (hideheaders) {
        this._setBoolRootPref("extensions.cardbook.hideheaders", hideheaders);
    },

    delBranch: function () {
		try {
			this.mPreferencesService.deleteBranch(this.prefPath);
		}
		catch(e) {
			dump("cardbookPreferenceService.delBranch : failed to delete" + this.prefPath + "\n" + e + "\n");
		}
    },

};
