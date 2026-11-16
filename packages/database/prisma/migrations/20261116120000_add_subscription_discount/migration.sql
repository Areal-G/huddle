-- The subscription discount fields were added to the schema without a
-- migration, so every query on subscriptions failed on a migrated database.
ALTER TABLE "subscriptions" ADD COLUMN "discount_percent_off" DOUBLE PRECISION,
ADD COLUMN "discount_amount_off" INTEGER;
