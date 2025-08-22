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
import { Button } from "./components/Main/DemoComponents";
import { Icon } from "./components/Main/DemoComponents";
import { DagatNaHome } from "./components/Main/DagatNaHome";
import { FishGuide } from "./components/Main/FishGuide";
import { AdoptFish } from "./components/MainFeatures/AdoptFish/AdoptFish";
import { FishTank } from "./components/MainFeatures/FishTank/FishTank";

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
        return <FishTank />
      case "learn":
        return <FishGuide />
      default:
        return <DagatNaHome setActiveTab={setActiveTab} />
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
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

        {/* Development Notice Banner - only show on home page */}
        {activeTab === "home" && (
          <>
            <div className="mt-6 mb-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <span className="text-green-600">🔗</span>
                <span className="text-sm font-semibold text-green-800">Phase 2: On-Chain Live!</span>
                <span className="text-green-600">🔗</span>
              </div>
              <p className="text-xs text-green-700 leading-relaxed">
                Full blockchain integration with <strong>Base Sepolia</strong>! 
                Fish adoption & tank management ready.
              </p>
              <div className="mt-2 flex justify-center space-x-4 text-xs text-green-600">
                <span>✅ Smart Contract</span>
                <span>✅ NFT Minting</span>
                <span>✅ Fish Tank</span>
              </div>
              
              {/* Development Warning */}
              <div className="mt-3 pt-2 border-t border-green-200">
                <p className="text-xs text-orange-700 leading-relaxed">
                  ⚠️ <strong>Development Phase:</strong> This is still in testing phase. 
                  Fish or progress might be erased when uploading new contract address 
                  to get updated and fix bugs for the future. Thanks for participation!
                </p>
              </div>
            </div>

            {/* Roadmap / Things To Do Section */}
            <div className="mb-3 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <span className="text-blue-600">📝</span>
                <span className="text-sm font-semibold text-blue-800">Dagat na Roadmap & Things To Do</span>
                <span className="text-blue-600">📝</span>
              </div>
              <p className="text-xs text-blue-700 leading-relaxed mb-2">
                See what&apos;s planned, what&apos;s in progress, and suggest features or report bugs!
              </p>
              <a
                href="https://github.com/JazzNase/dagat-na/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
              >
                📋 View & Suggest on GitHub Issues
              </a>
            </div>
          </>
        )}

        <footer className="pt-4 flex flex-col items-center space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            🐟 Dagat na • Built on Base with MiniKit
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://www.facebook.com/jazz.nase.14")}
          >
            👨‍💻 Builder: Jazz Michael Nase
          </Button>
        </footer>
      </div>
    </div>
  );
}