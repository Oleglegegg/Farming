import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Farming contract", function () {
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let users: SignerWithAddress[];

  let Farming: Contract;
  let rewardToken: Contract;
  let stakingToken: Contract;

  const TOKEN_A_NAME = "Biba";
  const TOKEN_A_SYMBOL = "BIB";

  const TOKEN_B_NAME = "Boba";
  const TOKEN_B_SYMBOL = "BOB";

  beforeEach(async () => {
    [owner, user1, user2, ...users] = await ethers.getSigners();

    const FarmingFactory = await ethers.getContractFactory("Farming");
    stakingToken = await deployToken(TOKEN_A_NAME, TOKEN_A_SYMBOL);
    rewardToken = await deployToken(TOKEN_B_NAME, TOKEN_B_SYMBOL);

    Farming = await FarmingFactory.deploy(stakingToken.address, rewardToken.address);
    await rewardToken.approve(Farming.address, ethers.utils.parseEther("1000"));

    const totalAmount = ethers.utils.parseEther("1000");
    const percentage = 1000;
    const epochDuration = 2678400;
    const amountOfEpochs = 3;
    const startTime = Math.floor(Date.now() / 1000); // goerli start
    // const startTime = await time.latest();
    
    await Farming.initialize(totalAmount, percentage, epochDuration, amountOfEpochs, startTime);
    await stakingToken.approve(Farming.address, ethers.utils.parseEther("1000"));

  });

  async function deployToken(name: string, symbol: string): Promise<Contract> {
    const TokenFactory = await ethers.getContractFactory("FarmToken");
    return await TokenFactory.deploy(name, symbol);
  }

  describe("Functionality test", async () => {
    it("should initialize Farming contract correctly", async () => {
      expect(await Farming.tokensLeft()).to.be.equal(ethers.utils.parseEther("1000"));
      expect(await Farming.percentage()).to.be.equal(1000);
      expect(await Farming.epochDuration()).to.be.equal(2678400);
      expect(await Farming.amountOfEpochs()).to.be.equal(3);
    });

    it("should allow users to deposit", async () => {
      const depositAmount = ethers.utils.parseEther("100");
      await Farming.connect(user1).deposit(depositAmount);
      const user1Info = await Farming.users(user1.address);
      expect(user1Info.amount).to.be.equal(depositAmount);
      expect(user1Info.claimed).to.be.false;

      await Farming.connect(user2).deposit(depositAmount);
      const user2Info = await Farming.users(user2.address);
      expect(user2Info.amount).to.be.equal(depositAmount);
      expect(user2Info.claimed).to.be.false;
    });

    it("should emit Deposited event on deposit", async () => {
      const depositAmount = ethers.utils.parseEther("100");
      await expect(Farming.connect(user1).deposit(depositAmount))
        .to.emit(Farming, "Deposited")
        .withArgs(user1.address, depositAmount);
    });

    it("should prevent double deposit", async () => {
      const depositAmount = ethers.utils.parseEther("100");
      await Farming.connect(user1).deposit(depositAmount);
      await expect(Farming.connect(user1).deposit(depositAmount)).to.be.revertedWith("You already have a deposit");
    });

    it("should allow users to withdraw", async () => {
      const depositAmount = ethers.utils.parseEther("100");
      await Farming.connect(user1).deposit(depositAmount);
      await Farming.connect(user2).deposit(depositAmount);

      await Farming.connect(user1).withdraw();
      const user1Info = await Farming.users(user1.address);
      expect(user1Info.amount).to.be.equal(ethers.utils.parseEther("0"));

      await Farming.connect(user2).withdraw();
      const user2Info = await Farming.users(user2.address);
      expect(user2Info.amount).to.be.equal(ethers.utils.parseEther("0"));
    });

    it("should emit Withdraw event on withdraw", async () => {
      const depositAmount = ethers.utils.parseEther("100");
      await Farming.connect(user1).deposit(depositAmount);
      await expect(Farming.connect(user1).withdraw())
        .to.emit(Farming, "Withdraw")
        .withArgs(user1.address);
    });

    it("should prevent double withdraw", async () => {
      const depositAmount = ethers.utils.parseEther("100");
      await Farming.connect(user1).deposit(depositAmount);
      await Farming.connect(user1).withdraw();
      await expect(Farming.connect(user1).withdraw()).to.be.revertedWith("You don't have a deposit");
    });

    it("should allow users to claim rewards", async () => {
      const depositAmount = ethers.utils.parseEther("100");
      await Farming.connect(user1).deposit(depositAmount);
      await time.increase(2678400 * 3); 
      await Farming.connect(user1).claimRewards();
      const user1Info = await Farming.users(user1.address);
      expect(user1Info.claimed).to.be.true;
    });

    it("should emit Claimed event on claimRewards", async () => {
      const depositAmount = ethers.utils.parseEther("100");
      await Farming.connect(user1).deposit(depositAmount);
      await time.increase(2678400 * 3); 
      await expect(Farming.connect(user1).claimRewards())
        .to.emit(Farming, "Claimed")
        .withArgs(user1.address, ethers.utils.parseEther("30")); 
    });
  });
});