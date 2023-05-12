import {html, css, LitElement, PropertyValues} from 'lit';
import {state} from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {katexStyles} from "./katex-css.js";
// @ts-ignore
import katex from 'katex';

export class KmapBinomialCoefficient extends LitElement {
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
        height: 16px;
        width: 16px;
        border-radius: 4px;
        background-color: var(--kmap-combinatorics-tuples-k-color, coral);
        transition: background-color .1s ease-in-out;
      }
      .box[m] {
        background-color: var(--kmap-combinatorics-tuples-not-k-color, deepskyblue);
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
      .notk {
        color: var(--kmap-combinatorics-tuples-n-color, deepskyblue);
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
  _combi: string[] = Array.from('110000');
  @state()
  _combis: string[][] = [];
  private _interval?: NodeJS.Timer;
  private _timeout?: NodeJS.Timeout;

  render() {
    const arr = this._combi !== undefined ? Array.from(this._combi) : undefined;
    const kat = katex.renderToString('\\displaystyle {\\htmlClass{n}' + this._n + '\\choose\\htmlClass{k}' + this._k + '}=\\frac{\\htmlClass{n}' + this._n + '!}{\\htmlClass{k}' + this._k + '!\\;\\htmlClass{notk}' + (this._n - this._k) + '!}=' + this._b,
        { output: "html", throwOnError: false, trust: true, displayMode: false });
    return html`
      <div>
        <div class="input"><label for="n">n = ${this._n}</label><input id="n" type="range" min="1" max="10" .value=${this._n} @input="${(e: Event) => this._n = parseInt((e.target as HTMLInputElement).value)}"></div>
        <div class="input"><label for="k">k = ${this._k}</label><input id="k" type="range" min="0" max="${this._n}" .value=${this._k} @input="${(e: Event) => this._k = parseInt((e.target as HTMLInputElement).value)}"></div>
        <div>${unsafeHTML(kat)}</div>
      </div>
      ${arr ? html`
      <div>
        <div>» <span class="k">${this._k}</span> aus <span class="n">${this._n}</span> «</div>
        <div class="boxes">
          ${arr.map(b => html`<div class="box" ?m="${b === '1'}"></div>`)}
        </div>
        <div class="input"><svg @click="${this._start}" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M320 853V293l440 280-440 280Zm60-280Zm0 171 269-171-269-171v342Z"/></svg>
          <input id="i" type="range" min="0" max="${this._b-1}" .value=${this._i} @input="${(e: Event) => this._i = parseInt((e.target as HTMLInputElement).value)}"></div>
      </div>
      ` : html`<div style="align-self: start">n muss größer oder gleich k sein!</div>`}
    `;
  }

  protected willUpdate(_changedProperties: PropertyValues) {
    if (_changedProperties.has("_n") || _changedProperties.has("_k")) {
      if (this._interval)
        clearInterval(this._interval);
      if (this._timeout)
        clearTimeout(this._timeout);

      if (this._k > this._n)
        this._k = this._n;
    }
  }

  protected updated(_changedProperties: PropertyValues) {
    if (_changedProperties.has("_n") || _changedProperties.has("_k")) {
      this._i = 0;
      this.createCombis();
      this._combi = this._combis[0];
      this._b = fak(this._n) / fak(this._k) / fak(this._n - this._k);
    }
    if (_changedProperties.has("_i")) {
      this._combi = this._combis[this._i];
    }
  }
  private _start() {
    this._i = 0;
    this._interval = setInterval(() => {
      if (this._i < this._combis.length - 1)
        this._i ++;
      else {
        if (this._interval) {
          clearInterval(this._interval);
          this._interval = undefined;
          this._timeout = setTimeout(() => { this._i = 0; this._interval = undefined }, 1000);
        }
      }
    }, 5000 / this._b);
  }

  private createCombis() {
    const max = Math.pow(2, this._n);
    const k = this._n - this._k;
    const combis: string[][] = [];
    for (let j = 0; j < max; j++) {
      let bin = j.toString(2).split("");
      var count = 0;
      for (let i = 0; i < this._n; i++) {
        if (bin[i] == '1') {
          count += 1;
        }
        if (bin[i] != '1' && bin[i] != '0') {
          bin.unshift("0");
        }
      }
      if (count == k) {
        combis.push(bin);
      }
    }
    this._combis = combis;
    console.log("create")
    console.log(combis)
  }
}

function fak(n: number)
{
  var r=1;

  for (var i=2; i<=n; i++)
    r *= i;

  return r;
}