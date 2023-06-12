<template>
    <header class="bg-indigo-900 sticky top-0 p-4 z-10">
        <div class="container mx-auto flex justify-between items-center">
            <router-link
                :to="{ name: 'home' }"
                class="text-3xl font-bold text-white"
                >Trello Board</router-link
            >
            <div class="flex items-center space-x-4">
                <h3 class="text-2xl font-semibold text-white">
                    <span
                        class="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text"
                        >{{ name }}</span
                    >
                </h3>
                <div v-if="isLoggedIn" class="relative inline-block text-left">
                    <div>
                        <button
                            type="button"
                            class="inline-flex w-full justify-center gap-x-1.5 rounded bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            id="menu-button"
                            aria-expanded="false"
                            aria-haspopup="true"
                            @click="toggleDropdown"
                        >
                            Boards
                            <svg
                                class="-mr-1 h-5 w-5 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    <div
                        v-show="isDropdownOpen"
                        class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabindex="-1"
                        @click="closeDropdown"
                    >
                        <div class="relative" role="none">
                            <!-- Display board titles as router links -->
                            <router-link
                                v-for="boardTitle in userBoards.titles"
                                :key="boardTitle.id"
                                :to="{
                                    name: 'board',
                                    params: { id: boardTitle.id },
                                }"
                                class="text-gray-700 block px-4 py-2 capitalize hover:text-indigo-900 hover:bg-indigo-100 border-b border-gray-300"
                                role="menuitem"
                                tabindex="-1"
                                :id="`menu-item-${boardTitle.id}`"
                            >
                                {{ boardTitle.title }}
                            </router-link>

                            <!-- Create Board button -->
                            <button
                                @click="openModal"
                                class="text-white bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 px-4 py-2 rounded w-full mt-2"
                            >
                                Create Board
                            </button>
                        </div>
                    </div>
                </div>

                <router-link
                    v-if="!isLoggedIn"
                    to="/login"
                    class="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded px-4 py-2 flex items-center space-x-2 font-bold"
                >
                    <LoginIcon />
                    <span>Sign In</span>
                </router-link>

                <button
                    v-if="isLoggedIn"
                    @click="logout"
                    class="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded px-4 py-2 flex items-center space-x-2"
                >
                    <LogoutIcon />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    </header>
    <Modal
        v-if="isModalOpen"
        title="Create Board"
        :confirmButtonText="confirmButtonText"
        :cancelButtonText="cancelButtonText"
        @confirm="handleConfirm"
        @cancel="handleCancel"
        @close="handleClose"
        :loading="isLoading"
    />
</template>

<script>
import LoginIcon from "../Icon/LoginIcon.vue";
import LogoutIcon from "../Icon/LogoutIcon.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import LogoutMutation from "../graphql/Logout.gql";
import { useStore } from "vuex";
import { ref, reactive, computed, onMounted, watch } from "vue";
import UserBoards from "../graphql/UserBoards.gql";
import Modal from "../Components/Modal.vue";
import BoardCreateMutation from "../graphql/BoardCreate.gql";
import { useRouter } from "vue-router";
import { provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "../apollo-client";

export default {
    components: { LoginIcon, LogoutIcon, Modal },
    setup() {
        const { mutate: logoutMutate } = useMutation(LogoutMutation);
        const { mutate: createBoardMutate } = useMutation(BoardCreateMutation);
        const store = useStore();
        const router = useRouter();

        const isDropdownOpen = ref(false);
        const userBoards = reactive({ titles: [] });
        const isModalOpen = ref(false);
        const confirmButtonText = "Create";
        const cancelButtonText = "Cancel";

        const isLoggedIn = computed(() => store.state.isLoggedIn);
        const user = computed(() => store.state.user);
        const name = computed(() => (user.value ? user.value.name : ""));

        const isLoading = ref(false);

        const logout = async () => {
            const { data } = await logoutMutate();

            if (data && data.logout.id) {
                // Dispatch Vuex store logout action
                store.dispatch("setLoggedIn", false);
                router.push({
                    name: "login",
                });
            }
        };

        const toggleDropdown = () => {
            isDropdownOpen.value = !isDropdownOpen.value;
        };

        const closeDropdown = () => {
            isDropdownOpen.value = false;
        };
        const ownerId = computed(() => store.state.user?.id);

        const { result, refetch } = useQuery(UserBoards, {
            owner_id: computed(() => store.state.user.id),
        });
        onMounted(async () => {
            if (ownerId.value) {
                refetch();
            }
        });

        watch(result, () => {
            if (!result.loading && !result.error) {
                userBoards.titles =
                    result.value?.userBoards.map((board) => ({
                        id: board.id,
                        title: board.title,
                    })) || [];
            }
        });
        onMounted(async () => {
            refetch();
        });

        const openModal = () => {
            isModalOpen.value = true;
        };

        const handleConfirm = async (inputValue) => {
            isLoading.value = true;

            provideApolloClient(apolloClient);

            try {
                const { data } = await createBoardMutate({
                    title: inputValue,
                    owner_id: user.value.id,
                });

                const newBoardId = data?.boardAdd.id;

                isModalOpen.value = false;
                refetch();

                if (newBoardId) {
                    router.push({
                        name: "board",
                        params: { id: newBoardId },
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                isLoading.value = false;
            }
        };

        const handleCancel = () => {
            isModalOpen.value = false;
        };

        const handleClose = () => {
            console.log("Modal closed");
        };

        return {
            name,
            isLoggedIn,
            userBoards,
            isDropdownOpen,
            toggleDropdown,
            closeDropdown,
            logout,
            openModal,
            handleConfirm,
            handleCancel,
            handleClose,
            isModalOpen,
            confirmButtonText,
            cancelButtonText,
            isLoading,
        };
    },
};
</script>
