# Web4Asset

`Web4Asset` is an ERC-721 (NFT) smart contract with role-based access control, built on [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/5.x/).

- **Token name / symbol:** Web4Asset / `W4A`
- **Standard:** ERC-721 (non-fungible token)
- **Access control:** OpenZeppelin `AccessControl` (RBAC), not plain `Ownable`

## Project structure

```
Web4asset/
├── contracts/
│   └── Web4Asset.sol       # Main token contract
├── interfaces/
│   └── IWeb4Asset.sol      # External interface
├── metadata/
│   └── schema.json         # Token metadata JSON schema
├── docs/
│   ├── WEB4ASSET_V1.md     # v1 specification
│   └── SECURITY.md         # Security considerations
├── script/
│   └── deploy.js           # Hardhat deploy script
├── package.json
├── hardhat.config.js
├── README.md
└── .gitignore
```

## Features

- **Minting** — restricted to accounts holding `MINTER_ROLE`
- **Burning** — restricted to accounts holding `BURNER_ROLE`
- **Role management** — `DEFAULT_ADMIN_ROLE` can grant and revoke `MINTER_ROLE` / `BURNER_ROLE` on other accounts, without redeploying the contract

See [`docs/WEB4ASSET_V1.md`](./docs/WEB4ASSET_V1.md) for the full contract specification and [`docs/SECURITY.md`](./docs/SECURITY.md) for security considerations before deploying with real value.

## Getting started

```bash
npm install
npx hardhat compile
```

### Deploy

```bash
ADMIN_ADDRESS=0xYourAdminAddress npx hardhat run script/deploy.js --network <network>
```

If `ADMIN_ADDRESS` isn't set, the deployer account is used as the admin by default.

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

## Compiler settings

- Solidity pragma: `^0.8.20`
- Configured version (Hardhat): `0.8.30`
- Optimizer: enabled, `200` runs

## Roles reference

| Role | Purpose |
|---|---|
| `DEFAULT_ADMIN_ROLE` | Built-in OpenZeppelin admin role; can grant/revoke all other roles by default |
| `MINTER_ROLE` | Required to mint new tokens |
| `BURNER_ROLE` | Required to burn existing tokens |

## Security

Minting was previously unrestricted (callable by anyone); it is now gated behind `MINTER_ROLE`. See [`docs/SECURITY.md`](./docs/SECURITY.md) for the full risk assessment, including recommendations around the `DEFAULT_ADMIN_ROLE` single-point-of-failure risk.

## License

MIT
