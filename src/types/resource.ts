export type ResourceCategory =
  | 'prayer'
  | 'grief'
  | 'parenting'
  | 'relationships'
  | 'growth'
  | 'community';

export interface Resource {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: ResourceCategory;
  tags: string[];
  publishedDate: string; // ISO date string
  downloadUrl?: string; // optional PDF study guide
  imageUrl?: string;
}
