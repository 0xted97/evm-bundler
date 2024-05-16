import { rawMintPosition } from "../libs/positions";
import {  } from "../libs/router";

async function main() {
   
    const rawMint = await rawMintPosition();
    console.log("🚀 ~ main ~ rawMint:", rawMint)
}


main().catch(console.error);