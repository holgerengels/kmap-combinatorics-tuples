import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { KmapBinomialCoefficient } from '../src/KmapBinomialCoefficient';
import '../src/kmap-combinatorics-tuples.js';

describe('KmapBinomialCoefficient', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    // @ts-ignore
    const el = await fixture<KmapBinomialCoefficient>(html`<kmap-combinatorics-tuples></kmap-combinatorics-tuples>`);

    //expect(el.title).to.equal('Hey there');
    //expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    // @ts-ignore
    const el = await fixture<KmapBinomialCoefficient>(html`<kmap-combinatorics-tuples></kmap-combinatorics-tuples>`);
    el.shadowRoot!.querySelector('button')!.click();

    //expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    // @ts-ignore
    const el = await fixture<KmapBinomialCoefficient>(html`<kmap-combinatorics-tuples title="attribute title"></kmap-combinatorics-tuples>`);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    // @ts-ignore
    const el = await fixture<KmapBinomialCoefficient>(html`<kmap-combinatorics-tuples></kmap-combinatorics-tuples>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
