-- OAuth identity supplied by Google. Password accounts continue to work unchanged.
ALTER TABLE "User" ADD COLUMN "googleId" TEXT;
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
