/*
 * https://github.com/kitstech/KitsFormController
 * Kits Form Controller(Requires jQuery)
 * Version 0.6.0
 */
function KitsFormController(formId) {
	if(typeof $ == 'undefined') {
		console.error('Cannot find jQuery symbol $');
		return;
	}
	var that = this;
	var initObj = $();
	var form = (that.blank(formId) == '') ? initObj : $('#' + formId);
	var impl = {
		get: function(selector) {
			return form.find(selector);
		},
		getValue: function(selector) {
			return that.blank(this.get(selector).val());
		},
		setValue: function(selector, value) {
			this.get(selector).val(that.blank(value));
		},
		setDisabled: function(selector, flag) {
			this.get(selector).attr('disabled', this.verify(flag));
		},
		setReadonly: function(selector, flag) {
			this.get(selector).attr('readonly', this.verify(flag));
		},
		verify: function(flag) {
			return ((typeof flag == 'undefined') ? true : ((typeof flag == 'boolean') ? flag : ((typeof flag == 'string' && (/^false$/i).test(flag)) ? false : !!flag)));
		}
	};
	
	this.get = function(name) {
		return (that.blank(name) == '') ? initObj : impl.get('[name=' + name + ']');
	};
	this.getById = function(id) {
		return (that.blank(id) == '') ? initObj : impl.get('#' + id);
	};
	
	this.getValue = function(name) {
		return (that.blank(name) == '') ? '' : impl.getValue('[name=' + name + ']');
	};
	this.getValueById = function(id) {
		return (that.blank(id) == '') ? '' : impl.getValue('#' + id);
	};
	
	this.setValue = function(name, value) {
		if(that.blank(name) != '') impl.setValue('[name=' + name + ']', value);
		return this;
	};
	this.setValueById = function(id, value) {
		if(that.blank(id) != '') impl.setValue('#' + id, value);
		return this;
	};
	
	this.setDisabled = function(name, flag) {
		if(that.blank(name) != '') impl.setDisabled('[name=' + name + ']', flag);
		return this;
	};
	this.setDisabledById = function(id, flag) {
		if(that.blank(id) != '') impl.setDisabled('#' + id, flag);
		return this;
	};
	
	this.setReadonly = function(name, flag) {
		if(that.blank(name) != '') impl.setReadonly('[name=' + name + ']', flag);
		return this;
	};
	this.setReadonlyById = function(id, flag) {
		if(that.blank(id) != '') impl.setReadonly('#' + id, flag);
		return this;
	};
}

KitsFormController.prototype.blank = function(s, d) {
	if(typeof s == 'undefined' || s == null || s == '') {
		if(typeof d == 'undefined' || d == null) {
			return '';
		} else {
			return String(d);
		}
	} else {
		return String(s);
	}
};

/*
 * https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#%ED%8F%B4%EB%A6%AC%ED%95%84
 */
if(!String.prototype.startsWith) {
	String.prototype.startsWith = function(search, pos) {
		return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
	};
}