import {html, css, LitElement, PropertyValues} from 'lit';
import {state} from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {katexStyles} from "./katex-css.js";
// @ts-ignore
import katex from 'katex';

export class KmapCombinatoricsTuples extends LitElement {
  static styles = [katexStyles,
    css`
      :host {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        color: var(--kmap-combinatorics-tuples-text-color, #000);
        font-family: Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: 0.9375rem;
        font-weight: 500;
      }
      :host > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 16px;
      }
      .boxes {
        width: 232px;
        display: flex;
        justify-content: center;
        gap: 8px;
      }
      .box {
        height: 20px;
        width: 20px;
        border-radius: 4px;
        background-color: var(--kmap-combinatorics-tuples-k-color, coral);
        font-weight: 1000;
        text-align: center;
        line-height: 20px;
        color: var(--kmap-combinatorics-tuples-n-color, darkslategray);
      }
      #k {
        accent-color: var(--kmap-combinatorics-tuples-k-color, coral);
      }
      #n {
        accent-color: var(--kmap-combinatorics-tuples-n-color, darkslategray);
      }
      .k {
        color: var(--kmap-combinatorics-tuples-k-color, coral);
      }
      .n {
        color: var(--kmap-combinatorics-tuples-n-color, darkslategray);
      }
      div.input {
        display: flex;
        justify-items: center;
        gap: 8px;
        white-space: nowrap;
      }
      label {
        width: 48px;
      }
    `];

  declare shadowRoot: ShadowRoot;

  @state()
  _n: number = 6;
  @state()
  _k: number = 2;
  @state()
  _i: number = 0;
  @state()
  _b: number = 0;

  @state()
  _combi: number[] = new Array(this._k).fill(0);

  private _interval?: NodeJS.Timer;
  private _timeout?: NodeJS.Timeout;

  render() {
    const kat = katex.renderToString('\\displaystyle {\\htmlClass{n}' + this._n + '^{\\htmlClass{k}' + this._k + '}}=' + this._b,
        { output: "html", throwOnError: false, trust: true, displayMode: false });
    return html`
      <div>
        <div class="input"><label for="n">n = ${this._n}</label><input id="n" type="range" min="1" max="10" .value=${this._n} @input="${(e: Event) => this._n = parseInt((e.target as HTMLInputElement).value)}"></div>
        <div class="input"><label for="k">k = ${this._k}</label><input id="k" type="range" min="1" max="6" .value=${this._k} @input="${(e: Event) => this._k = parseInt((e.target as HTMLInputElement).value)}"></div>
        <div>${unsafeHTML(kat)}</div>
      </div>
      <div>
        <div>» <span class="n">${this._combi.map((b, i) => html`${i > 0 ? ' · ' + this._n : this._n}`)}</span> «</div>
        <div class="boxes">
          ${this._combi.map(b => html`<div class="box">${b}</div>`)}
        </div>
        <div class="input"><svg @click="${this._start}" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M320 853V293l440 280-440 280Zm60-280Zm0 171 269-171-269-171v342Z"/></svg>
          <input id="i" type="range" min="0" max="${this._b-1}" .value=${this._i} @input="${(e: Event) => this._i = parseInt((e.target as HTMLInputElement).value)}"></div>
      </div>
    `;
  }

  protected willUpdate(_changedProperties: PropertyValues) {
    if (_changedProperties.has("_n") || _changedProperties.has("_k")) {
      if (this._interval)
        clearInterval(this._interval);
      if (this._timeout)
        clearTimeout(this._timeout);
    }
    if (_changedProperties.has("_i")) {
      let combi = [...this._combi];
      for (let i = 0; i < this._k; i++) {
        combi[i] = combi[i] + 1;
        if (combi[i] >= this._n) {
          combi[i] = 0;
        }
        else
          break;
      }
      this._combi = combi;
    }
  }

  protected updated(_changedProperties: PropertyValues) {
    if (_changedProperties.has("_n") || _changedProperties.has("_k")) {
      this._i = 0;
      this._combi = new Array(this._k).fill(0);
      this._b = this._n**this._k;
    }
  }
  private _start() {
    this._i = 0;
    this._interval = setInterval(() => {
      if (this._i < this._b - 1) {
        this._i++;
      }
      else {
        if (this._interval) {
          clearInterval(this._interval);
          this._interval = undefined;
          this._timeout = setTimeout(() => { this._i = 0; this._interval = undefined }, 1000);
        }
      }
    }, 5000 / this._b);
  }
}
