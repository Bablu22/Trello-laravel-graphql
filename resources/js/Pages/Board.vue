<template>
    <Layout>
        <div class="bg-gradient-to-b from-purple-700 to-blue-500 min-h-screen">
            <div class="flex -z-1 container mx-auto p-4">
                <LoadingState v-if="(loading || deletingList) && !board" />
                <LoadingState v-if="deletingList && board" />
                <div
                    v-show="error"
                    class="flex items-center justify-center w-full"
                >
                    <div class="bg-red-500 text-white py-2 px-4 rounded">
                        Error: {{ error && error.message }}
                    </div>
                </div>

                <div v-if="board && !deletingList">
                    <div class="w-full">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 my-8">
                            <List
                                v-for="list in board.lists"
                                :key="list.id"
                                :list="list"
                                @deleteList="deleteList"
                            />
                            <ListAddEditor />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>

<script>
import { useQuery, useMutation } from "@vue/apollo-composable";
import { computed, watch, ref } from "vue";
import { useRoute } from "vue-router";
import debounce from "lodash/debounce";
import BoardWithListAndCard from "../graphql/BoardWithListAndCard.gql";
import Layout from "../Layout/Layout.vue";
import List from "../Components/List.vue";
import LoadingState from "../Components/LoadingState.vue";
import ListAddEditor from "../Components/ListAddEditor.vue";
import DELETE_CARD from "../graphql/CardDelete.gql";
import DELETE_CARD_LIST from "../graphql/CardListDelete.gql";

export default {
    components: {
        Layout,
        List,
        LoadingState,
        ListAddEditor,
    },
    setup() {
        const router = useRoute();
        const id = computed(() => Number(router.params.id));
        const {
            result,
            loading: queryLoading,
            error,
            refetch,
        } = useQuery(BoardWithListAndCard, {
            id,
            fetchPolicy: "cache-and-network",
        });

        const board = computed(() => result.value?.board ?? null);
        const loading = ref(false); // Reactive variable to track deleteList loading state
        const deletingList = ref(false); // Reactive variable to track list deletion loading state

        const debouncedRefetch = debounce(() => {
            refetch();
        }, 500);

        watch(id, () => {
            debouncedRefetch();
        });

        const { mutate: deleteCard } = useMutation(DELETE_CARD);
        const { mutate: deleteCardList } = useMutation(DELETE_CARD_LIST);

        const deleteList = (listId) => {
            const list = board.value.lists.find((l) => l.id === listId);

            if (!list) {
                return;
            }

            deletingList.value = true; // Set deletingList loading state to true

            const cardDeletionPromises = list.cards.map((card) =>
                deleteCard({
                    id: card.id,
                })
            );

            Promise.all(cardDeletionPromises)
                .then(() =>
                    deleteCardList({
                        id: list.id,
                    })
                )
                .then(() => {
                    console.log("List deleted successfully");
                    refetch();
                })
                .catch((error) => {
                    console.error(
                        "An error occurred while deleting the list",
                        error
                    );
                })
                .finally(() => {
                    deletingList.value = false; // Set deletingList loading state to false
                });
        };

        return {
            board,
            loading: queryLoading || loading, // Combine query loading state with deleteList loading state
            deletingList,
            error,
            deleteList,
            queryLoading,
        };
    },
};
</script>
