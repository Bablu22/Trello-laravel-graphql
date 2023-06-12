<template>
    <div>
        <loading-state v-if="loading" />
        <!-- Board Cards -->
        <div v-else class="space-y-3 bg-gray-300 rounded-md p-4 shadow-xl mb-3">
            <div class="flex justify-end">
                <button
                    aria-label="Delete"
                    @click="deleteList"
                    class="text-red-500 text-bold hover:text-red-700"
                >
                    <CloseIcon />
                </button>
            </div>
            <h2 class="text-xl font-semibold mb-4">{{ list.title }}</h2>
            <Card
                v-for="card in list.cards"
                :key="card.id"
                :list="list"
                :card="card"
            />
            <!-- Card Editor -->
            <CardEditor
                v-if="editing"
                :list="list"
                @closeCardEditor="editing = false"
            />

            <!-- Add Card Button -->
            <CardButton
                v-if="!editing && canAddCard"
                @cardEditorEvent="editing = true"
            />
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import Card from "../Components/Card.vue";
import CardButton from "../Components/CardButton.vue";
import CardEditor from "../Components/CardEditor.vue";
import CloseIcon from "../Icon/CloseIcon.vue";
import LoadingState from "../Components/LoadingState.vue";

export default {
    components: {
        Card,
        CardButton,
        CardEditor,
        CloseIcon,
        LoadingState,
    },
    props: {
        list: Object,
        loading: Boolean,
    },
    data() {
        return {
            editing: false,
        };
    },
    computed: {
        ...mapState({
            user: (state) => state.user,
        }),
        canAddCard() {
            if (this.list && this.list.board && this.user) {
                return (
                    !this.editing && this.list.board.owner.id === this.user.id
                );
            }
            return false;
        },
    },
    methods: {
        deleteList() {
            this.$emit("deleteList", this.list.id);
        },
    },
};
</script>
