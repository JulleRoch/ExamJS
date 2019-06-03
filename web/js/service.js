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

    getByLogin(login, done) {
        ajax("GET", this.serviceUrl + "/" + login, done)
    }

    getAll(done){
        ajax("GET", this.serviceUrl + "/all", done);
    }
}

class DefiService extends Service{
    constructor(){
        super("defi");
    }

    getAllOrder(order, done){
        ajax("GET", this.serviceUrl + "/order/" + order, done);
    }
    
    updateLike(objet, done){
        ajax("PUT", this.serviceUrl, done, objet)
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
