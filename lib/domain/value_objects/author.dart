import 'package:equatable/equatable.dart';

class Author extends Equatable {
  final String value;

  const Author(this.value);

  @override
  List<Object> get props => [value];
}
