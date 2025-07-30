import { ConflictException, NotFoundException } from "@nestjs/common";
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
} from "src/constants";
import { IPaginatedResponse } from "../interfaces";

export type EntityWhereType<T extends BaseEntity> =
  | FindOptionsWhere<T>
  | FindOptionsWhere<T>[];

export abstract class BaseService<Entity extends BaseEntity> {
  private readonly entityName;

  constructor(private readonly repository: Repository<Entity>) {
    this.entityName = this.repository.metadata.name;
  }

  async create(
    body: DeepPartial<Entity>,
    duplicationMessage: string = null
  ): Promise<Entity> {
    try {
      return await this.repository.save({ ...body });
    } catch (exception) {
      if (exception?.code === "23505") {
        throw new ConflictException(duplicationMessage);
      } else {
        throw exception;
      }
    }
  }

  getRepository() {
    return this.repository;
  }


  async findOne(
    findOneOptions: FindOneOptions<Entity>
  ): Promise<Entity | null> {
    return await this.repository.findOne(findOneOptions);
  }

  async findOneOrThrowException(
    findOneOptions: FindOneOptions<Entity>,
    exceptionMessage = `${this.entityName} not found`
  ): Promise<Entity | never> {
    const eitherRecordOrNull = await this.findOne(findOneOptions);

    if (eitherRecordOrNull === null) {
      throw new NotFoundException(exceptionMessage);
    }

    return eitherRecordOrNull;
  }

  async findByIdOrThrowException(
    id: string,
    exceptionMessage = `${this.entityName} not found`
  ): Promise<Entity | never> {
    const eitherRecordOrNull = await this.repository.findOne({
      where: { id } as any,
    });

    if (eitherRecordOrNull === null) {
      throw new NotFoundException(exceptionMessage);
    }

    return eitherRecordOrNull;
  }

  async softDelete(recordToDeleteTemporarily: Entity) {
    recordToDeleteTemporarily.deletedAt = new Date();
    //recordToDeleteTemporarily.deleted_by = userDeletingRecord.email;
    return await this.repository.save(recordToDeleteTemporarily);
  }

  async delete(id: string) {
    return await this.repository.delete(id);
  }

  async save(
    entityInstance: Entity,
    duplicationMessage: string = null
  ): Promise<Entity> {
    try {
      return await this.repository.save({
        ...entityInstance,
      });
    } catch (exception) {
      if (exception?.code === "23505") {
        throw new ConflictException(duplicationMessage);
      } else {
        throw exception;
      }
    }
  }

  mergeWhereConditions(
    callback: () => EntityWhereType<Entity>,
    additionalWhere: FindOptionsWhere<Entity>
  ): EntityWhereType<Entity> {
    let finalWhere = callback();
    if (finalWhere === undefined) return additionalWhere;

    if (Array.isArray(finalWhere)) {
      if (finalWhere.length === 0) return additionalWhere;

      return finalWhere.map((_) => {
        return {
          ..._,
          ...additionalWhere,
        };
      });
    }

    return { ...finalWhere, ...additionalWhere };
  }
}
