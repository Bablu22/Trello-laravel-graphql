<template>
    <div class="card-editor">
        <textarea
            class="card-editor__textarea"
            v-model="cardText"
            placeholder="Enter card text"
            @keyup.enter="handleEnterKey"
            @keyup.esc="handleCloseEditorClick"
        ></textarea>
        <div class="text-red-600 font-bold" v-if="errorMessage">
            {{ errorMessage }}
        </div>

        <div class="flex justify-between mt-3 w-full">
            <button
                class="flex items-center justify-center bg-teal-900 text-white rounded-md shadow relative w-full py-2 mx-2"
                :disabled="loading"
                @click="addCard"
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
                <span v-else>Add New Card</span>
            </button>
            <button
                class="bg-red-500 text-white rounded-md py-0 w-1/2 mx-2"
                @click="handleCloseEditorClick"
            >
                Close
            </button>
        </div>
    </div>
</template>

<script setup>
import { useMutation, useQuery } from "@vue/apollo-composable";
import { computed, ref, defineEmits, defineProps } from "vue";
import AddCard from "../graphql/AddCard.gql";
import BoardWithListAndCard from "../graphql/BoardWithListAndCard.gql";
import { provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "../apollo-client";
import { useStore } from "vuex";

provideApolloClient(apolloClient);
const loading = ref(false); // Loading state
const cardText = ref("");
const errorMessage = ref("");

const props = defineProps({
    list: Object,
});
const store = useStore();
const user = computed(() => store.state.user);
// Execute the addCard mutation using useMutation
const { mutate } = useMutation(AddCard, {
    // Add refetchQueries option to update the cache and fetch the updated data
    refetchQueries: [
        {
            query: BoardWithListAndCard,
            variables: {
                id: parseInt(props.list.board_id),
            },
        },
    ],
    onCompleted: () => {
        loading.value = false; // Reset loading state
        handleCloseEditorClick();
    },
    onError: (error) => {
        errorMessage.value = error.message;
        loading.value = false; // Reset loading state
    },
});

// Define the addCard method
const addCard = async () => {
    if (loading.value) return; // Prevent multiple clicks

    if (cardText.value.trim() === "") {
        errorMessage.value = "Text is required";
        return;
    }

    loading.value = true; // Set loading state to true

    const variables = {
        title: cardText.value,
        order: parseInt(props.list.cards.length) + 1,
        list_id: parseInt(props.list.id),
        owner_id: Number(store.state.user?.id),
    };

    await mutate(variables);
    handleCloseEditorClick();
    loading.value = false;
};

// Emit events
const emit = defineEmits(["closeCardEditor"]);
const handleCloseEditorClick = () => {
    emit("closeCardEditor");
};

const handleEnterKey = (event) => {
    if (event.key === "Enter") {
        if (cardText.value.trim() === "") {
            errorMessage.value = "Text is required";
            return;
        }
        addCard();
        handleCloseEditorClick();
    }
};
</script>

<style scoped>
.card-editor {
    width: 100%;
}

.card-editor__textarea {
    width: 100%;
    height: 80px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
    outline: none;
}

.btn-sm {
    font-size: 0.875rem;
}
</style>
