import type { ProductImage, ProductDetail, BreadcrumbItem } from '../../types';
import { ProductTitle } from './ProductTitle';
import { ImageGallery } from './ImageGallery';
import { SellerDescription } from './SellerDescription';
import { DetailsGrid } from './DetailsGrid';
import { ShippingInfo } from './ShippingInfo';
import { SllerDocument } from './sellerDocument';

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

      {/* Document */}
      <SllerDocument document={document} />
      
      {/* Description from seller */}
      <SellerDescription description={sellerDescription} />

      {/* Details Grid */}
      <DetailsGrid details={details} />

      {/* Shipping */}
      <ShippingInfo info={shippingInfo} />
    </div>
  );
}
