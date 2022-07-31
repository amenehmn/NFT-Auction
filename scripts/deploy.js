const main = async () => {
	
  const [deployer] = await hre.ethers.getSigners();	
  console.log("deployer Address:", deployer.address);
  
  const ERC721 = await ethers.getContractFactory("MyNFT");
  const erc721 = await ERC721.deploy(1);
  await erc721.deployed();
  const nftContract = erc721.address;
  console.log("ERC721 Token address:", erc721.address);
  
    // Call the function.
  let nft_mint_txn = await erc721.makeAnNFT()
  // Wait for it to be mined.
  await nft_mint_txn.wait()
  console.log("Minted NFT #1")
	
  const auctionContractFactory = await hre.ethers.getContractFactory('SimpleAuction');
  const auctionContract = await auctionContractFactory.deploy(1918500, deployer.address);
  await auctionContract.deployed();
  const contractAddress = auctionContract.address;
  console.log("Contract deployed to:", contractAddress);
  
  await erc721.approve(auctionContract.address,	0);
   
  
  let contractBalance = await hre.ethers.provider.getBalance(contractAddress);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );
  
  //transfer Nft To Auction Contract
  
  let transferTxn = await auctionContract.transferNftToAuctionContract(nftContract, 0,  { gasLimit: 300000 });
    //Wait for it to be mined.
  await transferTxn.wait()
  

  
	// Call the bid function.
  let txn = await auctionContract.bid({value: ethers.utils.parseEther("0.00000001")})
  //Wait for it to be mined.
  await txn.wait()
  // checking contractBalance
  contractBalance = await hre.ethers.provider.getBalance(contractAddress);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

/*   // call the bid function for second with lower bid
   txn = await auctionContract.bid({value: ethers.utils.parseEther("0.000001")})
  //Wait for it to be mined.
  await txn.wait()
  // checking contractBalance
  contractBalance = await hre.ethers.provider.getBalance(contractAddress);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );
  
  // Withdraw a bid that was overbid.
  let withdraw_txn = await auctionContract.withdraw();
  await withdraw_txn.wait();
    contractBalance = await hre.ethers.provider.getBalance(contractAddress);
    console.log(
    "Contract balance",
    hre.ethers.utils.formatEther(contractBalance)
  ); */
  
  
  

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();