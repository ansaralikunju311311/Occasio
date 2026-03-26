import { Model, Document , UpdateQuery } from "mongoose";
import {FilterQuery} from "mongoose"
export abstract class BaseRepository<T extends Document> {

  constructor(protected model: Model<T>) {}

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async updateById(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter);
  }
  async updateOne(
  filter: FilterQuery<T>,
  data: UpdateQuery<T>
): Promise<T | null> {
  return this.model.findOneAndUpdate(filter, data, { new: true });
}
}