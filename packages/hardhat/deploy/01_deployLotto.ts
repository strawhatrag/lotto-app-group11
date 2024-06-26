import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployLotteryContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Lottery1", {
    from: deployer,
    contract: "Lottery",
    args: ["Group 11 Lotto Token", "Lotto9", 1500, 10n ** 18n, 10n ** 17n],
    log: true,
    autoMine: true,
  });

  const lotteryContract = await hre.ethers.getContract<Contract>("Lottery1", deployer);
  const lotteryTokenContract = await hre.ethers.getContractAt("LotteryToken", await lotteryContract.paymentToken());

  const symbol = await lotteryTokenContract.symbol();
  const tokenName = await lotteryTokenContract.name();

  console.log(`👋 DeployedContract: ${tokenName} Lottery`);
  console.log("   Symbol: ", symbol);
  console.log("   Purchase ration: ", await lotteryContract.purchaseRatio());
  console.log(`   Bet price: ${(await lotteryContract.betPrice()).toString()} ${symbol}`);
  console.log(`   Bet fee: ${(await lotteryContract.betFee()).toString()} ${symbol}`);
  console.log("   Lottery address", await lotteryContract.getAddress());
  console.log("   LotteryToken address", await lotteryContract.paymentToken());
};

export default deployLotteryContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployLotteryContract.tags = ["Lottery", "Lotto"];
