import {ethers, run, network} from 'hardhat'

const delay = async (time: number) => {
	return new Promise((resolve: any) => {
		setInterval(() => {
			resolve()
		}, time)
	})
}

async function main() {
  const rewardToken = "0x0d599a3b532fc241BA3CaC733402656Eb2c03B1D";
  const stakingToken = "0x514e8E521003a4B149827BE3efd1Fc135c60C3c5";



  const Farming = await ethers.getContractFactory("Farming");
  const farming = await Farming.deploy(stakingToken, rewardToken);

  await farming.deployed();

  console.log(
    `Farming contract deployed to ${farming.address}`
  );

  console.log('wait of delay...')
	await delay(25000) 
	console.log('starting verify contract...')
	try {
		await run('verify:verify', {
			address: farming!.address,
			contract: 'contracts/Farming.sol:Farming',
			constructorArguments: [ stakingToken, rewardToken ],
		});
		console.log('verify success')
	} catch (e: any) {
		console.log(e.message)
	}
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});