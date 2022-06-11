// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ERC165.sol";
import "./interfaces/IERC721.sol";
import "./libraries/Counters.sol";
import "./libraries/Strings.sol";

/************************************************************************************************
building out the minting function
a. nft to point to an address 
b. keep track of the token ids
c. keep track of token owner addresses to token ids
d. keep track of how many tokens an owner address has
e. create an event that emits a transfer log - contract address, where it is being minted to, the id
 ************************************************************************************************/

contract ERC721 is ERC165, IERC721 {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    using Strings for uint256;
    // mapping from tokenid to owner
    mapping(uint256 => address) private _tokenOwner;
    // mapping from owner to number of owned tokens
    mapping(address => Counters.Counter) private _OwnedTokensCount;
    // mapping from tokenId to approved address
    mapping(uint256 => address) private _tokenApprovals;
    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;
    // Base URI
    string private _baseURI;

    constructor() {
        _registerInterface(
            bytes4(
                keccak256("balanceOf(bytes4)") ^
                    keccak256("ownerOf(bytes4)") ^
                    keccak256("transferFrom(bytes4)")
            )
        );
    }

    function balanceOf(address _owner) public view override returns (uint256) {
        require(_owner != address(0), "owner query for non-existent token");
        return _OwnedTokensCount[_owner].current();
    }

    // @notice Find the owner of an NFT
    // @dev NFTs assigned to zero address are considered invalid, and queries
    //  about them do throw.
    // @param _tokenId The identifier for an NFT
    // @return The address of the owner of the NFT
    function ownerOf(uint256 _tokenId) public view override returns (address) {
        address owner = _tokenOwner[_tokenId];
        require(owner != address(0), "owner query for non-existent token");
        return owner;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        address owner = _tokenOwner[tokenId];
        // return truthniess the address is not zero
        return owner != address(0);
    }

    function _mint(address to, uint256 tokenId) internal virtual {
        // requires the address it not zero
        require(to != address(0), "ERC721: minting to the zero address");
        // require token not exists
        require(!_exists(tokenId), "ERC721: minting to the zero address");
        // add a new address with tokenid for minting
        _tokenOwner[tokenId] = to;
        // track address's minting count
        _OwnedTokensCount[to].increment();

        emit Transfer(address(0), to, tokenId);
    }

    // @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    //  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    //  THEY MAY BE PERMANENTLY LOST
    // @dev Throws unless `msg.sender` is the current owner, an authorized
    //  operator, or the approved address for this NFT. Throws if `_from` is
    //  not the current owner. Throws if `_to` is the zero address. Throws if
    //  `_tokenId` is not a valid NFT.
    // @param _from The current owner of the NFT
    // @param _to The new owner
    // @param _tokenId The NFT to transfer
    function _transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        // 1. add tokenId to the address receiving the tokenId
        // 2. update the balance of the address _from token
        // 3. update the balance of the address _to
        // 4. add safe fucntionality
        // a. require receiving address is not a zero addresse
        // b. require the address transfering then token actually owns the token

        require(
            _to != address(0),
            "Error - ERC721 Trasfer to the zero address"
        );
        require(
            ownerOf(_tokenId) == _from,
            "Trying to transfer a token the address does not own"
        );

        _OwnedTokensCount[_from].decrement();
        _OwnedTokensCount[_to].increment();

        _tokenOwner[_tokenId] = _to;

        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public override {
        require(isApprovedOrOwner(msg.sender, _tokenId));
        _transferFrom(_from, _to, _tokenId);
    }

    // 1. require the person approving is the owner
    // 2. approving an address to a tokenid
    // 3. require we cannot approve sending tokens to ourselves
    // 4. update the map of the approval addresses
    function approve(address _to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(_to != owner, "Error - approval to current owner");
        require(
            msg.sender == owner,
            "Current caller is not the owner of the token"
        );
        _tokenApprovals[tokenId] = _to;
        emit Approval(owner, _to, tokenId);
    }

    function isApprovedOrOwner(address spender, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        require(_exists(tokenId), "token does not exits");
        address owner = ownerOf(tokenId);
        return (spender == owner);
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    /**
     * @dev Returns the base URI set via {_setBaseURI}. This will be
     * automatically added as a prefix in {tokenURI} to each token's URI, or
     * to the token ID if no specific URI is set for that token ID.
     */
    function baseURI() public view virtual returns (string memory) {
        return _baseURI;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(base, tokenId.toString()));
    }
}
