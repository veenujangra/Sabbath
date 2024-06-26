import Animation from '..'
import SplitType from 'split-type'
import gsap from 'gsap'

export default class Title extends Animation {
  constructor({ element }) {
    super({ element })
    this.element = element

    this.animationOptions = {
      delay: this.element.getAttribute('dde') || 0,
      stagger: this.element.getAttribute('data-stagger') || 0.1,
      ease: this.element.getAttribute('data-ease') || 'Power1.easeOut',
      duration: this.element.getAttribute('data-duration') || 1,
    }

    this.create()
    this.setProperties()
  }

  create() {
    this.text = new SplitType(this.element)

    this.text.lines.forEach((item) => {
      var parent = item.parentNode
      var wrapper = document.createElement('div')
      wrapper.classList.add('line_wrapper')
      parent.replaceChild(wrapper, item)
      wrapper.appendChild(item)
    })
  }

  setProperties() {
    gsap.set(this.text.lines, {
      autoAlpha: 0,
      y: 50,
    })
  }

  animateIn() {
    if (this.element.classList.contains('visible')) return

    this.tl = gsap.timeline({
      delay: this.animationOptions.delay,
      onComplete: () => {
        this.element.classList.add('visible')
      },
    })

    this.tl.fromTo(
      this.text.lines,
      {
        autoAlpha: 0,
        y: 50,
      },
      {
        autoAlpha: 1,
        y: 0,
        ease: this.animationOptions.ease,
        stagger: this.animationOptions.stagger,
        duration: this.animationOptions.duration,
      }
    )
  }

  animateOut() {}

  onResize() {
    clearTimeout(this.interval)
    this.interval = setTimeout(() => {
      this.create()
    }, 500)
  }
}
