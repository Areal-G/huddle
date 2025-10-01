import { toNextJsHandler } from "better-auth/next-js";
import { authLib } from "@/lib/auth";

const { POST: authPost, GET: authGet } = toNextJsHandler(authLib);

export const POST = authPost;
export const GET = authGet;
