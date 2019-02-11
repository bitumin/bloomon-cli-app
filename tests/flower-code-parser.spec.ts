import {assert, expect} from 'chai';
import 'mocha';
import {FlowerCodeParser} from "../src/code-parsers/flower-code-parser";
import {InputValidationError} from "../src/errors/input-validator.error";

describe('Flower code parser', () => {
    it('checks that a flower code has the right length', () => {
        const flowerCodeParser = new FlowerCodeParser();

        assert.throws(() => {
            flowerCodeParser.parseCode('AAA')
        }, InputValidationError, `Flower AAA has a invalid flower code length.`);

        assert.throws(() => {
            flowerCodeParser.parseCode('A')
        }, InputValidationError, `Flower A has a invalid flower code length.`);
    });

    it('checks that a flower code without name from "a" to "z" is not valid', () => {
        const flowerCodeParser = new FlowerCodeParser();

        assert.throws(() => {
            flowerCodeParser.parseCode('1L')
        }, InputValidationError, `Flower 1L must have a flower name value from "a" to "z".`);

        assert.throws(() => {
            flowerCodeParser.parseCode('ëS')
        }, InputValidationError, `Flower ëS must have a flower name value from "a" to "z".`);

        assert.throws(() => {
            flowerCodeParser.parseCode('ES')
        }, InputValidationError, `Flower ES must have a flower name value from "a" to "z".`);
    });

    it('checks that a flower code without a size of "L" or "S" is not valid', () => {
        const flowerCodeParser = new FlowerCodeParser();

        assert.throws(() => {
            flowerCodeParser.parseCode('a6')
        }, InputValidationError, `Flower a6 size must be L or S.`);

        assert.throws(() => {
            flowerCodeParser.parseCode('aM')
        }, InputValidationError, `Flower aM size must be L or S.`);

        assert.throws(() => {
            flowerCodeParser.parseCode('as')
        }, InputValidationError, `Flower as size must be L or S.`);
    });

    it('checks that a valid flower code is parsed and returned', () => {
        const flowerCodeParser = new FlowerCodeParser();

        assert.deepEqual(flowerCodeParser.parseCode('aL'), {
            code: 'aL',
            species: 'a',
            size: 'L',
        });

        assert.deepEqual(flowerCodeParser.parseCode('bS'), {
            code: 'bS',
            species: 'b',
            size: 'S',
        });
    });
});
