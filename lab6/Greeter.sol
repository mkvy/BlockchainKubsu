pragma solidity ^0.8.18;

contract Greeter {

    string greeting;

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreet(string memory _greeting) public {
        greeting = _greeting;
    }
}