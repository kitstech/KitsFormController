/*
 * https://github.com/kitstech/KitsFormController
 * Kits Form Controller(Requires jQuery)
 * Version 0.12.0
 */
function KitsFormController(formId, opt) {
	if(typeof $ == 'undefined') {
		console.error('Cannot find jQuery symbol $');
		return;
	}
	opt = ($.type(opt) == 'object') ? opt : {};
	var that = this;
	var constant = {
		emptyJqObj: $(),//Empty jQuery object
		delimiter: ',',//checkbox 등 다건의 name을 가진 요소의 value를 이어붙일 때 사용
		passingInputType: ['button', 'file', 'image', 'reset', 'submit']//value function에서 처리하지 않을 input요소의 type. 참조 https://www.w3schools.com/tags/att_input_type.asp
	};
	var form = (that.blank(formId) == '') ? constant.emptyJqObj : $('#' + formId);
	var impl = {
		get: function(selector) {
			return form.find(selector);
		},
		getValue: function(selector) {
			var result = '';
			var list = this.get(selector), isSetById = (that.blank(selector).startsWith('#') ? true : false);
			if(!!list.length) {
				var isFirst = true, isValid = false;
				list.each(function(i, v) {
					if(v.tagName == 'INPUT') {
						if(constant.passingInputType.indexOf(v.type) == -1) {
							if(v.type == 'checkbox' || v.type == 'radio') {
								if(isSetById) {//setValueById로 호출되었으면 체크여부 상관없이 해당 요소의 value값 반환
									isValid = true;
								} else {
									if(v.checked) {
										isValid = true;
									}
								}
							} else {
								isValid = true;
							}
						}
					} else if(v.tagName == 'SELECT') {
						isValid = true;
					} else if(v.tagName == 'TEXTAREA') {
						isValid = true;
					}

					if(isValid) {
						if(isFirst) {
							result = that.encode(that.blank(v.value));
							isFirst = false;
						} else {
							result += (that.getDelimiter() + that.encode(that.blank(v.value)));
						}
						isValid = false;
					}
				});
			}
			return that.blank(result);
		},
		setValue: function(selector, value) {
			var list = this.get(selector), isSetById = (that.blank(selector).startsWith('#') ? true : false);
			if(!!list.length) {
				var _this = this, arr = that.blank(value).split(that.getDelimiter());
				list.each(function(i, v) {
					if(v.tagName == 'INPUT') {
						if(constant.passingInputType.indexOf(v.type) == -1) {
							if(v.type == 'checkbox' || v.type == 'radio') {
								if(isSetById) {//setValueById로 호출되었으면 value값에 따라 해당 ID의 요소를 체크/체크해제 처리
									v.checked = _this.verify(value);
								} else {
									if(arr.indexOf(v.value) > -1) {
										v.checked = true;
									}
								}
							} else {
								v.value = arr.length == 1 ? arr[0] : arr[i] || '';
							}
						}
					} else if(v.tagName == 'SELECT') {
						v.value = arr.length == 1 ? arr[0] : arr[i] || '';
					} else if(v.tagName == 'TEXTAREA') {
						v.value = arr.length == 1 ? arr[0] : arr[i] || '';
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

	this.encode = function(str) {
		if(/base64/i.test(that.blank(opt.crypto))) {
			/*
			 * https://developer.mozilla.org/ko/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
			 */
			return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
				function toSolidBytes(match, p1) {
					return String.fromCharCode('0x' + p1);
			}));
		} else {
			/*
			 * RFC 3986 (다음과 같은 예약어 포함 !, ', (, ), *) 권고에 보다 엄격하게 적용
			 * https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
			 */
			return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
		}
	};
	this.decode = function(str) {
		if(/base64/i.test(that.blank(opt.crypto))) {
			/*
			 * https://developer.mozilla.org/ko/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
			 */
			return decodeURIComponent(atob(str).split('').map(function(c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			}).join(''));
		} else {
			return decodeURIComponent(str);
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

	this.getFormData2Object = function(obj, opt) {
		var result = {}, list = that.getNames(), opt = opt || {append: false};
		for(var i=0; i<list.length; i++) {
			result[list[i]] = that.getValue(list[i]);
		}

		if(typeof obj == 'string') {
			var str = (obj.startsWith('?') || obj.startsWith('&')) ? obj.substring(1) : obj;
			var key, val, arr;
			$.each(str.split('&'), function(i, v) {
				arr = v.split('='), key = arr[0];
				if(arr.length > 2) {
					arr.shift();
					val = fc.encode(arr.join('='));
				} else if(arr.length == 2) {
					val = that.encode(arr[1]);
				}
				if(opt.append == true) {
					if((typeof result[key] == 'undefined')) {
						result[key] = val;
					} else {
						result[key] = [result[key], val].join(that.getDelimiter());
					}
				} else {
					result[key] = val;
				}
			});
		} else if(typeof obj == 'object') {
			var val = '';
			if(obj.constructor == Array) {
				$.each(obj, function(i, v) {
					$.each(v, function(j, w) {
						val = that.encode(that.blank(w));
						if(impl.verify(opt.append)) {
							if((typeof result[j] == 'undefined')) {
								result[j] = val;
							} else {
								result[j] = [result[j], val].join(that.getDelimiter());
							}
						} else {
							result[j] = val;
						}
					});
				});
			}
			if(obj.constructor == Object) {
				$.each(obj, function(i, v) {
					val = that.encode(that.blank(v));
					if(opt.append == true) {
						if((typeof result[i] == 'undefined')) {
							result[i] = val;
						} else {
							result[i] = [result[i], val].join(that.getDelimiter());
						}
					} else {
						result[i] = that.encode(v);
					}
				});
			}
		}
		return result;
	};
	this.getFormData2String = function(obj) {
		var result = [], list = that.getNames();
		for(var i=0; i<list.length; i++) {
			result.push([list[i], that.getValue(list[i])].join('='));
		}

		if(typeof obj == 'string') {
			result.push((obj.startsWith('?') || obj.startsWith('&')) ? obj.substring(1) : obj);
		} else if(typeof obj == 'object') {
			if(obj.constructor == Array) {
				$.each(obj, function(i, v) {
					$.each(v, function(j, w) {
						result.push([j, that.encode(w)].join('='));
					});
				});
			}
			if(obj.constructor == Object) {
				$.each(obj, function(i, v) {
					result.push([i, that.encode(v)].join('='));
				});
			}
		}
		return result.join('&');
	};

	this.getNames = function() {
		var names = [], all = form.find('input, select, textarea');
		all.each(function(i, v) {
			if(that.blank(v.name) != '') {
				names.push(v.name);
			}
		});
		return (names.reduce(function(a, b) {
			if(a.indexOf(b) < 0) a.push(b);
			return a;
		}, []));
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