# form-builder-js
This javascript module allows you to bind elements of the form with data. [Plunker demo](http://plnkr.co/edit/pSMV4UhIoZATBl42Kyzo?p=preview)
## Use
### Example 1 - Init fb.
```HTML
<html>
   <body>
      <form id="form">...</form>
      <script src="form-builder.js"></script>
      <script src="script.js"></script>
   </body>
</html>
```
```js
var fb = FB.make('#form');
```

### Example 2 - Create form controls (if not exist) or append new controls.
```HTML
<html>
   <body>
      <form id="form"></form>
      <script src="form-builder.js"></script>
      <script src="script.js"></script>
   </body>
</html>
```
```js
var fb = FB.make('#form');
fb.create({
   form: {
      name: 'form name'
   },
   user: {
      name: 'Roman',
      code: 12345,
      website: {
         url: 'www.google.com'
      },
      shops: [
         'shop_1',
         'shop_2',
         'shop_3'
      ]
   }
});
```

### Example 3 - Read data from form.
```HTML
<html>
   <body>
      <form id="form">
         <div>
            <label>Form name:</label>
            <input type="text" name="form[name]" value="Test Form"/>
         </div>
         <div>
            <label>User name:</label>
            <input type="text" name="user[name]" value="Roman"/>
         </div>
         <div>
            <label>Code:
               <input type="number" name="user[code]" value="123"/>
            </label>
         </div>
         <div>
            <label>Website:</label>
            <input type="text" name="user[website][url]" value="http://mysite.com" />
         </div>
         <div>
            <label>Shops:</label>
            <select multiple name="user[shops][]">
               <option selected value="shop_1">Shop 1</option>
               <option value="shop_2">Shop 2</option>
               <option selected value="shop_3">Shop 3</option>
            </select>
         </div>
         <div>
            <label>Secondary shop:</label>
            <input type="text" name="user[shops][]" value="Test shop" />
         </div>
      </form>
      <script src="form-builder.js"></script>
      <script src="script.js"></script>
   </body>
</html>
```
```js
var fb = FB.make('#form');
console.log(fb.data);
```

### Example 4 - Write data to form.
```js
fb.data = {
   form: {
      name: 'Test test test'
   },
	user: {
		name: 'feurjarx'
	}
};
```
### Example 5 - Clear form and data.
```js
fb.data = null;
// or ...
fb.clear();
```
### Example 6 - Not simple controls (controls customization). For select2 fields.
```HTML
<form id="form">
   ...
   <div>
      <label>Method auth:
         <select id="method" name="method">
            <option value=1 data-value='{"key": "inf2b", "text": "mi5"}'>green safe</option>
            <option value=2 data-value='{"key": "meta_incapsulation", "text": "meta"}'>META</option>
         </select>
      </label>
   </div>
</form>
```
```js
var fb = FB.make('#form', [{
	selector: '#method',
	getter: function() {
      		// you code
		return this.selectedOptions[0].dataset.value;
	},
	setter: function(v) {
		// you code
		[].forEach.call(this.options, function(optionElem) {
			if (optionElem.dataset.value === v) {
				optionElem.selected = true;
				return false;
			}
		});
	}
}]);
```
