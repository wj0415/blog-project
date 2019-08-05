const { ObjectId } = require("mongoose").Types;

exports.checkObjectId = (ctx, next) => {
  const { id } = ctx.params;

  //검증실패
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return null;
  }

  return next();
};

const Post = require("models/post");
const Joi = require("joi");
/*POST /api/posts
  {title, body, tags}
*/
exports.write = async ctx => {
  //객체가 지닌 값들을 검증
  const schema = Joi.object().keys({
    title: Joi.string().required(), //뒤에 required를 붙여주면 필수 항목이라는 의미
    body: Joi.string().required(),
    tags: Joi.array()
      .items(Joi.string())
      .required() // 문자열 배열
  });

  //첫번째 파라미터는 검증할 객체, 두 번째는 스키마
  const result = Joi.validate(ctx.request.body, schema);

  // 오류가 발생하면 오류 내용 응답
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;

  //new를 이용해서 새 post 인스턴스를 만듭니다.
  //생성자 함수의 파라미터에 정보를 지닌 객체를 넣는다.
  const post = new Post({
    title,
    body,
    tags
  });

  try {
    await post.save(); //데이터베이스에 저장된다.
    ctx.body = post;
  } catch (e) {
    //데이터베이스의 오류가 발생합니다.
    ctx.throw(e, 500);
  }
};
/*GET api/posts */
exports.list = async ctx => {
  // page가 주어지지 않았다면 1로 간주
  // query 는 문자열 형태로 받아 오므로 숫자로 변환
  const page = parseInt(ctx.query.page || 1, 10);

  if (page < 1) {
    ctx.status = 404;
    return;
  }
  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec(); //exec를 붙어야 서버에 쿼리를 요청함.

    const postCount = await Post.countDocuments().exec();
    //마지막 페이지 알려주기
    //ctx.set은 response header를 설정
    ctx.set("Last-Page", Math.ceil(postCount / 10));
    ctx.body = posts;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

/*GET api/posts/:id */
exports.read = async ctx => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

/*DELETE /api/posts/:id
 */
exports.remove = async ctx => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

/*PATCH /api/posts/:id
  {title, body, tags}
*/
exports.update = async ctx => {
  const { id } = ctx.params;
  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true
      // 이값을 설정해야 업데이트된 객체를 반환한다.
      // 설정하지 않으면 업데이트 전의 객체를 반환한다.
    }).exec();
    // 포스트가 존재하지 않을 때
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(e, 500);
  }
};
