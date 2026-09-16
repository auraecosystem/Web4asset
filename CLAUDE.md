# CLAUDE.md

Guidance for Claude Code (or any Claude instance) working in this repository.

## Project overview

**Web4Asset** is an ERC-721 (NFT) token contract, symbol `W4A`, using OpenZeppelin's `AccessControl` for role-gated minting and burning instead of a single-owner (`Ownable`) model.

## Repository structure

```
contracts/Web4Asset.sol     # Main contract
interfaces/IWeb4Asset.sol   # External interface
metadata/schema.json        # Off-chain token metadata JSON schema
docs/WEB4ASSET_V1.md        # v1 specification (roles, functions, versioning notes)
docs/SECURITY.md            # Security considerations and pre-deployment checklist
script/deploy.js            # Hardhat deploy script
package.json / hardhat.config.js
```

This is a Hardhat project (`npx hardhat compile`, `npx hardhat test`, `npx hardhat run script/deploy.js`).

## Contract: `Web4Asset.sol`

- Inherits `ERC721` and `AccessControl` from OpenZeppelin Contracts.
- Roles: `MINTER_ROLE` (gates `mint`), `BURNER_ROLE` (gates `burn`), `DEFAULT_ADMIN_ROLE` (OpenZeppelin's built-in admin-of-all-roles, can grant/revoke the other two).
- **Constructor:** `constructor(address admin)` — grants all three roles above to `admin` at deploy time. Deploy scripts must always pass a real admin address; `address(0)` would permanently disable role management.
- `supportsInterface` is overridden because both `ERC721` and `AccessControl` implement it — required by Solidity's inheritance rules, don't remove it.

## Compiler settings

- Pragma: `^0.8.20`
- Hardhat-configured version: `0.8.30`, optimizer enabled at `200` runs (`hardhat.config.js`)

## Conventions & things to watch

- **Access control:** Any new state-changing externally-callable function should be gated with `onlyRole(...)`. The original version of this contract had an ungated `mint`, which was the first security fix applied — don't regress that.
- **`burn` has no ownership check** — only role membership. `BURNER_ROLE` holders can burn any token, not just ones they own. Keep that role tightly scoped. See `docs/SECURITY.md`.
- **`DEFAULT_ADMIN_ROLE` is a single point of failure** by default. `docs/SECURITY.md` recommends a multisig admin or migrating to `AccessControlDefaultAdminRules` before any deployment with real value.
- **No supply cap** on minting currently — add one if required by the token's use case.
- Metadata for individual tokens should conform to `metadata/schema.json` if/when `tokenURI` is wired up to off-chain metadata.

## Suggested next steps (not yet done)

- Add a test suite (Hardhat + Chai/Waffle or similar) covering role grant/revoke, unauthorized-call reverts, and `supportsInterface`.
- Decide on and implement a `tokenURI` / metadata strategy consistent with `metadata/schema.json`.
- Consider `AccessControlDefaultAdminRules` before any deployment carrying real value.
