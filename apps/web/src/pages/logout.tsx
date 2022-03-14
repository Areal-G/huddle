import { withSessionSsr } from "@huddle/backend/next";
import { NextPage } from "next";

const Page: NextPage = () => {
  return null;
};

export const getServerSideProps = withSessionSsr(async (ctx) => {
  ctx.req.session.destroy();
  return {
    redirect: {
      destination: ctx.req.headers.referer ?? "/login",
      permanent: false,
    },
  };
});

export default Page;
