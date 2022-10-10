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

const formatCode = (code, lang, options?: { decode?: boolean; untab?: boolean }) => {
  if (options?.decode) {
    const decoded = document.createElement('textarea')
    decoded.innerHTML = code
    code = decoded.value
  }
  if (options?.untab) {
    try {
      const lines = code.split('\n').filter((l) => l.length > 0)
      const count = lines[0].match(/^\s*/)?.[0]?.length ?? 0
      code = lines.map((l) => l.replace(new RegExp(`^\\s{${count}}`, ''), '')).join('\n')
    } catch (ex) {}
  }

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
  language: CodeTexLanguage
  theme: CodeTexTheme
  p: number
  src: string
  source: string
  transparent: boolean
  preserveSpaces: boolean
  help: boolean
  //
  format: Promise<string>
}

export default define<CodeTexElement>({
  tag: 'code-tex',
  // overrides HTMLElement.lang
  lang: {
    set: (host, val = '') => {
      if (val) console.warn('<code-tex> use of deprecated "lang" property in >=1.1.0. Please use "language" instead.')
      host.language = val
      return val
    },
  },
  language: 'javascript',
  theme: 'nord',
  p: 2,
  src: '',
  source: '',
  transparent: false,
  preserveSpaces: false,
  help: {
    value: false,
    observe: (_, value) => value && printHelp(),
  },

  format: ({ src, source, language }) =>
    src
      ? fetchSrc(src).then((source) => formatCode(source, language))
      : source
      ? Promise.resolve(formatCode(source, language))
      : Promise.resolve(''),

  // prettier-ignore
  render: (host) => html`
    <div part="lang-theme" class="lang-theme">
      <label style="padding: 8px">${host.language}</label>
      <label style="padding: 8px">${host.theme}</label>
    </div>
    <pre class="code">${host.src || host.source ? html.resolve(host.format
      .then((formatted) => html`<code class="hljs ${host.language}" innerHTML="${formatted}" part="code"></code>`)
    ) : html`<code class="hljs ${host.language}" part="code" innerHTML="${formatCode(host.innerHTML, host.language, {
      decode: true,
      untab: !host.preserveSpaces,
    })}"></code>`}</pre>
    ${styles({ p: host.p, transparent: host.transparent })}`.style(themes(host.theme, "nord")),
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
