import { generateDecryption,generateHash,compareHash ,generateEncryption} from "../common/utlis/security";
export class SecurityServices {
    constructor(){

    }
    generateHash=generateHash
    compareHash=compareHash

    generateDecryption=generateDecryption
    generateEncryption=generateEncryption
   
}