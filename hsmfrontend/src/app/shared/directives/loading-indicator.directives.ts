import {
    Directive,
    ComponentFactory,
    ComponentRef,
    Input,
    ViewContainerRef,
    TemplateRef,
    ComponentFactoryResolver,
    OnInit
  } from '@angular/core';
  import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component';
  
  @Directive({
    selector: '[loadingIndicator]'
  })
  export class LoadingDirective implements OnInit {
    loadingFactory: ComponentFactory<LoadingIndicatorComponent>;
    loadingComponent: ComponentRef<LoadingIndicatorComponent>;
  
    @Input() set loadingIndicator(data: boolean) {
      this._containerRef.clear();
      this.loadingComponent = this._containerRef.createComponent(this.loadingFactory);
  
      if (data === false) {
        this._containerRef.clear();
        this._containerRef.createEmbeddedView(this._templateRef);
      }
    }
  
    constructor(
      private _containerRef: ViewContainerRef,
      private _templateRef: TemplateRef<any>,
      private _componentFactoryResolver: ComponentFactoryResolver
    ) {
      this.loadingFactory = this._componentFactoryResolver.resolveComponentFactory(LoadingIndicatorComponent);
    }
  
    ngOnInit() {
    }
  }
  