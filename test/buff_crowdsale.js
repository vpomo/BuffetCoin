var BUFFCrowdsale = artifacts.require("./BUFFCrowdsale.sol");
//import assertRevert from './helpers/assertRevert';

contract('BUFFCrowdsale', (accounts) => {
    var contract;
    var owner = "0x250AF0D95B2C467234A3fEa315869FFE421Ca5c0";
    var rate = 10000000;
    var buyWei = 5 * 10**17;
    var rateNew = 10000000;
    var buyWeiNew = 5 * 10**17;
    var buyWeiMin = 3 * 10**15;
    var buyWeiCap = 800 * 10**24;

    var totalSupply = 2e+26;

    it('should deployed contract', async ()  => {
        assert.equal(undefined, contract);
        contract = await BUFFCrowdsale.deployed();
        assert.notEqual(undefined, contract);
    });

    it('get address contract', async ()  => {
        assert.notEqual(undefined, contract.address);
    });

    it('verification balance owner contract', async ()  => {
        var balanceOwner = await contract.balanceOf(owner);
        var newTotalSupply = await contract.totalSupply.call();
        //console.log("balanceOwner = " + balanceOwner);
        assert.equal(totalSupply, newTotalSupply);
        assert.equal(totalSupply, balanceOwner);
    });

/*
    it('verification date', async ()  => {
        var result = await contract.testDate.call();
        //console.log("result = " + result);
        assert.equal(true, result);
    });
*/



    it('verification of receiving Ether', async ()  => {
        var tokenAllocatedBefore = await contract.totalSupply.call();
        var balanceAccountTwoBefore = await contract.balanceOf(accounts[2]);
        var weiRaisedBefore = await contract.weiRaised.call();
        //console.log("tokenAllocatedBefore = " + tokenAllocatedBefore);

        var numberToken = await contract.validPurchaseTokens.call(buyWei);
        //console.log(" numberTokens = " + JSON.stringify(numberToken));
        //console.log("numberTokens = " + numberToken);

        await contract.buyTokens(accounts[2],{from:accounts[2], value:buyWei});
        var tokenAllocatedAfter = await contract.totalSupply.call();
        //console.log("tokenAllocatedAfter = " + tokenAllocatedAfter);

        assert.isTrue(Number(tokenAllocatedBefore) < Number(tokenAllocatedAfter));
        assert.equal(totalSupply, tokenAllocatedBefore);

        var balanceAccountTwoAfter = await contract.balanceOf(accounts[2]);
        assert.isTrue(Number(balanceAccountTwoBefore) < Number(balanceAccountTwoAfter));
        assert.equal(0, balanceAccountTwoBefore);
        assert.equal(Number(rate*buyWei), Number(balanceAccountTwoAfter));

        var weiRaisedAfter = await contract.weiRaised.call();
        //console.log("weiRaisedAfter = " + weiRaisedAfter);
        assert.isTrue(weiRaisedBefore < weiRaisedAfter);
        assert.equal(0, weiRaisedBefore);
        assert.equal(buyWei, weiRaisedAfter);

        var depositedAfter = await contract.getDeposited.call(accounts[2]);
        //console.log("DepositedAfter = " + depositedAfter);
        assert.equal(buyWei, depositedAfter);

        var balanceAccountThreeBefore = await contract.balanceOf(accounts[3]);
        await contract.buyTokens(accounts[3],{from:accounts[3], value:buyWeiNew});
        var balanceAccountThreeAfter = await contract.balanceOf(accounts[3]);
        assert.isTrue(balanceAccountThreeBefore < balanceAccountThreeAfter);
        assert.equal(0, balanceAccountThreeBefore);
        //console.log("balanceAccountThreeAfter = " + balanceAccountThreeAfter);
        assert.equal(rateNew*buyWeiNew, balanceAccountThreeAfter);

        var balanceOwnerAfter = await contract.balanceOf(owner);
        //console.log("balanceOwnerAfter = " + Number(balanceOwnerAfter));
        //assert.equal(Number(totalSupply) - Number(balanceAccountThreeAfter) - Number(balanceAccountTwoAfter), Number(balanceOwnerAfter));
        assert.equal(Number(totalSupply),Number(balanceOwnerAfter));
    });

    it('verification tokens cap reached', async ()  => {
            var numberTokensNormal = await contract.validPurchaseTokens.call(buyWei);
            //console.log("numberTokensNormal = " + numberTokensNormal);
            assert.equal(rate*buyWei, numberTokensNormal);

            var numberTokensFault = await contract.validPurchaseTokens.call(buyWeiCap);
            //console.log("numberTokensFault = " + numberTokensFault);
            assert.equal(0, numberTokensFault);
    });

});



