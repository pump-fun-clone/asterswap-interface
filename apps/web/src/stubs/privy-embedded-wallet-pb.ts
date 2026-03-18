/**
 * Stub for @uniswap/client-privy-embedded-wallet (private Uniswap package).
 * AsterSwap does not use Uniswap's embedded passkey wallet feature.
 * This stub satisfies type imports so the dev server starts cleanly.
 */

export enum Action {
  ACTION_UNSPECIFIED = 0,
  CREATE_WALLET = 1,
  WALLET_SIGNIN = 2,
  SIGN_MESSAGE = 3,
  SIGN_TRANSACTION = 4,
  SIGN_TYPED_DATA = 5,
  EXPORT_SEED_PHRASE = 6,
  REGISTER_NEW_AUTHENTICATION_TYPES = 7,
  LIST_AUTHENTICATORS = 8,
}

export enum AuthenticationTypes {
  AUTHENTICATION_TYPE_UNSPECIFIED = 0,
  PASSKEY_REGISTRATION = 1,
  PASSKEY_AUTHENTICATION = 2,
}

export enum RegistrationOptions_AuthenticatorAttachment {
  AUTHENTICATOR_ATTACHMENT_UNSPECIFIED = 0,
  PLATFORM = 1,
  CROSS_PLATFORM = 2,
}

export interface ChallengeResponse {
  challengeOptions: string
  walletAddress?: string
  walletId?: string
}

export interface RegistrationOptions {
  authenticatorAttachment?: RegistrationOptions_AuthenticatorAttachment
  username?: string
}
