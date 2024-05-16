import { rawAddLiquidity, rawRemoveLiquidity } from "../libs/liquidity";
import {  } from "../libs/router";

async function main() {
   
    const rawAdd = await rawAddLiquidity(9898989);
    console.log("🚀 ~ main ~ rawAdd:", rawAdd)

    const rawRemove = await rawRemoveLiquidity(9898989);
    console.log("🚀 ~ main ~ rawRemove:", rawRemove)
}


main().catch(console.error);