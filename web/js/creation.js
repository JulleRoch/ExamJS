class DefiControlleur {
    constructor() {
        this.api = new DefiService();
        this.apiUser = new UserService();
    }

    addDefi(){
        this.apiUser.get((status, user) => {
            if (status === 200) {
                const d = new Defi($('#nom').value, $('#description').value,user.id);
                this.api.insert(d, (status)=>{
                    if(status === 200){
                        $('#nom').value = "";
                        $('#description').value = "";
                        window.location.replace("/listeDefi?type=byUser&idUser="+ user.id)
                    }
                });
                return false
            }
            return false
        });
      
    }
}
var controleur = new DefiControlleur();