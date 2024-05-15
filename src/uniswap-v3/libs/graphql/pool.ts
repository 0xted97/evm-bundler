// import { gql, request } from "graphql-request";

import axios from "axios";
import { CurrentConfig } from "../../config";
import { PoolInfo } from "../types";
import { ethers } from "ethers";
import { FeeAmount, TICK_SPACINGS } from "@uniswap/v3-sdk";

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
         }
      }
   `;
   try {
      const response = await axios.post(CurrentConfig.common.subgraphUri, {
         query: query
      });

      const { pool } = response.data.data;
      return {
         fee: Number(pool.feeTier),
         tick: Number(pool.tick),
         token0: pool.token0.id,
         token1: pool.token1.id,
         sqrtPriceX96: ethers.BigNumber.from(pool.sqrtPrice),
         liquidity: ethers.BigNumber.from(pool.liquidity),
         tickSpacing: Number(TICK_SPACINGS[Number(pool.feeTier) as FeeAmount]),
      }
   } catch (error) {
      console.error("Error fetching data from Uniswap V3 Subgraph:", error);
      throw error;
   }
}

