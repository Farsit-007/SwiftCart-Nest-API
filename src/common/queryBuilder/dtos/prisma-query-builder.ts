/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/common/utils/prisma-query-builder.ts

interface PrismaQueryOptions {
  searchTerm?: string; // text to search
  searchFields?: string[]; // fields to search in
  filter?: Record<string, any>; // dynamic filters
  sort?: string; // e.g., '-createdAt' or 'name'
  page?: number; // pagination page
  limit?: number; // pagination limit
  min?: number; // min value for numeric range
  max?: number; // max value for numeric range
  numericField?: string; // field to apply min/max on, e.g., 'age'
}

export class PrismaQueryBuilder {
  private options: PrismaQueryOptions;
  private where: any = {};
  private orderBy: any = {};
  private skip: number = 0;
  private take: number = 10;

  constructor(options: PrismaQueryOptions) {
    this.options = options;
  }

  /**
   * 🔍 Search by multiple fields
   */
  search() {
    const { searchTerm, searchFields } = this.options;
    if (searchTerm && searchFields?.length) {
      this.where.OR = searchFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      }));
    }
    return this;
  }

  /**
   * 🎯 Apply filters and numeric ranges
   */
  filter() {
    const { filter, min, max, numericField } = this.options;

    if (filter) {
      this.where = { ...this.where, ...filter };
    }

    if (min !== undefined || max !== undefined) {
      const field = numericField || 'price';
      this.where[field] = {};
      if (min !== undefined) this.where[field].gte = min;
      if (max !== undefined) this.where[field].lte = max;
    }

    return this;
  }

  /**
   * 🔽 Sort results
   */
  sort() {
    const { sort } = this.options;
    if (sort) {
      const direction = sort.startsWith('-') ? 'desc' : 'asc';
      const field = sort.replace('-', '');
      this.orderBy[field] = direction;
    } else {
      this.orderBy['createdAt'] = 'desc';
    }
    return this;
  }

  /**
   * 📄 Pagination
   */
  paginate() {
    const { page = 1, limit = 10 } = this.options;
    this.skip = (page - 1) * limit;
    this.take = limit;
    return this;
  }

  /**
   * 🛠️ Build Prisma query object
   */
  build() {
    return {
      where: this.where,
      orderBy: this.orderBy,
      skip: this.skip,
      take: this.take,
    };
  }

  /**
   * 📊 Count total records for pagination metadata
   */
  async countTotal(prismaModel: any) {
    const total = await prismaModel.count({ where: this.where });
    const page = this.options.page || 1;
    const limit = this.options.limit || 10;
    const totalPages = Math.ceil(total / limit);
    return { total, page, limit, totalPages };
  }
}
