import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL;
  return {
    title: "Dagat na - Filipino Fish Care Game", // Use text only for title
    description: "Adopt, raise, and care for Filipino fish species in this Tamagotchi-style mini app built on Base",
    icons: {
      icon: "/fish/Dalagang bukid.png", // Use your fish image as favicon/ico
      shortcut: "/fish/Dalagang bukid.png",
      apple: "/fish/Dalagang bukid.png",
    },
    openGraph: {
      images: [
        {
          url: "/fish/Dalagang bukid.png", // Social preview image
          width: 400,
          height: 400,
          alt: "Dalagang bukid",
        },
      ],
    },
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: "/fish/Dalagang bukid.png", // Hero image for Farcaster frame
        button: {
          title: `Adopt Your First Filipino Fish`,
          action: {
            type: "launch_frame",
            name: "Dagat na",
            url: URL,
            splashImageUrl: "/fish/Dalagang bukid.png",
            splashBackgroundColor: "#0066FF",
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}