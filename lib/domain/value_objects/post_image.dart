import 'package:equatable/equatable.dart';

class PostImage extends Equatable {
  final String url;
  final bool isHero;

  const PostImage(this.url, {this.isHero = false});

  @override
  List<Object?> get props => [url, isHero];
}
