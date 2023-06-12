<template>
    <button
        class="bg-gradient-to-r from-blue-500 to-blue-800 text-white font-semibold rounded-md px-4 py-2 mt-4 shadow w-full relative"
        @click="handleButtonClick"
    >
        New Card
    </button>
</template>

<script setup>
import { defineEmits } from "vue";

// Define an emits
const emit = defineEmits(["cardEditorEvent"]);
const handleButtonClick = () => {
    emit("cardEditorEvent");
};
</script>
