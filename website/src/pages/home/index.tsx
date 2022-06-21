import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Avatar,
  Tag,
  Descriptions,
} from "@arco-design/web-react";
import { IconUser } from "@arco-design/web-react/icon";
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

  const getOwnerOfNft = async (tokenId: any) => {
    const ownerAddress = await collectionsContract.methods
      .ownerOf(tokenId)
      .call();
    return ownerAddress;
  };

  const loadBlockChainData = async (collectionsContract: any) => {
    const totalSupply = await collectionsContract.methods.totalSupply().call();
    // set up array to keep track of tokens
    const collections = [];
    for (let i = 0; i < totalSupply; i++) {
      const collection = await collectionsContract.methods
        .collections(i)
        .call();
      collection["owner"] = await getOwnerOfNft(i);
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
          >
            <Meta
              avatar={
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <Avatar
                    style={{
                      flex: 1,
                      backgroundColor: "#3370ff",
                      marginRight: 8,
                    }}
                  >
                    <IconUser />
                  </Avatar>
                  <Typography.Text style={{ flex: 7 }} copyable>
                    {collection.owner}
                  </Typography.Text>
                </div>
              }
              title={collection.fileName}
              description={
                <Descriptions
                  colon=": "
                  column={1}
                  labelStyle={{ paddingRight: 16 }}
                  style={{ marginTop: 16 }}
                  data={[
                    {
                      label: "Type",
                      value: (
                        <Tag color="magenta" bordered>
                          {collection.fileType}
                        </Tag>
                      ),
                    },
                    {
                      label: "Date",
                      value: collection.date,
                    },
                  ]}
                />
              }
            />
          </Card>
        );
      })}
    </div>
  );
};

export default Home;
