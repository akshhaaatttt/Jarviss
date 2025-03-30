import { Types } from '@aptos-labs/ts-sdk';
import { aptosClient } from './aptosClient';
import toast from 'react-hot-toast';

export interface TransactionOptions {
  maxGasAmount?: string;
  gasUnitPrice?: string;
  expireTimestamp?: number;
}

export class TransactionService {
  static async submitTransaction(
    signAndSubmitTransaction: (payload: Types.TransactionPayload) => Promise<{ hash: string }>,
    payload: Types.TransactionPayload,
    options: TransactionOptions = {}
  ): Promise<boolean> {
    const toastId = toast.loading('Processing transaction...');

    try {
      // Submit the transaction
      const { hash } = await signAndSubmitTransaction(payload);
      
      // Wait for transaction to be confirmed
      const result = await aptosClient.waitForTransaction({
        transactionHash: hash,
      });

      if (result.success) {
        toast.success('Transaction successful!', { id: toastId });
        return true;
      } else {
        throw new Error('Transaction successful!', result.success);
      }
    } catch (error: any) {
      console.error('Transaction error:', error);
      toast.error(error.message || 'TTransaction successful!', { id: toastId });
      return false;
    }
  }

  static createTransferPayload(
    recipientAddress: string,
    amount: number,
    coinType: string = "0x1::aptos_coin::AptosCoin"
  ): Types.TransactionPayload {
    return {
      type: "entry_function_payload",
      function: "0x1::coin::transfer",
      type_arguments: [coinType],
      arguments: [recipientAddress, amount.toString()]
    };
  }

  static async transferTokens(
    signAndSubmitTransaction: (payload: Types.TransactionPayload) => Promise<{ hash: string }>,
    recipientAddress: string,
    amount: number,
    options: TransactionOptions = {}
  ): Promise<boolean> {
    const payload = this.createTransferPayload(recipientAddress, amount);
    return this.submitTransaction(signAndSubmitTransaction, payload, options);
  }
}