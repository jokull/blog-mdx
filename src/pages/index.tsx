import { desc } from "drizzle-orm";
import { Fragment } from "react/jsx-runtime";
import { groupBy } from "remeda";
import { Link } from "waku";
import { db } from "../db";
import { Post } from "../schema";

export default async function HomePage() {
  const data = await getData();
  const postsByYear = groupBy(data.posts, ({ createdAt }) =>
    new Date(createdAt).getUTCFullYear()
  );

  return (
    <div className="flex-grow">
      <div className="absolute -left-[200px] -top-56 ml-[50%] scale-50 sm:scale-75 md:-left-[350px] md:scale-[0.85] lg:scale-125">
        <div className="absolute left-4 top-0 overflow-visible opacity-40 dark:opacity-20">
          <div className="circle-a absolute h-[900px] w-[700px] rounded-[40rem] mix-blend-multiply" />
        </div>
        <div className="absolute right-0 top-28 overflow-visible opacity-40 lg:top-0 dark:opacity-20">
          <div className="circle-b absolute h-[600px] w-[600px] rounded-[40rem] mix-blend-multiply" />
        </div>
      </div>

      <div className="relative mx-auto max-w-2xl p-4 sm:p-8">
        {/* Two hazy circles playing */}
        <div className="mb-12 flex flex-col items-center justify-between sm:flex-row md:my-16 lg:my-24 lg:mb-32">
          <div className="sm:order-0 order-1 text-sm sm:text-base">
            <div className="[&_a]:font-medium [&_a]:underline [&_a]:hover:text-black">
              <p>
                I'm Jökull Sólberg, co-founder and CTO of{" "}
                <a
                  href="https://www.triptojapan.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Trip To Japan
                </a>
                , a startup creating the best booking experience for the Japan
                inbound tourism market. Previously I founded one of the first
                influencer marketing platforms{" "}
                <a
                  href="https://www.takumi.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Takumi
                </a>
                . I've managed products and development teams for{" "}
                <a
                  href="https://www.quizup.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  QuizUp
                </a>{" "}
                (Seqouia VC funded) and{" "}
                <a
                  href="https://www.getsling.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Sling
                </a>{" "}
                (acquired by{" "}
                <a
                  href="https://www.toasttab.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Toast Inc.
                </a>
                ).
              </p>
            </div>
          </div>
          <div className="order-0 mb-12 text-center sm:order-1 sm:mb-0 sm:ml-6 sm:flex-none">
            <img
              alt="Profile bust"
              src={data.profilePic}
              className="h-48 w-48 rounded-full bg-lime shadow-lg lg:h-52 lg:w-52"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-2xl p-4 sm:p-8">
        <div>
          {Object.entries(postsByYear).map(([year, posts]) => (
            <Fragment key={year}>
              <div className="my-6 first:mt-0">
                <div className="font-serif text-lg">{year}</div>
              </div>

              <div className="flex flex-col gap-3 sm:gap-1">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`./${post.slug}`}
                    className="item group flex-col gap-1 pb-4 leading-tight hover:no-underline sm:flex sm:flex-row sm:items-start sm:justify-between sm:leading-normal"
                  >
                    <div className="title w-4/5 font-medium decoration-auto group-hover:underline group-hover:decoration-black/30">
                      {post.title}
                    </div>
                    <div className="date text-sm font-light text-gray-600 group-hover:no-underline sm:text-base">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: undefined,
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </Link>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

const getData = async () => {
  return {
    posts: await db.query.Post.findMany({
      orderBy: [desc(Post.createdAt)],
    }),
    profilePic: "/images/baldur-square.jpg",
  };
};

export const getConfig = async () => {
  return {
    render: "dynamic",
  };
};
