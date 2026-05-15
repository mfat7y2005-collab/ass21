import { Router, Request, Response, NextFunction } from "express";
import { successResponse } from "../../common/response";
import userService from "./user.service";

import { authentication, authorization } from "../../middleware";
import { cloudFileUpload, fileFieldValidation } from "../../common/utlis/multer";

import { StorageApprochEnum } from "../../common/enums";
import { chatRouter } from "../chat";

const router = Router();


router.use("/userId",chatRouter)


router.patch(
  "/profile-image",
  authentication(),
  authorization(),
  cloudFileUpload({
    // storageApproch:StorageApprochEnum.DISK,
    valdiation:fileFieldValidation.image,
    storageApproch:StorageApprochEnum.DISK,
    maxSize:0

  }).single("attachment"),
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await userService.profileImage(req.file as Express.Multer.File,req.user);
    return successResponse({ res, data });
  }
);




// router.get(
//   "/",
//   authentication(),
//   authorization(),
//   async (req: Request, res: Response, next: NextFunction) => {
//     const data = await userService.profile(req.user);
//     return successResponse({ res, data });
//   }
// );

//  LOGOUT 
router.post(
  "/logout",
  authentication(),
  async (req: Request, res: Response, next: NextFunction) => {
    const status = await userService.logout(
      req.body,
      req.user,
      req.decoded as { jti: string; iat: number; sub: string }
    );

    return successResponse({
      res,
      status: 200,
      data: status,
    });
  }
);

//  ROTATE    
// router.post(
//   "/rotate",
//   authentication(),
//   async (req: Request, res: Response, next: NextFunction) => {
//     const credentials = await userService.rotateToken(
//       req.user,
//       req.decoded as { jti: string; iat: number; sub: string },
//       `${req.protocol}://${req.get("host")}`
//     );

//     return successResponse({
//       res,
//       status: 200,
//       data: credentials,
//     });
//   }
// );



//  SIGNUP 
// router.post(
//   "/signup",
//   async (req: Request, res: Response, next: NextFunction) => {
//     const result = await authService.signup(req.body);

//     return successResponse({
//       res,
//       status: 201,
//       data: result,
//     });
//   }
// );

//  LOGIN 
// router.post(
//   "/login",
//   async (req: Request, res: Response, next: NextFunction) => {
//     const result = await authService.login(req.body);

//     return successResponse({
//       res,
//       status: 200,
//       data: result,
//     });
//   }
// );

//  CONFIRM EMAIL 
// router.post(
//   "/confirm-email",
//   async (req: Request, res: Response, next: NextFunction) => {
//     const result = await authService.confirmEmail(req.body);

//     return successResponse({
//       res,
//       status: 200,
//       data: result,
//     });
//   }
// );

export default router;