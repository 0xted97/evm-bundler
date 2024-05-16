import { getProvider, getWalletAddress, } from "./providers"
import { MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS, NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS } from "./constants"
import { CurrencyAmount, Percent, Token } from "@uniswap/sdk-core"
import { AddLiquidityOptions, CollectOptions, NonfungiblePositionManager, RemoveLiquidityOptions, } from "@uniswap/v3-sdk"
import { CurrentConfig } from "../config"
import { constructPosition } from "./positions"
import { fromReadableAmount } from "./utils"

export async function rawAddLiquidity(positionId: number): Promise<any> {
  const address = getWalletAddress()
  const provider = getProvider()
  if (!address || !provider) {
    throw new Error('Cannot execute a trade without a connected wallet')
  }

  const addLiquidityOptions: AddLiquidityOptions = {
    recipient: address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    slippageTolerance: new Percent(50, 10_000),
    tokenId: positionId,
  }

  const position = await constructPosition(
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.token0,
      fromReadableAmount(
        CurrentConfig.tokens.token0Amount * CurrentConfig.tokens.fractionToAdd,
        CurrentConfig.tokens.token0.decimals
      ).toString()
    ),
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.token1,
      fromReadableAmount(
        CurrentConfig.tokens.token1Amount * CurrentConfig.tokens.fractionToAdd,
        CurrentConfig.tokens.token1.decimals
      ).toString()
    ),
  )


  // get calldata for minting a position
  const { calldata, value } = NonfungiblePositionManager.addCallParameters(
    position,
    addLiquidityOptions
  );

  const tx = {
    data: calldata,
    to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: value,
    from: address,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  }
  return tx;
}


export async function rawRemoveLiquidity(positionId: number): Promise<any> {
  const address = getWalletAddress()
  const provider = getProvider()
  if (!address || !provider) {
    throw new Error('Cannot execute a trade without a connected wallet')
  }

  const collectOptions: Omit<CollectOptions, 'tokenId'> = {
    expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.token0,
      0
    ),
    expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.token1,
      0
    ),
    recipient: address,
  }

  const removeLiquidityOptions: RemoveLiquidityOptions = {
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    slippageTolerance: new Percent(50, 10_000),
    tokenId: positionId,
    liquidityPercentage: new Percent(CurrentConfig.tokens.fractionToRemove),
    collectOptions,
  }

  const currentPosition = await constructPosition(
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.token0,
      fromReadableAmount(
        CurrentConfig.tokens.token0Amount,
        CurrentConfig.tokens.token0.decimals
      ).toString()
    ),
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.token1,
      fromReadableAmount(
        CurrentConfig.tokens.token1Amount,
        CurrentConfig.tokens.token1.decimals
      ).toString()
    )
  )


  // get calldata for minting a position
  const { calldata, value } = NonfungiblePositionManager.removeCallParameters(
    currentPosition,
    removeLiquidityOptions
  );

  const tx = {
    data: calldata,
    to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: value,
    from: address,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  }
  return tx;
}