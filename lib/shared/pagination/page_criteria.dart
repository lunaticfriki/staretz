class PageCriteria {
  final int page;
  final int pageSize;

  const PageCriteria({required this.page, required this.pageSize});

  int get offset => (page - 1) * pageSize;

  PageCriteria next() => PageCriteria(page: page + 1, pageSize: pageSize);
  PageCriteria previous() => PageCriteria(page: page - 1, pageSize: pageSize);

  @override
  bool operator ==(Object other) =>
      other is PageCriteria && other.page == page && other.pageSize == pageSize;

  @override
  int get hashCode => Object.hash(page, pageSize);
}
