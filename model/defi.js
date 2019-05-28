module.exports = class Defi{
    constructor(nom, description, idUser, date = null, masked = false, nbLike=0,nbComment=0, nbFinish = 0){
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