import { BaseProvider } from '@ethersproject/providers'
import { ethers } from 'ethers'

import { CurrentConfig } from '../config'

const provider = new ethers.providers.JsonRpcProvider(
  CurrentConfig.rpc.mainnet
);

const createWallet = (): ethers.Wallet =>{
  return new ethers.Wallet(CurrentConfig.wallet.privateKey, provider)
}

const wallet = createWallet();

// Provider and Wallet Functions

export function getProvider(): BaseProvider {
  return provider
}

export function getWalletAddress(): string | null {
    return wallet.address
}