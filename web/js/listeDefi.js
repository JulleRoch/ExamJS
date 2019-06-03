class ListeDefiControlleur {
    constructor() {
        this.api = new DefiService();
        this.apiUser = new UserService();
        this.apiLike = new LikeService();
        this.listeDefi = $('#listeDefi');
        this.url = "http://localhost:3333";
        this.order = "date";
        this.displayAllDefis(this.order);
    }

    displayAllDefis(order) {
        this.order = order;
        this.api.getAllOrder(this.order, (status, defis) => {
            if (status !== 200) {
                return
            }
            let div = "";
            for (let defi of defis) {
                if (defi.masked) {
                    let likeSrc = "/pouce.png";
                    if (defi.like) {
                        likeSrc = "/pouce_like.png";
                    }
                    const datePost = new Date(defi.date).toLocaleDateString('en-GB')
                    div += `<div class="card"><div class="card-header container en-tete row">
                    <div class="col-12 col-sm-8">
                            <h4>${defi.nom}</h4>
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
                                <h6><img src="/ok.png" width="20" height="20" class="img-responsive" alt="">${defi.nbFinish}</h6>
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
    

    changeOrder(e) {
        this.displayAllDefis(e.id);
    }

    onLike(e, idDefi) {
        const like = new Like(null, idDefi);
        this.apiLike.insert(like, (status) => {
            if (status === 200) {
                this.api.updateLike(like, (status) => {
                    if (status === 200) {
                        this.displayAllDefis(this.order);
                        const src = e.src;
                        if (src === (this.url + "/pouce.png")) {
                            e.src = this.url + "/pouce_like.png"
                        }
                        else {
                            e.src = this.url + "/pouce.png";
                        }
                    }
                })
            }
        });
        return false;
    }
}

var controleur = new ListeDefiControlleur();