import { NextFunction, Request, Response } from "express";
import { SignupUsecase } from "../application/use-cases/signup.usecase.js";
import { LoginUseCase } from "../application/use-cases/login.usecase.js";
import { VerifyUseCase } from "../application/use-cases/verify-otp.usecase.js";
import { ResendotpUseCase } from "../application/use-cases/resend-otp.usecase.js";
import { ForgotpasswordUsecase } from "../application/use-cases/forgotpassword.usecase.js";
import { ResetPasswordUseCase } from "../application/use-cases/resetpassword.usecase.js";
import { HttpStatus } from "../../../common/constants/http-stattus.js";
import { AdminLoginUseCase } from "../application/use-cases/adminlogin.use.js";
// import { GetmeUseCase } from "../application/use-cases/getme.usecase.js";
// import { CreateToken } from "../../../common/service/token.service.js";
// import { ITokenService } from "../domain/services/token.service.interface.js";
export class AuthController {
  constructor(private SignupUsecase :SignupUsecase,
       private LoginUseCase:LoginUseCase,
       private VerifyUseCase:VerifyUseCase,
       private ResendotpUseCase: ResendotpUseCase,
       private ForgotpasswordUsecase : ForgotpasswordUsecase,
       private ResetPasswordUseCase : ResetPasswordUseCase,
       private AdminLoginUseCase  :AdminLoginUseCase,
      //  private GetmeUseCase : GetmeUseCase,
      //  private tokenService:ITokenService
       
  ){}
  async signup(req: Request, res: Response,next:NextFunction): Promise<void> {

    console.log("bkjbhjbchjb")
    try {

      console.log("rjfjrf",req.body)
      const { name, email, password,role,confirmpassword,isVerified } = req.body;
     console.log("dejbdhbhbhshbh samoe")
      // manually wiring dependencies (later we use DI container)


      // const userRepository = new UserRepository();
      // const hashService = new BcryptHashService();

      // const signupUseCase = new SignupUsecase(userRepository, hashService);

      const user = await this.SignupUsecase.execute({ name, email, password,role,confirmpassword,isVerified});
      console.log(user)
       res.status(HttpStatus.CREATED).json({
        
        message: "User created successfully",
        data: user
      });

    } catch (error: any) {
       console.log(error.message)
      next(error)
    }
  }




    async login(req:Request,res:Response,next:NextFunction):Promise<void>

    {

      console.log('jnjnfdjnfkdjnfljnfljdnfdljfnd')
         
      try {
      

      const {email,password,role} = req.body;
      console.log(req.body)
      const user= await this.LoginUseCase.execute({email,password,role});


        //  res.cookie("refreshToken",refreshToken,{
        //   httpOnly:true,
        //   secure:true,
        //   sameSite:"strict",
        //   maxAge:7*24*60*60*1000
        //  })
        console.log("onnn check,",user)
       res.status(HttpStatus.OK).json({message:'user login correctly'
        ,
        user})
    } catch (error:any) {
      next(error)
    }
    }


    async verify(req:Request,res:Response,next:NextFunction):Promise<void>{
      try{
        const {email,otp} = req.body;


        console.log('opt verification come data',req.body)
        const user = await this.VerifyUseCase.execute({email,otp});

        //     res.cookie("refreshToken",refreshToken,{
        //   httpOnly:true,
        //   secure:true,
        //   sameSite:"strict",
        //   maxAge:7*24*60*60*1000
        //  })

        //  console.log("checking",user,refreshToken,accessToken)
      res.status(HttpStatus.OK).json({
          message:'the otp verification completed',user
        })
      }
      catch(error:any){
        next(error)
      }
    }

    async resnedVerify(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
             const {email} = req.body;

             const verifyOtp = await this.ResendotpUseCase.execute(email);
              res.status(HttpStatus.OK).json({
              message: "otp resned successfully",data:verifyOtp
             })
        } catch (error:any) {
             console.log(error);
            next(error)
        }
    }


    async forgotPassword(req:Request,res:Response,next:NextFunction):Promise<void>{
      console.log("vjfncjfjv")
      try {
          const {email} = req.body;


           console.log("fjvndfjvfhd")

          const user  = await this.ForgotpasswordUsecase.execute(email);

          // console.log("th user here",user)
             res.status(HttpStatus.OK).json({
              message:"otp sened succesfully",data:user
            })
          }
      catch (error:any) {
        //  console.log('error')
         next(error)
      }
    
    }
   


    async resetpassword(req:Request,res:Response,next:NextFunction):Promise<void>{
      try {
          const{email,otp,password,confirmpassword} = req.body;


          // console.log(req.body)
          const user = await this.ResetPasswordUseCase.execute({email,otp,password,confirmpassword});
           res.status(HttpStatus.OK).json({
            message:"reset success fully passowrd",data:user
          })
      } catch (error:any) {
       next(error)
      }
    }








     async adminlogin(req:Request,res:Response,next:NextFunction):Promise<void>

    {

      // console.log('jnjnfdjnfkdjnfljnfljdnfdljfnd')
         
      try {
      

      const {email,password,role} = req.body;
      // console.log(req.body)
      const user= await this.AdminLoginUseCase.execute({email,password,role});

        //   res.cookie("refreshToken",refreshToken,{
        //   httpOnly:true,
        //   secure:true,
        //   sameSite:"strict",
        //   maxAge:7*24*60*60*1000
        //  })
         
         
        // console.log("onnn check,",user,refreshToken,accessToken)
       res.status(HttpStatus.OK).json({message:'user login correctly'
        ,
        user})
    } catch (error:any) {
      next(error)
    }
    }

      
   async logout(_req: Request, res: Response, _next: NextFunction) {
  res.status(HttpStatus.OK).json({
    success: true,
    message: "Logout successful"
  });
}

}


    // async getMe(req:Request,res:Response){
    //   const decode = (req as any).user;

    //   console.log("decoded ",decode)
    //     const user = await this.GetmeUseCase.execute(decode.userId)
    //   res.status(HttpStatus.OK).json({
    //      user
    //   })
    // }







//     async getMe(req: Request, res: Response, next: NextFunction) {
//   try {

//     const refreshToken = req.cookies.refreshToken;
//      console.log(req.cookies)
//      console.log(req.cookies.refreshToken)
//     if (!refreshToken) {
//       return res.status(HttpStatus.UNAUTHORIZED).json({
//         message: "Not authenticated"
//       });
//     }

//     const decoded = this.tokenService.verifyRefreshToken(refreshToken) as any;

//     const user = await this.GetmeUseCase.execute(decoded.userId);

//     const accessToken = this.tokenService.generateAccessToken({
//       userId: user.id,
//       role: user.role
//     });

//     return res.status(HttpStatus.OK).json({
//       user,
//       accessToken
//     });

//   } catch (error) {
//     next(error);
//   }
// }
// async logout(_req:Request,res:Response,_next:NextFunction){
     

//    console.log("function cfknvnf")

//   res.clearCookie("refreshToken", {
//     httpOnly: true,
//     secure: true,
//     sameSite: "strict",
//   });

//   res.status(200).json({
//     message: "Logged out",
//   });
// }
// }




    


 