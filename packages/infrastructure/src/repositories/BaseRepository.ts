import { Model, Document } from 'mongoose';

export interface BaseRepositoryInterface<T, CreateDto, UpdateDto> {
  create(data: CreateDto): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, updateData: UpdateDto): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
  countDocuments(query?: any): Promise<number>;
}

export abstract class BaseRepository<TDocument extends Document, TEntity, TCreateDto, TUpdateDto> 
  implements BaseRepositoryInterface<TEntity, TCreateDto, TUpdateDto> {
  
  constructor(protected readonly model: Model<TDocument>) {}

  async create(data: TCreateDto): Promise<TEntity> {
    const doc = new this.model(this.mapCreateDto(data));
    const savedDoc = await doc.save();
    return this.mapToEntity(savedDoc);
  }

  async findById(id: string): Promise<TEntity | null> {
    const doc = await this.model.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async update(id: string, updateData: TUpdateDto): Promise<TEntity | null> {
    const updateFields = this.mapUpdateDto(updateData);
    const doc = await this.model.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }

  async exists(id: string): Promise<boolean> {
    const doc = await this.model.findById(id);
    return doc !== null;
  }

  async countDocuments(query: any = {}): Promise<number> {
    return this.model.countDocuments(query);
  }

  // Pagination helper
  protected async paginate<TResult = TEntity>(
    query: any,
    page: number = 1,
    limit: number = 10,
    sort: any = { createdAt: -1 },
    mapFn?: (doc: any) => TResult
  ): Promise<{ items: TResult[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    
    const [docs, total] = await Promise.all([
      this.model.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments(query)
    ]);

    const mapper = mapFn || ((doc: any) => this.mapToEntity(doc) as any);

    return {
      items: docs.map(mapper),
      total,
      page,
      limit
    };
  }

  // Aggregation pagination helper
  protected async aggregatePaginate<TResult>(
    pipeline: any[],
    page: number = 1,
    limit: number = 10,
    mapFn: (doc: any) => TResult
  ): Promise<{ items: TResult[]; total: number; page: number; limit: number }> {
    // Get total count
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await this.model.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Add pagination to main pipeline
    const paginatedPipeline = [
      ...pipeline,
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ];

    const docs = await this.model.aggregate(paginatedPipeline);

    return {
      items: docs.map(mapFn),
      total,
      page,
      limit
    };
  }

  // Build query helpers
  protected buildTextSearchQuery(search?: string): any {
    return search ? { $text: { $search: search } } : {};
  }

  protected buildRegexQuery(field: string, value?: string): any {
    return value ? { [field]: { $regex: value, $options: 'i' } } : {};
  }

  protected buildEqualityQuery(field: string, value?: any): any {
    return value !== undefined ? { [field]: value } : {};
  }

  protected buildSort(sortBy: string = 'createdAt', sortOrder: string = 'desc'): any {
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    return { [sortBy]: sortDirection };
  }

  // Abstract methods to be implemented by concrete repositories
  protected abstract mapCreateDto(data: TCreateDto): any;
  protected abstract mapUpdateDto(data: TUpdateDto): any;
  protected abstract mapToEntity(doc: any): TEntity;
} 