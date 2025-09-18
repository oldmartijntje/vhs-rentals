import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        defaultCommandTimeout: 10000, // Increase default timeout for commands
        pageLoadTimeout: 60000, // Increase page load timeout
        video: true, // Enable video recording for CI debugging
        screenshotOnRunFailure: true, // Take screenshots on failure
    },
    projectId: 'id9f7t',
});
