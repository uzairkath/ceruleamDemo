const { constants } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("nfts", function () {
  let FirstNFT, firstNFT, SecondNFT, secondNFT, owner, addr1, addr2, provider;
   before(async () => {
     provider = ethers.provider;
    [owner, addr1, addr2] = await ethers.getSigners();
     FirstNFT = await ethers.getContractFactory("firstContract");
     firstNFT = await FirstNFT.deploy();
    await firstNFT.deployed();
    console.log("first nft's address: ",firstNFT.address);
      SecondNFT = await ethers.getContractFactory("secondNFT");
      secondNFT = await SecondNFT.deploy(firstNFT.address);
     await secondNFT.deployed();
     console.log("second nft's address: ", secondNFT.address);

   });
  it("Should mint the token of first contract", async function () {
    const balanceBefore = await firstNFT.balanceOf(owner.address);
    await firstNFT.mint(owner.address, {from: owner.address, value: ethers.utils.parseEther("0.1")});
    const balanceAfter = await firstNFT.balanceOf(owner.address);
    // to check the balance after the token minted
    expect(balanceAfter -1).to.equal(balanceBefore);
    //to check transfer emit
    await expect(firstNFT.mint(owner.address, {from: owner.address, value: ethers.utils.parseEther("0.1")}))
  .to.emit(firstNFT, 'Transfer')
  .withArgs(constants.ZERO_ADDRESS, owner.address, 1);
  });
  
  it("Should mint the token of second contract in taking first token", async function () {
    const balanceBefore = await secondNFT.balanceOf(owner.address);
    await firstNFT.mint(owner.address , {value: ethers.utils.parseEther("0.1")});
    const balanceBefore1 = await firstNFT.balanceOf(owner.address);
    // approving first so that transferFrom can be used
    await firstNFT.approve(secondNFT.address, 1, {from: owner.address});
    await secondNFT.exchange(1);
    const balanceAfter = await secondNFT.balanceOf(owner.address);
    const contractBalance = await firstNFT.balanceOf(secondNFT.address);
    const balanceAfter1 = await firstNFT.balanceOf(owner.address);
    // to check the balance after token minted
    expect(balanceAfter -1).to.equal(balanceBefore);
    // to check the contract balance after exchange
    expect(contractBalance).to.equal(1);
    // to check the balance after token of firstNFT contract exchanged
    expect(parseInt(balanceAfter1.toString()) + 1).to.equal(balanceBefore1);

  })

    it("Should swap the token of second contract with the token of first contract", async function () {
      const balanceBefore = await secondNFT.balanceOf(owner.address);
      const balanceBefore1 = await firstNFT.balanceOf(owner.address);
      await secondNFT.swap(0, {from: owner.address});
      const balanceAfter = await secondNFT.balanceOf(owner.address);
      const balanceAfter1 = await firstNFT.balanceOf(owner.address);
      const contractBalance = await secondNFT.balanceOf(secondNFT.address);
      // to check the balance after tokens swapped
      expect(parseInt(balanceAfter.toString()) +1).to.equal(balanceBefore);
    // to check the contract balance after swap
      expect(contractBalance).to.equal(1);
    // to check the balance after token of secondNFT contract swapped
      expect(parseInt(balanceAfter1.toString()) - 1).to.equal(balanceBefore1);

    });
});
