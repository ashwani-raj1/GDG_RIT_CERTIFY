// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract CertificateRegistry {

    address public owner; //Stores the Ethereum wallet address of contract owner.

    mapping(string => string) public certificates;
    mapping(string => bytes32) public documentHashes;

    constructor() {
        owner = msg.sender; //means the wallet that called the current function
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can add certificates");
        _; //Means: “if validation passes, run the original function code.”
    }

    function addCertificate(
        string memory certificateId,
        string memory hash
    ) public onlyOwner { //public: function can be called from outside the contract

        require(
            bytes(certificates[certificateId]).length == 0,
            "Certificate already exists"
        );

        certificates[certificateId] = hash; //Stores the certificate hash in blockchain mapping.
    }

    function getCertificateHash(
        string memory certificateId
    )
        public
        view
        returns(string memory)
    {
        return certificates[certificateId];
    }

    function addDocumentHash(
        string memory certificateId,
        bytes32 documentHash
    ) public onlyOwner {
        require(
            bytes(certificates[certificateId]).length != 0,
            "Certificate does not exist"
        );

        require(
            documentHashes[certificateId] == bytes32(0),
            "Certificate document already locked"
        );

        documentHashes[certificateId] = documentHash;
    }

    function getDocumentHash(
        string memory certificateId
    ) public view returns (bytes32) {
        return documentHashes[certificateId];
    }
}