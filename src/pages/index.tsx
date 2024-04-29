import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import GetStarted from "@src/components/icons/GetStarted.icon";
import { ProfileContext } from "@src/provider/ProfileProvider";
import { api } from "@src/utils/api";
import { LABELS, Routes } from "@src/utils/constants/constants";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo } from "react";

import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
export default function Page() {
  const createUser = api.auth.create.useMutation();
  const { login } = useContext(ProfileContext);
  const { push } = useRouter();
  const { buttonState, onConnect, publicKey } = useWalletMultiButton({
    onSelectWallet({ wallets, onSelectWallet }) {
      setModalVisible(true);
      console.log({ wallets, onSelectWallet });
    },
  });
  useEffect(() => {
    if (publicKey) {
      void createUser
        .mutateAsync({
          wallet_address: publicKey.toBase58(),
        })
        .then(res => {
          if (!res.success) {
            // TODO implement an error toast
            return;
          }
          void login(res.user!.wallet_address).then(res => {
            if (res.success) {
              void push(`/dashboard/${Routes.HOME}`);
            }
          });
        });
    }
  }, [publicKey]);
  const content = useMemo(() => {
    if (publicKey) {
      const base58 = publicKey.toBase58();
      return base58.slice(0, 4) + ".." + base58.slice(-4);
    } else if (buttonState === "connecting" || buttonState === "has-wallet") {
      return LABELS[buttonState];
    }
  }, [buttonState, publicKey]);
  const { setVisible: setModalVisible } = useWalletModal();
  const handleSignIn = () => {
    switch (buttonState) {
      case "no-wallet":
        setModalVisible(true);
        break;
      case "has-wallet":
        if (onConnect) {
          onConnect();
        }
        break;
      case "connected":
        // redirect user to dashboard
        break;
    }
  };
  return (
    <div className="relative  flex w-full flex-col  tracking-[normal]">
      <Navbar />
      <section className="mx-auto mt-16 flex h-full w-full flex-col items-center justify-center">
        <Hero />
        <button onClick={handleSignIn}>
          <GetStarted className="mt-8 w-36" />
        </button>
      </section>
    </div>
  );
}
