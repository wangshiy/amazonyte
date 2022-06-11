// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ERC721Connector.sol";

contract Collections is ERC721Connector {
    // array to store nfts
    struct Collection {
        string hash;
        string fileName;
        string fileType;
        string date;
    }

    Collection[] public collections;

    mapping(string => bool) collectionExists;

    function mint(Collection memory _collection, string memory tokenURI)
        public
    {
        require(
            !collectionExists[_collection.hash],
            "Error - collection already exists"
        );
        collections.push(
            Collection({
                hash: _collection.hash,
                fileName: _collection.fileName,
                fileType: _collection.fileType,
                date: _collection.date
            })
        );
        uint256 id = collections.length - 1;
        _mint(msg.sender, id);
        _setTokenURI(id, tokenURI);
        collectionExists[_collection.hash] = true;
    }

    constructor() ERC721Connector("Collections", "COLLECTIONS") {}
}
