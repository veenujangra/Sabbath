import { each, map } from 'lodash'
import Title from '../animations/title'
import Description from '../animations/description'
import ImageAnimation from '../animations/image'
import SlideUp from '../animations/slideup'
import gsap from 'gsap'
import Lenis from '@studio-freight/lenis'

export default class Page {
  constructor(options) {
    this.element = options.element
    this.animationElement = {
      title: '[dt]',
      description: '[dd]',
      slideUp: '[ds]',
      image: '[di]',
    }
    this.createSmoothScroll()
  }

  create() {
    this.elements = {}
    each(this.animationElement, (item, index) => {
      if (item instanceof window.HTMLElement || item instanceof window.NodeList || Array.isArray(item)) {
        this.elements[index] = item
      } else {
        this.elements[index] = document.querySelectorAll(item)
        if (this.elements[index].length === 0) {
          this.elements[index] = null
        } else if (this.elements[index].length === 1) {
          this.elements[index] = document.querySelectorAll(item)
        }
      }
    })
    this.createAnimations()
  }

  createSmoothScroll() {
    this.lenis = new Lenis({
      lerp: 0.075,
      smoothTouch: true,
      syncTouchLerp: 0.075,
    })
    this.update()
  }

  update(time) {
    this.lenis.raf(time)
    requestAnimationFrame(this.update.bind(this))
  }

  createAnimations() {
    this.animations = []

    this.animationTitles = map(this.elements.title, (element) => {
      return new Title({ element })
    })
    this.animations.push([...this.animationTitles])

    this.animationDescription = map(this.elements.description, (element) => {
      return new Description({ element })
    })
    this.animations.push([...this.animationDescription])

    this.animationImage = map(this.elements.image, (element) => {
      return new ImageAnimation({ element })
    })
    this.animations.push([...this.animationImage])

    this.animationSlideup = map(this.elements.slideUp, (element) => {
      return new SlideUp({ element })
    })
    this.animations.push([...this.animationSlideup])
  }

  show(animation) {
    return new Promise((resolve) => {
      if (animation) {
        this.animateIn = animation
      } else {
        this.animateIn = gsap.timeline()

        this.animateIn.fromTo(
          this.element,
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            duration: 1.2,
            ease: 'Power1.easeIn',
          }
        )
      }
      this.animateIn.call((_) => {
        this.addEventListeners()
        resolve()
      })
    })
  }

  addEventListeners() {
    window.addEventListener('scroll', this.onScroll.bind(this))
  }

  onScroll() {
    if (this.lenis.direction === -1) {
      document.documentElement.classList.add('scroll-up')
      document.documentElement.classList.remove('scroll-down')
    } else if (this.lenis.direction === 1) {
      document.documentElement.classList.remove('scroll-up')
      document.documentElement.classList.add('scroll-down')
    }
  }

  onResize() {}
}
