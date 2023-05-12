import { html, TemplateResult } from 'lit-html';
import '../src/kmap-combinatorics-tuples.js';

export default {
  title: 'KmapCombinatoricsTuples',
  component: 'kmap-combinatorics-tuples',
  argTypes: {
    textColor: { control: 'color' },
    backgroundColor: { control: 'color' },
    borderColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

const Template: Story<ArgTypes> = ({
  textColor,
  backgroundColor,
  borderColor,
}: ArgTypes) => html`
  <kmap-combinatorics-tuples
    style="--kmap-combinatorics-tuples-text-color: ${textColor || 'black'} --kmap-combinatorics-tuples-background-color: ${backgroundColor || 'black'} --kmap-combinatorics-tuples-border-color: ${borderColor || 'black'}"
  >
</kmap-combinatorics-tuples>
`;

export const Regular = Template.bind({});
