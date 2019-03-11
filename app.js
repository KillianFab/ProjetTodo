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
            axios({
                method: 'post',
                url: 'http://localhost:3000/api/todos/post',
                params: {
                    items: value,
                    iduser: 10
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




new Vue({
    el: '#app',
    component: Todo,
    data: {
        userId: 10,
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