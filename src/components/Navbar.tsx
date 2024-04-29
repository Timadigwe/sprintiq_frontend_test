import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ProfileContext } from "@src/provider/ProfileProvider";
import { api } from "@src/utils/api";
import { LABELS, Routes } from "@src/utils/constants/constants";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo } from "react";
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
    <header className="flex flex-row justify-between bg-black/[0.12] px-8 py-4 sm:flex-row sm:p-4">
      <Image
        className="mb-4 h-6 w-auto sm:mb-0"
        loading="lazy"
        alt=""
        width={200}
        height={50}
        src="/logo.png"
      />
      <div className="flex flex-row justify-start gap-4 sm:justify-end">
        <button
          onClick={handleSignIn}
          className="ml-auto rounded-full bg-gradient-to-r from-green-700 via-green-700 to-green-700 px-5 py-1.5 text-center text-lg font-medium text-white shadow-lg shadow-green-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-green-300 dark:shadow-lg dark:shadow-green-800/80 dark:focus:ring-green-800"
        >
          Play
        </button>
      </div>
    </header>
  );
}

// import type { NextPage } from "next";
// import Image from "next/image";
// import Link from "next/link";
// import { useCallback } from "react";

// const Navbar: NextPage = () => {
//   const onButtonPrimaryClick = useCallback(() => {
//     // Please sync "Connect wallet" to the project
//   }, []);

//   return (
//     <header className="flex flex-row justify-between bg-black/[0.12] px-8 py-4 sm:flex-row sm:p-4">
//       <Image
//         className="mb-4 h-6 w-auto sm:mb-0"
//         loading="lazy"
//         alt=""
//         width={200}
//         height={50}
//         src="/logo.png"
//       />
//       <div className="flex flex-row justify-start gap-4 sm:justify-end">

//         <button>

//           <Link
//             href="/login"
//             className="ml-auto rounded-full bg-gradient-to-r from-green-700 via-green-700 to-green-700 text-center font-medium text-white shadow-lg shadow-green-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-green-300 dark:shadow-lg dark:shadow-green-800/80 dark:focus:ring-green-800 py-1.5 px-5 text-lg"
//           >
//             Play
//           </Link>
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
