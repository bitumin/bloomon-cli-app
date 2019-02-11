import {assert, expect} from 'chai';
import 'mocha';
import {InputValidationError} from "../src/errors/input-validator.error";
import {BouquetSpecCodeParser} from "../src/code-parsers/bouquet-spec-code-parser";

describe('Bouquet Spec code parser', () => {
    it('checks that a bouquet spec code has the right code structure', () => {
        const bouquetSpecCodeParser = new BouquetSpecCodeParser();

        assert.throws(() => {
            bouquetSpecCodeParser.parseCode('äL1a2')
        }, InputValidationError, `Bouquet spec äL1a2 does not have a valid bouquet spec format.`);

        assert.throws(() => {
            bouquetSpecCodeParser.parseCode('Aä1a2')
        }, InputValidationError, `Bouquet spec Aä1a2 does not have a valid bouquet spec format.`);

        assert.throws(() => {
            bouquetSpecCodeParser.parseCode('ASäa2')
        }, InputValidationError, `Bouquet spec ASäa2 does not have a valid bouquet spec format.`);

        assert.throws(() => {
            bouquetSpecCodeParser.parseCode('AL1ä2')
        }, InputValidationError, `Bouquet spec AL1ä2 does not have a valid bouquet spec format.`);

        assert.throws(() => {
            bouquetSpecCodeParser.parseCode('AL1aä')
        }, InputValidationError, `Bouquet spec AL1aä does not have a valid bouquet spec format.`);
    });

    it('checks that a bouquet spec code has no repeated flower species', () => {
        const bouquetSpecCodeParser = new BouquetSpecCodeParser();

        assert.throws(() => {
            bouquetSpecCodeParser.parseCode('AL1a1a3')
        }, InputValidationError, `Bouquet spec AL1a1a3 has repeated flower species.`);
    });

    it('checks that a bouquet spec code has flowers in alphabetical order', () => {
        const bouquetSpecCodeParser = new BouquetSpecCodeParser();

        assert.throws(() => {
            bouquetSpecCodeParser.parseCode('AL1z2a4')
        }, InputValidationError, `Bouquet spec AL1z2a4 must have flower species sorted alphabetically.`);
    });

    it('checks that a bouquet spec code has flower quantities greater than zero', () => {
        const bouquetSpecCodeParser = new BouquetSpecCodeParser();

        assert.throws(() => {
            bouquetSpecCodeParser.parseCode('AS0a1b3')
        }, InputValidationError, `Bouquet spec AS0a1b3 has quantities not greater than 0.`);
    });

    it('checks that a bouquet spec code has a sum of flower quantities less than total flower spaces in the bouquet', () => {
        const bouquetSpecCodeParser = new BouquetSpecCodeParser();

        assert.throws(() => {
            bouquetSpecCodeParser.parseCode('AS2a3b4')
        }, InputValidationError, `Bouquet spec AS2a3b4 total quantity is not greater or equal to the sum of flower quantities.`);
    });

    it('checks that a valid bouquet spec code is parsed and returned', () => {
        const bouquetSpecCodeParser = new BouquetSpecCodeParser();

        assert.deepEqual(bouquetSpecCodeParser.parseCode('AL2a3b4z45'), {
            code: 'AL2a3b4z45',
            name: 'A',
            size: 'L',
            flowersNeeded: {
                'a': 2,
                'b': 3,
                'z': 4,
            },
            totalFlowersSpaces: 45,
        });
    });
});
