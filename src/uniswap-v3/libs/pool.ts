import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { computePoolAddress, tickToPrice } from '@uniswap/v3-sdk'
import { ethers } from 'ethers'

import { CurrentConfig } from '../config'
import { POOL_FACTORY_CONTRACT_ADDRESS } from './constants'
import { getProvider } from './providers'
import { getGraphPoolInfo } from './graphql'
import { PoolInfo } from './types'
import { Price, Token } from '@uniswap/sdk-core'


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


  return {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
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