declare module "*.module.less" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module "@loadable/component";

interface Window {
  ethereum: any;
}
