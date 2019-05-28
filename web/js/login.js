class UserControlleur {
    constructor() {
        this.api = new UserService();
        this.dialogAddUser = jQuery('#dialog-add-user');
    }
    showSignUp(){
        this.dialogAddUser.modal('show');
    }
    addUser(){
        this.api.insert(new User($('#add-user-login').value, $('#add-user-password').value), (status)=>{
            if(status === 200){
                this.dialogAddUser.modal('hide');
                $('#add-user-login').value = "";
                $('#add-user-password').value = "";
                $('#detail').innerHTML = `<div class="alert alert-success">
                <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                <strong>Super!</strong> L'inscription a bien été éffectuée.</div>`
            }
            else{
                alert(status);
            }
        });
        return false
    }
}
var controleur = new UserControlleur();