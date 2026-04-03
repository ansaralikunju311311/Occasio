export interface IHashServive {
    hash(value:string):Promise<string>
    comapre(value:string,hashed:string):Promise<boolean>
}