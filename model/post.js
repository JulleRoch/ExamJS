module.exports = class Post{
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