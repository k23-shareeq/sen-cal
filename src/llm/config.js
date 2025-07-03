const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_ACCESS_TOKEN);
const hfClient = client;
// const hfModel = "meta-llama/Llama-3.1-8B-Instruct";
const hfModel = "mistralai/Mixtral-8x7B-Instruct-v0.1";
const hfProvider = "together";
const hfRole = "user";

module.exports = {
  hfClient,
  hfModel,
  hfProvider,
  hfRole
}
