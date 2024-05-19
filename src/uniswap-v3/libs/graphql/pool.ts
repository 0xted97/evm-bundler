// import { gql, request } from "graphql-request";

import axios from "axios";
import { CurrentConfig } from "../../config";
import { PoolInfo } from "../types";
import { ethers } from "ethers";
import { FeeAmount, Tick, TICK_SPACINGS } from "@uniswap/v3-sdk";

export async function getGraphPoolInfo(poolId: string): Promise<PoolInfo> {
   const query = `
      {
         pool(id: "${poolId.toString().toLowerCase()}") {
            tick
            token0 {
               symbol
               id
               decimals
            }
            token1 {
               symbol
               id
               decimals
            }
            feeTier
            sqrtPrice
            liquidity
            ticks { id liquidityGross liquidityNet }
         }
      }
   `;
   try {
      const response = await axios.post(CurrentConfig.common.subgraphUri, {
         query: query
      });

      const { pool } = response.data.data;
      const ticks = await fetchTicks(poolId, 0, 10000);
      return {
         fee: Number(pool.feeTier),
         tick: Number(pool.tick),
         token0: pool.token0.id,
         token1: pool.token1.id,
         sqrtPriceX96: ethers.BigNumber.from(pool.sqrtPrice),
         liquidity: ethers.BigNumber.from(pool.liquidity),
         tickSpacing: Number(TICK_SPACINGS[Number(pool.feeTier) as FeeAmount]),
         ticks: ticks
      }
   } catch (error) {
      console.error("Error fetching data from Uniswap V3 Subgraph:", error);
      throw error;
   }
}


export async function fetchTicks(poolId: string, min: number, max: number): Promise<Tick[]> {
   const ticks: Tick[] = [];
   for (let i = min; i <= max; i += 1000) {
      const query = `
         {
            pool(id: "${poolId.toString().toLowerCase()}") {
               ticks(first: 1000, skip: ${i}, orderBy: id) {
                  id
                  liquidityGross
                  liquidityNet
               }
            }
         }
      `;
      try {
         const response = await axios.post(CurrentConfig.common.subgraphUri, {
            query: query
         });
         if(!response.data.data) continue;

         const { pool } = response.data.data;
         const poolTicks = pool.ticks.map((tick: any) => {
            return new Tick({
               index: Number(String(tick.id).split("#")[1]),
               liquidityGross: Number(tick.liquidityGross),
               liquidityNet: Number(tick.liquidityNet)
            });
         });
         ticks.push(...poolTicks);
      } catch (error) {
         console.error("Error fetching data from Uniswap V3 Subgraph:", error);
         throw error;
      }
   }
   return ticks.filter(tick=>{
      return Number(tick.liquidityNet.toString()) > 0;
   }).sort((a, b) => a.index - b.index);
}

