import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { computePoolAddress, Tick, tickToPrice } from '@uniswap/v3-sdk'
import { ethers } from 'ethers'
import JSBI from "jsbi";
import { Contract, Provider } from 'ethers-multicall'

import { CurrentConfig } from '../config'
import { POOL_FACTORY_CONTRACT_ADDRESS } from './constants'
import { getProvider } from './providers'
import { fetchTicks, getGraphPoolInfo } from './graphql'
import { PoolInfo } from './types'
import { Price, Token } from '@uniswap/sdk-core'
import { tickToWord } from './utils'
import { getAllTicks, getTickIndicesInWordRange } from './fetcher';


export async function getPoolInfoFromContract(): Promise<PoolInfo> {
  const provider = getProvider()
  if (!provider) {
    throw new Error('No provider')
  }

  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: CurrentConfig.tokens.in,
    tokenB: CurrentConfig.tokens.out,
    fee: CurrentConfig.tokens.poolFee,
  })

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    provider
  )

  const [token0, token1, fee, tickSpacing, liquidity, slot0] =
    await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ])
  const ticks = await fetchAllTicksFromContract(currentPoolAddress, tickSpacing);
  console.log("🚀 ~ getPoolInfoFromContract ~ ticks:", ticks)


  return {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
    ticks: []
  }
}


export async function getPoolInfoFromGraph(): Promise<any> {


  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: CurrentConfig.tokens.in,
    tokenB: CurrentConfig.tokens.out,
    fee: CurrentConfig.tokens.poolFee,
  });

  const res = await getGraphPoolInfo(currentPoolAddress)
  return res;
}


export async function fetchAllTicksFromContract(poolAddress: string, tickSpacing: number): Promise<any> {
  const provider = getProvider()
  const multicallProvider = new Provider(provider)
  await multicallProvider.init()

  const minWord = tickToWord(-887272, tickSpacing)
  const maxWord = tickToWord(887272, tickSpacing)

  // Fetch all initialized tickIndices in word range
  const tickIndices = await getTickIndicesInWordRange(
    poolAddress,
    tickSpacing,
    minWord,
    maxWord
  )
  console.log(tickIndices)

  // Fetch all initialized ticks from tickIndices
  const ticks = await getAllTicks(poolAddress, tickIndices)
  return ticks;
}



export async function getPoolInfo(): Promise<PoolInfo> {
  const enabled = CurrentConfig.common.subgraphUriEnabled;
  if (!enabled) {
    console.log("🚀 ~ Get Pool from contract");
    return getPoolInfoFromContract();
  }
  console.log("🚀 ~ Get Pool from subgraph");
  return getPoolInfoFromGraph();
}



export async function getPrice(): Promise<Price<Token, Token>> {
  const poolInfo = await getPoolInfo()
  return tickToPrice(
    CurrentConfig.tokens.in,
    CurrentConfig.tokens.out,
    poolInfo.tick,
  )
}