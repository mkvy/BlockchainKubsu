// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract NRCToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("NotRealCoin", "NRC") {
        _mint(msg.sender, initialSupply*10**uint256(18));
    }
}
