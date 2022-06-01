// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface IERC165 {
    // contains only unimplemented functions
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
