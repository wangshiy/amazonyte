import { useEffect, useRef } from "react";
import {
  Input,
  Avatar,
  Select,
  Dropdown,
  Menu,
  Divider,
  Button,
  Layout,
} from "@arco-design/web-react";
import {
  IconUser,
  IconSettings,
  IconPoweroff,
  IconExperiment,
  IconDashboard,
  IconInteraction,
  IconTag,
  IconLanguage,
  IconNotification,
} from "@arco-design/web-react/icon";
import styles from "./index.module.less";
import useWeb3 from "src/contexts/web3-context";
import jazzicon from "@metamask/jazzicon";

const Header = () => {
  const avatarRef = useRef<any>();
  const { account } = useWeb3();
  const onMenuItemClick = () => {};

  const droplist = (
    <Menu onClickMenuItem={onMenuItemClick}>
      <Menu.Item key="account">
        <IconUser className={styles["dropdown-icon"]} />
        {account}
      </Menu.Item>
      <Menu.Item key="setting">
        <IconSettings className={styles["dropdown-icon"]} />
        setting
      </Menu.Item>
      <Menu.SubMenu
        key="more"
        title={
          <div style={{ width: 80 }}>
            <IconExperiment className={styles["dropdown-icon"]} />
            seeMore
          </div>
        }
      >
        <Menu.Item key="workplace">
          <IconDashboard className={styles["dropdown-icon"]} />
          workplace
        </Menu.Item>
        <Menu.Item key="card list">
          <IconInteraction className={styles["dropdown-icon"]} />
          cardList
        </Menu.Item>
      </Menu.SubMenu>

      <Divider style={{ margin: "4px 0" }} />
      <Menu.Item key="logout">
        <IconPoweroff className={styles["dropdown-icon"]} />
        logout
      </Menu.Item>
    </Menu>
  );

  // https://stackoverflow.com/questions/71678374/get-metamask-profile-picture-and-name-use-web3
  useEffect(() => {
    const element = avatarRef.current;
    if (element && account) {
      const addr = account.slice(2, 10);
      const seed = parseInt(addr, 16);
      const icon = jazzicon(32, seed); //generates a size 20 icon
      if (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(icon);
    }
  }, [account, avatarRef]);

  return (
    <Layout.Header className={styles["navbar"]}>
      <div className={styles["left"]}>
        <div className={styles["logo"]}>
          <div className={styles["logo-name"]}>Amazonyte</div>
        </div>
      </div>
      <ul className={styles["right"]}>
        <li>
          <Input.Search
            className={styles["round"]}
            placeholder={"placeholder"}
          />
        </li>
        <li>
          <Select
            triggerElement={
              <Button
                icon={<IconLanguage />}
                shape="circle"
                type="secondary"
                className={styles["icon-button"]}
              />
            }
            options={[
              { label: "中文", value: "zh-CN" },
              { label: "English", value: "en-US" },
            ]}
            triggerProps={{
              autoAlignPopupWidth: false,
              autoAlignPopupMinWidth: true,
              position: "br",
            }}
            trigger="hover"
          ></Select>
        </li>
        <li>
          <Button
            icon={<IconNotification />}
            shape="circle"
            type="secondary"
            className={styles["icon-button"]}
          />
        </li>
        <li>
          <Button
            icon={<IconSettings />}
            shape="circle"
            type="secondary"
            className={styles["icon-button"]}
          />
        </li>
        <li>
          <Dropdown droplist={droplist} position="br">
            <Avatar
              ref={avatarRef}
              size={32}
              style={{ cursor: "pointer" }}
            ></Avatar>
          </Dropdown>
        </li>
      </ul>
    </Layout.Header>
  );
};

export default Header;
