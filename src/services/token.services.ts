import  jwt, { JwtPayload } from 'jsonwebtoken';
import { RoleEnum ,AudienceEnum, TokenTypeEnum} from '../common/enums';
import { TOKEN_SECRET_KEY, TOKEN_SECRET_REFERSH_KEY, TOKEN_SYSTEM_REFERSH_SECRET_KEY, TOKEN_SYSTEM_SECRET_KEY } from '../config/config';
type SignOptions = /*unresolved*/ any

export class TokenService{
    constructor(){

    }
      sign = async ({
        payload,
        secret = process.env.JWT_SECRET as string,
        options
      }:{
            payload:  object,
            secret?: string,
            options?: SignOptions 


      }):Promise<string>=>{
        return  jwt.sign(payload,secret,options)
     }
      verfy = async ({
        token,
        secret = process.env.JWT_SECRET as string,
        options
      }:{
            token:  string,
            secret?: string,
            options?: SignOptions 


      }):Promise<JwtPayload>=>{
        return  jwt.verify(token,secret,options)
     }





    //  detectSignatureLevel = async (role:RoleEnum)=>{
    // let SignatureLevel = undefined;
    //  switch (role) {
    //     case RoleEnum.ADMIN:
    //       Signatures={
    //          accessSignature =TOKEN_SYSTEM_SECRET_KEY,
    //         refershSignature = TOKEN_SYSTEM_REFERSH_SECRET_KEY
                 
    //       }
    //       break;
    //       default;
    //       Signatures={
    //          accessSignature =TOKEN_SYSTEM_SECRET_KEY,
    //        refershSignature = TOKEN_SYSTEM_REFERSH_SECRET_KEY
    //       }
    //       break;
    //     }
    //     return Signatures

    // }
    //************************************************************
   detectSignatureLevel = (role: RoleEnum) => {
  if (role === RoleEnum.ADMIN) {
    return {
      accessSignature: TOKEN_SYSTEM_SECRET_KEY,
      refreshSignature: TOKEN_SYSTEM_REFERSH_SECRET_KEY,
    };
  }

  return {
    accessSignature: TOKEN_SECRET_KEY,
    refreshSignature: TOKEN_SECRET_REFERSH_KEY,
  };
};
//************************************************************** 

 getTokenSignature = async (role: RoleEnum) => {
  let accessSignature = undefined;
  let refreshSignature = undefined;
  let audience;

  switch (role) {
    case RoleEnum.ADMIN:
      accessSignature = TOKEN_SYSTEM_SECRET_KEY;
      refreshSignature = TOKEN_SYSTEM_REFERSH_SECRET_KEY;
      audience = AudienceEnum.SYSTEM;
      break;

    default:
      accessSignature = TOKEN_SECRET_KEY;
      refreshSignature = TOKEN_SECRET_REFERSH_KEY;
      audience = AudienceEnum.USER;
      break;
  }

  return { accessSignature, refreshSignature, audience };
};
//*********************************************************** 



decodedToken = async ({
  token,
  tokenType,
}: {
  token: string;
  tokenType?: TokenTypeEnum;
}) => {
  if (!token) throw new Error("token is required");

  const secret = process.env.JWT_SECRET!;

  const decoded = jwt.verify(token, secret) as JwtPayload;

  return decoded;
};






// decodedToken = async (
//   { token, tokentype = TokenTypeEnum.ACCESS } = {}
// ) => {
//   const decode = jwt.decode(token);
//   console.log({ decode });

//   if (!decode || !decode.aud) {
//     throw new Error("failed decode token");
//   }

//   const [decodetokentype, audience] = decode.aud as string[];

//   if (decodetokentype !== tokentype) {
//     throw new Error("invalid token");
//   }

//   const { accessSignature, refreshSignature } =
//     await this.getTokenSignature(audience);

//   const verifyData = await this.verfy({
//     token,
//     secret:
//       tokentype === TokenTypeEnum.REFRESH
//         ? refreshSignature
//         : accessSignature,
//   });

//   const user = await findOne({
//     model: UserModel,
//     filter: { _id: verifyData.sub },
//   });

//   if (!user) {
//     throw new Error("user not found");
//   }

//   return user;
// };



//---------------------Revoke------------------------------------
/*
createRevokeToken = async ({
  jti,
  ttl = 60 * 60 * 24, // 1 day default
}: {
  jti: string;
  ttl?: number;
}) => {
  await this.redis.set({
    key: `revoked_token:${jti}`,
    value: "true",
    ttl,
  });

  return true;
};
*/
}


export const tokenService= new TokenService()