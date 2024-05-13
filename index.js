import readline from 'readline-sync';
import Mande from './mande.js';

console.info(
  `MANDE CEK STAKER & STAKED\nMenu :\n1. Check staked\n2. Check staker\n3. Check address dont you stake back\n4. Check address dont stake you back\n`
);

const address = readline.question('Input your address\t: ');
const choose = readline.question('Choose your menu\t: ');

const mande = new Mande(address);

switch (Number(choose)) {
  case 1:
    const resultSend = await mande.getSendStake();
    console.info("LIST OF ADDRESS YOU'VE BEEN STAKED");
    console.table(resultSend.data.stakes);
    break;
  case 2:
    const resultReceipt = await mande.getReceiveStake();
    console.info('LIST OF RECEIPNT STAKE');
    console.table(resultReceipt.data.stakes);
    break;
  case 3:
    await mande.getUnstakedBack();
    break;
  case 4:
    await mande.getDidntStakeBack();
    break;
}
