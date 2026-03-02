import { NextFunction, Request, Response } from "express";
import { SignupUsecase } from "../application/use-cases/signup.usecase.js";
import { LoginUseCase } from "../application/use-cases/login.usecase.js";
import { VerifyUseCase } from "../application/use-cases/verify-otp.usecase.js";
import { ResendotpUseCase } from "../application/use-cases/resend-otp.usecase.js";
import { ForgotpasswordUsecase } from "../application/use-cases/forgotpassword.usecase.js";
import { ResetPasswordUseCase } from "../application/use-cases/resetpassword.usecase.js";
import { HttpStatus } from "../../../common/constants/http-stattus.js";
export class AuthController {
  constructor(private SignupUsecase :SignupUsecase,
       private LoginUseCase:LoginUseCase,
       private VerifyUseCase:VerifyUseCase,
       private ResendotpUseCase: ResendotpUseCase,
       private ForgotpasswordUsecase : ForgotpasswordUsecase,
       private ResetPasswordUseCase : ResetPasswordUseCase
       
  ){}
  async signup(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {

      console.log("rjfjrf",req.body)
      const { name, email, password,role,confirmpassword,isVerified } = req.body;

      // manually wiring dependencies (later we use DI container)


      // const userRepository = new UserRepository();
      // const hashService = new BcryptHashService();

      // const signupUseCase = new SignupUsecase(userRepository, hashService);

      const user = await this.SignupUsecase.execute({ name, email, password,role,confirmpassword,isVerified});

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
         
      try {
      

      const {email,password} = req.body;

      const user = await this.LoginUseCase.execute({email,password});
       res.status(HttpStatus.OK).json({message:'user login correctly'
        ,
        data:user})
    } catch (error:any) {
      next(error)
    }
    }


    async verify(req:Request,res:Response,next:NextFunction):Promise<void>{
      try{
        const {email,otp} = req.body;
        const verify = await this.VerifyUseCase.execute({email,otp});


      res.status(HttpStatus.OK).json({
          message:'the otp verification completed',data:verify
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
      try {
          const {email} = req.body;
          const user  = await this.ForgotpasswordUsecase.execute(email);
             res.status(HttpStatus.OK).json({
              message:"otp sened succesfully",data:user
            })
          }
      catch (error:any) {
         console.log('error')
         next(error)
      }
    
    }



    async resetpassword(req:Request,res:Response,next:NextFunction):Promise<void>{
      try {
          const{email,otp,password,confirmpassword} = req.body;
          const user = await this.ResetPasswordUseCase.execute({email,otp,password,confirmpassword});
           res.status(HttpStatus.OK).json({
            message:"reset success fully passowrd",data:user
          })
      } catch (error:any) {
       next(error)
      }
    }

}