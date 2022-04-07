const hre = require("hardhat");
const ethers = hre.ethers;

async function deploy() {
  await hre.run("compile"); // We are compiling the contracts using subtask
  const [deployer] = await ethers.getSigners(); // We are getting the deployer

  console.log("Deploying contracts with the account:", deployer.address); // We are printing the address of the deployer
  console.log("Account balance:", (await deployer.getBalance()).toString()); // We are printing the account balance

  const LibraryContractFactory = await ethers.getContractFactory("Library"); 
  const libraryContract = await LibraryContractFactory.deploy();
  console.log("Waiting for deployment...");
  await libraryContract.deployed();

  console.log("Contract address: ", libraryContract.address);
  console.log("Done!");

  await hre.run("printPrivateKey");

  await hre.run("verify:verify", {
    address: libraryContract.address,
    constructorArguments: [
    ],
  });
}

module.exports = deploy;