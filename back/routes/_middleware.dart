import 'package:dart_frog/dart_frog.dart';
import 'package:staretz_back/blog/application/post.read_service.dart';
import 'package:staretz_back/blog/application/post.write_service.dart';
import 'package:staretz_back/di/container.dart';

Handler middleware(Handler handler) {
  late AppContainer container;

  return (context) async {
    container = await AppContainer.build();
    return handler
        .use(provider<PostReadService>((_) => container.postReadService))
        .use(provider<PostWriteService>((_) => container.postWriteService))
        .call(context);
  };
}
