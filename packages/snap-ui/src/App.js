import "./App.css";
import * as snap from "snap-adapter";
import { Layout, Menu } from "antd";
import { Button, Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";

import { NewAccount } from "./NewAccount";
import { RecoverAccount } from "./RecoverAccount";
import { SignMessage } from "./SignMessage";

const { Header, Content, Footer } = Layout;

function App() {
  const [menuIndex, setMenuIndex] = useState(0);
  const [snapConnected, setSnapConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const connectSnap = async () => {
      const isEnabled = await snap.isEnabled();
      setLoading(isEnabled);
      setSnapConnected(isEnabled);
    }
    connectSnap().catch(console.error);
  }, []);

  const doConnectSnap = async () => {
    setLoading(true);
    setSnapConnected(false);
    try {
      await snap.connect();
      setSnapConnected(true);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <Layout className="layout" style={{ minHeight: "100" }}>
      <Header className="header">
        <div className="logo" />
        <Menu mode="horizontal" defaultSelectedKeys={["0"]}>
          <Menu.Item key="0" onClick={() => setMenuIndex(0)}>
            Create Account
          </Menu.Item>
          <Menu.Item key="2" onClick={() => setMenuIndex(2)}>
            Recover Account
          </Menu.Item>
          <Menu.Item key="3" onClick={() => setMenuIndex(3)}>
            Sign Message
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "50px 50px" }}>
        {!snapConnected && (
          <Card
            title="Connect and install snap"
            style={{ width: "100%", borderRadius: "20px" }}
            bordered={false}
          >
            <Row justify="center">
              <Col>
                <Button
                  type="primary"
                  disabled={snapConnected}
                  onClick={doConnectSnap}
                  shape="round"
                  size="large"
                  loading={!!loading}
                >
                  Connect
                </Button>
              </Col>
            </Row>
          </Card>
        )}
        {snapConnected && menuIndex === 0 && <NewAccount />}
        {snapConnected && menuIndex === 2 && <RecoverAccount />}
        {snapConnected && menuIndex === 3 && <SignMessage />}
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Visit{" "}
        <a href="https://github.com/piotr-roslaniec/ethwarsaw-2022">
          our Github repo
        </a>
        .
      </Footer>
    </Layout>
  );
}

export default App;
