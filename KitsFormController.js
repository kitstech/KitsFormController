/*
 * https://github.com/kitstech/KitsFormController
 * Kits Form Controller(Requires jQuery)
 * Version 0.8.0
 */
function KitsFormController(formId) {
	if(typeof $ == 'undefined') {
		console.error('Cannot find jQuery symbol $');
		return;
	}
	var that = this;
	var constant = {
		initObj: $(),//Empty jQuery object
		delimiter: '::',//checkbox 등 다건의 name을 가진 요소의 value를 이어붙일 때 사용
		passingInputType: ['button', 'file', 'image', 'reset', 'submit']//value function에서 처리하지 않을 input요소의 type. 참조 https://www.w3schools.com/tags/att_input_type.asp
	};
	var form = (that.blank(formId) == '') ? constant.initObj : $('#' + formId);
	var impl = {
		get: function(selector) {
			return form.find(selector);
		},
		getValue: function(selector) {
			var list = this.get(selector), val = '', isSetById = (that.blank(selector).startsWith('#') ? true : false);
			if(!!list.length) {
				var isFirst = true, isValid = false;
				list.each(function(i, obj) {
					if(obj.tagName == 'INPUT') {
						if(constant.passingInputType.indexOf(obj.type) == -1) {
							if(obj.type == 'checkbox' || obj.type == 'radio') {
								if(isSetById) {//setValueById로 호출되었으면 체크여부 상관없이 해당 요소의 value값 반환
									isValid = true;
								} else {
									if(obj.checked) {
										isValid = true;
									}
								}
							} else {
								isValid = true;
							}
						}
					} else if(obj.tagName == 'SELECT') {
						isValid = true;
					} else if(obj.tagName == 'TEXTAREA') {
						isValid = true;
					}

					if(isValid) {
						if(isFirst) {
							val = encodeURIComponent(that.blank(obj.value));
							isFirst = false;
						} else {
							val += (that.getDelimiter() + encodeURIComponent(that.blank(obj.value)));
						}
						isValid = false;
					}
				});
			}
			return that.blank(val);
		},
		setValue: function(selector, value) {
			var list = this.get(selector), valArr = that.blank(value).split(that.getDelimiter()), isSetById = (that.blank(selector).startsWith('#') ? true : false), _this = this;
			if(!!list.length) {
				list.each(function(i, obj) {
					if(obj.tagName == 'INPUT') {
						if(constant.passingInputType.indexOf(obj.type) == -1) {
							if(obj.type == 'checkbox' || obj.type == 'radio') {
								if(isSetById) {//setValueById로 호출되었으면 value값에 따라 해당 ID의 요소를 체크/체크해제 처리
									obj.checked = _this.verify(value);
								} else {
									if(valArr.indexOf(obj.value) > -1) {
										obj.checked = true;
									}
								}
							} else {
								obj.value = valArr.length == 1 ? valArr[0] : valArr[i] || '';
							}
						}
					} else if(obj.tagName == 'SELECT') {
						obj.value = valArr.length == 1 ? valArr[0] : valArr[i] || '';
					} else if(obj.tagName == 'TEXTAREA') {
						obj.value = valArr.length == 1 ? valArr[0] : valArr[i] || '';
					}
				});
			}
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
	
	this.getDelimiter = function() {
		return constant.delimiter;
	};
	this.setDelimiter = function(str) {
		constant.delimiter = that.blank(str);
		return this;
	};
	
	this.get = function(name) {
		return (that.blank(name) == '') ? constant.initObj : impl.get('[name=' + name + ']');
	};
	this.getById = function(id) {
		return (that.blank(id) == '') ? constant.initObj : impl.get('#' + id);
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

	this.getFormData2Object = function() {
		var result = {}, names = [];
		var all = form.find('input, select, textarea');
		all.each(function(i, obj) {
			if(that.blank(obj.name) != '') {
				names.push(obj.name);
			}
		});
		var uniq = names.reduce(function(a, b) {
			if(a.indexOf(b) < 0) a.push(b);
			return a;
		}, []);
		for(var i=0; i<uniq.length; i++) {
			result[uniq[i]] = that.getValue(uniq[i]);
		}
		return result;
	};
	this.getFormData2String = function() {
		var result = [], names = [];
		var all = form.find('input, select, textarea');
		all.each(function(i, obj) {
			if(that.blank(obj.name) != '') {
				names.push(obj.name);
			}
		});
		var uniq = names.reduce(function(a, b) {
			if(a.indexOf(b) < 0) a.push(b);
			return a;
		}, []);
		for(var i=0; i<uniq.length; i++) {
			result.push([uniq[i], that.getValue(uniq[i])].join('='));
		}
		return result.join('&');
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