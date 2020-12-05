import { define, html, Hybrids, property } from 'hybrids'
if(!customElements.get('cam-box')) {
  require('@auzmartist/cam-el').CamBox
} else {
  console.info('dependent element <cam-box> already defined.')
}

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
  source="console.log('hello code-TeX')"
/>`)
}

const CodeTeX: Hybrids<any> = {
  lang: 'js',
  theme: 'nord',
  p: 2,
  src: '',
  source: '',
  transparent: false,
  help: {
    ...property(false),
    observe: (_, value) => value && printHelp()
  },

  format: ({src, source, lang}) => src ?
    fetchSrc(src).then((source) => formatCode(source, lang)) :
      source ? Promise.resolve(formatCode(source, lang)) : Promise.resolve(''),

  render: ({format, lang, theme, p, transparent}) => html.resolve(format.then((formatted) => html`
    <cam-box>
      <cam-box part="lang-theme" flex="space-between center" m="1" class="lang-theme">
        <cam-box p="1">${lang}</cam-box>
        <cam-box p="1">${theme}</cam-box>
      </cam-box>
      <pre class="code"><code class="hljs ${lang}" innerHTML="${formatted}" part="code"></code></pre>
    </cam-box>
    ${styles({p, transparent})}`.style(themes(theme, 'nord').toString())
  )),
}

function styles({p, transparent}) {
  return html`<style>
    @import url('https://cdn.jsdelivr.net/npm/firacode@3.1.0/distr/fira_code.min.css');

    :host {
      display: block;
    }

    cam-box {
      position: relative;
    }

    .lang-theme {
      position: absolute;
      right: 0;
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 0.75em;
      line-height: 1rem;
      border: 2px solid rgba(200, 200, 200, 0.5);
      border-radius: 6px;
      color: #aaa;
    }
    .lang-theme > cam-box:not(:first-child) {
      border-left: 1px solid rgba(200, 200, 200, 0.5);
    }

    pre {
      margin: 0;
    }

    code.hljs {
      font-family: 'Fira Code', 'Consolas', monospace;
      padding: calc(var(--cam-unit, 8px) * ${p});
      ${transparent && `background: transparent;`}
    }
  </style>`
}

define('code-tex', CodeTeX)
export default CodeTeX