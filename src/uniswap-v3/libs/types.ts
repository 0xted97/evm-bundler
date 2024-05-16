import { BigNumber } from "ethers"

export enum TransactionState {
    Failed = 'Failed',
    New = 'New',
    Rejected = 'Rejected',
    Sending = 'Sending',
    Sent = 'Sent',
  }
  
export interface PoolInfo {
    token0: string
    token1: string
    fee: number
    tickSpacing: number
    sqrtPriceX96: BigNumber
    liquidity: BigNumber
    tick: number
}

export interface PositionInfo {
    tickLower: number
    tickUpper: number
    liquidity: BigNumber
    feeGrowthInside0LastX128: BigNumber
    feeGrowthInside1LastX128: BigNumber
    tokensOwed0: BigNumber
    tokensOwed1: BigNumber
  }