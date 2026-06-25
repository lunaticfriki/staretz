class PostBody {
  final String value;

  PostBody._({required this.value});

  factory PostBody.create(String raw) => PostBody._(value: raw);

  factory PostBody.empty() => PostBody._(value: '');

  @override
  bool operator ==(Object other) => other is PostBody && other.value == value;

  @override
  int get hashCode => value.hashCode;
}
