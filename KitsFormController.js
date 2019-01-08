/*
 * https://github.com/kitstech/KitsFormController
 * Kits Form Controller(Requires jQuery)
 * Version 0.5.6
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
			return this.get(selector).val();
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
			result[v.name] = encodeURIComponent(v.value);
		});
		if(typeof obj == 'string') {
			var arr, key, val;
			$.each(obj.split('&'), function(k, v) {
				arr = v.split('='), key = arr[0];
				if(arr.length > 1) {
					arr.shift();
					val = encodeURIComponent(arr.join('='));
				} else if(arr.length == 1) {
					val = encodeURIComponent(arr[1]);
				} else {
					val = '';
				}
				result[key] = val;
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