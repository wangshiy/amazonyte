import { FC } from "react";
import {
  Form,
  Button,
  Upload,
  Modal,
  Notification,
} from "@arco-design/web-react";
import { useNavigate } from "react-router-dom";
import useWeb3 from "src/contexts/web3-context";
import api from "src/utils/api";
import styles from "./index.module.less";

const FormItem = Form.Item;

interface IMintProps {}

const Mint: FC<IMintProps> = () => {
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
    <div className={styles["form-container"]}>
      <Form
        form={form}
        onSubmit={() => {
          form.validate(async (errors, values) => {
            if (!errors) {
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
                mint(
                  {
                    hash: res.IpfsHash,
                    fileName: file.name,
                    fileType: type,
                    date: res.Timestamp,
                  },
                  "https://gateway.pinata.cloud/ipfs/QmQQe2FeFoGj7N8n3ESpk16BK9gq5L44WMwdhSss6NDWwe"
                );
              } catch (error: any) {
                Notification.error({ content: error.message });
              }
            } else {
              console.log("errors", errors);
            }
          });
        }}
      >
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
    </div>
  );
};

export default Mint;
