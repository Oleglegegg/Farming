import { task } from 'hardhat/config';
import { ContractTransaction, ContractReceipt } from "ethers";

task('withdraw', 'Withdraw rewards from the farming contract')
    .addParam('contract', 'Address of the farming contract')
    .setAction(async ({ contract }, { ethers }) => {
        try {
            const Farming = await ethers.getContractFactory('Farming');
            const farming = Farming.attach(contract);

            const amountToWithdraw = ethers.utils.parseEther("100");
            const contractTx: ContractTransaction = await farming.withdraw(amountToWithdraw);
            const contractReceipt: ContractReceipt = await contractTx.wait();

            const event = contractReceipt.events?.find(event => event.event === 'Withdraw');
            if (event) {
                const eSender: string = event.args!['addr'];
                console.log(`Withdraw successful for address: ${eSender}`);
            } else {
                console.log('Withdraw failed or no events found in the transaction receipt.');
            }

        } catch (error: any) {
            console.error(`Error during withdraw: ${error.message}`);
        }
    });