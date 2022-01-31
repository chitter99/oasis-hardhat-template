// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WrapperCoolToken is ERC20 {
    IERC20 internal wcol;

    constructor(address _wcol) ERC20("WrapperCoolToken", "WCOL") {
        wcol = IERC20(_wcol);
    }

    function deposit(uint256 _amount) public returns(bool) {
        require(wcol.allowance(msg.sender, address(this)) >= _amount, "WCOL: Allowance");
        wcol.transferFrom(msg.sender, address(this), _amount);
        _mint(msg.sender, _amount);
        return true;
    }

    function withdraw(uint256 _amount) public returns(bool) {
        require(balanceOf(msg.sender) >= _amount, "WCOL: Balance");
        wcol.transfer(msg.sender, _amount);
        _burn(msg.sender, _amount);
        return true;
    }
}