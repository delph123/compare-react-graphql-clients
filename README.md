# Demo Application to test Apollo Client

## Explanations

To be filled...

## Usage

This project uses vite & yarn. To get started, clone the repo & install dependancies with:

```
  git clone https://innersource.soprasteria.com/delphin.barraud/apollo-client-demo.git
  cd apollo-client-demo
  yarn
```

After installation steps, following scripts are available:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
Tests runs are supported by vitest.

### `yarn build && yarn preview`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.\
A preview server is then started on the build folder.

## To Do

-   Write README.md
-   Avoid friends.length for getting nbFriends
-   Implement refresh button in header for redux
-   Adjust global store eviction as well according to same fine-grained eviction as apollo cache
-   Add Babel compilation for GraphQL queries & write queries as .graphql, add client-side schema
