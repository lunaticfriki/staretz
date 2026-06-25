class PostId {
  final String value;

  PostId._({required this.value});

  factory PostId.create(String raw) {
    if (raw.trim().isEmpty) throw ArgumentError('PostId cannot be empty');
    return PostId._(value: raw.trim());
  }

  factory PostId.empty() => PostId._(value: '');

  @override
  bool operator ==(Object other) => other is PostId && other.value == value;

  @override
  int get hashCode => value.hashCode;
}
