import 'package:equatable/equatable.dart';

class Slug extends Equatable {
  final String value;

  const Slug(this.value);

  @override
  List<Object> get props => [value];
}
