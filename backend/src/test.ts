   import { prisma } from "./lib/prisma";

   async function main() {
     const user = await prisma.user.create({
       data: {
         full_name: "Teste Silva",
         email: "teste@theclick.com",
         password_hash: "hash-de-teste",
       },
     });
     console.log("Criado:", user);

     console.log("Total de usuários:", await prisma.user.count());

     await prisma.user.delete({ where: { id: user.id } });
     console.log("Removido, tudo funcionando");
   }

   main().finally(() => prisma.$disconnect());