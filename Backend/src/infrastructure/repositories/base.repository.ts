import {
  Model,
  FilterQuery,
  UpdateQuery,
  HydratedDocument
} from "mongoose";

export abstract class BaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async findOne(filter: FilterQuery<T>): Promise<HydratedDocument<T> | null> {
    return this.model.findOne(filter).exec();
  }

  async findById(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findById(id).exec();
  }

  async create(data: Partial<T>): Promise<HydratedDocument<T>> {
    return this.model.create(data);
  }

  async updateById(
    id: string,
    data: UpdateQuery<T>
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async findAll(filter: FilterQuery<T> = {}): Promise<HydratedDocument<T>[]> {
    return this.model.find(filter).exec();
  }

  async updateOne(
    filter: FilterQuery<T>,
    data: UpdateQuery<T>
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findOneAndUpdate(filter, data, { new: true }).exec();
  }
}