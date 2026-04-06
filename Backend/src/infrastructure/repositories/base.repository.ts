// // // // import { Model, Document , UpdateQuery } from "mongoose";
// // // // import {FilterQuery} from "mongoose"
// // // // export abstract class BaseRepository<T extends Document> {

// // // //   constructor(protected model: Model<T>) {}

// // // //   async findOne(filter: FilterQuery<T>): Promise<T | null> {
// // // //     return this.model.findOne(filter);
// // // //   }
// // // //   async findById(id: string): Promise<T | null> {
// // // //     return this.model.findById(id);
// // // //   }
// // // //   async create(data: Partial<T>): Promise<T> {
// // // //     return this.model.create(data);
// // // //   }

// // // //   async updateById(id: string, data: UpdateQuery<T>): Promise<T | null> {
// // // //     return this.model.findByIdAndUpdate(id, data, { new: true });
// // // //   }

// // // //   async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
// // // //     return this.model.find(filter);
// // // //   }
// // // //   async updateOne(
// // // //   filter: FilterQuery<T>,
// // // //   data: UpdateQuery<T>
// // // // ): Promise<T | null> {
// // // //   return this.model.findOneAndUpdate(filter, data, { new: true });
// // // // }
// // // // }
// // // import {
// // //   Model,
  
// // //   UpdateQuery,
// // //   HydratedDocument
// // // } from "mongoose";
// // // // import type { FilterQuery } from "mongoose";
// // // export abstract class BaseRepository<T> {
// // //   constructor(protected model: Model<T>) {}

// // //   async findOne(filter: mongoose.FilterQuery<T>): Promise<HydratedDocument<T> | null> {
// // //     return this.model.findOne(filter);
// // //   }

// // //   async findById(id: string): Promise<HydratedDocument<T> | null> {
// // //     return this.model.findById(id);
// // //   }

// // //   async create(data: Partial<T>): Promise<HydratedDocument<T>> {
// // //     return this.model.create(data);
// // //   }

// // //   async updateById(
// // //     id: string,
// // //     data: UpdateQuery<T>
// // //   ): Promise<HydratedDocument<T> | null> {
// // //     return this.model.findByIdAndUpdate(id, data, { new: true });
// // //   }

// // //   async findAll(filter: FilterQuery<T> = {}): Promise<HydratedDocument<T>[]> {
// // //     return this.model.find(filter);
// // //   }

// // //   async updateOne(
// // //     filter: FilterQuery<T>,
// // //     data: UpdateQuery<T>
// // //   ): Promise<HydratedDocument<T> | null> {
// // //     return this.model.findOneAndUpdate(filter, data, { new: true });
// // //   }
// // // }
// // import mongoose, {
// //   Model,
// //   UpdateQuery,
// //   HydratedDocument
// // } from "mongoose";

// // export abstract class BaseRepository<T> {
// //   constructor(protected model: Model<T>) {}

// //   async findOne(
// //     filter: mongoose.FilterQuery<T>
// //   ): Promise<HydratedDocument<T> | null> {
// //     return this.model.findOne(filter);
// //   }

// //   async findById(id: string): Promise<HydratedDocument<T> | null> {
// //     return this.model.findById(id);
// //   }

// //   async create(data: Partial<T>): Promise<HydratedDocument<T>> {
// //     return this.model.create(data);
// //   }

// //   async updateById(
// //     id: string,
// //     data: UpdateQuery<T>
// //   ): Promise<HydratedDocument<T> | null> {
// //     return this.model.findByIdAndUpdate(id, data, { new: true });
// //   }

// //   async findAll(
// //     filter: mongoose.FilterQuery<T> = {}
// //   ): Promise<HydratedDocument<T>[]> {
// //     return this.model.find(filter);
// //   }

// //   async updateOne(
// //     filter: mongoose.FilterQuery<T>,
// //     data: UpdateQuery<T>
// //   ): Promise<HydratedDocument<T> | null> {
// //     return this.model.findOneAndUpdate(filter, data, { new: true });
// //   }
// // }
// import {
//   Model,
//   UpdateQuery,
//   HydratedDocument,
//   RootFilterQuery
// } from "mongoose";

// export abstract class BaseRepository<T> {
//   constructor(protected model: Model<T>) {}

//   async findOne(
//     filter: RootFilterQuery<T>
//   ): Promise<HydratedDocument<T> | null> {
//     return this.model.findOne(filter);
//   }

//   async findById(id: string): Promise<HydratedDocument<T> | null> {
//     return this.model.findById(id);
//   }

//   async create(data: Partial<T>): Promise<HydratedDocument<T>> {
//     return this.model.create(data);
//   }

//   async updateById(
//     id: string,
//     data: UpdateQuery<T>
//   ): Promise<HydratedDocument<T> | null> {
//     return this.model.findByIdAndUpdate(id, data, { new: true });
//   }

//   async findAll(
//     filter: RootFilterQuery<T> = {}
//   ): Promise<HydratedDocument<T>[]> {
//     return this.model.find(filter);
//   }

//   async updateOne(
//     filter: RootFilterQuery<T>,
//     data: UpdateQuery<T>
//   ): Promise<HydratedDocument<T> | null> {
//     return this.model.findOneAndUpdate(filter, data, { new: true });
//   }
// }
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