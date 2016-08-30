contract CrowdFunding {
  // Defines a new type with two fields
  struct Funder {
    address addr;
    uint amount;
  }

  struct Campaign {
    address beneficiary;
    uint fundingGoal;
    uint numFunders;
    uint amount;
    mapping (uint => Funder) funders;
  }

  uint numCampaigns;
  mapping (uint => Campaign) campaigns;

  function newCampaign(address beneficiary, uint goal) returns (uint campaignID) {
    campaignID = numCampaigns++;
    campaigns[campaignID] = Campaign(beneficiary, goal, 0, 0);
  }

  function contribute(uint campaignID) {
    Campaign c = campaigns[campaignID];
    c.funders[c.numFunders++] = Funder({addr: msg.sender, amount: msg.value});
    c.amount += msg.value;
  }

  function checkGoalReached(uint campaignID) returns (bool reached) {
    Campaign c = campaigns[campaignID];
    if (c.amount < c.fundingGoal)
      return false;
    if (!c.beneficiary.send(c.amount))
      throw;
    c.amount = 0;
    return true;
  }

}
