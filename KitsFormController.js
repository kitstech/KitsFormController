/*
 * https://github.com/kitstech/KitsFormController
 * Kits Form Controller(Requires jQuery)
 * Version 0.13.0
 */
function KitsFormController(formId) {
	if(typeof $ == 'undefined') {
		console.error('Cannot find jQuery symbol $');
		return;
	}
	var that = this;
	var constant = {
		emptyJqObj: $([])//Empty jQuery object
	};
	var form = (that.blank(formId) == '') ? constant.emptyJqObj : $('#' + formId);
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
		return (that.blank(name) == '') ? constant.emptyJqObj : impl.get('[name=' + name + ']');
	};
	this.getById = function(id) {
		return (that.blank(id) == '') ? constant.emptyJqObj : impl.get('#' + id);
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

	this.getFormDataToObject = function(obj) {
		var result = {};
		$.each(form.serializeArray(), function(i, v) {
			result[v.name] = that.blank(v.value);
		});
		if($.type(obj) == 'object') {
			$.each(obj, function(i, v) {
				result[i] = that.blank(v);
			});
		} else if($.type(obj) == 'string') {
			var arr, key, val = '';
			$.each(obj.split('&'), function(i, v) {
				arr = taht.blank(v).split('='), key = arr[0];
				if(arr.length > 1) {
					val = arr[1];
				}
				result[key] = val;
			});
		}
		return result;
	};
	this.getFormDataToString = function(obj) {
		var result = form.serialize();
		if($.type(obj) == 'object') {
			$.each(obj, function(i, v) {
				if(result == '') {
					resul = [i, that.blank(v)].join('=');
				} else {
					result = [result, [i, that.blank(v)].join('=')].join('&');
				}
			});
		} else if($.type(obj) == 'string') {
			obj = (obj.startsWith('?') ? obj.substring(1) : obj);
			if(result == '') {
				result = obj;
			} else {
				result += ('&' + obj);
			}
		}
		return result;
	};
}

KitsFormController.prototype.blank = function(s, d) {
	if(typeof s == 'undefined' || s == null || s === '') {
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