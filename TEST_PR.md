# Test PR: branch / push / PR flow check

This file is a throwaway artifact for verifying the fork-free branch → push → pull
request flow against this repository.

It is intentionally inert:

- It is **not** `profile/README.md`, so it does not render on the organization
  profile page and has no effect on the live site.
- It touches no code, no build config, and no media assets.
- It makes no claim about licensing, pricing, or security posture.

Nothing here should ever be merged. Close and delete the branch when the flow has
been verified.

## Checklist

- [ ] Branch created from `main`
- [ ] Commit authored with the expected identity
- [ ] Branch pushed to the remote
- [ ] Pull request opened against `main`
- [ ] Pull request visible in the repository's PR list
- [ ] Pull request closed and branch deleted
