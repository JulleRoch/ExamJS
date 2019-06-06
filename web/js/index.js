class IndexControlleur {
    constructor() {
        this.api = new UserService();

        this.api.get((status, user)=>{
            $('#nav-profil-menu').href = "/profil?id=" + user.id;
        })
    }
}
var controleur = new IndexControlleur();