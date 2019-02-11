import {BouquetSpec} from "./bouquet-spec.interface";
import {FlowerCodeQuantityMap} from "./flower-code-quantity-map.interface";

export interface BouquetSolverSolution {
    bouquetToBeBuilt: BouquetSpec,
    flowersToBuildWith: FlowerCodeQuantityMap,
}
