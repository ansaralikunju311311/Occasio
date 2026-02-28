import { Request, Response } from "express";
import { SignupUsecase } from "../application/use-cases/signup.usecase.js";
import { LoginUseCase } from "../application/use-cases/login.usecase.js";
import { VerifyUseCase } from "../application/use-cases/verify-otp.usecase.js";
import { ResendotpUseCase } from "../application/use-cases/resend-otp.usecase.js";
// import { UserRepository } from "../infrastructure/database/user.repository.js";
// import { BcryptHashService } from "../infrastructure/services/bcrypt-hash.service.js";

export class AuthController {
  constructor(private SignupUsecase :SignupUsecase,
       private LoginUseCase:LoginUseCase,
       private VerifyUseCase:VerifyUseCase,
       private ResendotpUseCase: ResendotpUseCase
  ){}
  async signup(req: Request, res: Response): Promise<Response> {
    try {

      console.log("rjfjrf",req.body)
      const { name, email, password,role,confirmpassword,isVerified } = req.body;

      // manually wiring dependencies (later we use DI container)


      // const userRepository = new UserRepository();
      // const hashService = new BcryptHashService();

      // const signupUseCase = new SignupUsecase(userRepository, hashService);

      const user = await this.SignupUsecase.execute({ name, email, password,role,confirmpassword,isVerified});

      return res.status(201).json({
        message: "User created successfully",
        data: user
      });

    } catch (error: any) {
       console.log(error.message)
      return res.status(400).json({
        message: error.message
        
      });
    }
  }




    async login(req:Request,res:Response):Promise<Response>

    {
         
      try {
      

      const {email,password} = req.body;

      const user = await this.LoginUseCase.execute({email,password});
      return res.status(200).json({message:'user login correctly'
        ,
        data:user})
    } catch (error:any) {
       return res.status(400).json({
        message: error.message
      });
    }
    }


    async verify(req:Request,res:Response):Promise<Response>{
      try{
        const {email,otp} = req.body;
        const verify = await this.VerifyUseCase.execute({email,otp});
        return res.status(200).json({
          message:'the otp verification completed',data:verify
        })
      }
      catch(error:any){
        return res.status(400).json({
          message:error.message
        })
      }
    }

    async resnedVerify(req:Request,res:Response):Promise<Response>{
        try {
             const {email} = req.body;

             const verifyOtp = await this.ResendotpUseCase.execute(email);
             return res.status(200).json({
              message: "otp resned successfully",data:verifyOtp
             })
        } catch (error:any) {
             console.log(error);
             return res.status(400).json({
              message:error.message
             })
        }
    }


}