# Amazonyte

- website: https://amazonyte.netlify.app
- network: rinkedby
- infura: https://infura.io/dashboard/ethereum/867da09e993444dfba35390f74d8c62e/settings, contract deployment
- netlify: https://app.netlify.com/sites/amazonyte/overview, web hosting
- pinata: https://app.pinata.cloud/pinmanager, ipfs storage

## How to deploy

### Backend

```sh
truffle compile
truffle migrate --reset --network rinkedby
# truffle migrate --network development # when deploy to development
```

### Frontend

prerequisite: node > 16 for ipfs client

```sh
cd website
yarn build
netlify deploy # Publish directory select: build
netlify deploy --prod # Publish directory select: build
```

### Project Secrets

ask shiyu.wang.ui@gmail.com

.
├── contract
│ ├── .env
├── website
│ ├── .env
│ └── .netlify
│ └── state.json
