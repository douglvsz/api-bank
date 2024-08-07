import User from "../model/User.js";

export const register = async(req, res) =>{
    try {
        const newUser = new User(req.body);
        const result = await newUser.register();
        if(newUser.errors.length > 0){
            res.json(newUser.errors);
            return
        }
        res.status(200).json(result)
        
    }
    catch(e)
    {console.log(e)};

};


/* 
export const list = async (req, res) => {
    try {
        const user = new User();
        const users = await user.listaUser();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 
*/

export const login = async(req, res) => {
    try{
        const login = new User(req.body);
        const result = await login.login();
        if(login.errors.length > 0 ) return res.status(401).json(login.errors);
        res.status(201).json(result)
    }
    catch(e){console.log(e)}
};