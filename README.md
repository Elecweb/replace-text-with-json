# Replace text with JSON format

I bundle SPA application ([CRA](https://create-react-app.dev/), for example) to artifact and want to use same artifact for multiple environment (e.g. Dev, Staging, Prod). Since environment variable for most SPA is injected while building, We can't inject any environment variable after bundle is built.

As [CRA](https://reactjs.org/docs/create-a-new-react-app.html) suggest that you can [inject environment as runtime](https://create-react-app.dev/docs/title-and-meta-tags#injecting-data-from-the-server-into-the-page) by using server to replace placeholer with JSON before sending response. But for simple storage hosting our SPA (e.g. AWS S3) we can't do that. So I got this idea to inject variable to artifact before deploy to server. So we don't need to have multple artifact per environment.

## Usage

This task work as title say, it replace text with JSON. It can use for inject variable in artifact or what ever you want. Let's assume we want to inject variable from Azure devops to our SPA. We want to change API URL and GG analytic UA code based on environment(Dev, Staging, Prod)

- First you need to provide placeholder in `index.html`

    ```html
        <script>
            window.RUNTIME_ENV = "@RUNTIME_ENV";
        </script>
    ```

    You can then reference `window.RUNTIME_ENV` in your code.

- In Build or Release pipeline, add this task add input following inputs (no pun intended).

    - rootDir

        where is your artifact folder.

    - replacedRegex
    
        `"@RUNTIME_ENV"`

        placeholder text that'll be replaced with JSON

    - source

        `index.html`

        source path relative to rootDir. souce is where placeholder is placed on and will be replaced

    - keyValue

        `API_URL=#{API_VAR_FROM_AZ_DEVOPS} \n UA_GG_ANALYTIC=ua-2345678`

        multiline text will convert to JSON. it seperate each key value by new line. for above case it'll be JSON like this.

        ```js
        window.RUNTIME_ENV = {
            API_URL: "api.exampble.com",
            UA_GG_ANALYTIC: "ua-2345678"
        };
        ```

    As you can see, you can also provide Azure devops variable by with `#{yourVar}.

## Development in local, how we handle ?

You can use environment variable for development. You can write simple check like this

```js
    const apiUrl = typeof window.RUNTIME_ENV === "string" ? process.env.API_URL : window.RUNTIME_ENV.API_URL
```

You can go further by create utility function for getting value.

```js
  const getEnvValue = (key) => {
      if (typeof window.RUNTIME_ENV === "string") {
          return process.env[key];
      } else {
          return window.RUNTIME_ENV[key]
      }
  };

```