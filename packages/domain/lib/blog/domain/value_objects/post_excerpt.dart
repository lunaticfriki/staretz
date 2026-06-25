class PostExcerpt {
  final String value;

  PostExcerpt._({required this.value});

  factory PostExcerpt.create(String raw) {
    if (raw.trim().isEmpty) throw ArgumentError('PostExcerpt cannot be empty');
    return PostExcerpt._(value: raw.trim());
  }

  factory PostExcerpt.empty() => PostExcerpt._(value: '');

  @override
  bool operator ==(Object other) =>
      other is PostExcerpt && other.value == value;

  @override
  int get hashCode => value.hashCode;
}
