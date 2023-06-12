<template>
    <button
        @click="openModal"
        class="bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded flex items-center relative h-10 text-center"
    >
        <AddIcon />
        Click Me
    </button>
    <Modal
        v-if="isModalOpen"
        title="Create List"
        :confirmButtonText="confirmButtonText"
        :cancelButtonText="cancelButtonText"
        @confirm="handleConfirm"
        @cancel="handleCancel"
        @close="handleClose"
        :loading="isLoading"
    />
</template>
<script>
import { computed, ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { gql } from "graphql-tag";
import { useRouter } from "vue-router";
import ListAddMutation from "../graphql/ListAdd.gql";
import BoardWithListAndCard from "../graphql/BoardWithListAndCard.gql";
import AddIcon from "../Icon/AddIcon.vue";
import Modal from "../Components/Modal.vue";

export default {
    components: {
        AddIcon,
        Modal,
    },

    setup() {
        const isModalOpen = ref(false);
        const isLoading = ref(false);
        const confirmButtonText = "Create";
        const cancelButtonText = "Cancel";
        const router = useRouter();
        const board_id = computed(() =>
            Number(router.currentRoute.value.params.id)
        );

        const { mutate } = useMutation(ListAddMutation);

        const openModal = () => {
            isModalOpen.value = true;
        };

        const handleConfirm = async (inputValue) => {
            try {
                isLoading.value = true; // Set loading state to true

                await mutate(
                    {
                        title: inputValue,
                        board_id: board_id.value.toString(),
                    },
                    {
                        awaitRefetchQueries: true,
                        refetchQueries: [
                            {
                                query: BoardWithListAndCard,
                                variables: {
                                    id: board_id.value.toString(),
                                },
                            },
                        ],
                    }
                );

                isModalOpen.value = false;
            } catch (error) {
                console.error(error);
            } finally {
                isLoading.value = false; // Set loading state to false after the mutation is complete
            }
        };

        const handleCancel = () => {
            // Handle the cancellation logic
            console.log("Create board canceled");

            // Close the modal
            isModalOpen.value = false;
        };

        const handleClose = () => {
            // Handle the modal close event
            console.log("Modal closed");
        };

        return {
            openModal,
            handleConfirm,
            handleCancel,
            handleClose,
            isModalOpen,
            isLoading,
            confirmButtonText,
            cancelButtonText,
        };
    },
};
</script>
