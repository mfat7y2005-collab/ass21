import { LogoutEnum } from "../../common/enums";
import { redisService, s3Service, S3Service, TokenService } from "../../services";
import { UserModel } from "../../DB/model";
import { HydratedDocument } from "mongoose";
import { IChat, IUser } from "../../common/interfaces";
import { awsConfig } from "../../config/aws";
import { ChatRepository, UserRepository } from "../../DB/repository";
import { Types } from "mongoose";

type RedisService = any;

export class UserService {
  private readonly redis: RedisService;
  private readonly tokenService: TokenService;
  private readonly s3:S3Service;
  private readonly userRepository:UserRepository
  private readonly chatRepository:ChatRepository

  constructor() {
    this.redis = redisService;
    this.tokenService = new TokenService();
    this.s3=s3Service
    this.userRepository=new UserRepository();
    this.chatRepository=new ChatRepository()
  }

async profile(user: HydratedDocument<IUser>):Promise<{user:IUser,groups:HydratedDocument<IChat>[]}> {
  await user.populate([{path:"friends"}]);
  const groups = await this.chatRepository.find({
    filter: {
      participants: { $in: [new Types.ObjectId(user._id)] },
    },
  });
  return { user:user.toJSON() ,groups}
}

  async profileImage(
  file: Express.Multer.File,
  user: HydratedDocument<IUser>
) {

  const result2 = await this.s3.uploadLargeAsset({
  file: file.buffer,
  fileName: file.originalname,
  ContentType: file.mimetype,
  path: `User/${user._id}/profile`,
  Bucket: awsConfig.bucketName,
});

  
  user.profileImage = result2.url;


  await user.save();

  return user.toJSON();
}

  //-----------------logout-----------------------------

  async logout(
    {
      flag,
    }: {
      flag: LogoutEnum;
    },
    user: any,
    { jti }: { jti: string; iat: number; sub: string }
  ) {
    switch (flag) {
      case LogoutEnum.ALL:
        user.changeCredentialTime = new Date();
        await user.save();
        return { message: "Logged out from all devices" };

      case LogoutEnum.ONLY:
        if (jti) {
          await this.redis.set({
            key: `revoked_token:${jti}`,
            value: "true",
            ttl: 60 * 60 * 24,
          });
        }
        return { message: "Logged out from this session" };

      default:
        return { message: "Invalid logout option" };
    }
  }

  //--------------------rotate-------------------

  rotateToken = async ({ refreshToken }: { refreshToken: string }) => {
    // 1. verify refresh token
    const decoded = await this.tokenService.verfy({
      token: refreshToken,
      secret: process.env.JWT_REFRESH_SECRET as string,
    });

    if (!decoded?.id || !decoded?.jti) {
      throw new Error("Invalid refresh token");
    }

   
    const isRevoked = await this.redis.get(
      `revoked_token:${decoded.jti}`
    );

    if (isRevoked) {
      throw new Error("Refresh token revoked");
    }

   
    const user = await UserModel.findOne(decoded.id);

    if (!user) {
      throw new Error("User not found");
    }

   
    await this.redis.set({
      key: `revoked_token:${decoded.jti}`,
      value: "true",
      ttl: 60 * 60 * 24 * 7,
    });

    
    const newAccessToken = await this.tokenService.sign({
      payload: {
        id: user._id,
        role: user.role,
      },
      secret: process.env.JWT_SECRET as string,
    });

    const newRefreshToken = await this.tokenService.sign({
      payload: {
        id: user._id,
        role: user.role,
      },
      secret: process.env.JWT_REFRESH_SECRET as string,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  };















}

export default new UserService();