import Bank from "../model/Bank.js";

export const deposito = async(req, res) => {
    try{
    const dep = new Bank(req.body)
    const result = await dep.deposit(req.user);
    if(dep.errors.length > 0) return res.json(dep.errors);
    res.json({result})
    }catch(e){console.log(e)}
};

export const transfer = async(req, res) => {
    try{
    const pay = new Bank(req.body);
    const payRes = await pay.transfer(req.user);
    if(pay.errors.length > 0) return res.json(pay.errors);
    res.json({payRes});
    }catch(e){console.log(e)}
};

export const consulta = async(req, res) => {
    try{const consulta = new Bank(req.body);
    const result = await consulta.consultaSaldo(req.user);
    res.json({result})
}catch(e){console.log(e)}
};