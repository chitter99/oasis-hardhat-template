// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CoolNFT is ERC721 {
    IERC20 internal wcol;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping for token id to token balance
    mapping(uint256 => uint256) private _tokenBalances;

    constructor(address _wcol) ERC721("CoolBond", "BOL") {
        wcol = IERC20(_wcol);
    }

    function deposit(uint256 _amount) public returns(uint256) {
        require(wcol.allowance(msg.sender, address(this)) >= _amount, "Allowance insufficient");
        wcol.transferFrom(msg.sender, address(this), _amount);

        _tokenIds.increment();

        uint256 newId = _tokenIds.current();
        _mint(msg.sender, newId);
        _tokenBalances[newId] = _amount;

        return newId;
    }

    function withdraw(uint256 _id) public returns(bool) {
        return withdrawTo(_id, msg.sender);
    }

    function withdrawTo(uint256 _id, address _to) public returns(bool) {
        require(_isApprovedOrOwner(msg.sender, _id), "Owner");

        wcol.transfer(_to, _tokenBalances[_id]);
        _burn(_id);

        return true;
    }

    function tokenBalanceOf(uint256 _id) public view returns(uint256) {
        return _tokenBalances[_id];
    } 
}