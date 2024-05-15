import { quoteExactInputSingle } from "./libs/quote";
import { createTrade, rawExecuteTrade } from "./libs/router";

async function main() {
    // const quoteAmount = await quoteExactInputSingle();
    // console.log("🚀 ~ main ~ quoteAmount:", quoteAmount)
    const dataTable: any = {
    };
    // Exact input
    const routes = await createTrade();
    dataTable.priceImpact = routes.priceImpact.toFixed();
    dataTable.executionPrice = routes.executionPrice.toFixed();
    dataTable.amountIn = routes.swaps[0].inputAmount.toExact();
    dataTable.amountOut = routes.swaps[0].outputAmount.toExact();
    dataTable.routerPath = routes.swaps.map(swap => swap.route.pools.map(pool => pool.token0.symbol + "-" + pool.token1.symbol).join(" -> ")).join(" -> ");
    const rawTx = await rawExecuteTrade(routes);
    console.table(dataTable)

}


main().catch(console.error);