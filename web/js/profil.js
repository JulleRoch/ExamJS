class ProfilControlleur {
    constructor() {
        this.api = new UserService();
        this.id = getParameterByName('id');
        this.displayProfil();
    }

    displayProfil(){
        this.api.get((status, user) => {
            $('#nav-profil-menu').href = "/profil?id=" + user.id;
            if( parseInt(this.id)=== user.id){
                $('#login').innerHTML = user.login;
                $('#nav-suivi').hidden = false;
                $('#nav-suivi').href = "/listeDefi?type=suivi";
                $('#edit').innerHTML = `<img src="/edit.png" width="25" height="25" class="img-responsive"
                alt="" onclick="return controleur.edit()">`
            }
            else {
                $('#nav-profil-menu').classList.remove("active");
                this.api.getById(this.id, (status, u)=>{
                    $('#login').innerHTML= u.login;
                })
            }
            $('#nav-creer').href="/listeDefi?type=byUser&idUser=" + this.id;
            $('#nav-realiser').href="/listeDefi?type=realize&idUser=" + this.id;
        })
    }

    edit(){
        this.api.get((status, user)=>{
            if(status !==200) return false;
            $('#update-user-login').value = user.login;
            jQuery('#dialog-update-user').modal('show');
        })
        return false;
    }
    
    updateUser(){
        this.api.compare($('#old-user-password').value, (status, isSame)=>{
            if(status !=200) return false;
            if(isSame){
                this.api.update(this.id, new User($('#update-user-login').value, $('#update-user-password').value), (status)=>{
                    if(status !=200) return false;
                    window.location.replace("/logout");
                })
            }
            else{
                alert("Mot de passe incorrect");
            }
        })
        return false;
    }
}
var controleur = new ProfilControlleur();