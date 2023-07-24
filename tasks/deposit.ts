import { task } from 'hardhat/config';
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('deposit', 'Deposit tokens into the farming contract')
    .addParam('amount', 'Amount of tokens to deposit')
    .addParam('contract', 'Address of the farming contract')
    .setAction(async ({ amount, contract }, { ethers }) => {
        try {
            const depositAmount: BigNumber = ethers.utils.parseUnits(amount, 18);

            const Farming = await ethers.getContractFactory('Farming');
            const farming = Farming.attach(contract);
            
            const contractTx: ContractTransaction = await farming.deposit(depositAmount);
            const contractReceipt: ContractReceipt = await contractTx.wait();
            
            const event = contractReceipt.events?.find(event => event.event === 'Deposited');
            
            const eSender: Address = event?.args!['addr'];
            const eAmount: BigNumber = event?.args!['amount'];

            console.log(`Deposit successful!`);
            console.log(`Sender address: ${eSender}`);
            console.log(`Token amount deposited: ${eAmount}`);
        } catch (error: any) {
            console.error(`Error during deposit: ${error.message}`);
        }
    });