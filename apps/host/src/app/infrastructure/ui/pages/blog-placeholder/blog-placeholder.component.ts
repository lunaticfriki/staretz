import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

@Component({
  selector: 'app-blog-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: '<div #root></div>',
})
export class BlogPlaceholderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) rootContainer!: ElementRef;
  root: ReactDOM.Root | null = null;

  async ngAfterViewInit() {
    try {
      console.log('React version:', React.version);
      // @ts-expect-error - ReactDOM version might not be typed
      console.log('ReactDOM version:', ReactDOM.version);

      if (!document.getElementById('blog-remote-script')) {
        const script = document.createElement('script');
        script.id = 'blog-remote-script';
        script.src = 'http://localhost:4201/remoteEntry.js';
        script.onload = async () => {
          try {
            // @ts-expect-error - window.blog is defined by the remote script
            const container = window.blog;
            // @ts-expect-error - __webpack_share_scopes__ is global
            await container.init(__webpack_share_scopes__.default);

            const factory = await container.get('./Module');
            const Module = factory();

            const App = Module.default;

            this.root = ReactDOM.createRoot(this.rootContainer.nativeElement);
            this.root.render(React.createElement(App));
          } catch (e) {
            console.error('Error initializing remote:', e);
          }
        };
        script.onerror = (e) => console.error('Script load error:', e);
        document.body.appendChild(script);
      } else {
        // @ts-expect-error - window.blog is defined by the remote script
        const container = window.blog;
        // @ts-expect-error - __webpack_share_scopes__ is global
        await container.init(__webpack_share_scopes__.default);
        const factory = await container.get('./Module');
        const Module = factory();
        const App = Module.default;
        this.root = ReactDOM.createRoot(this.rootContainer.nativeElement);
        this.root.render(React.createElement(App));
      }
    } catch (error) {
      console.error('Error loading blog remote:', error);
    }
  }

  ngOnDestroy() {
    if (this.root) {
      this.root.unmount();
    }
  }
}
