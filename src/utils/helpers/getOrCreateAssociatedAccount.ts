// getOrCreateAssociatedTokenAccount.ts
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";
import {
  Commitment,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";

import { createAssociatedTokenAccountInstruction } from "./createAssociatedTokenAccountInstruction";
import { getAccountInfo } from "./getAccountInfo";
import { getAssociatedTokenAddress } from "./getAssociatedTokenAddress";

type ErrorMessage = {
  message: string;
};

export async function getOrCreateAssociatedTokenAccount(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
  signTransaction: SignerWalletAdapterProps["signTransaction"],
  allowOwnerOffCurve = false,
  commitment?: Commitment,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
) {
  console.log("---- getting associated token address");
  const associatedToken = await getAssociatedTokenAddress(
    mint,
    owner,
    allowOwnerOffCurve,
    programId,
    associatedTokenProgramId,
  );
  console.log("---- done");

  // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
  // Sadly we can't do this atomically.
  let account;
  try {
    console.log("---- getting account info");
    account = await getAccountInfo(
      connection,
      associatedToken,
      commitment,
      programId,
    );

    console.log("---- done");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
    // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
    // TokenInvalidAccountOwnerError in this code path.
    console.error("Error getting account info", error);
    if (
      error === "TokenAccountNotFoundError" ||
      error === "TokenInvalidAccountOwnerError"
    ) {
      // As this isn't atomic, it's possible others can create associated accounts meanwhile.
      try {
        console.log("---- creating associated token account instruction");
        const transaction = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            payer,
            associatedToken,
            owner,
            mint,
            programId,
            associatedTokenProgramId,
          ),
        );
        console.log("---- done");

        const blockHash = await connection.getRecentBlockhash();
        transaction.feePayer = payer;
        transaction.recentBlockhash = blockHash.blockhash;
        const signed = await signTransaction(transaction);

        const signature = await connection.sendRawTransaction(
          signed.serialize(),
        );

        await connection.confirmTransaction(signature);
      } catch (error: unknown) {
        // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
        // instruction error if the associated account exists already.
      }
      console.log("---- now this should always succedd");
      // Now this should always succeed
      account = await getAccountInfo(
        connection,
        associatedToken,
        commitment,
        programId,
      );
      console.log("---- done");
    } else {
      console.log("Error getting the account info for the second time ", error);
      throw error;
    }
  }
  console.log("---- finalising");
  if (!account.mint.equals(mint)) throw Error("TokenInvalidMintError");
  if (!account.owner.equals(owner)) throw new Error("TokenInvalidOwnerError");
  console.log("---- done");
  return account;
}
