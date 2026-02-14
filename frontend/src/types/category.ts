import type {IconKey} from "../components/Card/Tab.tsx";

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    hexColor: string;
    icon: IconKey;
}