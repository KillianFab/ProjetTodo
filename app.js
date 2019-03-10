// API POUR TODO
// GET LIST BY USER ID
// http://localhost:3000/api/todos/11

// ADD ITEM IN TODO
// http://localhost:3000/api/todos/post





// Todo liste
let Todo = Vue.component('Todo', {
    template:  `
    <div>
            <li v-for="item in items">{{ item.message }} <button @click="removeTodo(item)">Remove Item</button></li>
            <div><input placeholder="edit me" v-model="newItems" v-on:keyup.enter="addTodo">
            <button @click="addTodo">Save item</button></div>

    </div>`,
    data: function () {
        return {
            items: [
                {message: 'hola'},
                {message: 'salut2'}
            ],
            newItems: '',
        }
    },
    methods: {
        addTodo: function () {
            var value = this.newItems && this.newItems.trim()
            if (!value) {
                return
            }
            this.items.push({
                message: value,
            })
            this.newItems = ''
        },
        removeTodo: function (item){
            this.items.splice(this.items.indexOf(item), 1)
            
        },

    },

})

new Vue({
    el: '#app',
    component: Todo,
    data: {
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