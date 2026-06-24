import 'package:staretz/shared/pagination/page_criteria.dart';

class Paginated<T> {
  final List<T> items;
  final int totalCount;
  final PageCriteria criteria;

  const Paginated({
    required this.items,
    required this.totalCount,
    required this.criteria,
  });

  int get totalPages => totalCount == 0 ? 1 : (totalCount / criteria.pageSize).ceil();
  bool get hasNext => criteria.page < totalPages;
  bool get hasPrevious => criteria.page > 1;
}
