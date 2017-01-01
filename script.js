var fb = FB.make('#user-form', [{
	name: 'method',
	getter: function() {
		return this.selectedOptions[0].dataset.value;
	},
	setter: function(v) {
		
		[].forEach.call(this.options, function(optionElem) {
			if (optionElem.dataset.value === v) {
				optionElem.selected = true;
				return false;
			}
		});
	}
}]);

// Create
fb.create({
	info: 'abc',
	params: {
		email: 'asds@dsad'
	}
};

// Read
console.table(fb.data);

// Update
fb.data = {
	user: {
		name: 'feurjarx'
	},
	method: '{"key": "meta_incapsulation", "text": "meta"}'
};

// Delete
fb.clear();
// or ...
fb.data = null;
