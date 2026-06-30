import router from "express"
import del from "../Controllers/del-share.js"
import shares from "../Controllers/list_shares.js"
import userShare from "../Controllers/shared_with_user.js"
import share_rec from "../Controllers/create_share.js"

const Router = router()

Router.post('/', share_rec)

Router.get('/me', userShare)

Router.get('/file/:file_id', shares)

Router.delete('/:id', del)

export default Router;