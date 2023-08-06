-- DropForeignKey
ALTER TABLE "book_orders" DROP CONSTRAINT "book_orders_user_order_id_fkey";

-- AddForeignKey
ALTER TABLE "book_orders" ADD CONSTRAINT "book_orders_user_order_id_fkey" FOREIGN KEY ("user_order_id") REFERENCES "user_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
