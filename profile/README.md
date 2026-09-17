# Hronaut

### The browser your coding agent can come back to.

A visible local browser with persistent, isolated workspaces and human control—connected to your coding agent through MCP.

[Download](https://hronaut.dev/download) · [Set up your agent](https://hronaut.dev/setup) · [Ask a question](https://github.com/orgs/hronaut/discussions) · [Explore the source](https://github.com/hronaut/hronaut)

## See a workspace survive a client disconnect

[![Real Hronaut 2.4.24 demo: the same checked local page after private-key workspace resume](https://raw.githubusercontent.com/hronaut/.github/main/profile/media/hronaut-workspace-continuity-2.4.24-poster.png)](https://github.com/hronaut/.github/blob/main/profile/media/hronaut-workspace-continuity-2.4.24.mp4)

[34-second video (MP4)](https://github.com/hronaut/.github/raw/refs/heads/main/profile/media/hronaut-workspace-continuity-2.4.24.mp4) · [Captions](https://github.com/hronaut/.github/blob/main/profile/media/hronaut-workspace-continuity-2.4.24.srt) · [What was tested](https://github.com/hronaut/.github/blob/main/profile/media/README.md)

Client A disconnects; the tab and checked state remain. A new connection cannot access the workspace by ID alone. Its private resume key restores access to the same tab.

*Real Hronaut 2.4.24 source-build footage at original speed, using a synthetic local page and MCP SDK test clients. Not an installer, named AI-client, app-restart, real-login or wallet test.*

## Make browser work repeatable

- **Keep browser context:** resume named workspaces with their tabs and website state across coding-agent sessions.
- **Test web apps:** inspect a page, exercise a bounded workflow, and check the actual result in a visible Chromium browser.
- **Stay in control:** watch, pause and take over for sign-in, MFA and consequential manual steps.

Your agent owns task planning and memory. Hronaut supplies the local browser and MCP tools—not a hosted browser fleet or a native-desktop automation layer.

## Web3 wallet and dApp QA

Start with the [disposable local EVM quickstart](https://github.com/hronaut/hronaut/blob/v2.4.22/docs/WALLET_QA_QUICKSTART.md): discover a provider, connect or reject, change accounts/networks, and distinguish submitted transactions from confirmed or reverted receipts.

Hronaut's built-in wallet providers are a shipped preview, not MetaMask/Phantom/TronLink emulation or WalletConnect/Reown. The EVM guide uses Anvil and human setup/approval; it does not establish Solana/Tron or real-extension test coverage. Use disposable accounts and no real funds. [Wallet capabilities and limits](https://github.com/hronaut/hronaut/blob/v2.4.22/docs/WALLETS.md).

## Build with us

[Start here](https://github.com/orgs/hronaut/discussions/201) for workflow questions, ideas and small working examples. Share a public or synthetic reproduction; keep credentials, wallet recovery material and customer data out of posts.

[Report a non-sensitive bug](https://github.com/hronaut/hronaut/issues) · [Report a vulnerability privately](https://github.com/hronaut/hronaut/security/advisories/new) · [Follow @Hronaut](https://x.com/Hronaut)

Windows, macOS and Linux. Source-available under the [Hronaut Subscription and Trial License](https://github.com/hronaut/hronaut/blob/main/LICENSE): one **10-day trial**, then **$4/month or $24/year per named user**. Not OSI open source. Desktop releases are currently unsigned/not Apple-notarized; [verify your download](https://hronaut.dev/security#verify-release).
