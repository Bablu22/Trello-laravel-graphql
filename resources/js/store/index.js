import Me from "../graphql/Me.gql";
import { apolloClient } from "../apollo-client";
import { createStore } from "vuex";

export default createStore({
    state() {
        return {
            isLoggedIn: false,
            user: {
                id: null,
                name: null,
                email: null,
            },
            loading: false, // Add loading state
        };
    },
    mutations: {
        setLoggedIn(state, payload) {
            state.isLoggedIn = Boolean(payload);
        },
        setUser(state, payload) {
            state.user = payload;
        },
        setLoading(state, payload) { // Mutation to set loading state
            state.loading = Boolean(payload);
        },
    },
    actions: {
        setLoggedIn({ commit }, payload) {
            const isLoggedIn = Boolean(payload);
            localStorage.setItem("isLoggedIn", isLoggedIn);
            commit("setLoggedIn", isLoggedIn);
        },

        async logout({ commit, dispatch }) {
            commit("setUser", { id: null, name: null, email: null });
            dispatch("setLoggedIn", false);

        },

        async fetchCurrentUser({ commit, dispatch }) {
            try {
                commit("setLoading", true); // Set loading state to true
                const { data } = await apolloClient.query({
                    query: Me,
                    fetchPolicy: "no-cache",
                });
                const currentUser = data.me;

                if (currentUser) {
                    commit("setUser", currentUser);
                    dispatch("setLoggedIn", true);
                }

            } catch (error) {
                dispatch("logout");
            } finally {
                commit("setLoading", false); // Set loading state to false
            }
        },
    },
    getters: {
        isAuthenticated(state) {
            return state.isLoggedIn;
        },
    },
});
