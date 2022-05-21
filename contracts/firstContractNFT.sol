//SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract firstContract is ERC721{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    address payable owner;
    constructor () ERC721("first", "FRS"){
        owner = payable(msg.sender);
    }

    function mint(address to) payable public {
        require(msg.value == 0.1 ether, "send 0.1 eth");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
    function withdraw() public {
        (bool sent,) = owner.call{value: address(this).balance}("");
        require(sent);
    }
}




