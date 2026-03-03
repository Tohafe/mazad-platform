import type { ProductImage, ProductDetail, BreadcrumbItem } from '../../types';
import { Breadcrumb } from './Breadcrumb';
import { ProductTitle } from './ProductTitle';
import { ImageGallery } from './ImageGallery';
import { ProductDescription } from './ProductDescription';
import { SellerDescription } from './SellerDescription';
import { DetailsGrid } from './DetailsGrid';
import { ShippingInfo } from './ShippingInfo';

interface MainContentProps {
  title: string;
  images: ProductImage[];
  description: string;
  sellerDescription: string;
  details: ProductDetail[];
  shippingInfo: string;
  breadcrumbs?: BreadcrumbItem[];
  favoriteCount?: number;
}

// Default breadcrumbs
const defaultBreadcrumbs: BreadcrumbItem[] = [
  { label: 'Jewellery & Precious Stones' },
  { label: 'Jewellery' },
  { label: 'Art Deco Jewellery Auction' },
];

export function MainContent({
  title,
  images,
  description,
  sellerDescription,
  details,
  shippingInfo,
  breadcrumbs = defaultBreadcrumbs,
  favoriteCount = 155,
}: MainContentProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      {/* Product Title */}
      <ProductTitle title={title} favoriteCount={favoriteCount} />

      {/* Image Gallery with Bleed Effect */}
      <div className="md:-ml-[100px]">
        <ImageGallery images={images} />
      </div>

      {/* Product Description */}
      <ProductDescription description={description} />

      {/* Description from seller */}
      <SellerDescription description={sellerDescription} />

      {/* Details Grid */}
      <DetailsGrid details={details} />

      {/* Shipping */}
      <ShippingInfo info={shippingInfo} />
    </div>
  );
}
