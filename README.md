# form-builder-js
This javascript module allows you to bind elements of the form with data.

## Use
### Example 1 - Init fb.
```HTML
<html>
   <body>
      <form id="form">...</form>
      <script src="form-builder.js"></script>
      <script>
         var fb = FB.make('#form');
      </script>
   </body>
</html>
```
### Example 2 - Read data from form
```HTML
<html>
   <body>
      <form id="form">
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
      <script>
         var fb = FB.make('#form');
         console.log(fb.data);
      </script>
   </body>
</html>
```
