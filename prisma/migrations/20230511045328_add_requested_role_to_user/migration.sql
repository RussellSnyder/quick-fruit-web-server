-- AlterTable
ALTER TABLE "users" ADD COLUMN     "requestedRole" "Role",
ALTER COLUMN "role" SET DEFAULT 'USER';
