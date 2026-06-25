import 'package:dart_frog/dart_frog.dart';
import 'package:staretz_back/blog/application/post.read_service.dart';
import 'package:staretz_back/blog/application/post.write_service.dart';
import 'package:staretz_back/di/container.dart';

const _corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

Handler middleware(Handler handler) {
  AppContainer? container;

  return (context) async {
    if (context.request.method == HttpMethod.options) {
      return Response(statusCode: 204, headers: _corsHeaders);
    }

    container ??= await AppContainer.build();

    final response = await handler
        .use(provider<PostReadService>((_) => container!.postReadService))
        .use(provider<PostWriteService>((_) => container!.postWriteService))
        .call(context);

    return response.copyWith(
      headers: {...response.headers, ..._corsHeaders},
    );
  };
}
