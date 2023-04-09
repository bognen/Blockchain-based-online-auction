// For IPFS
//const ipfsClient = require('ipfs-http-client');
//const ipfs = ipfsClient('http://3.88.43.92:5001');

import { create } from 'ipfs-http-client'
const ipfs = create(new URL('http://3.88.43.92:5001'))

import fs from 'fs';

const upload = async () => {

    try{
        const image1Data = fs.readFileSync('img1.jpg');
        const image1Buffer = Buffer.from(image1Data);
        const image1Result = await ipfs.add(image1Buffer);
        console.log("CID for Upload >> ", image1Result.cid.toString())
  }catch(e){
      console.log("ERROR")
      console.log(e.message)
  }
}

const download = async () => {

  const dataHash = 'QmRgCrt1EbeFpXkmCzdxPUJ4z6ynVMio1od2sR2WyszZus';

  // Retrieve the combined data from IPFS
  const dataStream = await ipfs.get(dataHash);
  // Write the data to a file
  const fileStream = fs.createWriteStream('image1-copy.jpg');
  for await (const chunk of dataStream) {
    fileStream.write(chunk);
  }
  fileStream.end();

}

download();
