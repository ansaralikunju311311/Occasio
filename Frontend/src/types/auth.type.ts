export interface  LoginDataType{
  email: string;
  password: string;
  remember: boolean;
};


export interface SignDataType{
    name : string;
    email:string;
    password:string;
    confirmpassword:string;
    remember:boolean

}

export interface OtpData{
  email:string,
  otp:string
}