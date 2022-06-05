declare module "*.module.less" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module "@loadable/component";

declare module "*.jpg";
declare module "*.jpeg";
declare module "*.png";

declare module "@metamask/jazzicon";

interface Window {
  ethereum: any;
}
