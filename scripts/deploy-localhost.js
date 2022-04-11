const hre = require("hardhat");
const ethers = hre.ethers;

async function deploy() {
  const Library = await ethers.getContractFactory("Library"); 
  const libContract = await Library.deploy();
  console.log('Waiting for deployment...');
  await libContract.deployed();

  console.log("Signer: ", Library.signer.address);
  console.log("Library deployed to:", libContract.address);
}

module.exports = deploy;