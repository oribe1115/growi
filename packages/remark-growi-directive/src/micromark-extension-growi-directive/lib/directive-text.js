/**
 * @typedef {import('micromark-util-types').Construct} Construct
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 * @typedef {import('micromark-util-types').Previous} Previous
 * @typedef {import('micromark-util-types').State} State
 */

import { codes } from 'micromark-util-symbol/codes.js';
import { types } from 'micromark-util-symbol/types.js';
import { ok as assert } from 'uvu/assert';

import { factoryAttributes } from './factory-attributes.js';
import { factoryLabel } from './factory-label.js';
import { factoryName } from './factory-name.js';

/** @type {Construct} */
export const directiveText = {
  tokenize: tokenizeDirectiveText,
  previous,
};

const label = { tokenize: tokenizeLabel, partial: true };
const attributes = { tokenize: tokenizeAttributes, partial: true };

/** @type {Previous} */
function previous(code) {
  // If there is a previous code, there will always be a tail.
  return (
    code !== codes.dollarSign
    || this.events[this.events.length - 1][1].type === types.characterEscape
  );
}

/** @type {Tokenizer} */
function tokenizeDirectiveText(effects, ok, nok) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return start;

  /** @type {State} */
  function start(code) {
    assert(code === codes.dollarSign, 'expected `$`');
    assert(previous.call(self, self.previous), 'expected correct previous');
    effects.enter('directiveText');
    effects.enter('directiveTextMarker');
    effects.consume(code);
    effects.exit('directiveTextMarker');
    return factoryName.call(self, effects, afterName, nok, 'directiveTextName');
  }

  /** @type {State} */
  function afterName(code) {
    // eslint-disable-next-line no-nested-ternary
    return code === codes.dollarSign
      ? nok(code)
      : code === codes.leftSquareBracket
        ? effects.attempt(label, afterLabel, afterLabel)(code)
        : afterLabel(code);
  }

  /** @type {State} */
  function afterLabel(code) {
    return code === codes.leftParenthesis
      ? effects.attempt(attributes, afterAttributes, afterAttributes)(code)
      : afterAttributes(code);
  }

  /** @type {State} */
  function afterAttributes(code) {
    effects.exit('directiveText');
    return ok(code);
  }
}

/** @type {Tokenizer} */
function tokenizeLabel(effects, ok, nok) {
  // Always a `[`
  return factoryLabel(
    effects,
    ok,
    nok,
    'directiveTextLabel',
    'directiveTextLabelMarker',
    'directiveTextLabelString',
  );
}

/** @type {Tokenizer} */
function tokenizeAttributes(effects, ok, nok) {
  // Always a `{`
  return factoryAttributes(
    effects,
    ok,
    nok,
    'directiveTextAttributes',
    'directiveTextAttributesMarker',
    'directiveTextAttribute',
    'directiveTextAttributeName',
    'directiveTextAttributeInitializerMarker',
    'directiveTextAttributeValueLiteral',
    'directiveTextAttributeValue',
    'directiveTextAttributeValueMarker',
    'directiveTextAttributeValueData',
  );
}
