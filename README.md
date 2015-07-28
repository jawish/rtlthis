# rtlThis
Automatically detect and decorate all RTL language script to easily set fonts and language direction.

## Installation
1. Add the script to the page.

```html
<script src="rtlthis.js"></script>
```

2. Run the script on desired elements using the .run(queryOrElem) method.

```html
<script type="text/javascript">
rtlThis.run('body');
</script>
```

3. Setup the CSS.
rtlThis will add the desired class to the decorating tag when run. This can be then targetted with CSS for setting font, text direction and other settings.

Example to style Dhivehi and Arabic text:
```css
[class*="rtl-"] {
	direction: rtl;
	unicode-bidi: inherit;
}
.rtl-div {
	font-family: 'MV Faseyha';
	font-size: 18px;
}
.rtl-ara {
	font-family: 'Arial MS Unicode','Simplified Arabic', 'Andale sans';
	font-size: 18px;
}
```
