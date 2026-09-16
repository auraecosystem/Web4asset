# Web4Asset — v1 Specification

## Summary

`Web4Asset` (symbol `W4A`) is an ERC-721 token contract using OpenZeppelin's `AccessControl` for role-gated minting and burning, rather than a single-owner (`Ownable`) model.

## Motivation

The original v0 implementation allowed **any address** to call `mint`, with no access restriction. v1 closes that gap by introducing role-based access control (RBAC), so minting and burning rights can be assigned, delegated, and revoked without redeploying the contract.

## Contract interface

| Function | Access | Description |
|---|---|---|
| `mint(address to) → uint256` | `MINTER_ROLE` | Mints a new token to `to`; returns the new token ID. |
| `burn(uint256 tokenId)` | `BURNER_ROLE` | Burns the specified token. |
| `grantRole(bytes32 role, address account)` | admin of `role` (default: `DEFAULT_ADMIN_ROLE`) | Grants a role to an account. |
| `revokeRole(bytes32 role, address account)` | admin of `role` | Revokes a role from an account. |
| `hasRole(bytes32 role, address account) → bool` | public | Checks whether an account holds a role. |
| `supportsInterface(bytes4) → bool` | public | ERC-165 interface detection (ERC721 + AccessControl). |

## Roles

| Role | Constant | Purpose |
|---|---|---|
| `DEFAULT_ADMIN_ROLE` | `0x00` | Built-in OpenZeppelin role; admin of all roles by default. |
| `MINTER_ROLE` | `keccak256("MINTER_ROLE")` | Required to mint new tokens. |
| `BURNER_ROLE` | `keccak256("BURNER_ROLE")` | Required to burn tokens. |

## Deployment parameters

```solidity
constructor(address admin)
```

`admin` receives `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE`, and `BURNER_ROLE` at deployment. This is a **breaking change** from v0, which had a no-argument constructor.

## Versioning notes

- **v0:** Plain `ERC721`, unrestricted `mint`, no `AccessControl`.
- **v1 (this spec):** Adds `AccessControl`, `MINTER_ROLE`, `BURNER_ROLE`, admin-parameterized constructor, `burn` function.

## Open questions for future versions

- Should `DEFAULT_ADMIN_ROLE` migrate to `AccessControlDefaultAdminRules` for a delayed, 2-step admin transfer? (See `docs/SECURITY.md`.)
- Should token metadata be on-chain (`tokenURI` override) or off-chain per `metadata/schema.json`?
- Should minting be capped (max supply) or permissionlessly unbounded per-minter?
