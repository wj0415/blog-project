import React from "react";
import PostInfo from "components/post/PostInfo";
import PageTemplate from "components/common/PageTemplate";
import PostBody from "../components/post/PostBody/PostBody";
const PostPage = () => {
  return (
    <PageTemplate>
      <PostInfo />
      <PostBody />
    </PageTemplate>
  );
};

export default PostPage;
