class DetailDefiControlleur {
    constructor() {
        this.api = new DefiService();
        this.apiUser = new UserService();
        this.apiLike = new LikeService();
        this.apiSuivi = new SuiviService();
        this.apiPost = new PostService();
        this.url = "http://localhost:3333";
        this.divDefi = $('#detail-defi');
        this.divComment = $('#commentaires');
        this.divRealize = $('#participants');
        this.id = getParameterByName('id');
        $('#like-img').addEventListener("click", () => {
            this.onLike(this.id);
        })
        this.displayDefi();
    }

    displayDefi() {
        this.api.getList("byId", null, this.id, (status, defis) => {
            if (status !== 200) {
                return false;
            }
            const defi = defis[0];
            const datePost = new Date(defi.date).toLocaleDateString('en-GB')
            $('#nom-challenge').innerHTML = defi.nom;
            $('#date-challenge').innerHTML = " " + datePost;
            $('#user-challenge').innerHTML = defi.loginUser;
            $('#description-challenge').innerHTML = defi.description;
            $('#comment-challenge').innerHTML = defi.nbComment;
            $('#realize-challenge').innerHTML = defi.nbRealize;
            $('#like-challenge').innerHTML = defi.nbLike;
            if (defi.like) {
                $('#like-img').src = this.url + "/pouce_like.png"
            }
            else{
                $('#like-img').src = this.url + "/pouce.png"
            }

            this.apiPost.getRealizeByDefi(this.id, (status, realizes) => {
                if (status !== 200) {
                    return false;
                }
                let div = `<h5 class="card-title">Participants</h5>`;
                for (let realize of realizes) {
                    const datePostR = new Date(realize.date).toLocaleDateString('en-GB')
                    let pj = "";
                    if (realize.typePJ === "video") {
                        pj = ` <div class="embed-responsive embed-responsive-21by9">
                        <video controls class="embed-responsive-item" src="${realize.pj}"></video>
                        </div>`
                    }
                    if (realize.typePJ === "img") {
                        pj = ` <div><img class="card-img img-fluid" style="max-width: 35%" src="${realize.pj}"/></div>`
                    }
                    div += `<div class="card card-inner">
                    <div class="container row">
                        <div class="col-6 col-sm-8">
                            <h6>${realize.loginUser}</h6>
                        </div>
                        <div class="col-6 col-sm-4">
                            <h6 class="gris"><span class="gris">Posté le</span> ${datePostR}</h6>
                        </div>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${realize.description} </p>
                       ${pj}
                    </div>
                </div>`
                }
                this.divRealize.innerHTML = div;
            })

            this.apiPost.getCommentByDefi(this.id, (status, comments) => {
                if (status !== 200) {
                    return false;
                }
                let div = `<h5 class="card-title">Commentaires</h5>`;
                for (let comment of comments) {
                    const datePostC = new Date(comment.date).toLocaleDateString('en-GB')
                    div += `<div class="card card-inner">
                    <div class="container row">
                        <div class="col-6 col-sm-8">
                            <h6>${comment.loginUser}</h6>
                        </div>
                        <div class="col-6 col-sm-4">
                            <h6 class="gris"><span class="gris">Posté le</span> ${datePostC}</h6>
                        </div>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${comment.description} </p>
                    </div>
                </div>`
                }
                this.divComment.innerHTML = div;
            })
        })
    }

    onLike(idDefi) {
        const like = new Like(null, idDefi);
        this.apiLike.insert(like, (status) => {
            if (status === 200) {
                this.api.updateLike(like, (status) => {
                    if (status === 200) {
                        this.displayDefi();
                    }
                })
            }
        });
        return false;
    }

    addComment(){
        this.apiUser.get((status, user)=>{
            this.apiPost.insert(new Post(this.id, user.id,$('#description-comment').value), (status)=>{
                if(status !== 200){
                    return false;
                }
                this.api.updatePost("comment", this.id, new Object(),(status)=>{
                    if(status !==200){
                        return false;
                    }
                    $('#description-comment').value = "";
                    jQuery('#dialog-add-comment').modal('hide');
                    this.displayDefi();
                })
            })
        })
        return false;
    }

    addRealize(){
        /*
        this.apiUser.get((status, user)=>{
            this.apiPost.insert(new Post(this.id, user.id,$('#description-comment').value,true), (status)=>{
                if(status !== 200){
                    return false;
                }
                this.api.updatePost("realize", this.id, new Object(),(status)=>{
                    if(status !==200){
                        return false;
                    }
                    $('#description-comment').value = "";
                    jQuery('#dialog-add-comment').modal('hide');
                    this.displayDefi();
                })
            })
        })
        return false;*/
    }
}
var controleur = new DetailDefiControlleur();