<template>
    <div class="min-h-screen flex flex-col justify-center">
        <!-- Header -->
        <Header />

        <!-- Banner Section -->
        <div
            class="bg-gray-100 flex flex-col items-center justify-center flex-grow"
        >
            <div class="w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between">
                    <!-- Text on the left side -->
                    <div class="w-1/2">
                        <h1 class="text-4xl font-bold text-gray-900">
                            Welcome to Trello Clone!
                        </h1>
                        <p class="mt-4 text-lg text-gray-600">
                            Create, collaborate, and organize your tasks
                            effortlessly.
                        </p>
                    </div>

                    <!-- Animated image on the right side -->
                    <div class="w-1/2">
                        <img :src="image" alt="" class="w-full" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Rest of the page content -->
    </div>
</template>

<script setup>
import Header from "../Layout/Header.vue";
import image from "../Icon/image.svg";
</script>

<style>
/* Custom styles can be added here */
</style>
