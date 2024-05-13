import fetch from 'node-fetch';
import readline from 'readline-sync';

class Mande {
  constructor(address) {
    this.address = address;
  }

  async getSendStake() {
    const fetchData = await fetch(
      'https://app.mande.network/subgraphs/name/TrustDrops',
      {
        method: 'POST',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
          Accept:
            'application/graphql-response+json, application/graphql+json, application/json, text/event-stream, multipart/mixed',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          Referer: 'https://app.mande.network/staking',
          'content-type': 'application/json',
          Origin: 'https://app.mande.network',
          Connection: 'keep-alive',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
        },
        body: JSON.stringify({
          operationName: 'GetStakesSent',
          query:
            'query GetStakesSent($address: String!) {\n  stakes(where: {staker_: {id: $address}}) {\n    amount\n    credScore\n    candidate {\n      id\n      __typename\n    }\n    __typename\n  }\n}',
          variables: { address: this.address },
        }),
      }
    );
    const resFetchData = await fetchData.json();
    return resFetchData;
  }

  async getReceiveStake() {
    const fetchData = await fetch(
      'https://app.mande.network/subgraphs/name/TrustDrops',
      {
        method: 'POST',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
          Accept:
            'application/graphql-response+json, application/graphql+json, application/json, text/event-stream, multipart/mixed',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          Referer: 'https://app.mande.network/staking',
          'content-type': 'application/json',
          Origin: 'https://app.mande.network',
          Connection: 'keep-alive',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
        },
        body: JSON.stringify({
          operationName: 'GetStakesSent',
          query:
            'query GetStakesSent($address: String!) {\n  stakes(where: {candidate_: {id: $address}}) {\n    amount\n    credScore\n    staker {\n      id\n      __typename\n    }\n    __typename\n  }\n}',
          variables: { address: this.address },
        }),
      }
    );

    const resFetchData = await fetchData.json();
    return resFetchData;
  }

  async getUnstakedBack() {
    const dataSend = await this.getSendStake();
    const dataReceipt = await this.getReceiveStake();

    const filteredData = dataReceipt.data.stakes.filter((itemReceipt) => {
      const find = dataSend.data.stakes.find(
        (itemSend) => itemSend.candidate.id === itemReceipt.staker.id
      );

      if (!find) {
        return true;
      }
    });

    console.info('LIST OF ADDRESS DONT YOU STAKE BACK');
    if (filteredData.length === 0) {
      console.info('0 DATA.');
      return;
    }

    console.table(filteredData);
  }

  async getDidntStakeBack() {
    const dataSend = await this.getSendStake();
    const dataReceipt = await this.getReceiveStake();

    const filteredData = dataSend.data.stakes.filter((itemSend) => {
      const find = dataReceipt.data.stakes.find(
        (itemReceipt) => itemReceipt.staker.id === itemSend.candidate.id
      );

      if (!find) {
        return true;
      }
    });

    console.info('LIST OF ADDRESS DONT STAKE YOU BACK');
    if (filteredData.length === 0) {
      console.info('0 DATA.');
      return;
    }

    console.table(filteredData);
  }
}

const mande = new Mande('0xd07623FA8D83D1686282D6D6cc2d8A9812B7eA13');

console.info(
  `MANDE CEK STAKER & STAKED\nMenu :\n1. Check staked\n2. Check staker\n3. Check address dont you stake back\n4. Check address dont stake you back\n`
);
const choose = readline.question('Choose your menu\t: ');

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
