var FB = (function() {
	
	var formElem;
	
	function readFromField(field) {
		
		var result = {};
		var parent = result;
		var key;
	
		var parts = field.name.split('[');
	
		var startValue;
		
		parts.forEach(function(part, i){
			
			key = part.replace(']', '');

			if (parts[i + 1] && parts[i + 1] === ']') {
				startValue = [];
			} else {
				startValue = Object.create({});
			}
			
			if (i === parts.length - 1) {
				
				if (parent instanceof Array) {
				
					if (field.selectedOptions instanceof HTMLCollection) {
					
						[].forEach.call(field.selectedOptions, function(optionElem) {
							parent.push(optionElem.value);
						});
					
					} else {
						
						parent.push(field.value);
					}
				
				} else {
					
					parent[key] = field.value;
				}
				
			} else {
				
				parent[key] = parent[key] || startValue;
			}
			
			parent = parent[key];
		});
	
		return result;
	};
	
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
					  
					  result[key] = obj[key];
					}
				}
			}
		}

		return result;
	};
	
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
				
				var field;
				if (fresh) {
					
					debugger
					if (scope[key] instanceof Array) {
						field = document.createElement('select');
					} else {
						field = document.createElement('input');
						field.type = 'text';
					}
					
					formElem.appendChild(field);
					
				} else {
					
					field = formElem.querySelector('[name="' + curPathname + '"]');
				}
				
				field.value = scope[key];
			}
		});
	}
	
	function clearForm() {
		var fields = formElem.querySelectorAll('[name]');					
		[].forEach.call(fields, function(field) {					
			field.value = null;
		});
	}
	
	return {
		make: function(formSelector, options) {
			
			formElem = document.querySelector(formSelector);
			
			options = options || [];
			options.forEach(function(option){
				var specFields = formElem.querySelectorAll('[name="' + option.name + '"]');
				[].forEach.call(specFields, function(field) {
					Object.defineProperty(field, 'value', {
						get: option.getter,
						set: option.setter
					});  
				});
			});
			
			var fb = {
				form: formElem,
				// CREATE
				// todo: make create elements by object
				create: function(schema) {
					updateFields(schema, null, true);
				},
				
				// READ
				get data() {
					
					var fields = formElem.querySelectorAll('[name]');
					var data = {};
					[].forEach.call(fields, function(field) {					
						data = objectMerge(data, readFromField(field));
					});
					
					return data;
				},
				readDataByFieldName: function(fieldName) {
					var field = formElem.querySelector('[name="' + fieldName + '"]');
					return readFromField(field);
				},
				readDataByFieldSelector: function(selector) {
					var fields = formElem.querySelectorAll(selector);
					var data = {};
					[].forEach.call(fields, function(field) { 
						data = objectMerge(data, readFromField(field));
					});
					
					return data;
				},
				
				// UPDATE
				set data(schema) {
					if (schema === null) {
						clearForm();
					} else {
						updateFields(schema);
					}
				},
				
				// DELETE
				clear: function() {
					clearForm();
				}
			};
			
			return fb;
		}
	}
}());
