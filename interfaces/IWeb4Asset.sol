// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @title IWeb4Asset
/// @notice External interface for the Web4Asset ERC-721 contract.
interface IWeb4Asset is IERC721 {
    /// @notice Role identifier required to call `mint`.
    function MINTER_ROLE() external view returns (bytes32);

    /// @notice Role identifier required to call `burn`.
    function BURNER_ROLE() external view returns (bytes32);

    /// @notice Mints a new token to `to`. Caller must hold MINTER_ROLE.
    /// @return tokenId The ID of the newly minted token.
    function mint(address to) external returns (uint256 tokenId);

    /// @notice Burns `tokenId`. Caller must hold BURNER_ROLE.
    function burn(uint256 tokenId) external;

    /// @notice Standard AccessControl role check.
    function hasRole(bytes32 role, address account) external view returns (bool);

    /// @notice Standard AccessControl role grant. Caller must hold the role's admin role.
    function grantRole(bytes32 role, address account) external;

    /// @notice Standard AccessControl role revoke. Caller must hold the role's admin role.
    function revokeRole(bytes32 role, address account) external;
}
