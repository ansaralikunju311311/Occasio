import { EventManager } from "../../../domain/entites/manager.entity.js";
import { IEventManagerRepository } from "../../../domain/repositories/manager/manager.repository.interface.js";
export class ManagerDetailsUseCase{
    constructor(
        private managerRepository:IEventManagerRepository
    ){}


    async execute(id:string):Promise<EventManager | null>{


        const manager = await this.managerRepository.findByIdManager(id)
        return manager
    }
}