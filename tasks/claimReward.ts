import { task } from 'hardhat/config';
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('claim', 'Claim rewards from the farming contract')
    .addParam('contract', 'Address of the farming contract')
    .setAction(async ({ contract }, { ethers }) => {
        try {
            const Farming = await ethers.getContractFactory('Farming');
            const farming = Farming.attach(contract);

            const contractTx: ContractTransaction = await farming.claimRewards();
            const contractReceipt: ContractReceipt = await contractTx.wait();

            const event = contractReceipt.events?.find(event => event.event === 'Claimed');

            if (!event) {
                console.log('Claim failed: No "Claimed" event found.');
                return;
            }

            const eSender: Address = event?.args!['addr'];
            const eAmount: BigNumber = event?.args!['amount'];

            console.log('Claim successful!');
            console.log(`Recipient address: ${eSender}`);
            console.log(`Reward amount: ${eAmount}`);
        } catch (error: any) {
            console.error(`Error during claim: ${error.message}`);
        }
    });