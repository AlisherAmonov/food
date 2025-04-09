function slider({
  container,
  slide,
  nextArrow,
  prevArrow,
  totalCounter,
  currentCounter,
  wrapper,
  field,
}) {
  const slides = document.querySelectorAll(slide)
  const slider = document.querySelector(container)
  const prev = document.querySelector(prevArrow)
  const next = document.querySelector(nextArrow)
  const total = document.querySelector(totalCounter)
  const current = document.querySelector(currentCounter)
  const slidesWrapper = document.querySelector(wrapper)
  const slidesField = document.querySelector(field)
  const width = window.getComputedStyle(slidesWrapper).width

  let slideIndex = 1
  let offset = 0

  function currentSlideIndex() {
    if (slides.length < 10) {
      current.textContent = `0${slideIndex}`
    } else {
      current.textContent = slideIndex
    }
  }

  currentSlideIndex()

  if (slides.length < 10) {
    total.textContent = `0${slides.length}`
  } else {
    total.textContent = slides.length
  }

  slidesField.style.width = 100 * slides.length + '%'
  slidesField.style.display = 'flex'
  slidesField.style.transition = '0.5s all'

  slidesWrapper.style.overflow = 'hidden'

  slides.forEach((slide) => {
    slide.style.width = width
  })

  slider.style.position = 'relative'

  const indicators = document.createElement('ol')
  const dots = []
  indicators.classList.add('carousel-indicators')
  slider.append(indicators)

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li')
    dot.classList.add('dot')
    dot.setAttribute('data-slide-to', i + 1)
    indicators.append(dot)

    if (i == 0) {
      dot.style.opacity = 1
    }
    dots.push(dot)
  }

  function getNumber(str) {
    return +str.replace(/\D/g, '')
  }

  function changeDotsOpacity(dots) {
    dots.forEach((dot) => {
      dot.style.opacity = 0.5
    })
    dots[slideIndex - 1].style.opacity = 1
  }

  next.addEventListener('click', () => {
    if (offset == getNumber(width) * (slides.length - 1)) {
      offset = 0
    } else {
      offset += getNumber(width)
    }

    slidesField.style.transform = `translateX(-${offset}px)`

    if (slideIndex == slides.length) {
      slideIndex = 1
    } else {
      slideIndex++
    }

    currentSlideIndex()
    changeDotsOpacity(dots)
  })

  prev.addEventListener('click', () => {
    if (offset == 0) {
      offset = getNumber(width) * (slides.length - 1)
    } else {
      offset -= getNumber(width)
    }

    slidesField.style.transform = `translateX(-${offset}px)`

    if (slideIndex == 1) {
      slideIndex = slides.length
    } else {
      slideIndex--
    }

    currentSlideIndex()
    changeDotsOpacity(dots)
  })

  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const slideTo = e.target.getAttribute('data-slide-to')

      slideIndex = slideTo
      offset = getNumber(width) * (slideTo - 1)

      slidesField.style.transform = `translateX(-${offset}px)`

      currentSlideIndex()
      changeDotsOpacity(dots)
    })
  })
}

export default slider
