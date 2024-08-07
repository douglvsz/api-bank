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
        if(isNaN(amount) || amount <= 0) return this.errors.push('Insira um valor para depósito');

        const newBalance = findUser.balance + amount

        const depositVal = await prisma.user.update({where:{id: userId}, data:{balance: newBalance}})
    
        return { message: `Depósito realizado no valor de ${amount.toFixed(2)}`, saldoAtual: depositVal.balance};
    };

    async transfer(sender){
        const senderId = sender.id;
        const {recipientId, amount} = this.body;

        const findSend = await prisma.user.findUnique({where:{id: senderId}});
        const findRecipient = await prisma.user.findUnique({where:{id: recipientId}});

        if(!findSend) return this.errors.push('Remetente não encontrado!');
        if(!findRecipient) return this.errors.push('Destinatário não encontrado!');

        const payment = parseFloat(amount);
        if(isNaN(payment) || payment <= 0) return this.errors.push('Insira um valor válido');
        if(findSend.balance < payment) return this.errors.push ('Saldo Insuficiente');

        const newSendBalance = findSend.balance - payment;
        const newRecipBalance = findRecipient.balance + payment;

        await prisma.user.update({where:{id: senderId}, data:{balance: newSendBalance}});
        await prisma.user.update({where:{id: recipientId}, data:{balance: newRecipBalance}});

        await prisma.transfer.create({data:{amount: payment, senderId: senderId, receiverId: recipientId}})

        return {
        message: `Transfêrencia no valor de ${payment.toFixed(2)} realizada com sucesso!`, 
        quemRecebeu: findRecipient.name};
    };

    async consultaSaldo(user){
        const userId = user.id;
        const findUser = await prisma.user.findUnique({where:{id: userId}});
        const saldo = findUser.balance.toFixed(2)
        return {nome: findUser.name, saldo: `R$: ${saldo}`}
    }
};

export default Bank;

