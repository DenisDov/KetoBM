import Reactotron from "reactotron-react-native";
import {
  QueryClientManager,
  reactotronReactQuery,
} from "reactotron-react-query";
import { queryClient } from "./query-client";

const queryClientManager = new QueryClientManager({
  // @ts-ignore
  queryClient,
});

Reactotron.configure({
  name: "KetoBM",
  onDisconnect: () => {
    queryClientManager.unsubscribe();
  },
})
  .use(reactotronReactQuery(queryClientManager))
  .useReactNative()
  .connect();
