"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";
import { Icon } from "./components/DemoComponents";
import { DagatNaHome } from "./components/DagatNaHome";
import { FishGuide } from "./components/FishGuide";
import { AdoptFish } from "./components/AdoptFish";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  // Get page title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case "home":
        return "🐟 Dagat na"
      case "adopt":
        return "🎣 Adopt Fish"
      case "tank":
        return "🐠 Fish Tank"
      case "learn":
        return "📚 Fish Guide"
      default:
        return "🐟 Dagat na"
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <DagatNaHome setActiveTab={setActiveTab} />
      case "adopt":
        return <AdoptFish />
      case "tank":
        return <div className="text-center p-8">🐠 Fish Tank View Coming Soon!</div>
      case "learn":
        return <FishGuide />
      default:
        return <DagatNaHome setActiveTab={setActiveTab} />
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        {/* Updated Development Notice Banner */}
        <div className="mb-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <span className="text-green-600">🔗</span>
            <span className="text-sm font-semibold text-green-800">Phase 2: On-Chain Ready!</span>
            <span className="text-green-600">🔗</span>
          </div>
          <p className="text-xs text-green-700 leading-relaxed">
            Now with <strong>Base Sepolia</strong> setup ready! 
            Fish adoption system implemented.
          </p>
          <div className="mt-2 flex justify-center space-x-4 text-xs text-green-600">
            <span>✅ Fish Generation</span>
            <span>✅ Wagmi Config</span>
            <span>🔜 Smart Contract</span>
          </div>
        </div>

        <header className="flex justify-between items-center mb-3 h-11">
          <div className="flex items-center space-x-2">
            {/* Back Button */}
            {activeTab !== "home" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("home")}
                className="p-2"
                icon={<Icon name="arrow-right" size="sm" className="rotate-180" />}
              >
                Back
              </Button>
            )}
            
            {/* Wallet or Page Title */}
            {activeTab === "home" ? (
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            ) : (
              <h2 className="font-bold text-lg">{getPageTitle()}</h2>
            )}
          </div>
          
          <div>{saveFrameButton}</div>
        </header>

        <main className="flex-1">
          {renderContent()}
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            🐟 Dagat na • Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}