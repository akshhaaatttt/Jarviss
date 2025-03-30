import React, { useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

export const WalletConnect: React.FC = () => {
  const { connected, account, connect, disconnect, wallets, wallet } = useWallet();

  useEffect(() => {
    if (wallet) {
      console.log('Current wallet:', wallet.name);
    }
  }, [wallet]);

  const handleWalletConnection = async () => {
    if (connected) {
      try {
        await disconnect();
        console.log('Wallet disconnected');
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    } else {
      try {
        if (typeof window.aptos !== 'undefined') {
          const petraWallet = wallets.find(w => w.name === 'Petra');
          if (petraWallet) {
            await connect(petraWallet.name);
            console.log('Petra wallet connected');
          } else {
            toast.error('Petra wallet not found in available wallets');
          }
        } else {
          toast.error('Please install Petra wallet to continue', {
            duration: 6000,
            action: {
              label: 'Install',
              onClick: () => window.open('https://petra.app/', '_blank'),
            },
          });
        }
      } catch (error) {
        console.error('Failed to connect:', error);
        toast.error('Failed to connect to wallet');
      }
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {connected && account && (
        <div className="flex items-center bg-lavender-100 text-lavender-800 px-4 py-2 rounded-lg">
          <Wallet className="h-4 w-4 mr-2" />
          <span className="text-sm">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </span>
        </div>
      )}
      <button
        onClick={handleWalletConnection}
        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
          connected
            ? 'bg-lavender-100 text-lavender-800 hover:bg-lavender-200'
            : 'bg-lavender-600 text-white hover:bg-lavender-700'
        }`}
      >
        <Wallet className="h-4 w-4 mr-2" />
        {connected ? 'Disconnect' : 'Connect Petra Wallet'}
      </button>
    </div>
  );
};