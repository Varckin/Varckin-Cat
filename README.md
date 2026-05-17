# Varckin cat

A fork of https://github.com/adryd325/oneko.js

## Usage

Include the script on your page:
```
<script src="varckin_cat.js"></script>
```

By default the cat image is expected at ./varckin_cat.gif. You can change it with the data-cat attribute:
```
<script src="varckin_cat.js" data-cat="your-custom-cat.gif"></script>
```

## Features

- Pixel cat that follows your mouse
- Idle animations (sleeping, scratching)
- Optional position saving via localStorage (use data-persist-position="true")
- Respects prefers-reduced-motion

## IE version

A legacy version for Internet Explorer is available as varckin_cat_ie6.js.

## Webring variant

The varckin_cat_webring.js variant preserves the cat's position when navigating between participating sites.

## License

Feel free to use and modify.