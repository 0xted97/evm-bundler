import { desiredMintAmountsNotWithinRange, desiredMintAmountsWithinRange } from "../libs/liquidity";
import { desiredSwapAmounts } from "../libs/router";

async function main() {
    // desiredSwapAmounts();
    // const tx = await desiredMintAmounts([5, 10]);

    await desiredMintAmountsNotWithinRange();
    await desiredMintAmountsWithinRange();
}


main().catch(console.error);