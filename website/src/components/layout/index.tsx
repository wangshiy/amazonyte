import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from "@arco-design/web-react";
import { IconHome, IconCalendar } from "@arco-design/web-react/icon";
import Header from "./header/index";
import Footer from "./footer/index";
import styles from "./index.module.less";
import lazyload from "./lazyload";
import logo from "src/assets/amazonyte.jpeg";
const Home = lazyload(() => import("src/pages/home"));
const Mint = lazyload(() => import("src/pages/mint"));
const GLTF = lazyload(() => import("src/pages/demo/gltf"));

const MenuItem = Menu.Item;

const Sider = Layout.Sider;
const Content = Layout.Content;
const SubMenu = Menu.SubMenu;

const BaseMenu = () => {
  return (
    <Menu theme="dark" style={{ width: "100%" }}>
      <Link to="/">
        <MenuItem key="home">
          <IconHome /> Home
        </MenuItem>
      </Link>
      <Link to="/mint">
        <MenuItem key="mint">
          <IconHome /> Mint
        </MenuItem>
      </Link>
      <SubMenu
        key="Demo"
        title={
          <span>
            <IconCalendar />
            Demo
          </span>
        }
      >
        <Link to="/demo/gltf">
          <MenuItem key="/demo/gltf">GLTF</MenuItem>
        </Link>
      </SubMenu>
    </Menu>
  );
};

const PageLayout = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleCollapse = () => {
    setCollapsed((collapsed) => !collapsed);
  };

  return (
    <Layout className={styles["layout"]}>
      <BrowserRouter>
        <Sider
          theme="dark"
          breakpoint="lg"
          onCollapse={toggleCollapse}
          collapsed={collapsed}
          width={200}
          collapsible
        >
          <div className={styles["logo"]}>
            <img style={{ width: "100%" }} alt="amazonyte" src={logo} />
          </div>
          <BaseMenu />
        </Sider>
        <Layout>
          <Header />
          {/* <Breadcrumb style={{ padding: "0 24px", margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb> */}
          <Content style={{ padding: "0 24px" }}>
            <Routes>
              <Route key="/" path="/" element={<Home />} />
              <Route key="/mint" path="/mint" element={<Mint />} />
              <Route key="/demo/gltf" path="/demo/gltf" element={<GLTF />} />
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </BrowserRouter>
    </Layout>
  );
};

export default PageLayout;
