module.exports = class Defi{
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