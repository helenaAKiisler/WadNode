import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignUp from "../views/SignUp.vue";
import LogIn from "../views/LogIn.vue";
import auth from "../auth";
import AddPost from "../views/AddPost.vue";
import APost from "../views/APost.vue";

const routes = [{
    path: "/",
    name: "home",
    component: HomeView,
    beforeEnter: async (to, from, next) => {
        let authResult = await auth.authenticated();
        if (!authResult) {
            next('/login')
        } else {
            next();
        }
    }
},
{
    path: "/signup",
    name: "SignUp",
    component: SignUp,
},
{
    path: "/add-post",
    name: "AddPost",
    component: AddPost
},
{
    path: "/posts/:id",
    name: "APost",
    component: APost
},
{
    path: "/login",
    name: "LogIn",
    component: LogIn,
},
{
    path: "/contactus",
    name: "contactus",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
        import( /* webpackChunkName: "about" */ "../views/ContactUs.vue"),
},
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;