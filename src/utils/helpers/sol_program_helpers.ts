import {
  AnchorProvider,
  BN,
  type Idl,
  Program,
  type Provider,
  setProvider,
} from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
  getMultipleAccounts,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { type SignerWalletAdapterProps } from "@solana/wallet-adapter-base";
import type { AnchorWallet } from "@solana/wallet-adapter-react";
import { type AccountMeta, type Connection, PublicKey } from "@solana/web3.js";

import idl from "../../sprintiq_program/idl.json";
import { getOrCreateAssociatedTokenAccount } from "./getOrCreateAssociatedAccount";

const decimals = 9;
const mintDecimals = Math.pow(10, decimals);

type WalletAddressesAndPercentages = {
  wallet_address: string | undefined;
  percentage: number;
};

const usdcDevCoinMintAddress = new PublicKey(
  "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
);

const PROGRAMID = new PublicKey("J1s7LQHYsHS82cw983LA5kC17ZNwBJXRmgVpa6fcWxd");

export const sendFunds = async (
  publicKey: PublicKey,
  anchor_wallet: AnchorWallet,
  connection: Connection,
  amount: string,
) => {
  console.log("---working");
  if (publicKey && anchor_wallet) {
    const provider = new AnchorProvider(connection, anchor_wallet, {});
    setProvider(provider);
    console.log("---provider set up");
    const programId = PROGRAMID;
    console.log(programId);
    const program = new Program(
      idl as unknown as Idl,
      programId as unknown as PublicKey,
    );
    console.log("here");

    const gameCreatorAssociatedUsdcToken = await getAssociatedTokenAddress(
      usdcDevCoinMintAddress,
      publicKey,
    );

    const [tokenAccountOwnerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("token_account_owner_pda"), publicKey.toBuffer()],
      programId,
    );

    const [tokenVault] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("sprint_iq_token_vault"),
        usdcDevCoinMintAddress.toBuffer(),
        publicKey.toBuffer(),
      ],
      programId,
    );

    console.log("TokenAccountOwnerPda: ", tokenAccountOwnerPda.toString());

    console.log("VaultAccount: ", tokenVault.toString());

    const confirmOptions = {
      skipPreflight: true,
    };
    //Initialization transaction
    const txHash = await program.methods
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      .initAndSendFunds(new BN(amount))
      .accounts({
        tokenAccountOwnerPda: tokenAccountOwnerPda,
        vaultTokenAccount: tokenVault,
        senderTokenAccount: gameCreatorAssociatedUsdcToken,
        mintOfTokenBeingSent: usdcDevCoinMintAddress,
        signer: publicKey,
      })
      .rpc(confirmOptions);

    console.log(`Initialize`);
    await logTransaction(txHash, connection);
    console.log(`Vault initialized.`);
    let tokenAccountInfo = await getAccount(
      connection,
      gameCreatorAssociatedUsdcToken,
    );
    console.log("Owned token amount: " + tokenAccountInfo.amount);
    tokenAccountInfo = await getAccount(connection, tokenVault);
    console.log("Vault token amount: " + tokenAccountInfo.amount);
  }
};

export const sendFundsToPlayers = async (
  publicKey: PublicKey,
  anchor_wallet: AnchorWallet,
  connection: Connection,
  walletAddressesAndPercentages: WalletAddressesAndPercentages[],
  signTransaction: SignerWalletAdapterProps["signTransaction"],
) => {
  console.log("---working");
  if (publicKey && anchor_wallet) {
    const provider = new AnchorProvider(connection, anchor_wallet, {});
    setProvider(provider);
    console.log("---provider set up");
    const programId = PROGRAMID;
    const program = new Program(
      idl as unknown as Idl,
      programId as unknown as PublicKey,
    );
    console.log("here");

    const [tokenAccountOwnerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("token_account_owner_pda"), publicKey.toBuffer()],
      programId,
    );

    const [tokenVault] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("sprint_iq_token_vault"),
        usdcDevCoinMintAddress.toBuffer(),
        publicKey.toBuffer(),
      ],
      programId,
    );

    console.log("TokenAccountOwnerPda: ", tokenAccountOwnerPda.toString());

    console.log("VaultAccount: ", tokenVault.toString());

    const confirmOptions = {
      skipPreflight: true,
    };
    try {
      const tokenAddresses: PublicKey[] = [];
      const percentages: number[] = [];

      // Iterate over the array of wallet addresses and percentages
      for (const {
        wallet_address,
        percentage,
      } of walletAddressesAndPercentages) {
        // Get the associated token address for each wallet address
        if (wallet_address) {
          const walletAddress = new PublicKey(wallet_address);
          const tokenAddress = await getOrCreateAssociatedTokenAccount(
            connection,
            publicKey,
            usdcDevCoinMintAddress,
            walletAddress,
            signTransaction,
          );

          // Store the token address and percentage
          tokenAddresses.push(tokenAddress.address);
          percentages.push(percentage);

          console.log(
            `Wallet address: ${wallet_address}, Token address: ${tokenAddress.address.toString()}`,
          );
        }
      }

      console.log("Token Addresses:", tokenAddresses.toString());
      console.log("Percentages:", percentages);

      const remainingAccounts: AccountMeta[] = [];

      for (const address of tokenAddresses) {
        const publicKey = new PublicKey(address.toString());
        const accountMeta: AccountMeta = {
          pubkey: publicKey,
          isWritable: true, // Adjust as needed
          isSigner: false, // Adjust as needed
        };
        remainingAccounts.push(accountMeta);
      }
      console.log("percentages", Buffer.from(percentages));
      //send funds to winners transaction
      const txHash = await program.methods
        .sendFundsToPlayers(Buffer.from(percentages))
        .accounts({
          tokenAccountOwnerPda: tokenAccountOwnerPda,
          vaultTokenAccount: tokenVault,
          mintOfTokenBeingSent: usdcDevCoinMintAddress,
          signer: publicKey,
        })
        //.signers([pg.wallet.keypair])
        .remainingAccounts(remainingAccounts)
        .rpc(confirmOptions);

      console.log(`Transfer tokens to winners`);
      await logTransaction(txHash, connection);
      const tokenAccountInfo = await getAccount(connection, tokenVault);
      console.log("Vault token amount: " + tokenAccountInfo.amount);

      const tokenAccountsInfo = await getMultipleAccounts(
        connection,
        tokenAddresses,
      );
      tokenAccountsInfo.map(account => {
        console.log(`${account.address.toString()}, ${account.amount}`);
      });
    } catch (error) {
      console.error("Error invoking transaction:", error);
      // Handle errors appropriately
    }
  }
};

async function logTransaction(txHash: string, connection: Connection) {
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash,
    lastValidBlockHeight,
    signature: txHash,
  });

  console.log(
    `Solana Explorer: https://explorer.solana.com/tx/${txHash}?cluster=devnet`,
  );
}

//This is just a function that generates random numbers for a game
export function generateGameCode(length: number): string {
  const characters = "0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const checkIfTokenAccountExists = async (
  connection: Connection,
  receiverTokenAccountAddress: PublicKey,
) => {
  // Check if the receiver's token account exists
  try {
    await getAccount(connection, receiverTokenAccountAddress, "confirmed");

    return true;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    // error.message is am empty string
    // TODO: fix upstream
    if (error.name === "TokenAccountNotFoundError") {
      return false;
    }

    throw error;
  }
};
