import { desiredMintAmounts } from "../libs/liquidity";
import { desiredSwapAmounts } from "../libs/router";

async function main() {
    const amountOut = desiredSwapAmounts();
    // const tx = await desiredMintAmounts([5, 10]);
}


main().catch(console.error);