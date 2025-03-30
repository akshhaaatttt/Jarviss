import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

const config = new AptosConfig({ network: Network.DEVNET });
export const aptosClient = new Aptos(config);

export const DECIMALS = 100000000; // 8 decimal places for APT

export async function getTokenBalance(address: string, maxRetries: number = 5): Promise<number> {
  let lastError: Error | null = null;

  // Validate address format (0x followed by 64 hex characters)
  if (!/^0x[a-fA-F0-9]{64}$/.test(address)) {
    throw new Error(`Invalid Aptos address format: ${address}`);
  }

  for (let i = 0; i < maxRetries; i++) {
    try {
      const resources = await aptosClient.getAccountResources({
        accountAddress: address,
      });
      
      const accountResource = resources.find(
        (r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
      );

      if (!accountResource) {
        throw new Error(`Could not find APT coin store for address: ${address}`);
      }

      const balance = (accountResource.data as any).coin.value;
      return parseInt(balance) / DECIMALS;
    } catch (error: any) {
      lastError = error;
      
      // Check if it's an account not found error
      if (error.message?.includes("account_not_found")) {
        console.warn(`Account ${address} not found, attempt ${i + 1}/${maxRetries}`);
        // Exponential backoff: 250ms, 500ms, 1000ms, 2000ms, 4000ms
        const delay = Math.min((2 ** i) * 250, 4000); // Cap at 4 seconds
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // For other errors, throw immediately
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  // If we've exhausted all retries, throw a user-friendly error
  throw new Error(`Account ${address} not found on the Aptos network after ${maxRetries} attempts. The account may not exist or may not be funded yet.`);
}