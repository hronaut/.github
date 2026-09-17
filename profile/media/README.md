# Hronaut workspace-continuity demonstration

[Video (MP4, 34 seconds)](hronaut-workspace-continuity-2.4.24.mp4) ·
[Caption transcript](hronaut-workspace-continuity-2.4.24.srt)

Recorded on September 17, 2026 from Hronaut **2.4.24**, public source commit
[`7a13a55cd8be15317413059f502eca1a1156b460`](https://github.com/hronaut/hronaut/commit/7a13a55cd8be15317413059f502eca1a1156b460).
The video retains a continuous 29-second native application recording at original
speed, with a two-second title, three-second closing card, explanatory captions
and an original 120 BPM soundtrack. No application UI is reconstructed.

## What the test checked

Two MCP SDK test clients used the real local Hronaut runtime in a network-isolated
Linux/Electron environment. The page is a synthetic loopback-only QA checklist,
explicitly labeled as a local example. Ten runtime checks verified:

1. Creation of a fresh scratch workspace through MCP.
2. Opening the local example page in that workspace.
3. Changing its checkbox through MCP.
4. The same tab remaining after client A disconnected.
5. The checkbox still being checked after disconnection.
6. Client B initially listing no owned workspace.
7. Workspace-ID-only status access being denied to client B.
8. Successful resume using the workspace's private resume key.
9. The same tab identity after resume.
10. A fresh snapshot containing the checked result.

Private resume material is not shown, logged or included in these assets.
The explanatory captions describe the executed checks; they are outside the app
frame, not additional Hronaut UI. Persistence does not grant a new client access
automatically and does not establish the outcome of an unrelated earlier action.

## Scope and limitations

This is a source-build demonstration, **not** a downloaded-installer/MCPB test, a
named AI-client integration, an application-restart test, login recovery, an
external website test, wallet compatibility or a security audit. No real account,
customer information, wallet or transaction was used. Existing setup prerequisites
and release caveats still apply: [setup](https://hronaut.dev/setup).

Published by the Hronaut project. Editorial captions and production tooling were
AI-assisted; the app footage and runtime checks are real. Hronaut is source-available
under its [Subscription and Trial License](https://github.com/hronaut/hronaut/blob/v2.4.24/LICENSE),
not OSI open source. This video does not change the software's license terms.

## Media verification

- Final video: 1920×1080, 30 fps, 1020 frames, 34 seconds; H.264 and stereo 48 kHz AAC.
- Full native source: 1600×900, 30 fps, 870 frames, 29 seconds, no speed-up or crop.
- Encoded audio: -17.36 LUFS integrated, -4.15 dBTP true peak.
- Eight encoded scene frames plus full-size intro, ending and poster were reviewed;
  full video/audio decoding and format checks passed.
- Final MP4: 1,868,518 bytes; SHA-256
  `8db2cda7ff2d6ca192bcad81d85b5af4dd7d85a78a2363d832af712bb43725c3`.
- Poster SHA-256: `a4060d17994fa74346e7e6f5d3928ac89b17cc60f100a596d50c2417e65644e7`.
- Caption SHA-256: `05f4d82bfe087856dbe0bd1e9ca06dcc075519f2cacde70641e860e9b74816a8`.

For workflow questions, use [Hronaut Discussions](https://github.com/orgs/hronaut/discussions).
Share only public or synthetic reproductions, never credentials or recovery material.
