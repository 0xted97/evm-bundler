import { Token } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import dotenv from 'dotenv';
dotenv.config();

import { USDC_TOKEN, LINK_TOKEN, WETH_TOKEN } from './libs/constants'

// Sets if the example should run locally or on chain
export enum Environment {
  LOCAL,
  MAINNET,
  WALLET_EXTENSION,
}

// Inputs that configure this example to run
export interface ExampleConfig {
  common: {
    subgraphUri: string;
    subgraphUriEnabled: boolean;
  }
  env: Environment
  rpc: {
    local: string
    mainnet: string
  }
  wallet: {
    address: string
    privateKey: string
  }
  tokens: {
    in: Token
    amountIn: number
    out: Token
    poolFee: number
  }
}

// Example Configuration

export const CurrentConfig: ExampleConfig = {
  common: {
    subgraphUri: process.env.UNISWAP_GRAPH_URL || '',
    subgraphUriEnabled: process.env.UNISWAP_GRAPH_ENABLED === 'true',
  },
  env: Environment.MAINNET,
  rpc: {
    local: '',
    mainnet: 'https://eth.llamarpc.com',
  },
  wallet: {
    address: '0x9F969EcA8815562260Fba6C533533a918841da2a',
    privateKey:
      '9701b33be5cd2751094d215871b85e53a93312b6d0f2ac97ff1b774055ec52a9',
  },
  tokens: {
    in: WETH_TOKEN,
    amountIn: 1.8,
    out: USDC_TOKEN,
    poolFee: FeeAmount.MEDIUM,
  },
}
