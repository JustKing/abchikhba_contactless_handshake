import {
  AppRoot,
  SplitLayout,
  SplitCol,
  ViewWidth,
  View,
  Panel,
  PanelHeader,
  PanelHeaderContent,
  PanelHeaderBack,
  withAdaptivity,
  withPlatform,
  Group,
  Button,
  Header,
  Separator,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import React from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "axios";

const App = withPlatform(
  withAdaptivity(
    class App extends React.Component {
      constructor(props) {
        super(props);
        bridge.send("VKWebAppGetUserInfo").then((data) => {
          this.setState({ roomId: data.id });
        });
        this.state = {
          activePanel: "home",
          friend: {},
          waiting: true,
          roomId: "0",
        };
      }

      async subscribe() {
        await axios.get('http://localhost:3001/get-message')
      }

      async createRoom() {
        await axios.post("http://localhost:3001/set-message", {
          action: 'createRoom',
          roomId: this.state.roomId,
        });
      }

      getUsers() {
        bridge.send("VKWebAppGetFriends").then((data) => {
          if (data.users[0]) {
            this.setState({
              friend: data.users[0],
              activePanel: "handshake",
              roomId: `${this.state.roomId}_${data.users[0].id}`,
            });
          }
        });
      }

      goHome() {
        this.setState({
          activePanel: "home",
          friend: {},
          roomId: this.state.roomId.split("_")[0],
        });
      }

      render() {
        const isMobile = this.props.viewWidth <= ViewWidth.MOBILE;

        return (
          <AppRoot>
            <SplitLayout header={<PanelHeader separator={false} />}>
              <SplitCol spaced={!isMobile}>
                <View activePanel={this.state.activePanel}>
                  <Panel id="home">
                    <PanelHeader>
                      <PanelHeaderContent status="Абчихба">
                        Бесконтактное рукопожатие
                      </PanelHeaderContent>
                    </PanelHeader>
                    <Group
                      header={
                        <Header>Выберите пользователя для рукопожатия</Header>
                      }
                    >
                      <Separator style={{ margin: "12px 0" }} />
                      {JSON.stringify(this.state.friend)}
                      <Button stretched onClick={() => this.getUsers()}>
                        Выбрать пользователя
                      </Button>
                    </Group>
                  </Panel>
                  <Panel id="handshake">
                    <PanelHeader
                      left={<PanelHeaderBack onClick={() => this.goHome()} />}
                    >
                      <PanelHeaderContent status={this.state.friend.last_name}>
                        {this.state.friend.first_name}
                      </PanelHeaderContent>
                    </PanelHeader>
                    <Group
                      header={
                        <Header>
                          {this.state.waiting ? "Ожидание" : "Жмите руки!"}
                        </Header>
                      }
                    >
                      Номер комнаты: {this.state.roomId}
                    </Group>
                  </Panel>
                </View>
              </SplitCol>
            </SplitLayout>
          </AppRoot>
        );
      }
    },
    {
      viewWidth: true,
    }
  )
);

export default App;
