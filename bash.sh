git clone https://github.com/auraecosystem/Web4asset.git
cd Web4asset
# paste the updated contract into Web4asset.sol
git checkout -b feat/rbac-access-control
git add Web4asset.sol
git commit -m "Add RBAC (MINTER_ROLE, BURNER_ROLE) via AccessControl"
git push origin feat/rbac-access-control
# then open a PR on GitHub

https://github.com/auraecosystem/Web4asset.git
cd web4-asset-1747416169968
