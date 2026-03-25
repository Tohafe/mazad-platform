import type { ProductImage, ProductDetail, BreadcrumbItem } from '../../types';
import { ProductTitle } from './ProductTitle';
import { ImageGallery } from './ImageGallery';
import { SellerDescription } from './SellerDescription';
import { DetailsGrid } from './DetailsGrid';
import { ShippingInfo } from './ShippingInfo';

interface MainContentProps {
  title: string;
  images: ProductImage[];
  description: string;
  document: string;
  sellerDescription: string;
  details: ProductDetail[];
  shippingInfo: string;
  breadcrumbs?: BreadcrumbItem[];
  favoriteCount?: number;
}

export function MainContent({
  title,
  images,
  sellerDescription,
  document,
  details,
  shippingInfo,
}: MainContentProps) {
  return (
    <div className="space-y-6">

      {/* Product Title */}
      <ProductTitle title={title} />

      {/* Image Gallery with Bleed Effect */}
      <div className="">
        <ImageGallery images={images} />
      </div>

      {/* Description from seller */}
      <SellerDescription description={sellerDescription} />

      {/* Document */}
      <div className="border-t  border-border pt-6">
        <h2 className="text-base font-semibold uppercase tracking-widest text-secondary mb-3">
          Item documnet
        </h2>
        <a href={document} target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
          Open Document
        </a>
        <div className="flex items-center gap-4">
        </div>
      </div>

      {/* Details Grid */}
      <DetailsGrid details={details} />

      {/* Shipping */}
      <ShippingInfo info={shippingInfo} />
    </div>
  );
}
