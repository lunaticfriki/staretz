import 'package:equatable/equatable.dart';

class Title extends Equatable {
  final String value;

  const Title(this.value);

  @override
  List<Object> get props => [value];
}
