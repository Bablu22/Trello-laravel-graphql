import { createRouter, createWebHistory } from "vue-router"
import Board from "../Pages/Board.vue"
import Login from "../Pages/Login.vue"
import NotFound from "../Pages/NotFound.vue"
import Register from "../Pages/Register.vue"
import Home from "../Pages/Home.vue"
import store from "../store/index.js"

const routes = [
    { path: '/', name: "home", component: Home },
    { path: '/board/:id', name: "board", component: Board },
    { path: '/login', name: "login", component: Login },
    { path: '/register', name: "register", component: Register },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters['isAuthenticated']

    if (to.name !== 'home' && to.name !== 'login' && to.name !== 'register' && !isAuthenticated) {
        // Redirect to the login page if not authenticated
        next({ name: 'login' })
    } else {
        next()
    }
})


export default router
