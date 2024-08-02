import Bank from "../model/Bank.js";

export const deposito = async(req, res) => {
    try{
    const dep = new Bank(req.body)
    const result = await dep.deposit(req.user);
    res.json({result})
    if(dep.errors.length > 0) res.json(dep.errors);
    }catch(e){console.log(e)}
}