# Amazonyte

[![Netlify Status](https://api.netlify.com/api/v1/badges/72789567-681a-4a87-be52-f1b4e1f78048/deploy-status?branch=main)](https://app.netlify.com/sites/amazonyte/deploys)

- website: https://amazonyte.netlify.app
- network: rinkedby
- infura: https://infura.io/dashboard/ethereum/867da09e993444dfba35390f74d8c62e/settings, contract deployment
- netlify: https://app.netlify.com/sites/amazonyte/overview, web hosting
- pinata: https://app.pinata.cloud/pinmanager, ipfs storage
- tenderly: https://dashboard.tenderly.co/tx/rinkeby/0x060a5a8cf23f00cbb95db8903a02ee022674557153848553ab1ae34599cbda0c/debugger, transaction debugging

## How to deploy

### Backend

```sh
truffle compile
truffle migrate --reset --network rinkedby
# truffle migrate --reset --network development # when deploy to development
```

### Frontend

prerequisite: node > 16 for ipfs client

Since the project keys are stored locally, so only deployed manually from local will work, in the other word, automatically deloyed from github won't work.

```sh
cd website
yarn build
netlify deploy # Publish directory select: build
netlify deploy --prod # Publish directory select: build
```

### Project Secrets

ask shiyu.wang.ui@gmail.com

```javascript
.
├── contract
│ ├── .env
├── website
│ ├── .env
│ └── .netlify
│ └── state.json
```
