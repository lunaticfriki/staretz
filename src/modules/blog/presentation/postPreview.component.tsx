import { PostPreviewViewModel } from './viewModels/postPreview.viewModel';
import { Link } from '../../../ui/link.component';
interface PostPreviewProps {
  viewModel: PostPreviewViewModel;
}

export function PostPreview({ viewModel }: PostPreviewProps) {
  return (
    <div class="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-zinc-200 dark:border-zinc-800">
      <div class="relative h-48 overflow-hidden">
        <img
          src={viewModel.image}
          alt={viewModel.title}
          class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div class="p-6">
        <div class="flex items-center gap-3 mb-4">
          <img
            src={viewModel.authorAvatar}
            alt={viewModel.authorName}
            class="w-8 h-8 rounded-full"
          />
          <div class="text-sm text-zinc-500 dark:text-zinc-400">
            <span>{viewModel.authorName}</span>
            <span class="mx-2">•</span>
            <span>{viewModel.date}</span>
          </div>
        </div>

        <h3 class="text-xl font-bold mb-3 text-zinc-900 dark:text-white line-clamp-2">
          {viewModel.title}
        </h3>

        <p class="text-zinc-600 dark:text-zinc-300 mb-6 line-clamp-3">{viewModel.excerpt}</p>

        <Link
          href={`/blog/${viewModel.id}`}
          class="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
        >
          Llegeix l'article
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
