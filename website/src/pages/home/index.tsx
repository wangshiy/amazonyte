import { useState, useEffect } from "react";
import { Card, Avatar, Typography } from "@arco-design/web-react";
import {
  IconThumbUp,
  IconShareInternal,
  IconMore,
} from "@arco-design/web-react/icon";
import useWeb3 from "src/contexts/web3-context";
import styles from "./index.module.less";

const { Meta } = Card;

const Home = () => {
  const { collectionsContract } = useWeb3();
  const [data, setData] = useState<any>({
    totalSupply: 0,
    collections: [],
  });
  console.log("collectionsContract", collectionsContract);

  const loadBlockChainData = async (collectionsContract: any) => {
    const totalSupply = await collectionsContract.methods.totalSupply().call();
    // set up array to keep track of tokens
    const collections = [];
    for (let i = 0; i < totalSupply; i++) {
      const collection = await collectionsContract.methods
        .collections(i)
        .call();
      collections.push(collection);
    }
    console.log("collections", collections);
    setData({
      totalSupply,
      collections,
    });
  };

  useEffect(() => {
    if (collectionsContract) {
      loadBlockChainData(collectionsContract);
    }
  }, [collectionsContract]);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        boxSizing: "border-box",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: 16,
      }}
    >
      {data.collections.map((collection: any, key: number) => {
        return (
          <Card
            key={key}
            className={styles["card-with-icon-hover"]}
            style={{ width: 360, margin: 4 }}
            cover={
              <div
                style={{
                  height: 204,
                  overflow: "hidden",
                }}
              >
                <img
                  style={{ width: "100%", transform: "translateY(-20px)" }}
                  alt="dessert"
                  src={`https://gateway.pinata.cloud/ipfs/${collection.hash}`}
                />
              </div>
            }
            actions={[
              <span className={styles["icon-hover"]}>
                <IconThumbUp />
              </span>,
              <span className={styles["icon-hover"]}>
                <IconShareInternal />
              </span>,
              <span className={styles["icon-hover"]}>
                <IconMore />
              </span>,
            ]}
          >
            <Meta
              avatar={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#1D2129",
                  }}
                >
                  <Avatar size={24} style={{ marginRight: 8 }}>
                    A
                  </Avatar>
                  <Typography.Text>aaa</Typography.Text>
                </div>
              }
              title={collection.fileName}
              description={`Type: ${collection.fileType}, Date: ${collection.date}`}
            />
          </Card>
        );
      })}
    </div>
  );
};

export default Home;
