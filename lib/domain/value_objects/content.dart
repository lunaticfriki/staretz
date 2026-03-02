import 'package:equatable/equatable.dart';

class Content extends Equatable {
  final String value;

  const Content(this.value);

  @override
  List<Object> get props => [value];
}
