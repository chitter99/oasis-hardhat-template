import { expect } from "chai";
import { ethers as et } from "ethers";
import { ethers } from "hardhat";

describe("CoolToken", function () {
	let Token: et.ContractFactory;

	before(async function() {
		Token = await ethers.getContractFactory("CoolToken");
	});

	it("Deployment should assign the total supply of tokens to the owner", async function () {
		const [owner] = await ethers.getSigners();
		const token = await Token.deploy(ethers.utils.parseUnits("1"));
		const ownerBalance = await token.balanceOf(owner.address);
		expect(await token.totalSupply()).to.equal(ownerBalance);
	});

	it("Two wallet should be able to transfer tokens", async function() {
		const [owner, receiver] = await ethers.getSigners();
		const token = await Token.deploy(ethers.utils.parseUnits("1"));
		await token.transfer(receiver.address, ethers.utils.parseUnits("1"));
		const receiverBalance = await token.balanceOf(receiver.address);
		expect(ethers.utils.parseUnits("1")).to.equal(receiverBalance);
	});
});

describe("WrapperCoolToken", function () {
	let Token: et.ContractFactory, WrapperToken: et.ContractFactory;

	before(async function() {
		Token = await ethers.getContractFactory("CoolToken");
		WrapperToken = await ethers.getContractFactory("WrapperCoolToken");
	});

	it("Deposit should mint wcol and withdraw should burn wcol", async function() {
		const [owner, receiver] = await ethers.getSigners();
		const amount = ethers.utils.parseUnits("1");
		const token = await Token.deploy(amount);
		const wrapper = await WrapperToken.deploy(token.address);

		// Mint wcol
		await token.approve(wrapper.address, amount);
		await wrapper.deposit(amount);
		
		expect(amount).to.equal(await wrapper.balanceOf(owner.address));
		expect(amount).to.equal(await token.balanceOf(wrapper.address));
		
		// Transfer wcol to reciver
		await wrapper.transfer(receiver.address, amount);

		expect(amount).to.equal(await wrapper.balanceOf(receiver.address));

		// Burn wcol
		await wrapper.connect(receiver).withdraw(amount);
		
		expect(0).to.equal(await wrapper.balanceOf(receiver.address));
		expect(amount).to.equal(await token.balanceOf(receiver.address));
	});
});

describe("CoolNFT", function () {
	let Token: et.ContractFactory, CoolNFT: et.ContractFactory;

	before(async function() {
		Token = await ethers.getContractFactory("CoolToken");
		CoolNFT = await ethers.getContractFactory("CoolNFT");
	});

	it("Mint a nft by depositing cool token and withdraw that tokens by burning the nft", async function() {
		const [owner, receiver] = await ethers.getSigners();
		const amount = ethers.utils.parseUnits("1");
		const nftId = 1;
		const token = await Token.deploy(amount);
		const nft = await CoolNFT.deploy(token.address);

		// Mint nft
		await token.approve(nft.address, amount);
		let tx = await nft.deposit(amount);
		
		await expect(tx).to.emit(nft, "Transfer").withArgs(ethers.constants.AddressZero, owner.address, nftId);
		expect(1).to.equal(await nft.balanceOf(owner.address));
		expect(amount).to.equal(await token.balanceOf(nft.address));
		expect(await nft.tokenBalanceOf(nftId)).to.equal(amount);
		
		// Transfer nft to reciver
		await nft.transferFrom(owner.address, receiver.address, nftId);

		// Burn nft
		tx = await nft.connect(receiver).withdraw(nftId);
		
		await expect(tx).to.emit(nft, "Transfer").withArgs(receiver.address, ethers.constants.AddressZero, nftId);
		expect(amount).to.equal(await token.balanceOf(receiver.address));
	});
});
