import {AppStates} from "../interfaces/app-states.interface";
import {BouquetSpecCodeParser} from "../code-parsers/bouquet-spec-code-parser";
import {BouquetSpec} from "../interfaces/bouquet-spec.interface";
import {FlowerCodeParser} from "../code-parsers/flower-code-parser";
import {FlowerCodeQuantityMap} from "../interfaces/flower-code-quantity-map.interface";
import {Flower} from "./flower";
import {InputProcessor} from "../interfaces/input-processor.interface";
import {UnexpectedAppStateError} from "../errors/unexpected-app-state.error";
import {UnexpectedInputError} from "../errors/unexpected-input.error";
import {NaiveBouquetSolver} from "../bouquet-solvers/naive-bouquet.solver";
import {BouquetSolver} from "../interfaces/bouquet-solver.interface";


export class BloomonApp implements InputProcessor {
    private readonly _appStates: AppStates = {
        READING_BOUQUET_SPECS: 0,
        READING_FLOWERS: 1,
    };
    private _currentAppState: number;
    private _bouquetSpecsBuffer: Array<BouquetSpec> = [];
    private _flowersBuffer: FlowerCodeQuantityMap = {};
    private _bouquetSpecCodeParser: BouquetSpecCodeParser;
    private _flowerCodeParser: FlowerCodeParser;
    private _bouquetSolver: BouquetSolver;

    constructor() {
        this._setAppStateIsReadingBouquetSpecs();
        // TODO we could decouple this dependencies by using dependency injection.
        this._bouquetSpecCodeParser = new BouquetSpecCodeParser();
        this._flowerCodeParser = new FlowerCodeParser();
        this._bouquetSolver = new NaiveBouquetSolver();
    }

    processInput(newInputLine: string): string | null {
        if (this._isEmptyLine(newInputLine)) {
            if (this._isAppReadingBouquetSpecs() && this.bouquetBufferIsEmpty()) {
                throw new UnexpectedInputError('Empty line received, but a bouquet spec was expected.');
            }
            if (this._isAppReadingFlowers()) {
                throw new UnexpectedInputError('Empty line received, but a flower code was expected.');
            }
            this._setAppStateIsReadingFlowers();
            return null;
        }

        if (this._isAppReadingBouquetSpecs()) {
            this._addBouquetSpecToBuffer(this._bouquetSpecCodeParser.parseCode(newInputLine));
            return null;
        }

        if (this._isAppReadingFlowers) {
            this._addFlowerToBuffer(this._flowerCodeParser.parseCode(newInputLine));
            const buildableBouquetSolution = this._bouquetSolver.solve(this._bouquetSpecsBuffer, this._flowersBuffer);
            if (buildableBouquetSolution === null) {
                return null;
            }
            this._removeBouquetFromBuffer(buildableBouquetSolution.bouquetToBeBuilt);
            this._removeFlowersToBuildBouquetFromTheBuffer(buildableBouquetSolution.flowersToBuildWith);
            return buildableBouquetSolution.bouquetToBeBuilt.code;
        }

        throw new UnexpectedAppStateError();
    }

    private _isAppReadingBouquetSpecs(): boolean {
        return this._currentAppState === this._appStates.READING_BOUQUET_SPECS;
    }

    private _isAppReadingFlowers(): boolean {
        return this._currentAppState === this._appStates.READING_FLOWERS;
    }

    private _setAppStateIsReadingBouquetSpecs(): void {
        this._currentAppState = this._appStates.READING_BOUQUET_SPECS;
    }

    private _setAppStateIsReadingFlowers(): void {
        this._currentAppState = this._appStates.READING_FLOWERS;
    }

    private bouquetBufferIsEmpty(): boolean {
        return this._bouquetSpecsBuffer.length === 0;
    }

    private _addBouquetSpecToBuffer(bouquetSpec: BouquetSpec): void {
        this._bouquetSpecsBuffer.push(bouquetSpec);
    }

    private _addFlowerToBuffer(flower: Flower): void {
        if (this._flowersBuffer.hasOwnProperty(flower.code)) {
            // This kind of flower is found already in buffer,
            // so we increase the amount we have by 1.
            ++this._flowersBuffer[flower.code];
        } else {
            // We did not have any flower of this kind before,
            // so we we add it to buffer and set the starting quantity to 1.
            this._flowersBuffer[flower.code] = 1;
        }
    }

    private _isEmptyLine(line: string): boolean {
        return line.length === 0;
    }

    private _removeBouquetFromBuffer(buildableBouquet: BouquetSpec): void {
        let i = this._bouquetSpecsBuffer.length;
        while (i--) {
            if (this._bouquetSpecsBuffer[i].code === buildableBouquet.code) {
                this._bouquetSpecsBuffer.splice(i, 1);
            }
        }
    }

    private _removeFlowersToBuildBouquetFromTheBuffer(flowers: FlowerCodeQuantityMap): void {
        for (let flowerCode in flowers) {
            let quantityNeeded = flowers[flowerCode];
            this._flowersBuffer[flowerCode] -= quantityNeeded;
        }
    }
}
