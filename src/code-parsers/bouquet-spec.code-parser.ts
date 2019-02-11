import {SpeciesQuantityMap} from "../interfaces/species-quantity-map.interface";
import {InputValidationError} from "../errors/input-validator.error";
import {CodeParser} from "../interfaces/code-parser.interface";
import {BouquetSpec} from "../interfaces/bouquet-spec.interface";

export class BouquetSpecCodeParser implements CodeParser {
    parseCode(bouquetSpecCode: string): BouquetSpec {
        if (!this._hasValidBouquetCodeStructure(bouquetSpecCode)) {
            throw new InputValidationError(`Bouquet spec ${bouquetSpecCode} does not have a valid bouquet spec format.`);
        }
        if (this._hasRepeatedFlowerSpecies(bouquetSpecCode)) {
            throw new InputValidationError(`Bouquet spec ${bouquetSpecCode} has repeated flower species.`);
        }
        if (!this._hasFlowerSpeciesInAlphabeticalOrder(bouquetSpecCode)) {
            throw new InputValidationError(`Bouquet spec ${bouquetSpecCode} must have flower species sorted alphabetically.`);
        }
        if (!this._allQuantitiesGreaterThanZero(bouquetSpecCode)) {
            throw new InputValidationError(`Bouquet spec ${bouquetSpecCode} has quantities not greater than 0.`);
        }
        if (!this._totalQuantityGreaterOrEqualThanSumOfFlowerQuantities(bouquetSpecCode)) {
            throw new InputValidationError(`Bouquet spec ${bouquetSpecCode} total quantity is not greater or equal to the sum of flower quantities.`);
        }

        return {
            code: bouquetSpecCode,
            name: this._parseName(bouquetSpecCode),
            size: this._parseSize(bouquetSpecCode),
            flowersNeeded: this._parseFlowers(bouquetSpecCode),
            totalFlowersSpaces: this._parseTotalFlowers(bouquetSpecCode),
        };
    }

    /**
     * A valid bouquet code structure is defined as:
     * <name><size><flower.1 quantity><f.1 species>...<f.N quantity><f.N species><total flowers>
     *
     * @param bouquetSpecCode
     */
    private _hasValidBouquetCodeStructure(bouquetSpecCode: string): boolean {
        /*
         * [A-Z] checks valid bouquet name (from A to Z)
         * [L|S] checks valid bouquet size (L or S)
         * (?:\d+[a-z])+ checks for any number of valid combinations
         *               of flower quantities (digit(s)) and species (char from a to z)
         * \d+ checks for the final total flowers digit(s)
         */
        return /[A-Z][L|S](?:\d+[a-z])+\d+$/.test(bouquetSpecCode);
    }

    private _hasRepeatedFlowerSpecies(bouquetSpecCode: string): boolean {
        const species = bouquetSpecCode.match(/[a-z]/g);

        // Sets do not allow repeated values.
        return (new Set(species)).size !== species.length;
    }

    private _hasFlowerSpeciesInAlphabeticalOrder(bouquetSpecCode: string): boolean {
        const species = bouquetSpecCode.match(/[a-z]/g);

        return species.join() === species.sort().join();
    }

    private _allQuantitiesGreaterThanZero(bouquetSpecCode: string): boolean {
        const quantities = bouquetSpecCode.match(/\d+/g);

        for (let quantity of quantities) {
            if (parseInt(quantity, 10) <= 0) {
                return false;
            }
        }

        return true;
    }

    private _totalQuantityGreaterOrEqualThanSumOfFlowerQuantities(bouquetSpecCode: string): boolean {
        const quantities = bouquetSpecCode.match(/\d+/g);
        const totalFlowers = parseInt(quantities.pop(), 10);
        const sumReducerFn = (sum, currentQuantity) => sum + parseInt(currentQuantity, 10);
        const sumOfFlowerQuantities = quantities.reduce(sumReducerFn, 0);

        return totalFlowers >= sumOfFlowerQuantities;
    }

    private _parseName(bouquetSpecCode: string) {
        return bouquetSpecCode.substring(0, 1);
    }

    private _parseSize(bouquetSpecCode: string) {
        return bouquetSpecCode.substring(1, 2);
    }

    private _parseTotalFlowers(bouquetSpecCode: string) {
        const totalFlowers = bouquetSpecCode.match(/\d+$/g)[0];

        return parseInt(totalFlowers, 10);
    }

    private _parseFlowers(bouquetSpecCode: string) {
        const quantitySpeciesPairs = bouquetSpecCode.match(/(\d+[a-z])/g);
        const flowers: SpeciesQuantityMap = {};
        for (let quantitySpeciesPair of quantitySpeciesPairs) {
            let pairStrLength = quantitySpeciesPair.length;
            let species = quantitySpeciesPair.substring(pairStrLength - 1, pairStrLength);
            let quantityStr = quantitySpeciesPair.substring(0, pairStrLength - 1);
            flowers[species] = parseInt(quantityStr, 10);
        }

        return flowers;
    }
}
