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
	
	function updateFields(scope, pathname) {
		
		pathname = pathname || '';	
			
		Object.keys(scope).forEach(function(key) {
			
			if (scope[key] instanceof Object && !(scope[key] instanceof Array)) {
				
				var nextPathname = pathname + '[' + key + ']';
				updateFields(scope[key], nextPathname);
				
			} else {
				
				var curPathname = pathname + '[' + key + ']'; 
				curPathname = curPathname
					.replace('[', '')
					.replace(']', '')
					;
				
				if (scope[key] instanceof Array) {
					curPathname += '[]';
				}
				
				debugger
				var field = formElem.querySelector('[name="' + curPathname + '"]');
				field.value = scope[key];
			}
		});
		
	}
	
	return {
		make: function(formSelector) {
			
			formElem = document.querySelector(formSelector);
			
			var fb = {
				form: formElem,
				// CREATE
				// todo: make create elements by object
				
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
					debugger
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
				set data(v) {
					
					debugger
					
					updateFields(v);
					
				},
				
				updateDataByFieldName: function(v) {
					
					
				},
				
				updateFieldByFieldName: function(v) {
					
					
				},
				
				// DELETE 
			};
			
			return fb;
		}
	}
}());
