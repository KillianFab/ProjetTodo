// API POUR TODO
// GET LIST BY USER ID
// http://localhost:3000/api/todos/11

// ADD ITEM IN TODO
// http://localhost:3000/api/todos/post


let store = {
    debug: true,
    state: {
        items: []
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
        <ul>
            <li v-for="item in items">{{ item.message }} - > <button @click="removeTodo(item)">Remove Item</button></li>
        </ul>
            <div><input placeholder="Insert Todo" v-model="newItems" v-on:keyup.enter="addTodo">
            <button @click="addTodo">Save item</button></div>
           
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
                url: 'http://localhost:3000/api/todos/post',
                    params: {
                    items: value,
                    iduser: this.$root.userId
                }
            }).then(response => (
                store.state.items.push({
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
        axios.get('http://localhost:3000/api/todos/user/'+this.$root.userId, { crossdomain: true })
            .then(response => (
                Object.keys(response.data).forEach(key => {
                    let val = response.data[key];
                    store.state.items.push({
                        message: val.items,
                        id: val._id,
                    })
                })
            ))
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
    <div>
        <input type="text" name="username" v-model="input.username" id="username" placeholder="Username">
        <input type="password" name="password" v-model="input.password" id="password" v-on:keyup.enter="login()" placeholder="Password"> 
        <button type="button" v-on:click="login()">Connexion</button>
        
    </div>
    `,
    methods: {
        login: function (){
            if(this.input.username != "" && this.input.password != "") {

                axios({
                    method: 'get',
                    url: 'http://localhost:3000/api/users/check',
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
            items: store.state.items,
        }  
    },
    template: `
    <div>
        <ul>
            <li v-for="users in listeUser">Username : {{ users.username }} <button @click="editTodoUser(users.id)">Modifier la todo de l'user</button> </li>
        </ul>
    </div>
    `,
    mounted () {
        axios.get('http://localhost:3000/api/users/getall')
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
        editTodoUser: function(val){
            console.log(val);
            // Vider le store.state.items 
            // Mettre à jour le store.state.items
            // MEttre à jour le store.state.admin.editId
            // remettre à jour 
        },
    }
})


new Vue({
    el: '#app',
    
    component: {Todo, User, Admin},
    data: {
        userId: null,
        userLoggin: false,
        userRank: 0,
        oldUserId: '',
        show: false,
    },
    methods:{
        logout: function(){
            this.$root.userLoggin = false
            this.$root.userRank = 0
            this.$root.userId = null
        }
    }
})