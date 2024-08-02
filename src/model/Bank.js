import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class Bank{
    constructor(body){
        this.body = body;
        this.errors = [];
    };

    async deposit(user){
        const userId = user.id
        const findUser = await prisma.user.findUnique({where:{id: userId}});
        if(!findUser) return this.errors.push('Usuário não encontrado!');

        const amount = parseFloat(this.body.amount)
        if(isNaN(amount) || amount <= 0) this.errors.push('Insira um valor para depósito');

        const newBalance = findUser.balance + amount

        const depositVal = await prisma.user.update({where:{id: userId}, data:{balance: newBalance}})
        const { password, createdAt, updatedAt, ...userWithoutSensitiveData} = depositVal
        return { message: 'Depósito realizado com sucesso', user: userWithoutSensitiveData };
    };
};

export default Bank;

