const Token = artifacts.require("Token");
const dBank = artifacts.require("dBank");

module.exports = async function(deployer) {
	await deployer.deploy(Token);
    const tokenContract = await Token.deployed();

    await deployer.deploy(dBank, tokenContract.address);
    const dBankContract = await dBank.deployed();

    await tokenContract.passMinterRole(dBankContract.address);
};