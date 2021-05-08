// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "./Token.sol";

contract dBank {
    Token private _token;

    mapping(address => uint) public etherBalance;
    mapping(address => uint) public depositTimeStamps;
    mapping(address => bool) public isDeposited;

    event Deposit(address indexed user, uint etherAmount, uint timeStamp);
    event Withdraw(address indexed user, uint etherAmount, uint timeStamp, uint interest);

    constructor(Token token) {
        _token = token;
    }

    function deposit() payable public {
        require(isDeposited[msg.sender] == false, "The sender already deposit");
        require(msg.value >= 1e16, string(abi.encodePacked("Failed to deposit less than 0.01 ETH (requested: ", msg.value, ")")));

        etherBalance[msg.sender] += msg.value;
        depositTimeStamps[msg.sender] += block.timestamp;
        isDeposited[msg.sender] = true;

        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    function withdraw() public {
        require(isDeposited[msg.sender] == true, "The sender did not deposit funds");
        uint amount = etherBalance[msg.sender];

        uint hodlingTime = block.timestamp - depositTimeStamps[msg.sender];

        uint interestPerSecond = 31668017 * amount / 1e16;
        uint interest = interestPerSecond * hodlingTime;

        msg.sender.transfer(amount);
        _token.mint(msg.sender, interest);

        etherBalance[msg.sender] = 0;
        depositTimeStamps[msg.sender] = 0;
        isDeposited[msg.sender] = false;

        emit Withdraw(msg.sender, amount, block.timestamp, interest);
    }

    function borrow() payable public {
        //check if collateral is >= than 0.01 ETH
        //check if user doesn't have active loan

        //add msg.value to ether collateral

        //calc tokens amount to mint, 50% of msg.value

        //mint&send tokens to user

        //activate borrower's loan status

        //emit event
    }

    function payOff() public {
        //check if loan is active
        //transfer tokens from user back to the contract

        //calc fee

        //send user's collateral minus fee

        //reset borrower's data

        //emit event
    }
}