import router from "express"
import { signupvalidation, loginvalidation } from "../Middlewares/inputvalidation.js"
import { sign_up, login, checkUserExists } from "../Controllers/auth_controller.js"
import profile from "../Controllers/profile_controller.js"
import userdata from "../Middlewares/tokendata.js"


const Router = router()

Router.post('/login', loginvalidation, login)

Router.post('/register', signupvalidation, sign_up)

Router.get('/me', userdata, profile)

Router.get('/users/:id', checkUserExists)

Router.get('/', (req,res)=>{
    res.send("working")
})

export default Router;