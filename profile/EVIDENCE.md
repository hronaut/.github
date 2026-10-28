# Evidence and test scope

What each Hronaut recording shows, when it was made, and what it does not prove. The [latest release](https://github.com/hronaut/hronaut/releases/latest) may be newer than a recording. Treat the recording date and the limits below as part of the evidence.

## Product tour (38 seconds)

[Watch on hronaut.dev](https://hronaut.dev/#demo)

A real Hronaut recording from an unmodified source build, made on October 21, 2026 at normal speed in the Cyberpunk theme.

An agent connects to Hronaut over local MCP, creates an isolated workspace called Checkout QA and opens a local example cart. It reads the page, adds one notebook so the total becomes $36.00, and opens the review step. It then asks for a person, and the tab is marked for attention. A person types a review note and confirms the review in the same tab; the page says no payment was sent.

Hronaut Home shows one active MCP session. The first agent disconnects and the count drops to zero, while the workspace, tab and result remain. A second agent connects, finds no workspaces of its own, resumes Checkout QA with the workspace's private resume key, and reads the saved result.

- The demo agents are MCP SDK clients, not a named AI client.
- The person's input is driven by the capture harness.
- Example Store is a local page with example data.
- Not shown: the installer, a real login or external website, a payment, or an app restart.
- Original synthwave score; sound is optional.

## Other recordings on hronaut.dev

Real Hronaut recordings from a source build, made on October 21, 2026 at normal speed.

| Recording | What it shows | Limits |
| --- | --- | --- |
| [Login handoff](https://hronaut.dev/authenticated-browser-agents) (27 s) | Pause agents, sign in yourself, resume. The agent inherits the session, not the password. | Synthetic local account, password and code; MCP SDK test agent. |
| [Workspace continuity](https://hronaut.dev/browser-workspace-continuity) (26 s) | A client disconnects and the page state stays. A new connection with only the workspace ID is refused. The private resume key restores the same workspace. | Synthetic local page and MCP SDK test clients. No installer, named AI client, app or OS restart, crash, login, wallet, external website or transaction. |
| [Split view](https://hronaut.dev/split-view) (26 s) | Two live pages side by side, resized with the mouse and keyboard, then reset. | Local example pages; real pointer and keyboard input. |

## Earlier recordings and checks

Kept for reference. They used older builds and are not refreshed for each release.

- [Workspace continuity, 2.4.24](media/README.md): source-build recording from September 17, 2026, with its ten runtime checks and media hashes. [Video](media/hronaut-workspace-continuity-2.4.24.mp4) · [captions](media/hronaut-workspace-continuity-2.4.24.srt) · [YouTube](https://youtu.be/nI2vJk_UfTE).
- [Local EVM wallet QA, 2.4.24](media/wallet-qa.md): reject, submit, read a pending receipt, then confirm the same hash after local mining, on a disposable Anvil chain. The test harness clicks the trusted operator controls; an MCP agent does not approve itself. [Video](media/hronaut-wallet-qa-2.4.24.mp4) · [captions](media/hronaut-wallet-qa-2.4.24.srt).
- [Packaged Linux amd64 2.4.25](media/linux-deb-2.4.25-check.md): the published `.deb` installed and passed 21 checks (startup, MCP interaction, clean app restart) in each of two fresh containers. It does not establish native desktop sandbox integration or other platforms.
- [mcp-use client 2.3.1](media/mcp-use-client-check.md): a client-library interoperability check against the 2.4.25 package, not an LLM-agent end-to-end test, partnership or certification.
- [Kilo 7.7.3](media/kilo-marketplace-check.md): Kilo's local server installed a protected global MCP connection to the 2.4.25 package. Project-level setup with an environment header was skipped by Kilo.

## Web3 wallets

Hronaut's built-in wallet providers are a shipped preview. They do not emulate MetaMask, Phantom or TronLink, and they are not WalletConnect or Reown. Use disposable accounts and no real funds. [Local EVM quickstart](https://github.com/hronaut/hronaut/blob/main/docs/WALLET_QA_QUICKSTART.md) · [wallet capabilities and limits](https://github.com/hronaut/hronaut/blob/main/docs/WALLETS.md).

## Releases

Every package and the checksum manifest come with SHA-256 hashes and GitHub build-provenance attestations. Windows and macOS packages are not yet platform code-signed or Apple-notarized, so SmartScreen or Gatekeeper may warn. [Verify your download](https://hronaut.dev/security#verify-release).

## License

Source available for audit and local builds under the [Hronaut Subscription and Trial License](https://github.com/hronaut/hronaut/blob/main/LICENSE). One 10-day trial, then $4/month or $24/year per named user. It is not an OSI open-source license.

Questions: [Hronaut Discussions](https://github.com/orgs/hronaut/discussions). Share only public or synthetic reproductions, never credentials, wallet recovery material or customer data.
