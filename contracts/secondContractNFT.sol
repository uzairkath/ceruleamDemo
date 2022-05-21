//SPDX-License-Identifier: MIT;

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract secondNFT is ERC721{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    IERC721 private firstToken;
    
    mapping(address => mapping(uint256 => uint256)) public tokensEscrowed;
    
    constructor(address _firstToken) ERC721("Second", "SCD"){
        firstToken = IERC721(_firstToken);
    }

    function exchange(uint256 _tokenId) external{
        firstToken.transferFrom(msg.sender, address(this), _tokenId);
        tokensEscrowed[msg.sender][_mint(msg.sender)] = _tokenId;
    }

    function _mint(address to) internal returns(uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        return tokenId;
    }

    function swap(uint256 _tokenId) external {
        address sender = msg.sender;
        require(ownerOf(_tokenId) == sender, "You don't own this token");
        _transfer(sender, address(this), _tokenId);
        firstToken.safeTransferFrom(address(this), sender, tokensEscrowed[sender][_tokenId]);
    }
}
