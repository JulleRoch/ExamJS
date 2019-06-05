class User{
    constructor(login, password){
        this.id = null;
        this.login = login;
        this.password = password;
    }
}

class Defi{
    constructor(nom, description, idUser, date = null, masked = false, nbLike=0,nbComment=0, nbRealize = 0){
            this.id = null;
            this.nom = nom;
            this.description = description;
            this.date = date;
            if(date === null)
                this.date = new Date();
            this.idUser = idUser;
            this.nbLike = nbLike;
            this.masked = masked;
            this.nbRealize = nbRealize;
            this.nbComment = nbComment;
    }
}

class Like{
    constructor(idUser, idDefi){
            this.idDefi = idDefi;
            this.idUser = idUser;
    }
}
class Suivi{
    constructor(idUser, idDefi){
            this.idDefi = idDefi;
            this.idUser = idUser;
    }
}

class Post{
    constructor(idDefi, idUser, description, date = null, isRealize=false, typePJ="", pj="", approved=false){
        this.id = null;
        this.idDefi = idDefi;
        this.idUser = idUser;
        this.description = description;
        this.date = date;
        if(date === null)
            this.date = new Date();
        this.isRealize = isRealize;
        this.typePJ = typePJ;
        this.pj = pj;   
        this.approved = approved;
    }
}