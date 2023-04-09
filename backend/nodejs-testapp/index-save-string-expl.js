// For IPFS
//const ipfsClient = require('ipfs-http-client');
//const ipfs = ipfsClient('http://3.88.43.92:5001');

import { create } from 'ipfs-http-client'
const ipfs = create(new URL('http://54.197.36.31:5001'))

import fs from 'fs';

const upload = async () => {

    try{
      const data = {
          name: 'Nolakdsa',
          description: 'Some another different and not as much useful text',
          cateroty: 'nft',
          location: 'uae'
      };

      // Upload the combined data to IPFS
      const dataBuffer = Buffer.from(JSON.stringify(data));
      const dataResult = await ipfs.add(dataBuffer);
      console.log("CID for Upload >> ", dataResult.cid.toString())
  }catch(e){
      console.log("ERROR")
      console.log(e.message)
  }
}

const download = async () => {

  const dataHash = 'QmZL7AoXmMpnUiJe26ek2LYGuorWwZv3UnJaGsTqVhRPQm';
  const dataStream = await ipfs.get(dataHash);

  const chunks = [];

  for await (const chunk of dataStream) {
      chunks.push(chunk);
  }

  const dataString = Buffer.concat(chunks).toString('utf-8');
  const payloadStartIndex = dataString.indexOf('{');
  const payloadString = dataString.slice(payloadStartIndex);
  const cleanedPayloadString = payloadString.replace(/\0/g, '').trim();

  const payload = JSON.parse(cleanedPayloadString);
  console.log(payload);
}

upload();
