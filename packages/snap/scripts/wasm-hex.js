const { promises: fs } = require('fs');
const path = require('path');

const WASM_PATH = path.join(
  __dirname,
  '../../../node_modules', // TODO: Do we need that? Does Aleph have any sort of Rust SDK to build? 
);

async function main() {
  const wasmBin = await fs.readFile(WASM_PATH);
  const wasmHex = wasmBin.toString('hex');
  const jsFileString = `
// THIS IS A GENERATED FILE. DO NOT EDIT.
// SEE scripts/wasm-hex.js FOR MORE INFORMATION
export const PROGRAM_WASM_HEX: string = '${wasmHex}';
`;
  await fs.writeFile('./src/wasm.ts', jsFileString);
}

main();
