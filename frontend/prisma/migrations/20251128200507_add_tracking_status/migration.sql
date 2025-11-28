-- AlterTable
ALTER TABLE "MarketplaceOrder" ADD COLUMN     "trackingStatus" TEXT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "updatedAt" DROP DEFAULT;
