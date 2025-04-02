
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, Download, Chrome, Globe } from 'lucide-react';

const PhantomInstallGuide = () => {
  const openPhantomWebsite = () => {
    window.open('https://phantom.app/', '_blank');
  };

  const openChromeWebStore = () => {
    window.open('https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa', '_blank');
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Install Phantom Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Install Phantom Wallet</DialogTitle>
          <DialogDescription>
            Phantom is a friendly crypto wallet built for Solana users.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-gray-50">
            <img 
              src="https://phantom.app/img/logo.svg" 
              alt="Phantom Logo" 
              className="h-16 w-16"
            />
            <p className="text-center text-sm text-gray-600">
              Phantom makes it safe & easy for you to store, buy, send, receive, and swap tokens on the Solana blockchain.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Installation options:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="flex justify-start items-center gap-2"
                onClick={openPhantomWebsite}
              >
                <Globe className="h-4 w-4" />
                Phantom Website
              </Button>
              <Button 
                variant="outline" 
                className="flex justify-start items-center gap-2"
                onClick={openChromeWebStore}
              >
                <Chrome className="h-4 w-4" />
                Chrome Extension
              </Button>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-800">
            <p className="flex items-start gap-2">
              <Download className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>After installation, refresh this page to connect your wallet.</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhantomInstallGuide;
