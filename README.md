# Docker Desktop extension

This repo contains the code for the Docker Desktop extension for Labspaces.

## Development

To develop the extension, run the following steps:

1. Start the app with Compose Watch:

   ```console
   docker compose up --watch
   ```

2. If you don't have the extension installed yet, install it:

   ```console
   docker extension install dockersamples/labspace-extension
   ```

3. Enable debug mode for the extension (to get the Chrome developer tools):

   ```console
   docker extension dev debug dockersamples/labspace-extension
   ```

4. Set the UI source for the extension to be your development environment:

   ```console
   docker extension dev ui-source dockersamples/labspace-extension http://localhost:5173
   ```

5. Open the extension in Docker Desktop. It will now be using the Vite reload server for the UI, allowing you to make changes and see them reflected immediately.

## Deep link support

Once the extension is installed, deep links can be used to launch a Labspace.

```
http://open.docker.com/dashboard/extension-tab?extensionId=dockersamples/labspace-extension&location=PUBLISHED_LABSPACE_URL&title=TITLE
```

[Click here](http://open.docker.com/dashboard/extension-tab?extensionId=dockersamples/labspace-extension&location=dockersamples/labspace-container-supported-development&title=Demo) to launch a sample Labspace
