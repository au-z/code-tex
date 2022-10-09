import { define, html } from 'hybrids'
import hljs from 'highlight.js'
import './languages'
import themes, { CodeTexTheme, THEME_CODES } from './themes.js'
import { CodeTexLanguage } from './languages.js'

const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const escapeForHTML = (input) => input.replace(/([&<>'"])/g, (char) => escapeMap[char])

const formatCode = (code, lang) => {
  const supportedLang = !!(lang && hljs.getLanguage(lang))
  return supportedLang ? hljs.highlight(lang, code).value : escapeForHTML(code)
}

const fetchSrc = (src) =>
  fetch(src).then((r) => {
    if (!r.ok) throw new Error(r.statusText)
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

export interface CodeTexElement extends HTMLElement {
  lang: CodeTexLanguage
  theme: CodeTexTheme
  p: number
  src: string
  source: string
  transparent: boolean
  help: boolean
  //
  format: Promise<string>
}

export default define<CodeTexElement>({
  tag: 'code-tex',
  // overrides HTMLElement.lang
  // TODO port to 'language' to prevent unexpected behavior
  lang: 'javascript',
  theme: 'nord',
  p: 2,
  src: '',
  source: '',
  transparent: false,
  help: {
    value: false,
    observe: (_, value) => value && printHelp(),
  },

  format: ({ src, source, lang }) =>
    src
      ? fetchSrc(src).then((source) => formatCode(source, lang))
      : source
      ? Promise.resolve(formatCode(source, lang))
      : Promise.resolve(''),

  // prettier-ignore
  render: ({ format, lang, theme, p, transparent }) => html.resolve(format.then((formatted) => html`
    <div part="lang-theme" class="lang-theme">
      <label style="padding: 8px">${lang}</label>
      <label style="padding: 8px">${theme}</label>
    </div>
    <pre class="code"><code class="hljs ${lang}" innerHTML="${formatted}" part="code"></code></pre>
    ${styles({ p, transparent })}`.style(themes(theme, "nord"))
  )),
})

function styles({ p, transparent }) {
  return html`<style>
    @import url('https://cdn.jsdelivr.net/npm/firacode@3.1.0/distr/fira_code.min.css');

    :host {
      display: block;
    }

    .lang-theme {
      position: absolute;
      margin: 0.5rem;
      right: 0;
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 0.7em;
      line-height: 1rem;
      border: 2px solid rgba(200, 200, 200, 0.5);
      border-radius: 6px;
      color: #aaa;
    }
    .lang-theme > label {
      display: inline-block;
    }
    .lang-theme > label:not(:first-child) {
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
