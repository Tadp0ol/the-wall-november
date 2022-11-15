

class ViewController{
    #req;
    #res;

    constructor(req, res){
        this.#req = req;
        this.#res = res;
    }

    loginRegister = async () => {
        if(!this.#req.session?.user_data){
            this.#res.render("login_register.ejs");
        }
        else{
            this.#res.redirect("/dashboard");
        }
    }

    dashboard = async () => {
        if(this.#req.session?.user_data){
            this.#res.send("Dashboard")
        }
        else{
            this.#res.redirect("/");
        }
    }
    
    logout  = async(req, res) => {
        this.#req.session.destroy();
        this.#res.redirect("/");
    }
}

module.exports = ViewController;