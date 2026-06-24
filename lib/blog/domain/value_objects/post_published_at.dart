class PostPublishedAt {
  final DateTime value;

  PostPublishedAt._({required this.value});

  factory PostPublishedAt.create(DateTime raw) =>
      PostPublishedAt._(value: raw);

  factory PostPublishedAt.empty() =>
      PostPublishedAt._(value: DateTime.fromMillisecondsSinceEpoch(0));

  @override
  bool operator ==(Object other) =>
      other is PostPublishedAt && other.value == value;

  @override
  int get hashCode => value.hashCode;
}
