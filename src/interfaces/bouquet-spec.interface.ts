import {SpeciesQuantityMap} from "./species-quantity-map.interface";

export interface BouquetSpec {
    code: string;
    name: string;
    size: string;
    flowersNeeded: SpeciesQuantityMap;
    totalFlowersSpaces: number;
}
