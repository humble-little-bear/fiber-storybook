import type { Metadata } from "next";
import localFont from "next/font/local";
import { SoundProvider } from "@/components/providers/sound-provider";
import "./globals.css";

const chalkboardSe = localFont({
  src: [
    {
      path: "../public/font/ChalkboardSE-Light-01_0.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/font/ChalkboardSE-Regular-02_0.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/font/ChalkboardSE-Bold-03_0.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-chalk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fiber Storybook",
  description: "A scroll-driven Fiber storybook starring Pico at the airport nap pods.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={chalkboardSe.variable}>
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
