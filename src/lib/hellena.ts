import "server-only";

import { HellenaClient } from "@hellena-sdk/hellena";

const apiKey = process.env.HELLENA_API_KEY;
if (!apiKey) throw new Error("Define a variável HELLENA_API_KEY.");

export const hellena = new HellenaClient(apiKey, {

});