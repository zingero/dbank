// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public minter;

    event MinterChanged(address indexed from, address to);

    constructor() ERC20("ERC20 Name", "ZZZ") payable {
        minter = msg.sender;
    }

    function passMinterRole(address bank) public returns (bool) {
        require(msg.sender == minter, "Failed to pass the minter role since only the owner can pass it");
        minter = bank;
        emit MinterChanged(msg.sender, bank);
        return true;
    }

    function mint(address account, uint256 amount) public {
        require(msg.sender == minter, string(abi.encodePacked("Failed to mint for sender:", msg.sender, " since they are not the minter")));
        _mint(account, amount);
    }
}