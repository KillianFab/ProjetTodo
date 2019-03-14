// API POUR TODO
// GET LIST BY USER ID
// http://localhost:3000/api/todos/11

// ADD ITEM IN TODO
// http://localhost:3000/api/todos/post


let store = {
    debug: true,
    state: {
            items: [],
            admin: {
                editUserTodo: {
                    username: '',
                    id: '',
                    edit: false,
                }
            }
        }
    }

// Todo liste
let Todo = Vue.component('Todo', {
    store,
    data: function () {
        return {
            items: store.state.items,
            newItems: '',
        }

    },
    template:  `
    <div>
        <ul class="collection with-header">
            <li class="collection-header">
                <div class="row">
                    <h4 class="col s12">Todolist</h4>
                    <input id="todoitems" placeholder="Votre liste" class="col s11" v-model="newItems" v-on:keyup.enter="addTodo"><a class="btn-floating darken-4" @click="addTodo"><i class="material-icons">send</i></a>
                </div>
            </li>
            <li class="collection-item" v-for="item in items"><div>{{ item.message }}<a href="#!" class="secondary-content red-text" @click="removeTodo(item)"><i class="material-icons">delete</i></a></div></li>
        </ul>
    </div>`,
    methods: {
        addTodo: function () {
            let value = this.newItems && this.newItems.trim()
            if (!value) {
                return
            }

            if(!this.$root.userId){
                console.log('Err : UserAccount');
                return false;
            }
            
            axios({
                method: 'post',
                url: 'http://54.37.229.55:3000/api/todos/post',
                    params: {
                    items: value,
                    iduser: this.$root.userId
                }
            }).then(response => (
                this.items.push({
                    id: response.data,
                    message: value,
                })
            ))
            this.newItems = ''
        },
        removeTodo: function (item){
            axios({
                method: 'post',
                url: 'http://localhost:3000/api/todos/post/delete',
                params: {
                    id: item.id
                }
            })
            console.log(item.id);
            this.items.splice(this.items.indexOf(item), 1)
        },

    },
    mounted () {
        if(!this.$root.userId){
            return false;
        }
        axios.get('http://54.37.229.55:3000/api/todos/user/'+this.$root.userId, { crossdomain: true })
            .then(response => (
                Object.keys(response.data).forEach(key => {
                    let val = response.data[key];
                    store.state.items.push({
                        message: val.items,
                        id: val._id,
                    })
                })
            ))
    },
    watch: {
        items: function(val) {
            console.log(val);
        }
    }

})


let User = Vue.component('User', {
    data: function () {
        return {
            input: {
                username : '',
                password : '',
            },
            connexion: '',
        }  
    },
    template: `
    <div class='row'>
        <div class='input-field col s12'>
            <input class='validate' type='text' name='username' id='username' v-model="input.username" />
            <label for='username'>Username</label>
        </div>
        <div class='input-field col s12'>
            <input class='validate' type='password' name='password' id='password' v-model="input.password" v-on:keyup.enter="login()" />
            <label for='password'>Password</label>
        </div>
        
        <button type='button' name='btn_login' v-on:click="login()" class='col s12 btn btn-large waves-effect indigo'>Login</button>
        <span class="helper-text" data-error="wrong" data-success="right">demo1 - demo1 <br> admin - admin</span>
    </div>
    `,
    methods: {
        login: function (){
            if(this.input.username != "" && this.input.password != "") {

                axios({
                    method: 'get',
                    url: 'http://54.37.229.55:3000/api/users/check',
                        params: {
                        username: this.input.username,
                        password: this.input.password
                    }
                }).then(response => (
                    this.connexion = response.data
                ))
            }else{
                console.log('Un des deux champ sont vides.')
            }
        },
        
    },
    watch: {
        connexion: function (val) {
            if(val.length > 0){
                this.$root.userId = val[0]._id
                this.$root.userRank = val[0].rank
                this.$root.userLoggin = true
                this.$root.userName = val[0].username
            }else{
                console.log('mauvaise connexion');
            }
        }
    }

})
let Admin = Vue.component('Admin', {
    store,
    data: function () {
        return {
            listeUser: [],
            itemsEdit: [],
            usernameEdit: '',
            edit: false,
        }  
    },
    template: `
    <div>
        <ul class="collection with-header">
            <li class="collection-header">Liste des users</li>
            <li class="collection-item" v-for="users in listeUser">
                <div>
                    Username : {{ users.username }} 
                    <a href="#" class="secondary-content orange white-text" @click="editTodoUser(users.id, users.username)">
                        <i class="material-icons">edit</i>
                    </a>
                </div>
            </li>
        </ul>

        <ul class="collection with-header" v-if="edit">
            <li class="collection-header">Modification de la Todo de : {{ usernameEdit }} <a href="#" @click="closeEdit">Fermer</a></li>
            <li class="collection-item" v-for="item in itemsEdit"><div>{{ item.message}} <a href="#!" class="secondary-content red-text" @click="deleteItemsTodoUser(item)"><i class="material-icons">delete</i></a></div></li>
        </ul>
    </div>
    `,
    mounted () {
        axios.get('http://54.37.229.55:3000/api/users/getall')
            .then(response => (
                Object.keys(response.data).forEach(key => {
                    let val = response.data[key];
                    this.listeUser.push({
                        username: val.username,
                        id: val._id,
                    })
                })
            ))
    },


    methods: {
        closeEdit: function(){
            this.edit = false
        },
        editTodoUser: function(userid, username){
            this.edit = true
            this.itemsEdit = []
            store.state.admin.editUserTodo.id = userid
            if(!store.state.admin.editUserTodo.id){
                return false;
            }
            this.usernameEdit = username
            axios.get('http://54.37.229.55:3000/api/todos/user/'+store.state.admin.editUserTodo.id, { crossdomain: true })
                .then(response => (
                    Object.keys(response.data).forEach(key => {
                        let val = response.data[key];
                        
                        this.itemsEdit.push({
                            message: val.items,
                            id: val._id,
                        })
                    })
                ))
            // Vider le store.state.items 
            // Mettre à jour le store.state.items
            // MEttre à jour le store.state.admin.editId
            // remettre à jour 
        },
        saveEditTodoUser: function(){
        },
        deleteItemsTodoUser: function(item){
            axios({
                method: 'post',
                url: 'http://54.37.229.55:3000/api/todos/post/delete',
                params: {
                    id: item.id
                }
            })
            this.itemsEdit.splice(this.itemsEdit.indexOf(item), 1)
        }
    }
})


new Vue({
    el: '#app',
    
    component: {Todo, User, Admin},
    data: {
        userName: '',
        userId: null,
        userLoggin: false,
        userRank: 0,
        oldUserId: '',
        show: false,
        testAdmin: 'testAdmin',
        errorClass: 'errorClass'
    },
    methods:{
        logout: function(){
            store.state.items = []
            this.$root.userLoggin = false
            this.$root.userRank = 0
            this.$root.userId = null
        },
        getAdmin: function(){
            if(this.$root.userRank == 10)
                return true
        }
    },
    mounted (){
       
    }
})