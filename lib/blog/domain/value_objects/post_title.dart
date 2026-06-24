class PostTitle {
  final String value;

  PostTitle._({required this.value});

  factory PostTitle.create(String raw) {
    if (raw.trim().isEmpty) throw ArgumentError('PostTitle cannot be empty');
    return PostTitle._(value: raw.trim());
  }

  factory PostTitle.empty() => PostTitle._(value: '');

  @override
  bool operator ==(Object other) => other is PostTitle && other.value == value;

  @override
  int get hashCode => value.hashCode;
}
