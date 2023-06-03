// domain/.netlfiy/functions/hello

// ofcourse we set redirect to domain/.netlfiy/functions/hello
// if entered /api/hello

exports.handler = async (ev, context) => {
  return {
    statusCode: 200,
    body: 'something changed',
  };
};
