import { rawAddLiquidity, rawCollectFeePosition, rawRemoveLiquidity } from "../libs/liquidity";
import { } from "../libs/router";

async function main() {
    const rawAdd = await rawCollectFeePosition(9898989);
    console.log("🚀 ~ main ~ rawAdd:", rawAdd)
}


main().catch(console.error);