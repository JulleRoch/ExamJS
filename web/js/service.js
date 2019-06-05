class Service{
    constructor(service){
        this.serviceUrl = "http://localhost:3333/" + service;
    }
    update(id, objet, done) {
        ajax("PUT", this.serviceUrl + "/" + id, done, objet)
    }
    delete(id, done) {
        ajax("DELETE", this.serviceUrl + "/" + id, done)
    }
    insert(objet, done) {
        ajax("POST", this.serviceUrl, done, objet)
    }
    get(id, done) {
        ajax("GET", this.serviceUrl + "/" + id, done)
    }
    getAll(done) {
        ajax("GET", this.serviceUrl, done)
    }
}

class UserService extends Service{
    constructor(){
        super("user");
    }

    get(done){
        ajax("GET", this.serviceUrl, done);
    }

    getById(id, done) {
        ajax("GET", this.serviceUrl + "/" + id, done)
    }

    getByLogin(login, done) {
        ajax("GET", this.serviceUrl + "/login/" + login, done)
    }

    getAll(done){
        ajax("GET", this.serviceUrl + "/all", done);
    }
}

class DefiService extends Service{
    constructor(){
        super("defi");
    }

    getList(type, order, id /*user ou defi suivant le type*/, done){
        let url = this.serviceUrl;
        if(type==="all"){
            url += "/order/" + order;
        }
        if(type==="byUser"){
            url += "/user/" + id;
        }
        if(type==="realize"){
            url += "/realize/" + id;
        }
        if(type==="byId"){
            url += "/" + id;
        }
        ajax("GET", url, done);
    }
    
    updateLike(objet, done){
        ajax("PUT", this.serviceUrl, done, objet)
    }

    updatePost(type, id, objet, done){
        let url = this.serviceUrl + "/"+ type  + "/" + id;
        ajax("PUT", url, done, objet);
    }
}

class LikeService extends Service{
    constructor(){
        super("like");
    }
    update(objet, done) {
        ajax("PUT", this.serviceUrl, done, objet)
    }

    getLike(idDefi, done) {
        ajax("GET", this.serviceUrl + "/" + idDefi, done)
    }
}

class SuiviService extends Service{
    constructor(){
        super("suivi");
    }
    delete(idDefi, done) {
        ajax("DELETE", this.serviceUrl + "/" + idDefi, done)
    }
    getByUser(idUser, done) {
        ajax("GET", this.serviceUrl + "/" + idUser, done)
    }
}
class PostService extends Service{
    constructor(){
        super("post");
    }

    getCommentByDefi(id, done){
        ajax("GET", this.serviceUrl + "/comment/" + id, done)
    }
    
    getRealizeByDefi(id, done){
        ajax("GET", this.serviceUrl + "/realize/" + id, done)
    }
}
