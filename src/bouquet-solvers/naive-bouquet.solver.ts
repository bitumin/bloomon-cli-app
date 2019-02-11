import {BouquetSpec} from "../interfaces/bouquet-spec.interface";
import {FlowerCodeQuantityMap} from "../interfaces/flower-code-quantity-map.interface";
import {BouquetSolver} from "../interfaces/bouquet-solver.interface";
import {TotalFlowersInBuffer} from "../interfaces/total-flowers-in-buffer.interface";
import {BouquetSolverSolution} from "../interfaces/bouquet-solver-solution.inteface";
import {SpeciesQuantityMap} from "../interfaces/species-quantity-map.interface";

/**
 * Naive and fast implementation of a bouquet solver (not optimal).
 */
export class NaiveBouquetSolver implements BouquetSolver {
    solve(bouquetSpecsBuffer: Array<BouquetSpec>, flowersBuffer: FlowerCodeQuantityMap): BouquetSolverSolution | null {
        for (let bouquetSpec of bouquetSpecsBuffer) {
            const flowerSizeNeeded = bouquetSpec.size;
            const flowersNeeded = bouquetSpec.flowersNeeded;
            const totalFlowersNeeded = bouquetSpec.totalFlowersSpaces;

            if (!this._doWeHaveEnoughFlowersOfThisSize(flowersBuffer, flowerSizeNeeded, totalFlowersNeeded)) {
                continue;
            }

            if (!this._doWeHaveEnoughFlowersOfAllSpeciesNeeded(flowersBuffer, flowerSizeNeeded, flowersNeeded)) {
                continue;
            }

            const flowersToBuildWith = this._fillBouquetNaively(flowersNeeded, flowerSizeNeeded, totalFlowersNeeded, flowersBuffer);

            return {
                bouquetToBeBuilt: bouquetSpec,
                flowersToBuildWith: flowersToBuildWith,
            };
        }

        return null;
    }

    private _doWeHaveEnoughFlowersOfThisSize(flowersBuffer: FlowerCodeQuantityMap,
                                             flowerSizeNeeded: string,
                                             totalFlowersNeeded: number) {
        const totalFlowersInBuffer = this._calculateTotalFlowersInBuffer(flowersBuffer);

        return totalFlowersInBuffer[flowerSizeNeeded] >= totalFlowersNeeded;
    }

    private _calculateTotalFlowersInBuffer(flowersBuffer: FlowerCodeQuantityMap): TotalFlowersInBuffer {
        let totalLargeFlowers = 0;
        let totalSmallFlowers = 0;
        for (let flowerCode in flowersBuffer) {
            let flowerSize = flowerCode.substring(1, 2);
            let flowerQuantity = flowersBuffer[flowerCode];
            if (flowerSize === 'S') {
                totalSmallFlowers += flowerQuantity;
            } else if (flowerSize === 'L') {
                totalLargeFlowers += flowerQuantity;
            }
        }

        return {
            'L': totalLargeFlowers,
            'S': totalSmallFlowers,
        };
    }

    private _doWeHaveEnoughFlowersOfAllSpeciesNeeded(flowersBuffer: FlowerCodeQuantityMap,
                                                     flowerSizeNeeded: string,
                                                     flowersNeeded: FlowerCodeQuantityMap): boolean {
        for (let speciesNeeded in flowersNeeded) {
            let quantityNeeded = flowersNeeded[speciesNeeded];
            let flowerCode = '' + speciesNeeded + flowerSizeNeeded;
            if (!this._doWeHaveEnoughOfThisFlower(flowersBuffer, flowerCode, quantityNeeded)) {
                return false;
            }
        }
        return true;
    }

    private _doWeHaveEnoughOfThisFlower(flowersBuffer: FlowerCodeQuantityMap,
                                        flowerCode: string,
                                        quantityNeeded: number): boolean {
        return flowersBuffer[flowerCode] >= quantityNeeded;
    }

    private _fillBouquetNaively(flowersNeeded: SpeciesQuantityMap,
                                flowerSizeNeeded: string,
                                totalFlowersNeeded: number,
                                flowersBuffer: FlowerCodeQuantityMap): FlowerCodeQuantityMap {
        let flowersToBuildWith: FlowerCodeQuantityMap = {};
        const flowersToBuildWithSpeciesQuantitiesMap = flowersNeeded;
        for (let flowerSpecies in flowersToBuildWithSpeciesQuantitiesMap) {
            flowersToBuildWith[flowerSpecies + flowerSizeNeeded] = flowersToBuildWithSpeciesQuantitiesMap[flowerSpecies];
        }

        let specifiedFlowersQuantity = 0;
        for (let speciesNeeded in flowersNeeded) {
            specifiedFlowersQuantity += flowersNeeded[speciesNeeded];
        }

        let fillFlowersQuantityNeeded = totalFlowersNeeded - specifiedFlowersQuantity;
        if (fillFlowersQuantityNeeded <= 0) {
            return flowersToBuildWith;
        }

        mainLoop:
        for (let flowerCode in flowersBuffer) {
            let flowerSpecies = flowerCode[0];
            let flowerSize = flowerCode[1];
            if (flowerSize !== flowerSizeNeeded) {
                continue;
            }
            let specifiedQuantityNeeded = flowersNeeded.hasOwnProperty(flowerSpecies) ? flowersNeeded[flowerSpecies] : 0;
            let flowerInBufferQuantity = flowersBuffer.hasOwnProperty(flowerCode) ? flowersBuffer[flowerCode] : 0;
            let unusedFlowerQuantity = flowerInBufferQuantity - specifiedQuantityNeeded;
            if (unusedFlowerQuantity <= 0) {
                continue;
            }
            for (let i = 0, iMax = unusedFlowerQuantity; i < iMax; i++) {
                if (flowersToBuildWith.hasOwnProperty(flowerCode)) {
                    ++flowersToBuildWith[flowerCode]
                } else {
                    flowersToBuildWith[flowerCode] = 1;
                }
                --fillFlowersQuantityNeeded;
                if (fillFlowersQuantityNeeded <= 0) {
                    break mainLoop;
                }
            }
        }

        return flowersToBuildWith;
    }
}
