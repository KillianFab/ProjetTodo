// API POUR TODO
// GET LIST BY USER ID
// http://localhost:3000/api/todos/11

// ADD ITEM IN TODO
// http://localhost:3000/api/todos/post





// Todo liste
let Todo = Vue.component('Todo', {
    template:  `
    <div>
            <li v-for="item in items">{{ item.message }} - > <button @click="removeTodo(item)">Remove Item</button></li>
            <div><input placeholder="edit me" v-model="newItems" v-on:keyup.enter="addTodo">
            <button @click="addTodo">Save item</button></div>
            {{ items }}
           
    </div>`,
    data: function () {
        return {
            items: [],
            newItems: '',
        }
    },
    methods: {
        
        addTodo: function () {
            let value = this.newItems && this.newItems.trim()
            if (!value) {
                return
            }else{
                console.log('pensez à mettre un message');
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
        axios.get('http://localhost:3000/api/todos/user/'+this.$root.userId, { crossdomain: true })
            .then(response => (
                Object.keys(response.data).forEach(key => {
                    let val = response.data[key];
                    this.items.push({
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
        <input type="password" name="password" v-model="input.password" id="password" placeholder="Password"> 
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
                console.log(val[0].username);
                this.$root.userId = val[0]._id
                this.$root.userRank = val[0].rank
                this.$root.userLoggin = true;
            }else{
                console.log('mauvaise connexion');
            }
        }
    }

})



new Vue({
    el: '#app',
    component: {Todo, User},
    data: {
        userId: null,
        userLoggin: false,
        userRank: 0,
    },
    methods:{
        logout: function(){
            this.$root.userLoggin = false
            this.$root.userRank = 0
            this.$root.userId = null
        }
    }
})