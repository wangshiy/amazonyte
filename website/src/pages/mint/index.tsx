import { FC, useState } from "react";
import {
  Form,
  Button,
  Upload,
  Modal,
  Notification,
  Input,
  Spin,
} from "@arco-design/web-react";
import { useNavigate } from "react-router-dom";
import useWeb3 from "src/contexts/web3-context";
import api from "src/utils/api";
import styles from "./index.module.less";

const FormItem = Form.Item;
const TextArea = Input.TextArea;

interface IMintProps {}

const Mint: FC<IMintProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { account, collectionsContract } = useWeb3();
  const [form] = Form.useForm();
  let navigate = useNavigate();

  const mint = (collection: any, tokenUri: string) => {
    if (collectionsContract) {
      collectionsContract.methods
        .mint(collection, tokenUri)
        .send({ from: account })
        .once("receipt", (receipt: any) => {
          console.log("receipt", receipt);
          Notification.success({
            title: "Success",
            content: JSON.stringify(receipt),
          });
          navigate("/");
        })
        .catch((error: any) => {
          Notification.error({ content: error.message });
        });
    }
  };

  return (
    <Spin loading={loading} className={styles["form-loading"]}>
      <Form
        style={{ margin: 16 }}
        form={form}
        onSubmit={() => {
          form.validate(async (errors, values) => {
            if (!errors) {
              setLoading(true);
              const { name, description } = values;
              const files = values.upload;
              const file = files[0].originFile;
              const type = file.name.substr(file.name.lastIndexOf(".") + 1);
              try {
                const data = new FormData();
                data.append("file", file);
                const res: any = await api.post(
                  "/pinning/pinFileToIPFS",
                  data,
                  {
                    headers: {
                      "Content-Type": `multipart/form-data;`,
                    },
                  }
                );
                console.log("res", res);
                //  tokenUri JSON is normally hosted on IPFS
                const tokenUriJson = {
                  name,
                  description,
                  image: `https://gateway.pinata.cloud/ipfs/${res.IpfsHash}`,
                  attributes: [
                    {
                      trait_type: "Hash",
                      value: res.IpfsHash,
                    },
                    {
                      trait_type: "FileName",
                      value: file.name,
                    },
                    {
                      trait_type: "FileType",
                      value: type,
                    },
                    {
                      trait_type: "Date",
                      value: res.Timestamp,
                    },
                  ],
                };
                const pinataJsonPayload = {
                  pinataContent: tokenUriJson,
                };
                const tokenUriJsonRes: any = await api.post(
                  "/pinning/pinJSONToIPFS",
                  pinataJsonPayload,
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
                console.log("tokenUriJsonRes", tokenUriJsonRes);
                mint(
                  {
                    hash: res.IpfsHash,
                    fileName: file.name,
                    fileType: type,
                    date: res.Timestamp,
                  },
                  `https://gateway.pinata.cloud/ipfs/${tokenUriJsonRes.IpfsHash}`
                );
              } catch (error: any) {
                Notification.error({ content: error.message });
              } finally {
                setLoading(false);
              }
            } else {
              console.log("errors", errors);
            }
          });
        }}
      >
        <Form.Item
          label="Name"
          field="name"
          rules={[{ required: true, type: "string" }]}
        >
          <Input style={{ width: 350 }} />
        </Form.Item>
        <Form.Item
          label="Description"
          field="description"
          rules={[{ required: true, type: "string" }]}
        >
          <TextArea
            placeholder="Please enter ..."
            autoSize={{ minRows: 4, maxRows: 8 }}
            style={{ width: 350 }}
          />
        </Form.Item>

        <Form.Item
          label="Upload"
          field="upload"
          triggerPropName="fileList"
          rules={[{ required: true, type: "string" }]}
        >
          <Upload
            listType="picture-card"
            multiple
            limit={1}
            name="files"
            action="/"
            autoUpload={false}
            onPreview={(file: any) => {
              Modal.info({
                title: "Preview",
                content: (
                  <img
                    src={file.url || URL.createObjectURL(file.originFile)}
                    style={{ maxWidth: "100%" }}
                  ></img>
                ),
              });
            }}
          />
        </Form.Item>
        <FormItem
          wrapperCol={{
            offset: 5,
          }}
        >
          <Button type="primary" htmlType="submit" style={{ marginRight: 24 }}>
            Submit
          </Button>
          <Button
            style={{ marginRight: 24 }}
            onClick={() => {
              form.resetFields();
            }}
          >
            Reset
          </Button>
        </FormItem>
      </Form>
    </Spin>
  );
};

export default Mint;
