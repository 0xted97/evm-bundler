import { createTrade, rawExecuteTrade } from "./libs/router";

async function main() {
    // Exact input
    const routes = await createTrade();
    console.log("🚀 ~ Price impact:", routes.priceImpact.toFixed())
    console.log("🚀 ~ Amount in", routes.swaps[0].inputAmount.toExact())
    console.log("🚀 ~ Amount out", routes.swaps[routes.swaps.length - 1].outputAmount.toExact())

    const rawTx = rawExecuteTrade(routes);
    console.log("🚀 ~ main ~ rawTx:", rawTx)

}


main().catch(console.error);