const Collection = artifacts.require("Collections");
module.exports = function (_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(Collection);
};
