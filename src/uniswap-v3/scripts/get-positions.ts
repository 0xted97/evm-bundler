import { getPositionIds, getPositionInfo } from "../libs/positions";
import {  } from "../libs/router";

async function main() {
   const positions = await getPositionIds();
   positions.map(async p => {
      console.log("🚀 ~ main ~ p:", p.toString())
      const position = await getPositionInfo(p);
      console.log("🚀 ~ main ~ position:", position.tokensOwed0.toString())
      console.log("🚀 ~ main ~ position:", position.tokensOwed1.toString())
   })
    
}


main().catch(console.error);