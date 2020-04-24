import { define, html, property } from 'hybrids'
import hljs from 'highlight.js'

import './languages'
import themes, {THEME_CODES} from './themes'

const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}

const escapeForHTML = (input) => input.replace(/([&<>'"])/g, (char) => escapeMap[char])

const formatCode = (code, lang) => {
  const supportedLang = !!(lang && hljs.getLanguage(lang))
  return supportedLang ? hljs.highlight(lang, code).value : escapeForHTML(code)
}

const fetchSrc = (src) => fetch(src).then((r) => {
  if(!r.ok) throw new Error(r.statusText)
  return r.text()
})

function printHelp() {
  console.log(`
<!-- <code-tex> HELP -->
<code-tex
  lang="${hljs.listLanguages().join(' | ')}"\n
  theme="${THEME_CODES.join(' | ')}"\n
  source="console.log('hello code-tex')"
/>`)
}

define('code-tex', {
  lang: 'js',
  theme: 'nord',
  src: '',
  source: '',
  transparent: false,
  help: {
    ...property(false),
    observe: (host, value) => !!value && printHelp()
  },

  format: ({src, source, lang}) => src ?
    fetchSrc(src).then((source) => formatCode(source, lang)) :
      source ? Promise.resolve(formatCode(source, lang)) : Promise.resolve(''),

  styles: ({theme}) => themes(theme, 'nord'),

  render: ({format, lang, styles, transparent}) => html.resolve(format.then((formatted) => html`
    <pre class="code">
      <code class="hljs ${lang}" innerHTML="${formatted}" part="code"></code>
    </pre>
    <style>
@import url('https://cdn.jsdelivr.net/npm/firacode@3.1.0/distr/fira_code.min.css');

code.hljs {
  font-family: 'Fira Code', 'Consolas', monospace;
  ${transparent && `background: transparent;`}
}

${styles.toString()}
    </style>
  `)),
})