# <code-TeX>
> code-TeX a source code web component

Need to present your source code on the web? `code-TeX` has got you covered.

```html
<script src="https://cdn.jsdelivr.net/gh/auzmartist/code-tex/build/out/code-tex.min.js">

<code-tex lang="javascript" theme="nord" source="console.log('hello code-TeX')" />
```

![](https://i.imgur.com/rg61Z7h.png)

## API
All [highlight.js](https://highlightjs.org/) languages and nearly all themes are supported.
If in doubt, `code-tex` will print out all available options with the `help` attribute.

### help
> Prints all supported languages and themes to the browser console
```html
<code-tex help />
```

### language
> Sets the code-tex language
```html
<code-tex language="javascript" />
```

### source
> The source code to render as a string
```html
<code-tex language="c++" source='
  #include <iostream>

  int main() {
    std::cout << "Hello code-TeX!";
    return 0;
  }
' />
```

### src
> The URL from which to load the source code
```html
<code-tex language="html" src="https://www.spacejam.com/index.html" />
```

### theme
> Sets the code-tex theme
```html
<code-tex theme="monokai">
```

### transparent
> Makes the code background transparent
```html
<code-tex transparent />
```

## Styling
code-TeX already offers rich syntax highlighting and themes, all rendered in the Fira Code ligature-enabled font. But if you've got something else in mind, you can edit the `code` element with the `::part(code)` selection modifier:

```css
code-tex::part(code) {
  background:
    radial-gradient(circle at 50% 59%, #622AAB 3%, #364Ea7 4%, #364Ea7 11%, rgba(54,78,39,0) 12%, rgba(54,78,39,0)) 50px 0,
    radial-gradient(circle at 50% 41%, #364Ea7 3%, #622AAB 4%, #622AAB 11%, rgba(210,202,171,0) 12%, rgba(210,202,171,0)) 50px 0,
    radial-gradient(circle at 50% 59%, #622AAB 3%, #364Ea7 4%, #364Ea7 11%, rgba(54,78,39,0) 12%, rgba(54,78,39,0)) 0 50px,
    radial-gradient(circle at 50% 41%, #364Ea7 3%, #622AAB 4%, #622AAB 11%, rgba(210,202,171,0) 12%, rgba(210,202,171,0)) 0 50px,
    radial-gradient(circle at 100% 50%, #622AAB 16%, rgba(210,202,171,0) 17%),
    radial-gradient(circle at 0% 50%, #364Ea7 16%, rgba(54,78,39,0) 17%),
    radial-gradient(circle at 100% 50%, #622AAB 16%, rgba(210,202,171,0) 17%) 50px 50px,
    radial-gradient(circle at 0% 50%, #364Ea7 16%, rgba(54,78,39,0) 17%) 50px 50px;
  background-color:#3f4fff;
  background-size:100px 100px;
  border-radius: 12px;
  font-family: "Comic Sans MS", cursive, sans-serif;
}
```

![](https://i.imgur.com/XEU4Aef.png)

Just remember to CSS responsibly...

