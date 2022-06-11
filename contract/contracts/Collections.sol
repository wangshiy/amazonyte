// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Collections is ERC721 {
    using SafeMath for uint256;
    using Strings for string;

    // array to store nfts
    struct Collection {
        string hash;
        string fileName;
        string fileType;
        string date;
    }

    Collection[] public collections;

    mapping(string => bool) collectionExists;

    constructor() public ERC721("Collections", "COLLECTIONS") {}

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
        _safeMint(msg.sender, id);
        _setTokenURI(id, tokenURI);
        collectionExists[_collection.hash] = true;
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        _setTokenURI(tokenId, _tokenURI);
    }
}
