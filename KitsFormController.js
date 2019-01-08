/*
 * https://github.com/kitstech/KitsFormController
 * Kits Form Controller(Requires jQuery)
 * Version 0.4.0
 */
function KitsFormController(formId) {
	if(typeof $ == 'undefined') {
		console.error('Cannot find jQuery symbol $');
		return;
	}
	var _this = this;
	var initObj = $();
	var form = (_this.blank(formId) == '') ? initObj : $('#' + formId);
	var impl = {
		get: function(selector) {
			return form.find(selector);
		},
		getValue: function(selector) {
			return this.get(selector).val();
		},
		setValue: function(selector, value) {
			this.get(selector).val(_this.blank(value));
		},
		setDisabled: function(selector, flag) {
			flag = ((typeof flag == 'undefined') ? true : ((typeof flag == 'boolean') ? flag : ((typeof flag == 'string' && (/^false$/i).test(flag)) ? false : !!flag)));
			this.get(selector).attr('disabled', flag);
		},
		setReadonly: function(selector, flag) {
			flag = ((typeof flag == 'undefined') ? true : ((typeof flag == 'boolean') ? flag : ((typeof flag == 'string' && (/^false$/i).test(flag)) ? false : !!flag)));
			this.get(selector).attr('readonly', flag);
		}
	};
	
	this.getById = function(id) {
		return (_this.blank(id) == '') ? initObj : impl.get('#' + id);
	};
	this.get = function(name) {
		return (_this.blank(name) == '') ? initObj : impl.get('[name=' + name + ']');
	};
	
	this.getValueById = function(id) {
		return (_this.blank(id) == '') ? '' : impl.getValue('#' + id);
	};
	this.getValue = function(name) {
		return (_this.blank(name) == '') ? '' : impl.getValue('[name=' + name + ']');
	};
	
	this.setValueById = function(id, value) {
		if(_this.blank(id) != '') impl.setValue('#' + id, value);
		return this;
	};
	this.setValue = function(name, value) {
		if(_this.blank(name) != '') impl.setValue('[name=' + name + ']', value);
		return this;
	};
	
	this.setDisabledById = function(id, flag) {
		if(_this.blank(id) != '') impl.setDisabled('#' + id, flag);
		return this;
	};
	this.setDisabled = function(name, flag) {
		if(_this.blank(name) != '') impl.setDisabled('[name=' + name + ']', flag);
		return this;
	};
	
	this.setReadonlyById = function(id, flag) {
		if(_this.blank(id) != '') impl.setReadonly('#' + id, flag);
		return this;
	};
	this.setReadonly = function(name, flag) {
		if(_this.blank(name) != '') impl.setReadonly('[name=' + name + ']', flag);
		return this;
	};
	
	this.getFormData2String = function(obj) {
		var result = form.serialize();
		if(typeof obj == 'string') {
			var s = (obj.startsWith('?') ? obj.substring(1) : obj);
			s = (s.startsWith('&') ?  (result == '' ? s.substring(1) : s) :  (result == '' ? s :  '&' + s));
			result += s;
		}
		if(typeof obj == 'object') {
			if(obj.constructor == Array) {//obj는 [{string: string}, ...] 형태여야함
				$.each(obj, function(k, v) {
					if(typeof v == 'object' && v.constructor == Object) {
						$.each(v, function(key, val) {
							val = encodeURIComponent(val);
							if(result == '') {
								result = [key, val].join('=');
							} else {
								result = [result, [key, val].join('=')].join('&');
							}
						});
					}
				});
			}
			if(obj.constructor == Object) {//obj는 {string: string} 형태여야함
				$.each(obj, function(k, v) {
					v = encodeURIComponent(v);
					if(result == '') {
						result = [k, v].join('=');
					} else {
						result = [result, [k, v].join('=')].join('&');
					}
				});
			}
		}
		return result;
	};
	
	this.getFormData2Json = function(obj) {//Object로 반환되기에 동일한 키값 입력될시 마지막에 입력된 값으로 덮어써짐에 유의
		var result = {};
		$.each(form.serializeArray(), function(k, v) {
			result[v.name] = v.value;
		});
		if(typeof obj == 'string') {
			$.each(obj.split('&'), function(k, v) {
				v = encodeURIComponent(v);
				result[v.split('=')[0]] = ((v.split('=').length > 1) ? v.split('=')[1] : '');
			});
		}
		if(typeof obj == 'object') {
			if(obj.constructor == Array) {//obj는 [{string: string}, ...] 형태여야함
				$.each(obj, function(k, v) {
					if(typeof v == 'object' && v.constructor == Object) {
						$.each(v, function(key, val) {
							result[key] = encodeURIComponent(val);
						});
					}
				});
			}
			if(obj.constructor == Object) {//obj는 {string: string} 형태여야함
				$.each(obj, function(k, v) {
					result[k] = encodeURIComponent(v);
				});
			}
		}
		return result;
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
		return s;
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