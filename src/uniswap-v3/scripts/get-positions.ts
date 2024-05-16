import { getPositionIds, getPositionInfo } from "../libs/positions";
import {  } from "../libs/router";

async function main() {
   const positions = await getPositionIds();
   positions.map(async p=>{
        const position = await getPositionInfo(p);
        console.log("🚀 ~ main ~ position:", position)
   });
    
}


main().catch(console.error);