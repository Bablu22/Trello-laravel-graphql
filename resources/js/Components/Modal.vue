<template>
    <div
        class="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
    >
        <!-- Background backdrop -->
        <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        ></div>

        <div class="fixed inset-0 z-10 overflow-y-auto">
            <div
                class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
            >
                <!-- Modal panel -->
                <div
                    class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                >
                    <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div class="">
                            <!-- Removed the icon -->
                            <div
                                class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left"
                            >
                                <h3
                                    class="text-lg font-semibold leading-6 text-gray-900"
                                    id="modal-title"
                                >
                                    {{ title }}
                                </h3>
                                <div class="mt-4">
                                    <input
                                        type="text"
                                        v-model="inputValue"
                                        class="border rounded-lg px-4 py-2 w-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring focus:ring-indigo-300 border-gray-300"
                                        placeholder="Enter your text"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
                    >
                        <button
                            :disabled="loading"
                            type="button"
                            class="inline-flex w-full justify-center rounded-md bg-gradient-to-r from-green-500 to-cyan-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-green-600 hover:to-cyan-600 sm:ml-3 sm:w-auto"
                            @click="confirmAction"
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
                            <span v-else> {{ confirmButtonText }}</span>
                        </button>
                        <button
                            type="button"
                            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            @click="cancelAction"
                        >
                            {{ cancelButtonText }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            inputValue: "",
        };
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        confirmButtonText: {
            type: String,
            default: "Confirm",
        },
        cancelButtonText: {
            type: String,
            default: "Cancel",
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        confirmAction() {
            // Emit an event with the input value
            this.$emit("confirm", this.inputValue);
            this.closeModal();
        },
        cancelAction() {
            // Emit an event to cancel the action
            this.$emit("cancel");
            this.closeModal();
        },
        closeModal() {
            // Reset the input value and close the modal
            this.inputValue = "";
            this.$emit("close");
        },
    },
};
</script>
