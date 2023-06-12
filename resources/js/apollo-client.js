import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import store from './router'; // Import your Vue store instance

// HTTP connection to the API
const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: 'http://127.0.0.1:8000/graphql',
    headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    },
    credentials: 'include',

});

// Cache implementation
const cache = new InMemoryCache();

// Create the Apollo client
export const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
});

function isSessionExpired() {
    // Your logic to check if the session is expired
    // This can vary depending on how your session management is implemented
    // Return true if session is expired, false otherwise
    // For demonstration purposes, let's assume the sessionExpires variable holds the expiration timestamp
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const sessionExpires = localStorage.getItem('sessionExpires');
    return sessionExpires && currentTimestamp > sessionExpires;
}

// Function to log out the user
function logoutUser() {
    // Dispatch the "setLoggedIn" action with false to update the store state
    store.dispatch("setLoggedIn", false);

    localStorage.removeItem('sessionExpires');
}

// Check session status periodically
const sessionCheckInterval = setInterval(() => {
    if (isSessionExpired()) {
        clearInterval(sessionCheckInterval); // Stop further checking
        logoutUser();
    }
}, 5000);
