
class DetailDefiControlleur {
    constructor() {
        this.api = new DefiService();
        this.apiUser = new UserService();
        this.apiLike = new LikeService();
        this.apiSuivi = new SuiviService();
        this.apiPost = new PostService();
        this.apiUpload = new UploadService();
        this.url = "http://localhost:3333";
        this.divDefi = $('#detail-defi');
        this.divComment = $('#commentaires');
        this.divRealize = $('#participants');
        this.id = getParameterByName('id');
        $('#id-defi').value = this.id;
        $('#like-img').addEventListener("click", () => {
            this.onLike(this.id);
        })
        this.apiSuivi.getByDefi(this.id, (status, suivi) => {
            if (status !== 200) {
                return false;
            }
            if (suivi == null) {
                $('#deleteList').hidden = true;
                $('#addList').hidden = false;
            }
            else {
                $('#deleteList').hidden = false;
                $('#addList').hidden = true;
            }
        })
        this.apiUser.get((status, user) => {
            $('#nav-profil-menu').href = "/profil?id=" + user.id;
        })
        this.displayDefi();
    }

    displayDefi() {
        this.apiUser.get((status, user) => {
            this.api.getList("byId", null, this.id, (status, defis) => {
                if (status !== 200) {
                    return false;
                }
                const defi = defis[0];
                if (defi.nbComment === 0 && defi.nbLike === 0 && defi.nbRealize === 0 && defi.idUser === user.id) {
                    $('#deleteDefi').hidden = false;
                }
                else {
                    $('#deleteDefi').hidden = true;
                }
                if (defi.nbComment === 0 && defi.nbRealize === 0 && defi.idUser === user.id) {
                    if (defi.masked) {
                        $('#maskOnDefi').hidden = false;
                        $('#maskOffDefi').hidden = true;
                    }
                    else {
                        $('#maskOnDefi').hidden = true;
                        $('#maskOffDefi').hidden = false;
                    }
                }
                const datePost = new Date(defi.date).toLocaleDateString('en-GB')
                $('#nom-challenge').innerHTML = defi.nom;
                $('#date-challenge').innerHTML = " " + datePost;
                $('#user-challenge').innerHTML = `<a href="/profil?id=${defi.idUser}" style="color:black">${defi.loginUser}</a>`;
                $('#description-challenge').innerHTML = defi.description;
                $('#comment-challenge').innerHTML = defi.nbComment;
                $('#realize-challenge').innerHTML = defi.nbRealize;
                $('#like-challenge').innerHTML = defi.nbLike;
                if (defi.like) {
                    $('#like-img').src = this.url + "/pouce_like.png"
                }
                else {
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
                        if (realize.typePJ === "image") {
                            pj = ` <div><img class="card-img img-fluid" style="max-width: 35%" src="/media/${realize.pj}"/></div>`
                        }
                        let edit = "";
                        if (realize.idUser === user.id && !realize.approved) {
                            edit = `<img src="/edit.png" width="25" height="25" class="img-responsive"
                            alt="" onclick="return controleur.editRealize(${realize.id})">`
                        }
                        let approved = "";
                        if (realize.approved) {
                            approved = `<img src="/approved.png" width="25" height="20" class="img-responsive" alt="">`
                        }
                        if (defi.idUser === user.id) {
                            let srcApproved = "";
                            if (realize.approved) {
                                srcApproved = "/approved.png";
                            }
                            else {
                                srcApproved = "/toApproved.png";
                            }
                            approved = `<img src="${srcApproved}" width="25" height="20" class="img-responsive" alt=""
                                onclick="return controleur.onApproved(${realize.id})">`
                        }
                        div += `<div class="card card-inner">
                        <div class="container row">
                        <div class="col-6 col-sm-7">
                        <h6><span>${approved}</span>${realize.loginUser}</h6>
                         </div>
                            <div class="col-5 col-sm-4">
                                <h6 class="gris"><span class="gris">Posté le</span> ${datePostR}</h6>
                            </div>
                            <div class="col-1 col-sm-1">
                                 ${edit}
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
                        let edit = "";
                        if (comment.idUser === user.id) {
                            edit = `<img src="/edit.png" width="25" height="25" class="img-responsive"
                            alt="" onclick="return controleur.editComment(${comment.id})">`
                        }
                        const datePostC = new Date(comment.date).toLocaleDateString('en-GB')
                        div += `<div class="card card-inner">
                        <div class="container row">
                            <div class="col-6 col-sm-7">
                                <h6>${comment.loginUser}</h6>
                            </div>
                            <div class="col-5 col-sm-4">
                                <h6 class="gris"><span class="gris">Posté le</span> ${datePostC}</h6>
                            </div>
                            <div class="col-1 col-sm-1">
                                ${edit}
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
        })

    }

    onLike(idDefi) {
        const like = new Like(null, idDefi);
        this.apiLike.insert(like, (status) => {
            if (status === 200) {
                this.api.updateLike(like, (status) => {
                    this.displayDefi();
                })
            }
        });
        return false;
    }

    onApproved(idPost) {
        this.apiPost.get(idPost, (status, posts) => {
            if (status !== 200) {
                return false;
            }
            const post = posts[0];
            post.approved = !(post.approved);
            this.apiPost.update(idPost, post, (status) => {
                if (status !== 200) {
                    return false;
                }
                this.displayDefi();
            })
        })
        return false;
    }

    addComment() {
        this.apiUser.get((status, user) => {
            this.apiPost.insert(new Post(this.id, user.id, $('#description-comment').value), (status) => {
                if (status !== 200) {
                    return false;
                }
                this.api.updatePost("comment", this.id, new Object(), (status) => {
                    if (status !== 200) {
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

    actionComment() {
        const typeDialog = $('#typeDialog-comment').value;
        if (typeDialog === "add") {
            this.addComment();
        }
        if (typeDialog === "update") {
            this.updateComment();
        }
        return false;
    }

    editComment(id) {
        this.apiPost.get(id, (status, post) => {
            if (status !== 200) {
                return false;
            }
            $('#description-comment').value = post[0].description;
            $('#typeDialog-comment').value = "update";
            $('#id-comment').value = id;
            jQuery('#dialog-add-comment').modal('show');
        })
    }

    updateComment() {
        this.apiPost.get($('#id-comment').value, (status, posts) => {
            const post = posts[0];
            this.apiPost.update(post.id, new Post(post.idDefi, post.idUser, $('#description-comment').value, post.date), (status) => {
                if (status !== 200) {
                    return false;
                }
                $('#description-comment').value = "";
                $('#typeDialog-comment').value = "add";
                $('#id-comment').value = null;
                jQuery('#dialog-add-comment').modal('hide');
                this.displayDefi();
            })
        })
    }

    editRealize(id) {
        this.apiPost.get(id, (status, post) => {
            if (status !== 200) {
                return false;
            }
            $('#description-realize').value = post[0].description;
            $('#check-update').hidden = false;
            $('#preuve').disabled = true;
            $('#preuve').required = false;
            $('#check-update-preuve').addEventListener("change", () => {
                if ($('#check-update-preuve').checked) {
                    $('#preuve').disabled = false;
                    $('#preuve').required = true;
                }
                else {
                    $('#preuve').disabled = true;
                    $('#preuve').required = false;
                }
            })
            $('#id-realize').value = id;
            $('#id-defi').value = post.id;
            $('#form-add-realize').action = "/post/upload/update";
            jQuery('#dialog-add-realize').modal('show');
        })
    }

    addListSuivi() {
        this.apiUser.get((status, user) => {
            this.apiSuivi.insert(new Suivi(user.id, this.id), (status) => {
                if (status != 200) return false;
                $('#deleteList').hidden = false;
                $('#addList').hidden = true;
            })
        })
        return false;
    }

    deleteListSuivi() {
        this.apiUser.get((status, user) => {
            this.apiSuivi.delete(this.id, (status) => {
                if (status != 200) {
                    return false;
                }
                $('#deleteList').hidden = true;
                $('#addList').hidden = false;
            })
        })
    }

    deleteDefi() {
        this.api.delete(this.id, (status) => {
            if (status != 200) {
                return false;
            }
            this.apiUser.get((status, user) => {
                if (status != 200) return false;
                window.location.replace("/listeDefi?type=byUser&idUser=" + user.id)
            })
        })
    }

    maskDefi() {
        this.api.get(this.id, (status, defis) => {
            if (status != 200) {
                return false;
            }
            const defi = defis[0];
            defi.masked = !(defi.masked);
            this.api.update(this.id, defi, (status) => {
                if (status !== 200) {
                    return false;
                }
                if (defi.masked) {
                    $('#maskOnDefi').hidden = false;
                    $('#maskOffDefi').hidden = true;
                }
                else {
                    $('#maskOnDefi').hidden = true;
                    $('#maskOffDefi').hidden = false;
                }
            })
        })
    }
}
var controleur = new DetailDefiControlleur();