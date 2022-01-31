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
