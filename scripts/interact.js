const hre = require("hardhat");
const Library = require("/Users/dimitardzhalev/Workspace/Library-Solidity/artifacts/contracts/Library.sol/Library.json");

const run = async function(){
    const provider = new hre.ethers.providers.InfuraProvider("ropsten","ffec7024b09d49dda46422d090631777");
    const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new hre.ethers.Contract("0x0D9b0e434c7291dD80Ea5388D9e69322B9bC5de7",Library.abi,wallet);

    const balance = await wallet.getBalance();
    console.log("Wallet ballance is: ", balance);

    //check all available books
    const getLibraryArchiveTransaction = await contract.GetLibraryArchive();
    console.log("Library Archive List:")
    getLibraryArchiveTransaction.forEach(element => {
        console.log(element);
    });
    
    //add book
    //const newBookTransaction = await contract.AddBook("Lord of the Rings", 15);

    //rent a book
    //const rentBookTransaction = await contract.BorrowBook(0);
    
    //check rent history for given book
    //const borrowHistoryTransaction = await contract.BorrowHistory(0);
    //console.log("Book borrow history after being rented: ", borrowHistoryTransaction);

    //return book
    //const returnBookTransaction = await contract.ReturnBook(0);
}

run();