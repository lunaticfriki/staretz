class PostSlug {
  final String value;

  PostSlug._({required this.value});

  factory PostSlug.create(String raw) {
    if (raw.trim().isEmpty) throw ArgumentError('PostSlug cannot be empty');
    return PostSlug._(value: raw.trim());
  }

  factory PostSlug.empty() => PostSlug._(value: '');

  @override
  bool operator ==(Object other) => other is PostSlug && other.value == value;

  @override
  int get hashCode => value.hashCode;
}
