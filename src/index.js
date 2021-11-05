import ReactDOM from "react-dom";
import "./assets/main.css";
import App from "./App.jsx";
import {
  ConfigProvider,
  AdaptivityProvider,
  ANDROID,
  IOS,
  Scheme,
} from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";

bridge.send("VKWebAppInit");

let scheme = Scheme.VKCOM_DARK;
bridge.subscribe((event) => {
  if (!event.detail) {
    return;
  }
  const { type, data } = event.detail;
  if (type === "VKWebAppUpdateConfig") {
    const _data = data;
    scheme = _data.scheme;
  }
});

ReactDOM.render(
  <ConfigProvider platform={IOS || ANDROID} scheme={scheme}>
    <AdaptivityProvider>
      <App />
    </AdaptivityProvider>
  </ConfigProvider>,
  document.getElementById("app")
);

if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => {});
}
