export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  rating: number;
  numReviews: number;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: File;
}

export interface PaginatedProducts {
  data: Product[];
  meta: {
    limit: number;
    hasNextPage: boolean;
    nextCursor: string | null;
    // Only returned for page-based requests and the first cursor request
    page?: number;
    hasPreviousPage?: boolean;
    total?: number;
    totalPages?: number;
    categories?: string[];
  };
}
