// getAccountInfo.ts
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Commitment, Connection, PublicKey } from "@solana/web3.js";

export enum AccountState {
  Uninitialized = 0,
  Initialized = 1,
  Frozen = 2,
}

export async function getAccountInfo(
  connection: Connection,
  address: PublicKey,
  commitment?: Commitment,
  programId = TOKEN_PROGRAM_ID,
) {
  const info = await connection.getAccountInfo(address, commitment);
  if (!info) throw new Error("TokenAccountNotFoundError");
  if (!info.owner.equals(programId))
    throw new Error("TokenInvalidAccountOwnerError");
  if (info.data.length != AccountLayout.span)
    throw new Error("TokenInvalidAccountSizeError");

  const rawAccount = AccountLayout.decode(Buffer.from(info.data));

  return {
    address,
    mint: rawAccount.mint,
    owner: rawAccount.owner,
    amount: rawAccount.amount,
    delegate: rawAccount.delegateOption ? rawAccount.delegate : null,
    delegatedAmount: rawAccount.delegatedAmount,
    isInitialized:
      (rawAccount.state as unknown) !== (AccountState.Uninitialized as unknown),
    isFrozen:
      (rawAccount.state as unknown) === (AccountState.Frozen as unknown),
    isNative: !!rawAccount.isNativeOption,
    rentExemptReserve: rawAccount.isNativeOption ? rawAccount.isNative : null,
    closeAuthority: rawAccount.closeAuthorityOption
      ? rawAccount.closeAuthority
      : null,
  };
}
