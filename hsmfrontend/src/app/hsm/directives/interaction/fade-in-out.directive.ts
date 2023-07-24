import { Directive, Input, OnChanges } from '@angular/core';
import { ElementRef } from '@angular/core';
import {
  AnimationPlayer,
  AnimationBuilder,
  AnimationMetadata,
  animate,
  style,
} from '@angular/animations';

@Directive({
  selector: '[fadeInOut]',
})

export class FadeInOutDirective {
  player: AnimationPlayer;
  playAnim: boolean = false;

  @Input()
  set show(show: boolean) {
      if (this.player) {
        this.player.destroy();
      }

      let metadata = show ? this.fadeIn() : this.fadeOut();

      if(!this.playAnim && !show)
        metadata = this.hideEl();

      const factory = this.builder.build(metadata);
      const player = factory.create(this.el.nativeElement);

      player.play();
  }
  
  constructor(private builder: AnimationBuilder, private el: ElementRef) {}

  ngOnChanges() {
    this.playAnim = true;
  }

  private fadeIn(): AnimationMetadata[] {
    return [
      style({ opacity: 0 }),
      animate('250ms ease-in', style({ opacity: 1 })),
    ];
  }

  private fadeOut(): AnimationMetadata[] {
    return [
      style({ opacity: '*' }),
      animate('200ms ease-in', style({ opacity: 0 })),
    ];
  }

  private hideEl(): AnimationMetadata[] {
    return [
      style({ opacity: 0 }),
    ];
  }
}
