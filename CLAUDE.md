# Web4Asset

`Web4Asset` is an ERC-721 (NFT) smart contract with role-based access control, built on [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/5.x/).

- **Token name / symbol:** Web4Asset / `W4A`
- **Standard:** ERC-721 (non-fungible token)
- **Access control:** OpenZeppelin `AccessControl` (RBAC), not plain `Ownable`

## Features

- **Minting** — restricted to accounts holding `MINTER_ROLE`
- **Burning** — restricted to accounts holding `BURNER_ROLE`
- **Role management** — `DEFAULT_ADMIN_ROLE` can grant and revoke `MINTER_ROLE` / `BURNER_ROLE` on other accounts, without redeploying the contract

## Contract overview

```solidity
contract Web4Asset is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor(address admin) ERC721("Web4Asset", "W4A") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(BURNER_ROLE, admin);
    }

    function mint(address to) public onlyRole(MINTER_ROLE) returns (uint256);
    function burn(uint256 tokenId) public onlyRole(BURNER_ROLE);
}
```

| Function | Access | Description |
|---|---|---|
| `mint(address to)` | `MINTER_ROLE` | Mints a new token to `to`, returns the new token ID |
| `burn(uint256 tokenId)` | `BURNER_ROLE` | Burns an existing token |
| `grantRole(bytes32 role, address account)` | role's admin (default: `DEFAULT_ADMIN_ROLE`) | Grants a role to an account |
| `revokeRole(bytes32 role, address account)` | role's admin | Revokes a role from an account |

## Deployment

The constructor takes one argument:

```solidity
constructor(address admin)
```

`admin` receives `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE`, and `BURNER_ROLE` at deploy time. Pass the address that should control minting/burning and role management (a wallet, multisig, or governance contract).

### Compiler settings

- Solidity pragma: `^0.8.0`
- Last built with: `0.8.30`
- Optimizer: enabled, `200` runs

### Dependencies

- [`@openzeppelin/contracts`](https://github.com/OpenZeppelin/openzeppelin-contracts) — `ERC721`, `AccessControl`

This project has been developed in [Remix IDE](https://remix.ethereum.org/); there is currently no local Hardhat/Foundry build setup.

## Roles reference

| Role | Purpose |
|---|---|
| `DEFAULT_ADMIN_ROLE` | Built-in OpenZeppelin admin role; can grant/revoke all other roles by default |
| `MINTER_ROLE` | Required to mint new tokens |
| `BURNER_ROLE` | Required to burn existing tokens |

## Security notes

- Minting was previously unrestricted (callable by anyone); it is now gated behind `MINTER_ROLE`.
- Because `DEFAULT_ADMIN_ROLE` can manage every other role, consider using [`AccessControlDefaultAdminRules`](https://docs.openzeppelin.com/contracts/5.x/api/access#AccessControlDefaultAdminRules) instead of plain `AccessControl` if this contract will control real value — it adds a 2-step, delayed transfer of the admin role to reduce the risk of losing control to a bad address.

## License

MIT
