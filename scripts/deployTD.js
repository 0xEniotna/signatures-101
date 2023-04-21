// Deploying the TD somewhere
// To verify it on Etherscan:
// npx hardhat verify --network sepolia <address> <constructor arg 1> <constructor arg 2>

const hre = require("hardhat");
const Str = require('@supercharge/strings')

async function main() {
  // Deploying contracts
  const ERC20TD = await hre.ethers.getContractFactory("ERC20TD");
  const Evaluator = await hre.ethers.getContractFactory("Evaluator");
  const BouncerProxy = await hre.ethers.getContractFactory("BouncerProxy");
  const erc20 = await ERC20TD.deploy("TD-ERC20-101","TD-ERC20-101",0);
  const bouncerproxy = await BouncerProxy.deploy();

  
  await erc20.deployed();
  const evaluator = await Evaluator.deploy(erc20.address, bouncerproxy.address);
  console.log(
    `ERC20TD deployed at  ${erc20.address}`
  );
  await evaluator.deployed();
  console.log(
    `Evaluator deployed at ${evaluator.address}`
  );
    // Setting the teacher
    await erc20.setTeacher(evaluator.address, true)

    // setting random values
   randomData = []
	randomSig = []
	for (i = 0; i < 20; i++)
		{
      
      
			const accountNumber = Math.floor(Math.random()*10);
      let path = "m/44'/60'/0'/0/" + accountNumber;
      let mnemonicWallet = ethers.Wallet.fromMnemonic(process.env.mnemonic, path)
      console.log(mnemonicWallet.address)
		const hashToSign2 = ethers.utils.solidityKeccak256(['address', 'uint256'], [mnemonicWallet.address, Math.floor(Math.random()*1000000000)]);
		randomData.push(hashToSign2)
		const signature2 = await mnemonicWallet.signMessage(hashToSign2)
		randomSig.push(signature2)
		// randomTickers.push(web3.utils.utf8ToBytes(Str.random(5)))
		// randomTickers.push(Str.random(5))
		}

	console.log(randomData)
	console.log(randomSig)
	// console.log(web3.utils)
	// console.log(type(Str.random(5)0)
	await evaluator.setRandomBytes32AndSignature(randomData, randomSig);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
