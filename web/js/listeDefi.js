class ListeDefiControlleur {
    constructor() {
        this.api = new DefiService();
        this.apiUser = new UserService();
        this.apiLike = new LikeService();
        this.apiSuivi = new SuiviService();
        this.listeDefi = $('#listeDefi');
        this.titre = $('#titre');
        this.order = "date";
        this.gestionTypeList();
        this.displayAllDefis(this.order);
    }

    gestionTypeList() {
        this.typeList = getParameterByName("type");
        this.idUser = getParameterByName("idUser");

        if (this.typeList === null) {
            this.typeList = "all";
            this.titre.innerHTML = "Tous les défis";
            $('#navbar').innerHTML += `
            <span class="navbar-text">
                    Trié par
            </span>
            <a class="nav-link  mr-sm-2" href="#" onclick="return controleur.changeOrder(this);"
                    id="nbLike">Popularité</a>
            <span class="navbar-text">
                    |
            </span>
            <a class="nav-link  mr-sm-2" href="#" onclick="return controleur.changeOrder(this);" id="date">Date de
                    publication</a>`;
        }
        else {
            this.apiUser.get((status, u) => {
                if (this.typeList === "suivi") {
                    this.idUser = u.id;
                }
                this.apiUser.getById(this.idUser, (status, user) => {
                    let debTitre = "";
                    if (this.typeList === "byUser") {
                        debTitre = "Les défis proposées par";
                    }
                    if (this.typeList === "realize") {
                        debTitre = "Les défis réalisés par";
                    }
                    let t = debTitre + " " + user.login;
                    if (this.typeList === "suivi") {
                        t = "Mes suivis";
                    }
                    if (u.id === parseInt(this.idUser)) {
                        if (this.typeList === "byUser") {
                            t = "Vos défis"
                        }
                        if (this.typeList === "realize") {
                            t = "Vos défis réalisés"
                        }
                    }
                    this.titre.innerHTML = t;
                })
            })
        }
    }

    displayAllDefis(order) {
        this.order = order;
        this.apiUser.get((s, u) => {
            if (this.typeList === "suivi") {
                this.apiSuivi.getByUser(u.id, (status, defis) => {
                    if (status !== 200) {
                        return
                    }
                    let div = "";
                    for (let defi of defis) {
                        if (!defi.masked) {
                            let likeSrc = "/pouce.png";
                            if (defi.like) {
                                likeSrc = "/pouce_like.png";
                            }
                            const datePost = new Date(defi.date).toLocaleDateString('en-GB')
                            div += `<div class="card" color="gray"><div class="card-header container en-tete row">
                            <div class="col-12 col-sm-8">
                                    <h4><a href="/detail?id=${defi.id}" style="color:black">${defi.nom}</a></h4>
                            </div>
                            <div class="col-6 col-sm-2">
                                    <h6 class="gris"><span class="gris">Posté le</span> ${datePost}</h6>
                            </div>
                            <div class="col-6 col-sm-2">
                                    <h6 class="gris"><span class="gris">par </span>${defi.loginUser}</h6>
                            </div>
                            </div>
                        <div class="card-body">
                          <p class="card-text">${defi.description}</p>
                        </div>
                        <div class="card-footer container row pied-page">
                                <div class="col-4 col-sm-4">
                                        <h6> <img src="/comment.png" width="20" height="20" class="img-responsive" alt="">${defi.nbComment}</h6>
                                </div>
                                <div class="col-4 col-sm-4">
                                        <h6><img src="/ok.png" width="20" height="20" class="img-responsive" alt="">${defi.nbRealize}</h6>
                                </div>
                                <div class="col-4 col-sm-4">
                                   <h6><img id="like" src="${likeSrc}" width="20" height="20" class="img-responsive" alt="" onclick="return controleur.onLike(this, ${defi.id})">${defi.nbLike}</h6>
                                </div>
                        </div></div>`
                        }
                    }
                    this.listeDefi.innerHTML = div;
                })
            }
            else {
                this.api.getList(this.typeList, this.order, this.idUser, (status, defis) => {
                    if (status !== 200) {
                        return
                    }
                    let div = "";
                    for (let defi of defis) {
                        let mask;
                        if (!defi.masked || (mask = (u.id === defi.idUser && this.typeList === "byUser"))) {
                            let tMask = "";
                            if (mask) tMask = `<span class="gris">Masqué</span>`;
                            let likeSrc = "/pouce.png";
                            if (defi.like) {
                                likeSrc = "/pouce_like.png";
                            }
                            const datePost = new Date(defi.date).toLocaleDateString('en-GB')
                            div += `<div class="card" color="gray"><div class="card-header container en-tete row">
                            <div class="col-12 col-sm-8">
                                    <h4><a href="/detail?id=${defi.id}" style="color:black">${defi.nom}</a>${tMask}</h4>
                            </div>
                            <div class="col-6 col-sm-2">
                                    <h6 class="gris"><span class="gris">Posté le</span> ${datePost}</h6>
                            </div>
                            <div class="col-6 col-sm-2">
                                    <h6 class="gris"><span class="gris">par </span>${defi.loginUser}</h6>
                            </div>
                            </div>
                        <div class="card-body">
                          <p class="card-text">${defi.description}</p>
                        </div>
                        <div class="card-footer container row pied-page">
                                <div class="col-4 col-sm-4">
                                        <h6> <img src="/comment.png" width="20" height="20" class="img-responsive" alt="">${defi.nbComment}</h6>
                                </div>
                                <div class="col-4 col-sm-4">
                                        <h6><img src="/ok.png" width="20" height="20" class="img-responsive" alt="">${defi.nbRealize}</h6>
                                </div>
                                <div class="col-4 col-sm-4">
                                   <h6><img id="like" src="${likeSrc}" width="20" height="20" class="img-responsive" alt="" onclick="return controleur.onLike(${defi.id})">${defi.nbLike}</h6>
                                </div>
                        </div></div>`
                        }
                    }
                    this.listeDefi.innerHTML = div;
                })
            }
        })
    }


    changeOrder(e) {
        this.displayAllDefis(e.id);
    }

    onLike(idDefi) {
        const like = new Like(null, idDefi);
        this.apiLike.insert(like, (status) => {
            if (status === 200) {
                this.api.updateLike(like, (status) => {
                    if (status === 200) {
                        this.displayAllDefis(this.order);
                    }
                })
            }
        });
        return false;
    }
}

var controleur = new ListeDefiControlleur();