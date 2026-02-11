/*
  Warnings:

  - A unique constraint covering the columns `[cedula]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `cedula` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_cedula_key` ON `users`(`cedula`);
