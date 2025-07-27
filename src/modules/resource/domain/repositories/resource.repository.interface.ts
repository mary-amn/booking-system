import { Resource } from '../entities/resource.entity';

export interface ResourceReader {
  findById(id: number): Promise<Resource>;
  listAll(): Promise<Resource[]>
}

export interface ResourceWriter {
  save(resource: Resource): Promise<void>;
}

export interface IResourceRepository extends ResourceReader, ResourceWriter {}
