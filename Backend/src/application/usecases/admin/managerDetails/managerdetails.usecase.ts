import { EventManager } from "../../../../domain/entities/manager.entity";
import { IEventManagerRepository } from "../../../../domain/repositories/manger.repository.interface";
import { IManagerDetailsUseCase } from "./managerdetails.usecase.interface";
export class ManagerDetailsUseCase implements IManagerDetailsUseCase{
    constructor(
        private managerRepository:IEventManagerRepository
    ){}


    async execute(id:string):Promise<EventManager | null>{


        const manager = await this.managerRepository.findByIdManager(id)
        return manager
    }
}