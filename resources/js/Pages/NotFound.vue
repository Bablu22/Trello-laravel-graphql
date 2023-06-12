<template>
    <div class="not-found-container">
        <h1 class="not-found-title">404</h1>
        <h2 class="not-found-subtitle">Page Not Found</h2>
        <p class="not-found-description">
            The page you are looking for does not exist.
        </p>
        <router-link to="/" class="go-home-button">Go Home</router-link>
    </div>
</template>

<style scoped>
.not-found-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    font-family: Arial, sans-serif;
}

.not-found-title {
    font-size: 6rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #ff4d4f;
}

.not-found-subtitle {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: #333;
}

.not-found-description {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #777;
}

.go-home-button {
    padding: 0.75rem 1.5rem;
    font-size: 1.2rem;
    font-weight: bold;
    text-decoration: none;
    color: #fff;
    background-color: #336699;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.go-home-button:hover {
    background-color: #204466;
}

.go-home-button:active {
    background-color: #102233;
}
</style>
