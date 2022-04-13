// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;


contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimumContribution) public{
        Campaign campaign = new Campaign(msg.sender, minimumContribution);
        deployedCampaigns.push(address(campaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory){
        return deployedCampaigns;
    }
}

contract Campaign {
    struct PaymentRequest {
        string description;
        uint value; // in wei
        address payable recipient;
        bool complete;
        uint approvalCount;
    }

    PaymentRequest[] public paymentRequests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    mapping(address => mapping(uint => bool)) public approvals;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(address creatorAddress, uint minimum) {
        manager = creatorAddress;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createPaymentRequest(string memory description, uint value, address payable recipient) public restricted {
        //require(approvers[msg.sender]);
        PaymentRequest memory request  = PaymentRequest({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        paymentRequests.push(request);

    }

    function approveRequest(uint requestIndex) public{
        require(approvers[msg.sender]);
        mapping(uint => bool) storage senderApprovals = approvals[msg.sender];
        require(!senderApprovals[requestIndex]);

        senderApprovals[requestIndex] = true;
        paymentRequests[requestIndex].approvalCount++;
    }

    function finalizeRequest(uint requestIndex) public restricted {
        PaymentRequest storage request = paymentRequests[requestIndex];
        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address(this).balance,
            paymentRequests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return paymentRequests.length;
    }

    function getAllRequests() public view returns (PaymentRequest[] memory) {
        return paymentRequests;
    }
}
