import { Fragment, FC } from "react";
import {
  Form,
  Button,
  Upload,
  Modal,
  Notification,
} from "@arco-design/web-react";
import useWeb3 from "src/contexts/web3-context";
import api from "src/utils/api";

const FormItem = Form.Item;

interface IMintProps {}

const Mint: FC<IMintProps> = () => {
  const { account, collectionsContract } = useWeb3();
  const [form] = Form.useForm();

  const mint = (collection: any) => {
    if (collectionsContract) {
      collectionsContract.methods
        .mint(collection)
        .send({ from: account })
        .once("receipt", (receipt: any) => {
          console.log("receipt", receipt);
        })
        .catch((error: any) => {
          Notification.error({ content: error.message });
        });
    }
  };

  return (
    <Fragment>
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
                mint({
                  hash: res.IpfsHash,
                  fileName: file.name,
                  fileType: type,
                  date: res.Timestamp,
                });
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
    </Fragment>
  );
};

export default Mint;
