// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./Helpers.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ETHWrapper.sol";

contract Library is Ownable, ETHWrapper{

    Helpers helpersContract = new Helpers();

    struct Book {
        uint id;
        string name;
        uint quantity;
        bool exists;
    }

    uint counter;

    Book[] public LibraryArchive;

    mapping(uint => Book) BookIndex;

    mapping(uint => address[]) BookBorrowHistory;

    mapping(address => uint[]) ClientBorrowList;

    modifier shouldExist(uint bookId){
        require(BookIndex[bookId].exists,"Book does not exist in library!");
        _;
    }

    function AddBook(string calldata bookName, uint quantity) public onlyOwner{
        if(LibraryContainsBook(bookName) || BookIndex[counter].exists){
            revert("This book exists in the library!");
        }
        if(quantity < 1){
            revert("Quantity cannot be less than 1!");
        }

        Book memory newBook;
        newBook.id = counter;
        newBook.name = bookName;
        newBook.quantity = quantity;
        newBook.exists = true;

        BookIndex[counter] = newBook;
        LibraryArchive.push(newBook);

        counter++;
    }

    function BorrowBook(uint bookId) public payable shouldExist(bookId){    
        if(BookIndex[bookId].quantity==0){
            revert("This book is out of stock currently!");
        }    
        if(helpersContract.intArrContainsValue(bookId, ClientBorrowList[msg.sender])){
            revert("You've already borrowed that book!");
        }
        if(msg.value< 0.1 ether)
        {
            revert("Not enough money! Price is 0.1 ETH");
        }

        //Wrap ETH to LIB
        wrap();

        ClientBorrowList[msg.sender].push(bookId);


        if(!helpersContract.addressArrContainsValue(msg.sender, BookBorrowHistory[bookId])){
            BookBorrowHistory[bookId].push(msg.sender);        
        }

        BookIndex[bookId].quantity --;
        LibraryArchive[bookId].quantity --;
    }

    function ReturnBook(uint bookId, uint value) public shouldExist(bookId){
        if(!helpersContract.intArrContainsValue(bookId, ClientBorrowList[msg.sender])){
            revert("You havent borrowed that book!");
        }

        //Unwrap LIB back to ETH
        unwrap(value);
  
        //remove book from list of borrowed books for the specific client
        removeIntArrElement(ClientBorrowList[msg.sender], bookId);
        BookIndex[bookId].quantity ++;
        LibraryArchive[bookId].quantity ++;
    }

    function BorrowHistory(uint bookId) public view shouldExist(bookId) returns (address[] memory){
        return BookBorrowHistory[bookId];
    }

    function GetLibraryArchive() public view returns (Book[] memory){
        return LibraryArchive;
    }

    function LibraryContainsBook(string calldata bookName) private view returns (bool){
        for(uint i=0;i<LibraryArchive.length;i++){
            if(helpersContract.compareStrings(LibraryArchive[i].name, bookName)){
                return true;
            }
        }
        return false;
    }

    function removeIntArrElement(uint[] storage array, uint id) internal{
         for (uint i=0; i < array.length; i++) {
            if (id == array[i]) {
                array[i] = array[array.length - 1];
                array.pop();
            }
        }
    }
}