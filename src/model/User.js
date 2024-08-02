import { PrismaClient } from "@prisma/client";
import validator from "validator";
import bcrypt from 'bcrypt'
import { cpf } from "cpf-cnpj-validator";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();


const prisma = new PrismaClient();

class User{
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    };

    async register(){
        await this.valida();
        if(this.errors.length > 0) return this.errors
        await this.userExist();
        if(this.errors.length > 0) return this.errors
        this.cpfValidate();
        if(this.errors.length > 0) return this.errors
        let {name, cpfVal, email, password} = this.body;
        cpfVal = cpfVal.replace(/\D/g, '');
        const newPass = await bcrypt.hash(password, 10)
        await prisma.user.create({data:{name: name, cpf: cpfVal, email: email, password: newPass}});
    };

    async login(){
        this.user = await prisma.user.findUnique({where:{email: this.body.email}});
        if(!this.user) return this.errors.push('Usuário não existe')
        const pass = await bcrypt.compare(this.body.password, this.user.password)
        if(!pass) return this.errors.push('Senha Inválida')

        const secret = process.env.PRIVATE_KEY;
        const token = jwt.sign({id: this.user.id, email: this.user.email}, secret, {expiresIn: "1d"})
        console.log({message: "Usuário autenticado", token})
    };


    async listaUser(){
        return await prisma.user.findMany();
    };

    async valida(){  
        const email = validator.isEmail(this.body.email);
        if(!email) this.errors.push('Email inválido!');
        const password = this.body.password;
        if(password.length < 3 || password.length > 15) this.errors.push('A senha deve ser entre 3 e 15 caracteres!');
    };
    
    async userExist(){
        const email = this.user = await prisma.user.findUnique({where:{email: this.body.email}});
        const cpf = this.user = await prisma.user.findUnique({where:{cpf: this.body.cpfVal}});
        if(email || cpf) this.errors.push('Usuário já existe!');
    };

    cpfValidate(){
        const cpfVal = this.body.cpfVal;
        if(!cpf.isValid(cpfVal)) this.errors.push('CPF Inválido!');
    }
};


export default User;