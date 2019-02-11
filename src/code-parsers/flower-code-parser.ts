import {CodeParser} from "../interfaces/code-parser.interface";
import {InputValidationError} from "../errors/input-validator.error";
import {Flower} from "../models/flower";

export class FlowerCodeParser implements CodeParser {
    parseCode(flowerCode: string): Flower {
        // TODO we could improve UX by capturing this exceptions and allowing the user to try passing correct input.
        if (!this._hasValidFlowerCodeLength(flowerCode)) {
            throw new InputValidationError(`Flower ${flowerCode} has a invalid flower code length.`);
        }
        if (!this._hasValidFlowerSpecies(flowerCode)) {
            throw new InputValidationError(`Flower ${flowerCode} must have a flower name value from "a" to "z".`);
        }
        if (!this._hasValidSize(flowerCode)) {
            throw new InputValidationError(`Flower ${flowerCode} size must be L or S.`);
        }

        return {
            code: flowerCode,
            species: this._parseSpecies(flowerCode),
            size: this._parseSize(flowerCode),
        };
    }

    private _hasValidFlowerCodeLength(flowerCode: string): boolean {
        return flowerCode.length === 2;
    }

    private _hasValidFlowerSpecies(flowerCode: string): boolean {
        const flowerSpecies = flowerCode.split('')[0];

        return /^[a-z]*$/.test(flowerSpecies);
    }

    private _hasValidSize(flowerCode: string): boolean {
        const flowerSize = flowerCode.split('')[1];
        const acceptedFlowerSizes = ['L', 'S'];

        return acceptedFlowerSizes.indexOf(flowerSize) !== -1;
    }

    private _parseSpecies(bouquetSpecCode: string): string {
        return bouquetSpecCode.substring(0, 1);
    }

    private _parseSize(bouquetSpecCode: string): string {
        return bouquetSpecCode.substring(1, 2);
    }
}
