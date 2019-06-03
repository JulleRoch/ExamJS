class User{
    constructor(login, password){
        this.id = null;
        this.login = login;
        this.password = password;
    }
}

class Defi{
    constructor(nom, description, idUser, date = null, masked = false, nbLike=0,nbComment=0, nbFinish = 0){
            this.id = null;
            this.nom = nom;
            this.description = description;
            this.date = date;
            if(date === null)
                this.date = new Date();
            this.idUser = idUser;
            this.nbLike = nbLike;
            this.masked = masked;
            this.nbFinish = nbFinish;
            this.nbComment = nbComment;
    }
}

class Like{
    constructor(idUser, idDefi){
            this.idDefi = idDefi;
            this.idUser = idUser;
    }
}