import {BouquetSpec} from "./bouquet-spec.interface";
import {FlowerCodeQuantityMap} from "./flower-code-quantity-map.interface";
import {BouquetSolverSolution} from "./bouquet-solver-solution.inteface";

export interface BouquetSolver {
    solve(bouquetSpecsBuffer: Array<BouquetSpec>, flowersBuffer: FlowerCodeQuantityMap): BouquetSolverSolution | null;
}
