import serverless from "serverless-http";
import app from "./app-vercel.js";

const handle = serverless(app);

export default async function handler(req: any, res: any) {
  return handle(req, res);
}
