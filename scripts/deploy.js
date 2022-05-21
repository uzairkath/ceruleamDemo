const {ethers} = require('hardhat');

async function main(){
    const firstContract = await ethers.getContractFactory("firstContract");
    const deployedFirstNFTContract = await firstContract.deploy();
    const secondContract = await ethers.getContractFactory("secondNFT");
    const deployedSecondNFTContract = await secondContract.deploy(deployedFirstNFTContract.address)
    console.log(deployedFirstNFTContract.address);
    console.log(deployedSecondNFTContract.address);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);

});