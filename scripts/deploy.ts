import { ethers } from "hardhat";

async function main() {
	const Token = await ethers.getContractFactory("CoolToken");
	const WrapperToken = await ethers.getContractFactory("WrapperCoolToken");
	const CoolNFT = await ethers.getContractFactory("CoolNFT");

	const token = await Token.deploy(ethers.utils.parseUnits("1000"));
	await token.deployed();
	
	const wrapperToken = await WrapperToken.deploy(token.address);
	await wrapperToken.deployed();

	const coolNFT = await CoolNFT.deploy(token.address);
	await coolNFT.deployed();

	console.log("Token deployed to:", token.address);
	console.log("WrapperToken deployed to:", wrapperToken.address);
	console.log("NFT deployed to:", coolNFT.address);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
