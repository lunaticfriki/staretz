import 'package:equatable/equatable.dart';

class Tag extends Equatable {
  final String value;

  const Tag(this.value);

  @override
  List<Object> get props => [value];
}
