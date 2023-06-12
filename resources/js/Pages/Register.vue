<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
    >
        <div class="bg-white shadow-lg rounded-lg p-12 w-1/3 mx-auto">
            <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">
                Register
            </h2>
            <p
                v-if="error"
                class="my-2 text-red-500 text-bold text-center bg-red-200 p-2"
            >
                {{ error }}
            </p>

            <form @submit.prevent="register">
                <div class="mb-6">
                    <label
                        for="name"
                        class="block text-gray-700 text-sm font-bold mb-2"
                        >Name:</label
                    >
                    <input
                        type="text"
                        id="name"
                        v-model="name"
                        class="w-full border border-gray-300 rounded p-2"
                        placeholder="Enter your name"
                    />
                </div>
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
                    type="submit"
                    :disabled="loading"
                    class="bg-teal-900 text-white px-4 py-2 rounded font-bold w-full transition-colors duration-200"
                >
                    <span
                        v-if="loading"
                        class="flex items-center justify-center"
                    >
                        <svg
                            class="animate-spin h-5 w-5 text-white mr-2"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0012 20c4.411 0 8-3.589 8-8h-4a4 4 0 11-8 0H6v3.291z"
                            ></path>
                        </svg>
                        Loading...
                    </span>
                    <span v-else>Register</span>
                </button>
            </form>
            <p class="mt-4 text-gray-700 text-sm text-center">
                Already have an account?
                <router-link
                    to="/login"
                    class="text-blue-500 font-bold hover:underline"
                    >Login here</router-link
                >
            </p>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import RegisterMutation from "../graphql/Register.gql";
import { onError } from "@apollo/client/link/error";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
    setup() {
        const name = ref("");
        const email = ref("");
        const password = ref("");
        const loading = ref(false);
        const error = ref(null);
        const router = useRouter();
        const store = useStore();

        const { mutate } = useMutation(RegisterMutation);

        const handleError = (err) => {
            if (
                err.graphQLErrors.length > 0 &&
                err.graphQLErrors[0].extensions
            ) {
                const validationErrors =
                    err.graphQLErrors[0].extensions.validation;
                if (validationErrors) {
                    const errorMessages =
                        Object.values(validationErrors).flat();
                    error.value = errorMessages[0]; // Display the first error message
                } else {
                    error.value = err.message;
                }
            } else {
                error.value = err.message;
            }
            loading.value = false;
        };

        onError(handleError);

        const register = async () => {
            if (loading.value) return; // Prevent multiple clicks

            if (!name.value || !email.value || !password.value) {
                error.value = "Please enter all fields.";
                return;
            }

            loading.value = true;
            error.value = null;

            try {
                const { data } = await mutate({
                    name: name.value,
                    email: email.value,
                    password: password.value,
                });
                if (data.register) {
                    // Successful login
                    loading.value = false;
                    store.dispatch("setLoggedIn", true);
                    router.push("/");
                } else {
                    // Invalid credentials or other error
                    handleError(
                        new Error("Something went wrong. Please try again")
                    );
                }
            } catch (err) {
                handleError(err);
            }
        };

        return {
            name,
            email,
            password,
            loading,
            error,
            register,
        };
    },
};
</script>

<style>
input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(156, 39, 176, 0.5);
}
</style>
