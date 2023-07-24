import { task } from 'hardhat/config';
import { ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('initialize', 'Initialize the farming contract')
    .addParam('totalAmount', 'Total amount of tokens for farming')
    .addParam('percentage', 'Percentage for farming (0 ~ 10000, where 10000 = 100%)')
    .addParam('epochDuration', 'Duration of each epoch in seconds')
    .addParam('amountOfEpochs', 'Number of epochs')
    .addParam('startTime', 'Start time for farming in UNIX timestamp')
    .addParam('contract', 'Address of the farming contract')
    .setAction(async ({ totalAmount, percentage, epochDuration, amountOfEpochs, startTime, contract }, { ethers }) => {
        try {
            const parsedTotalAmount = ethers.BigNumber.from(totalAmount);
            const parsedPercentage = ethers.BigNumber.from(percentage);
            const parsedEpochDuration = ethers.BigNumber.from(epochDuration);
            const parsedAmountOfEpochs = ethers.BigNumber.from(amountOfEpochs);
            const parsedStartTime = ethers.BigNumber.from(startTime);

            const Farming = await ethers.getContractFactory('Farming');
            const farming = Farming.attach(contract);

            const contractTx: ContractTransaction = await farming.initialize(parsedTotalAmount, parsedPercentage, parsedEpochDuration, parsedAmountOfEpochs, parsedStartTime);
            const contractReceipt: ContractReceipt = await contractTx.wait();
                        

            console.log('Farming contract initialized successfully!');            
        } catch (error: any) {
            console.error(`Error during initialization: ${error.message}`);
        }
    });