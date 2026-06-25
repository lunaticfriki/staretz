import 'package:flutter/material.dart';
import 'package:staretz_domain/blog/domain/entities/post.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_body.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_excerpt.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_id.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_image_url.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_published_at.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_slug.dart';
import 'package:staretz_domain/blog/domain/value_objects/post_title.dart';

class PostEditorForm extends StatefulWidget {
  final Post? initial;
  final void Function(Post) onSave;

  const PostEditorForm({super.key, this.initial, required this.onSave});

  @override
  State<PostEditorForm> createState() => _PostEditorFormState();
}

class _PostEditorFormState extends State<PostEditorForm> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _id;
  late final TextEditingController _title;
  late final TextEditingController _slug;
  late final TextEditingController _imageUrl;
  late final TextEditingController _excerpt;
  late final TextEditingController _body;
  late final TextEditingController _publishedAt;

  @override
  void initState() {
    super.initState();
    final p = widget.initial;
    _id = TextEditingController(text: p?.id.value ?? '');
    _title = TextEditingController(text: p?.title.value ?? '');
    _slug = TextEditingController(text: p?.slug.value ?? '');
    _imageUrl = TextEditingController(text: p?.imageUrl.value ?? '');
    _excerpt = TextEditingController(text: p?.excerpt.value ?? '');
    _body = TextEditingController(text: p?.body.value ?? '');
    _publishedAt = TextEditingController(
      text: p?.publishedAt.value.toIso8601String().split('T').first ?? '',
    );
  }

  @override
  void dispose() {
    for (final c in [_id, _title, _slug, _imageUrl, _excerpt, _body, _publishedAt]) {
      c.dispose();
    }
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    final post = Post.create(
      id: PostId.create(_id.text),
      title: PostTitle.create(_title.text),
      slug: PostSlug.create(_slug.text),
      imageUrl: PostImageUrl.create(_imageUrl.text),
      excerpt: PostExcerpt.create(_excerpt.text),
      body: PostBody.create(_body.text),
      publishedAt: PostPublishedAt.create(DateTime.parse(_publishedAt.text)),
    );
    widget.onSave(post);
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          _field(_id, 'ID', required: true),
          _field(_title, 'Title', required: true),
          _field(_slug, 'Slug', required: true),
          _field(_imageUrl, 'Image URL', required: true),
          _field(_excerpt, 'Excerpt', required: true),
          _field(_body, 'Body', required: true, maxLines: 10),
          _field(_publishedAt, 'Published at (YYYY-MM-DD)', required: true),
          const SizedBox(height: 24),
          ElevatedButton(onPressed: _submit, child: const Text('Save')),
        ],
      ),
    );
  }

  Widget _field(
    TextEditingController controller,
    String label, {
    bool required = false,
    int maxLines = 1,
  }) =>
      Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: TextFormField(
          controller: controller,
          maxLines: maxLines,
          decoration: InputDecoration(
            labelText: label,
            border: const OutlineInputBorder(),
          ),
          validator: required
              ? (v) => (v == null || v.trim().isEmpty) ? '$label is required' : null
              : null,
        ),
      );
}
