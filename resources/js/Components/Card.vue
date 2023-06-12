<template>
    <div class="space-y-2 mb-3">
        <div
            class="bg-white rounded p-4 text-gray-800 font-semibold shadow card group"
        >
            <template v-if="isEditing">
                <input
                    v-model="updatedCardText"
                    class="border rounded p-1 outline-none"
                    @keyup.enter="updateCard"
                    @keyup.esc="cancelEditing"
                    autofocus
                />
                <div class="flex justify-between mt-2">
                    <button class="btn-cancel" @click="cancelEditing">
                        Cancel
                    </button>
                    <button class="btn-save" @click="updateCard">Save</button>
                </div>
            </template>
            <template v-else>
                {{ card.title }}
                <div
                    v-if="card.owner.id === userId"
                    class="hidden group-hover:flex justify-between mt-2 transition-all ease-in-out duration-300"
                >
                    <button class="btn-edit" @click="startEditing">
                        <EditIcon />
                    </button>
                    <button class="btn-delete" @click="deleteCard">
                        <DeleteIcon />
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import DeleteIcon from "../Icon/DeleteIcon.vue";
import EditIcon from "../Icon/EditIcon.vue";
import CardDelete from "../graphql/CardDelete.gql";
import UpdateCard from "../graphql/UpdateCard.gql";
import BoardWithListAndCard from "../graphql/BoardWithListAndCard.gql";
import { useMutation } from "@vue/apollo-composable";
import { mapState } from "vuex";

export default {
    components: {
        DeleteIcon,
        EditIcon,
    },
    props: {
        card: Object,
        list: Object,
    },
    computed: mapState({
        userId: (state) => state.user.id,
    }),
    setup(props) {
        const { mutate: CaredDeleteMutation } = useMutation(CardDelete, {
            refetchQueries: [
                {
                    query: BoardWithListAndCard,
                    variables: {
                        id: props.list.board_id,
                    },
                },
            ],
            onError: (error) => {
                console.error(error);
            },
        });

        const { mutate: updateCardMutation } = useMutation(UpdateCard, {
            refetchQueries: [
                {
                    query: BoardWithListAndCard,
                    variables: {
                        id: props.list.board_id,
                    },
                },
            ],
            onError: (error) => {
                console.error(error);
            },
        });

        const isEditing = ref(false);
        const updatedCardText = ref("");

        const startEditing = () => {
            isEditing.value = true;
            updatedCardText.value = props.card.title;
        };

        const cancelEditing = () => {
            isEditing.value = false;
        };

        const updateCard = async () => {
            try {
                await updateCardMutation({
                    id: props.card.id,
                    title: updatedCardText.value,
                });
                isEditing.value = false;
            } catch (error) {
                console.error(error);
            }
        };

        const deleteCard = async () => {
            try {
                await CaredDeleteMutation({
                    id: props.card.id,
                });
            } catch (error) {
                console.error(error);
            }
        };

        return {
            isEditing,
            updatedCardText,
            startEditing,
            cancelEditing,
            updateCard,
            deleteCard,
        };
    },
};
</script>

<style>
.card {
    width: 250px;
    overflow-wrap: break-word;
}
</style>
