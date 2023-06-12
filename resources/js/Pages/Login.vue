<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
    >
        <div class="bg-white shadow-lg rounded-lg p-12 w-1/3 mx-auto">
            <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">
                Login
            </h2>
            <p
                v-if="error"
                class="my-2 text-red-500 text-bold text-center bg-red-200 p-2"
            >
                {{ error }}
            </p>
            <form @submit.prevent="login">
                <div class="mb-6">
                    <label
                        for="email"
                        class="block text-gray-700 text-sm font-bold mb-2"
                        >Email:</label
                    >
                    <input
                        type="email"
                        id="email"
                        v-model="email"
                        class="w-full border border-gray-300 rounded p-2"
                        placeholder="Enter your email"
                    />
                </div>
                <div class="mb-6">
                    <label
                        for="password"
                        class="block text-gray-700 text-sm font-bold mb-2"
                        >Password:</label
                    >
                    <input
                        type="password"
                        id="password"
                        v-model="password"
                        class="w-full border border-gray-300 rounded p-2"
                        placeholder="Enter your password"
                    />
                </div>
                <button
                    class="flex items-center justify-center bg-teal-900 text-white rounded-md shadow relative w-full py-2 mx-2"
                    :disabled="loading"
                >
                    <div v-if="loading" class="flex items-center">
                        <svg
                            class="animate-spin h-5 w-5 mr-3 text-white"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                                fill="none"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM20 12c0-3.042-1.135-5.824-3-7.938l-3 2.647A7.962 7.962 0 0016 12h4z"
                            ></path>
                        </svg>
                        <span class="text-white">Processing...</span>
                    </div>
                    <span v-else>Login</span>
                </button>
            </form>

            <p class="mt-4 text-gray-700 text-sm text-center">
                Don't have an account?
                <router-link
                    to="/register"
                    class="text-blue-500 font-bold hover:underline"
                    >Register here</router-link
                >
            </p>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import LoginMutation from "../graphql/Login.gql";
import { useRouter } from "vue-router";
import { onError } from "@apollo/client/link/error";
import { useStore } from "vuex";

export default {
    setup() {
        const email = ref("bablu@gmail.com");
        const password = ref("password");
        const loading = ref(false);
        const error = ref(null);
        const router = useRouter();
        const store = useStore();

        const { mutate } = useMutation(LoginMutation);

        const handleError = (err) => {
            error.value = err.message;
            loading.value = false;
        };

        onError(handleError);

        const login = async () => {
            if (loading.value) return; // Prevent multiple clicks

            if (!email.value || !password.value) {
                error.value = "Please enter both email and password.";
                return;
            }

            loading.value = true;
            error.value = null;

            // Call the login mutation
            try {
                const { data } = await mutate({
                    email: email.value,
                    password: password.value,
                });

                if (data.login) {
                    // Successful login
                    loading.value = false;
                    store.dispatch("setLoggedIn", true);
                    // store.dispatch("fetchCurrentUser");
                    router.push("/");
                } else {
                    // Invalid credentials or other error
                    handleError(new Error("Invalid email or password."));
                }
            } catch (err) {
                handleError(err);
            }
        };

        return {
            email,
            password,
            loading,
            error,
            login,
        };
    },
};
</script>

<style scoped>
/* Your styles */
</style>
