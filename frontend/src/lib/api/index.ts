import createClient from "openapi-fetch";
import type { paths } from "@schema";

const client = createClient<paths>({ baseUrl: process.env.BASE_API_URL });
export default client;
