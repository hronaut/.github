# Local EVM wallet QA: a hash is not confirmation

[Video (MP4, about 45 seconds)](hronaut-wallet-qa-2.4.24.mp4) ·
[Caption transcript](hronaut-wallet-qa-2.4.24.srt)

Recorded September 17, 2026 with a real Hronaut **2.4.24 source build**, real Anvil
**1.3.1**, and the unchanged released
[local wallet fixture](https://github.com/hronaut/hronaut/blob/v2.4.24/examples/wallet-qa/index.html).
The whole 39.67-second native capture runs at original speed. Title, closing card,
editorial captions and original 120 BPM music are outside the application UI.

## What actually ran

Twenty focused assertions passed in a network-isolated Linux/Electron test:

- An MCP SDK test client creates a scratch workspace and opens the local fixture.
- Trusted Settings imports a disposable wallet, attached only to that workspace;
  automatic signing policies stay empty. This setup happens before recording.
- The fixture discovers Hronaut's own EIP-6963/EIP-1193 provider.
- Rejecting account access returns `4001` and exposes no account. A subsequent
  operator-test approval grants access to one disposable account.
- The 1 wei request is simulated, then rejected in trusted Hronaut approval:
  no hash, no submitted transaction.
- A separately approved request returns one transaction hash. With Anvil
  automining off, the independent receipt read reports pending—not success.
- After one local mine, reading that **same hash** yields receipt status `0x1`.
  Hronaut's request record also becomes confirmed. The chain transaction count
  is exactly one; the pending transaction is not resubmitted.

**Operator-role disclosure:** Playwright's test harness fills normal trusted
Settings and clicks Hronaut's real approval controls. It is testing the operator
role, not demonstrating a human trial or an MCP agent approving itself. No
approval bypass or automatic signing policy is used.

The wallet has a random throwaway key and a valueless balance on local Anvil.
No real wallet, recovery material, customer information or public-chain funds
are used. Keys/passphrases are not recorded; the isolated profile is discarded.
The native UI shows only disposable addresses and transaction identifiers.

The fixture's `walletBehavior: not-exercised` on a receipt entry means that
**independent local RPC read** does not exercise a wallet. Its correlated logs
alone cannot prove approval; the native-dialog and Hronaut request-state checks
are separate evidence.

## Reproduce the relevant steps

Use the [versioned local EVM quickstart](https://github.com/hronaut/hronaut/blob/v2.4.24/docs/WALLET_QA_QUICKSTART.md)
with your own disposable environment. Configure the wallet in trusted Settings,
keep automatic policies disabled, test connect/reject, then reject a transaction.
Disable Anvil automining, approve one fresh request, preserve its hash and read
its pending receipt. Mine it and read the same hash again. Never substitute a
funded wallet or mainnet endpoint.

The recording covers this bounded sequence, **not every quickstart step**. It
does not exercise chain switching, account revocation, a reverted receipt or
application restart.

## Limits

Source build, not an installer/MCPB or named AI-client compatibility test.
Hronaut's own local EVM provider, not an external dApp, MetaMask/Phantom/TronLink
emulation, WalletConnect/Reown, Solana or Tron. No security audit or universal
compatibility claim. Setup and unsigned-release caveats still apply.

Published by the Hronaut project; production tooling and captions are AI-assisted.
Hronaut is source-available under its
[Subscription and Trial License](https://github.com/hronaut/hronaut/blob/v2.4.24/LICENSE),
not OSI open source: one 10-day trial from the first agent tool call, then
$4/month or $24/year per named user. This demonstration does not change the terms.

## Media verification

- Final: **44.666667 seconds**, 1920×1080/30 fps, 1,340 frames; H.264 and stereo
  48 kHz AAC. Native source: 39.666667 seconds / 1,190 frames, unsped and uncropped.
- Encoded audio: **-17.38 LUFS**, **-4.15 dBTP**. Ten encoded scene frames plus
  full-size title and approval poster were inspected; full audio/video decode
  and codec/frame checks passed. These are media checks, not a security audit.
- MP4: 3,180,729 bytes; SHA-256
  `4498c067ce9075db6c2577987873008e4354345568de7620e9c79c2f64db0a3d`.
- Poster SHA-256: `15221e073bfb11b2afee658259dc51bb0665c51b328b772ebe99ed043ae2c990`.
- Captions SHA-256: `040cda3ea33d5b5eb36980d59904547b695e225bbdecbaf7b7b6eb1678891865`.

For workflow questions, use [Hronaut Discussions](https://github.com/orgs/hronaut/discussions).
Share only public or synthetic examples, never wallet recovery material.
