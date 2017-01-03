var FB = (function() {
	
	var formElem;
	
	function buildControlBox(label, fieldElem) {
		
		var controlBox;
		var controlLabelElem;
		var controlFieldElem;
		
		var standardElem = formElem.querySelector('*');
		if (standardElem) {
			
			controlBox = standardElem.cloneNode(true); 
			
			controlLabelElem = controlBox.querySelector('* label');
			if (!controlLabelElem) {
				controlLabelElem = document.createElement('label');
				controlBox.appendChild(controlLabelElem);
			}
			
			if (controlLabelElem.childNodes.length) {
				controlLabelElem.childNodes[0].textContent = label;
			} else {
				controlLabelElem.textContent = label;
			}
			
			controlFieldElem = controlBox.querySelector('* input');
			if (!controlFieldElem) {
				controlFieldElem = controlBox.querySelector('* select');
			}			
			
			if (controlFieldElem) {
				controlFieldElem.parentNode.insertBefore(fieldElem, controlFieldElem);
				controlFieldElem.parentNode.removeChild(controlFieldElem);
				
			} else {
				
				controlBox.appendChild(fieldElem);
			}
			
		} else {
			
			controlBox = document.createElement('div'); 				
			controlLabelElem = document.createElement('label');
			controlLabelElem.textContent = label;
			controlBox.appendChild(controlLabelElem);
			controlBox.appendChild(fieldElem);
		}
		
		return controlBox;
	}
	
	function readFromField(fieldElem) {
		
		var result = {};
		var parent = result;
		
		var startValue;
		splitPathname(fieldElem.name, function(key, i, parts){
			
			if (parts[i + 1] && parts[i + 1] === ']') {
				startValue = [];
			} else {
				startValue = Object.create({});
			}
			
			if (i === parts.length - 1) {
				
				if (parent instanceof Array) {
				
					if (fieldElem.selectedOptions instanceof HTMLCollection) {
					
						[].forEach.call(fieldElem.selectedOptions, function(optionElem) {
							parent.push(optionElem.value);
						});
					
					} else {
						
						parent.push(fieldElem.value);
					}
				
				} else {
					
					parent[key] = fieldElem.value;
				}
				
			} else {
				
				parent[key] = parent[key] || startValue;
			}
			
			parent = parent[key];
		});
		
		return result;
	}
	
	function updateFields(scope, pathname, fresh) {
		
		pathname = pathname || '';	
			
		Object.keys(scope).forEach(function(key) {
			
			if (scope[key] instanceof Object && !(scope[key] instanceof Array)) {
				
				var nextPathname = pathname + '[' + key + ']';
				updateFields(scope[key], nextPathname, fresh);
				
			} else {
				
				var curPathname = pathname + '[' + key + ']'; 
				curPathname = curPathname
					.replace('[', '')
					.replace(']', '')
				;
				
				if (scope[key] instanceof Array) {
					curPathname += '[]';
				}
				
				var fieldElem;
				if (fresh) {
					
					var label;
					if (scope[key] instanceof Array) {
						
						fieldElem = document.createElement('select');
						
						var option = document.createElement('option');
						
						scope[key].forEach(function(v) {
							
							option.value = v;
							if (option.value) {
								option.textContent = option.value.replace(/_/g, ' ');
								option.textContent = option.textContent[0].toUpperCase() + option.textContent.slice(1);
							}
							
							fieldElem.appendChild(option.cloneNode(true));
						});
						
						fieldElem.value = option.value;

						label = '';
						splitPathname(curPathname, function(key, i, parts) {
							if (i === 0) {
								key = key[0].toUpperCase() + key.slice(1);
								label += key.replace(/_/g, ' ');
							}
							
							if (i === parts.length - 1) {
								label += key.replace(/_/g, ' ');
							}
						});
						
						label += ': ';
						
					} else {
						
						fieldElem = document.createElement('input');
						fieldElem.type = 'text';
						fieldElem.value = scope[key];
						
						label = key[0].toUpperCase() + key.slice(1) + ': ';
						label = label.replace(/_/g, ' ');
					}
					
					fieldElem.name = curPathname;
					
					var controlBox = buildControlBox(label, fieldElem);
					formElem.appendChild(controlBox);
					
				} else {
					
					fieldElem = formElem.querySelector('[name="' + curPathname + '"]');
					if (fieldElem) {
						if (scope[key] instanceof Array 
							&& 
							fieldElem.tagName === 'SELECT' 
							&& 
							fieldElem.multiple
						) {
							[].forEach.call(fieldElem.options, function(option) {
								option.selected = scope[key].indexOf(option.value) !== -1;
							});
							
						} else {
							
							fieldElem.value = scope[key];
						}
						
					} else {
						console.error('Field with name is "' + curPathname + '" not found.')
					}
				}
			}
		});
	}
	
	function clearForm() {
		var fields = formElem.querySelectorAll('[name]');					
		[].forEach.call(fields, function(fieldElem) {					
			fieldElem.value = null;
		});
	}
	
	function splitPathname(pathname, callback) {
		var parts = pathname.split('[');
		parts.forEach(function(part, i) {
			callback(part.replace(']', ''), i, parts);
		});
	}
	
	function objectMerge() {
		
		var result = {};
		for (var i = 0; i < arguments.length; i++) {
			var obj = arguments[i];

			if (!obj) {
				continue;
			}

			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (typeof obj[key] === 'object' && !(obj[key] instanceof Array)) {
					  
					  result[key] = objectMerge(result[key], obj[key]);
					
					} else {
					  
					  if (result[key] instanceof Array && obj[key] instanceof Array) {

						result[key] = result[key].concat(obj[key]);
						
					  } else {
						
						result[key] = obj[key];						
					  }
					}
				}
			}
		}

		return result;
	};
	
	return {
		make: function(formSelector, options) {
			
			formElem = document.querySelector(formSelector);
			
			options = options || [];
			options.forEach(function(option) {
				
				var specFields = formElem.querySelectorAll(option.selector);
				[].forEach.call(specFields, function(fieldElem) {
					Object.defineProperty(fieldElem, 'value', {
						get: option.getter,
						set: option.setter,
						configurable: true
					});  
				});
			});
			
			return {
				form: formElem,
				
				// CREATE
				create: function(schema) {
					updateFields(schema, null, true);
				},
				
				// READ
				get data() {					
					var fields = formElem.querySelectorAll('[name]');
					var data = {};
					[].forEach.call(fields, function(fieldElem) {					
						data = objectMerge(data, readFromField(fieldElem));
					});
					
					return data;
				},
				readDataByFieldName: function(fieldName) {
					var fieldElem = formElem.querySelector('[name="' + fieldName + '"]');
					return readFromField(fieldElem);
				},
				readDataByFieldSelector: function(selector) {
					var fields = formElem.querySelectorAll(selector);
					var data = {};
					[].forEach.call(fields, function(fieldElem) { 
						data = objectMerge(data, readFromField(fieldElem));
					});
					
					return data;
				},
				
				// UPDATE
				set data(schema) {
					if (schema) {
						updateFields(schema);
					} else {
						throw new Error('Bad data.');
					}
				},
				
				// DELETE
				clear: function() {
					clearForm();
				}
			};
		}
	}
}());
