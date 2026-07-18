import type { Auth } from './auth';

export interface Product {
    id: string;
    categoryId: string;
    name: string;
    slug: string;
    price: number;
    filePath: string | null;
    rating?: number;
    reviewsCount?: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface PersonalizedState {
    recently_viewed: Product[];
    recommended: Product[];
    has_recent_order: boolean;
}

export interface HomeSearchFilters {
    search: string | null;
    categoryId: number | null;
}

export interface HomePageProps {
    products: Product[];
    categories: Category[];
    personalized: PersonalizedState | null;
    filters: HomeSearchFilters;
    auth: Auth;
}
