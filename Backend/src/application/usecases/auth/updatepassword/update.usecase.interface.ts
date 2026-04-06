
import { UpdatePasswordDto } from "../../../../application/dtos/updatepassword.dto";


export interface IUpdateUseCase {
  execute(data: UpdatePasswordDto): Promise<void>;
}