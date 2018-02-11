const BUFFCrowdsale = artifacts.require('./BUFFCrowdsale.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm

    var startTimeICO =   1518652800; //15 Feb 2018, 08:00:00 GMT

    var owner = "0x250AF0D95B2C467234A3fEa315869FFE421Ca5c0";
    var wallet = "0x80e27C9317fed8acabBe9feFfC9D3719A35ff974";

    deployer.deploy(BUFFCrowdsale,
        startTimeICO, owner, wallet);

};
