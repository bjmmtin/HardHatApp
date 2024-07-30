const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EtherWallet", function () {
    let EtherWallet, etherWallet, owner, addr1;

    beforeEach(async function () {
        EtherWallet = await ethers.getContractFactory("EtherWallet");
        [owner, addr1] = await ethers.getSigners();
        etherWallet = await EtherWallet.deploy();
        await etherWallet.deployed();
    });

    it("Should set the right owner", async function () {
        expect(await etherWallet.owner()).to.equal(owner.address);
    });

    it("Should receive ethers", async function () {
        await owner.sendTransaction({
            to: etherWallet.address,
            value: ethers.utils.parseEther("1.0"),
        });

        expect(await ethers.provider.getBalance(etherWallet.address)).to.equal(ethers.utils.parseEther("1.0"));
    });

    it("Should allow the owner to withdraw", async function () {
        await owner.sendTransaction({
            to: etherWallet.address,
            value: ethers.utils.parseEther("1.0"),
        });
        await etherWallet.withdraw(ethers.utils.parseEther("1.0"));

        expect(await ethers.provider.getBalance(etherWallet.address)).to.equal(0);
    });

    it("Should not allow non-owner to withdraw", async function () {
        await owner.sendTransaction({
            to: etherWallet.address,
            value: ethers.utils.parseEther("1.0"),
        });

        await expect(etherWallet.connect(addr1).withdraw(ethers.utils.parseEther("1.0"))).to.be.revertedWith("caller is not owner");
    });

    it("Should return the correct balance", async function () {
        await owner.sendTransaction({
            to: etherWallet.address,
            value: ethers.utils.parseEther("1.0"),
        });

        expect(await etherWallet.getBalance()).to.equal(ethers.utils.parseEther("1.0"));
    });
});
