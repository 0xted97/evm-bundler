import { getPrice } from "../libs/pool";
import { createSingleTrade, executeTrade, rawExecuteTrade } from "../libs/router";

async function main() {
    // const quoteAmount = await quoteExactInputSingle();
    // console.log("🚀 ~ main ~ quoteAmount:", quoteAmount)
    const dataTable: any = {
    };
    // Exact input
    const routes = await createSingleTrade();
    const price = await getPrice();
    dataTable.price = price.toFixed();
    dataTable.priceImpact = routes.priceImpact.toFixed();
    dataTable.executionPrice = routes.executionPrice.toFixed();
    dataTable.amountIn = routes.swaps[0].inputAmount.toExact();
    dataTable.amountOut = routes.swaps[0].outputAmount.toExact();
    dataTable.routerPath = routes.swaps.map(swap => swap.route.pools.map(pool => pool.token0.symbol + "-" + pool.token1.symbol).join(" -> ")).join(" -> ");
    console.table(dataTable)

    // Execute trade
    const tx = await executeTrade(routes);
    console.log("🚀 ~ main ~ tx:", tx)

}


main().catch(console.error);