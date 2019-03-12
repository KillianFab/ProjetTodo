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
            }
            if(!this.$root.userId){
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
            userRegister: {
                0: {
                    id: 1,
                    username: 'demo1',
                    password: 'demo1',
                    rank: 0,
                },
                1: {
                    id: 2,
                    username: 'demo2',
                    password: 'demo2',
                    rank: 0,
                },
                2: {
                    id: 3,
                    username : 'admin',
                    password : 'admin',
                    rank : 10
                }
            },
            input: {
                username : '',
                password : '',
            }
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
                this.userRegister.forEach((el, index) => {
                    if (el.username === 'demo1'){
                        let user = index;
                        console.log(user);     
                    } 
                })
            }else{
                console.log('Un des deux champ sont vides.')
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
        display: function(value){
            if(value){
                this.userLoggin = true;
            }else{
                this.userLoggin = false;
            }
        }
    }
})