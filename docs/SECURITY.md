# Security Considerations

## Access control model

`Web4Asset` uses OpenZeppelin `AccessControl` rather than `Ownable`. This means:

- Minting and burning are gated behind `MINTER_ROLE` and `BURNER_ROLE` respectively — not open to any caller.
- `DEFAULT_ADMIN_ROLE` is, by default, the admin of every role, including itself. Whoever holds it can grant or revoke `MINTER_ROLE` and `BURNER_ROLE` at will.

## Known risks

### 1. Single point of failure at `DEFAULT_ADMIN_ROLE`

Because `DEFAULT_ADMIN_ROLE` can manage all other roles, a compromised or lost admin key is a critical risk:

- **Compromise:** An attacker with the admin key can grant themselves `MINTER_ROLE` and mint arbitrary tokens, or revoke legitimate minters/burners.
- **Loss:** If the admin key is lost and no successor was configured, the contract's roles become permanently frozen (no one can grant or revoke going forward).

**Mitigation options:**
- Use a multisig (e.g. Gnosis Safe) as the `admin` address at deployment rather than a single EOA.
- Consider migrating to [`AccessControlDefaultAdminRules`](https://docs.openzeppelin.com/contracts/5.x/api/access#AccessControlDefaultAdminRules), which enforces a single admin account with a 2-step, delayed transfer process — preventing accidental transfer to an unreachable address.

### 2. Constructor argument is required

The constructor signature is `constructor(address admin)`. Deploying without correctly setting this argument (e.g. passing `address(0)`) would leave the contract with **no admin and no minters/burners**, permanently disabling minting and role management. Always verify the `admin` argument before deployment, especially in automated deploy scripts.

### 3. `burn` has no ownership check beyond role membership

`burn(uint256 tokenId)` only checks that the caller holds `BURNER_ROLE` — it does **not** check that the caller owns or is approved for the token being burned. This is intentional for an admin/moderation-style burn capability, but means `BURNER_ROLE` holders can burn *any* token, including ones they don't own. Ensure `BURNER_ROLE` is only granted to trusted addresses.

### 4. No supply cap

`mint` is unbounded — any address with `MINTER_ROLE` can mint indefinitely. If a fixed or capped supply is a requirement, add a max-supply check before granting `MINTER_ROLE` broadly.

## Recommended practices before mainnet deployment

- [ ] Deploy with a multisig or governance contract as `admin`, not a single EOA.
- [ ] Consider `AccessControlDefaultAdminRules` for delayed admin transfer.
- [ ] Get an independent audit or thorough peer review before granting `MINTER_ROLE`/`BURNER_ROLE` broadly or deploying with real value at stake.
- [ ] Add tests covering role grant/revoke paths, unauthorized-call reverts, and the `supportsInterface` override.
- [ ] Confirm the `admin` constructor argument through a deploy script dry-run (e.g. Hardhat's `--network localhost` or a testnet) before mainnet deployment.

## Reporting a vulnerability

If you discover a security issue in this contract, please report it privately to the repository maintainers rather than opening a public issue.
