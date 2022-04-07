// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Helpers{
    function intArrContainsValue(uint value, uint[] memory array) public pure returns(bool){   
        for (uint i=0; i < array.length; i++) {
            if (value == array[i]) {     
                return true;
            }
        }
        return false;
    }

    function addressArrContainsValue(address value, address[] memory array) public pure returns(bool){   
        for (uint i=0; i < array.length; i++) {
            if (value == array[i]) {     
                return true;
            }
        }
        return false;
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}