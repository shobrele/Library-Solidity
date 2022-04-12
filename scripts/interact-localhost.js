const hre = require("hardhat");
const Library = require("/Users/dimitardzhalev/Workspace/Library-Solidity/artifacts/contracts/Library.sol/Library.json");
const LibraryToken = require("/Users/dimitardzhalev/Workspace/Library-Solidity/artifacts/contracts/LibraryToken.sol/LibraryToken.json");
const web3 = require("web3");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

const run = async function () {
  const provider = new hre.ethers.providers.JsonRpcProvider(
    process.env.PROVIDER_URL_LOCALHOST
  );
  const wallet = new hre.ethers.Wallet(
    process.env.PRIVATE_KEY_LOCALHOST,
    provider
  );
  const contract = new hre.ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    Library.abi,
    wallet
  );

  const clientWallet = new hre.ethers.Wallet(
    process.env.PRIVATE_KEY_CLIENT_LOCALHOST,
    provider
  );

  const balance = await wallet.getBalance();
  console.log("Total Wallet ballance is: ", balance.toString());

  const libTokenAddress = await contract.LIBToken();

  //create a token contract with the address of the token from the wrapper
  const tokenContract = new hre.ethers.Contract(
    libTokenAddress,
    LibraryToken.abi,
    wallet
  );
  console.log(
    "Total LIB ballance is: ",
    (await tokenContract.totalSupply()).toString()
  );

  console.log("LIB Token address: ", libTokenAddress.toString());

  Events(contract)

  //await getAvailableBooks(contract)

  //addBook(contract)

  //getClientWalletBalance(tokenContract, clientWallet);

  //rentBook(contract,clientWallet)

  //rentHistory(contract)

  //returnBook(tokenContract, contract, clientWallet);
};

async function getAvailableBooks(contract) {
  //check all available books
  const getLibraryArchiveTransaction = await contract.GetLibraryArchive();
  console.log("Library Archive List:");
  getLibraryArchiveTransaction.forEach((element) => {
    console.log(element);
  });
}

async function addBook(contract) {
  //add book
  const newBookTransaction = await contract.AddBook("Lord of the Rings", 15);
}

async function addBook(contract) {
  //add book
  const newBookTransaction = await contract.AddBook("Lord of the Rings", 15);
}

async function getClientWalletBalance(tokenContract, clientWallet) {
  const clientBalance = await clientWallet.getBalance();
  console.log("Client ETH ballance is: ", clientBalance.toString());
  const clientTokenBalance = await tokenContract.balanceOf(
    "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
  );
  console.log("Client LIB ballance is: ", clientTokenBalance.toString());
}

async function rentBook(contract, clientWallet) {
  //rent a book with another user
  const rentBookTransaction = await contract
    .connect(clientWallet)
    .BorrowBook(0, { value: ethers.utils.parseUnits("0.1", 18) });
}

async function rentHistory(contract) {
  //check rent history for given book
  const borrowHistoryTransaction = await contract.BorrowHistory(0);
  console.log(
    "Book borrow history after being rented: ",
    borrowHistoryTransaction
  );
}

async function returnBook(tokenContract, contract, clientWallet) {

  const approveTx = await tokenContract.connect(clientWallet).approve(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    hre.ethers.utils.parseEther("0.1")
  );
  await approveTx.wait();

  await contract.connect(clientWallet).ReturnBook(0, hre.ethers.utils.parseEther("0.1"));
}

async function Events(contract){
  contract.on('LogAddBook', (bookId, bookName, bookQuantity, tx) => {
    console.log("Added book: ",bookId,bookName,bookQuantity)
  });

  contract.on('LogBorrowBook', (bookId, client, tx) => {
    console.log("User borrowed the following book: ", bookId, client)
  });

  contract.on('LogReturnBook', (bookId, client, tx) => {
    console.log("User returned the following book: ", bookId, client)
  });
}

run();
