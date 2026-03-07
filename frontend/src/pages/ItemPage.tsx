import { useParams } from 'react-router-dom';
import { Header, TwoColumnLayout, MainContent, BidSidebar } from '../components';
import { useProduct } from '../hooks/';

function ItemPage() {
  const { productId } = useParams<{ productId: string }>();
  const numericProductId = Number(productId);
  const { data, isLoading, isError, error } = useProduct(numericProductId);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* <Header /> */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    console.error('Product fetch error:', error);
    return (
      <div className="min-h-screen bg-white">
        {/* <Header /> */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <p className="text-red-600 text-lg font-medium mb-2">Failed to load product</p>
            <p className="text-gray-500 text-sm">{String(error?.message || error || 'Please try again later')}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* <Header /> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <TwoColumnLayout
          mainContent={
            <MainContent
              title={data.product.title}
              images={data.product.images}
              description={data.product.description}
              sellerDescription={data.product.sellerDescription}
              details={data.product.details}
              shippingInfo={data.product.shippingInfo}
            />
          }
          sidebar={<BidSidebar data={data.bidData} auctionId={numericProductId} />}
        />
      </main>
    </div>
  );
}

export default ItemPage;
