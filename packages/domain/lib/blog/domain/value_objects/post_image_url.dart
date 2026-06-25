class PostImageUrl {
  final String value;

  PostImageUrl._({required this.value});

  factory PostImageUrl.create(String raw) {
    if (raw.trim().isEmpty) throw ArgumentError('PostImageUrl cannot be empty');
    return PostImageUrl._(value: raw.trim());
  }

  factory PostImageUrl.empty() => PostImageUrl._(value: '');

  @override
  bool operator ==(Object other) =>
      other is PostImageUrl && other.value == value;

  @override
  int get hashCode => value.hashCode;
}
