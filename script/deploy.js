// Deploy script for Web4Asset (Hardhat)
//
// Usage:
//   npx hardhat run script/deploy.js --network <network>
//
// Set ADMIN_ADDRESS in your environment, or edit the fallback below,
// to control which address receives DEFAULT_ADMIN_ROLE, MINTER_ROLE,
// and BURNER_ROLE at deployment.

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const adminAddress = process.env.ADMIN_ADDRESS || deployer.address;

  console.log("Deploying Web4Asset with the account:", deployer.address);
  console.log("Admin role will be granted to:", adminAddress);

  const Web4Asset = await hre.ethers.getContractFactory("Web4Asset");
  const web4Asset = await Web4Asset.deploy(adminAddress);

  await web4Asset.waitForDeployment();

  const address = await web4Asset.getAddress();
  console.log("Web4Asset deployed to:", address);

  // Sanity check: confirm roles were granted correctly.
  const DEFAULT_ADMIN_ROLE = await web4Asset.DEFAULT_ADMIN_ROLE();
  const MINTER_ROLE = await web4Asset.MINTER_ROLE();
  const BURNER_ROLE = await web4Asset.BURNER_ROLE();

  const hasAdmin = await web4Asset.hasRole(DEFAULT_ADMIN_ROLE, adminAddress);
  const hasMinter = await web4Asset.hasRole(MINTER_ROLE, adminAddress);
  const hasBurner = await web4Asset.hasRole(BURNER_ROLE, adminAddress);

  console.log("DEFAULT_ADMIN_ROLE granted:", hasAdmin);
  console.log("MINTER_ROLE granted:", hasMinter);
  console.log("BURNER_ROLE granted:", hasBurner);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
