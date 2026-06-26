import 'dart:convert';
import 'dart:io';

import 'package:dart_frog/dart_frog.dart';

Response onRequest(RequestContext context) {
  if (context.request.method != HttpMethod.get) {
    return Response(statusCode: HttpStatus.methodNotAllowed);
  }

  final spec = {
    'openapi': '3.0.3',
    'info': {
      'title': 'Staretz API',
      'version': '1.0.0',
    },
    'paths': {
      '/posts': {
        'get': {
          'summary': 'List posts (paginated)',
          'parameters': [
            {
              'name': 'page',
              'in': 'query',
              'schema': {'type': 'integer', 'default': 1},
            },
            {
              'name': 'pageSize',
              'in': 'query',
              'schema': {'type': 'integer', 'default': 20},
            },
          ],
          'responses': {
            '200': {
              'description': 'Paginated list of posts',
              'content': {
                'application/json': {
                  'schema': {r'$ref': '#/components/schemas/PaginatedPosts'},
                },
              },
            },
          },
        },
        'post': {
          'summary': 'Create a post',
          'requestBody': {
            'required': true,
            'content': {
              'application/json': {
                'schema': {r'$ref': '#/components/schemas/PostInput'},
              },
            },
          },
          'responses': {
            '201': {
              'description': 'Post created',
              'content': {
                'application/json': {
                  'schema': {r'$ref': '#/components/schemas/Post'},
                },
              },
            },
          },
        },
      },
      '/posts/{slug}': {
        'parameters': [
          {
            'name': 'slug',
            'in': 'path',
            'required': true,
            'schema': {'type': 'string'},
          },
        ],
        'get': {
          'summary': 'Get a post by slug',
          'responses': {
            '200': {
              'description': 'Post found',
              'content': {
                'application/json': {
                  'schema': {r'$ref': '#/components/schemas/Post'},
                },
              },
            },
            '404': {'description': 'Post not found'},
          },
        },
        'put': {
          'summary': 'Update a post',
          'requestBody': {
            'required': true,
            'content': {
              'application/json': {
                'schema': {r'$ref': '#/components/schemas/PostInput'},
              },
            },
          },
          'responses': {
            '200': {
              'description': 'Post updated',
              'content': {
                'application/json': {
                  'schema': {r'$ref': '#/components/schemas/Post'},
                },
              },
            },
            '404': {'description': 'Post not found'},
          },
        },
        'delete': {
          'summary': 'Delete a post',
          'responses': {
            '204': {'description': 'Deleted'},
          },
        },
      },
    },
    'components': {
      'schemas': {
        'Post': {
          'type': 'object',
          'properties': {
            'id': {'type': 'string', 'format': 'uuid'},
            'title': {'type': 'string'},
            'slug': {'type': 'string'},
            'imageUrl': {'type': 'string', 'format': 'uri'},
            'excerpt': {'type': 'string'},
            'body': {'type': 'string'},
            'publishedAt': {'type': 'string', 'format': 'date-time'},
          },
        },
        'PostInput': {
          'type': 'object',
          'required': ['title', 'slug', 'imageUrl', 'excerpt', 'body'],
          'properties': {
            'title': {'type': 'string'},
            'slug': {'type': 'string'},
            'imageUrl': {'type': 'string', 'format': 'uri'},
            'excerpt': {'type': 'string'},
            'body': {'type': 'string'},
          },
        },
        'PaginatedPosts': {
          'type': 'object',
          'properties': {
            'items': {
              'type': 'array',
              'items': {r'$ref': '#/components/schemas/Post'},
            },
            'totalCount': {'type': 'integer'},
          },
        },
      },
    },
  };

  return Response(
    statusCode: HttpStatus.ok,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(spec),
  );
}
