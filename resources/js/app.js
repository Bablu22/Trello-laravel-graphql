import { createApp, provide } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "./apollo-client";
import store from "./store";
import router from './router'


const app = createApp({
    beforeCreate() {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        store.dispatch("setLoggedIn", isLoggedIn);
    },
    setup() {
        provide(DefaultApolloClient, apolloClient);
    },
});

store.watch(
    (state) => state.isLoggedIn,
    (isLoggedIn) => {
        if (isLoggedIn) {
            store.dispatch("fetchCurrentUser");
        }
    }
);

app.use(router);
app.use(store);
app.mount("#app");
