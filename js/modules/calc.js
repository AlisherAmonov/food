function calc() {
  const result = document.querySelector('.calculating__result span')
  let sex, height, weight, age, ratio

  if (localStorage.getItem('sex')) {
    sex = localStorage.getItem('sex')
  } else {
    sex = 'female'
    localStorage.setItem('sex', 'female')
  }

  if (localStorage.getItem('ratio')) {
    ratio = localStorage.getItem('ratio')
  } else {
    ratio = 1.375
    localStorage.setItem('ratio', 1.375)
  }

  function initLocalSettings(selector, activeClass) {
    const elem = document.querySelectorAll(selector)

    elem.forEach((el) => {
      el.classList.remove(activeClass)
      if (el.getAttribute('id') === localStorage.getItem('sex')) {
        el.classList.add(activeClass)
      }
      if (el.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
        el.classList.add(activeClass)
      }
    })
  }

  initLocalSettings('#gender div', 'calculating__choose-item_active')
  initLocalSettings(
    '.calculating__choose_big div',
    'calculating__choose-item_active'
  )

  function calcTotal() {
    if (!sex || !height || !weight || !age || !ratio) {
      result.textContent = 0
      return
    }

    if (sex === 'female') {
      result.textContent = Math.round(
        (447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio
      )
    } else {
      result.textContent = Math.round(
        (88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio
      )
    }
  }
  calcTotal()

  function getStaticInformation(selector, activeClass) {
    const elem = document.querySelectorAll(selector)
    elem.forEach((el) => {
      el.addEventListener('click', (e) => {
        if (e.target.getAttribute('data-ratio')) {
          ratio = +e.target.getAttribute('data-ratio')
          localStorage.setItem('ratio', ratio)
        } else {
          sex = e.target.getAttribute('id')
          localStorage.setItem('sex', sex)
        }

        elem.forEach((el) => {
          el.classList.remove(activeClass)
        })

        e.target.classList.add(activeClass)

        calcTotal()
      })
    })
  }

  getStaticInformation('#gender div', 'calculating__choose-item_active')
  getStaticInformation(
    '.calculating__choose_big div',
    'calculating__choose-item_active'
  )

  function getDynamicInformation(selector) {
    const input = document.querySelector(selector)

    input.addEventListener('input', () => {
      if (input.value.match(/\D/g)) {
        input.style.border = '1px solid red'
      } else {
        input.style.border = 'none'
      }
      switch (input.getAttribute('id')) {
        case 'height':
          height = +input.value
          break
        case 'weight':
          weight = +input.value
          break
        case 'age':
          age = +input.value
          break
      }
      calcTotal()
    })
  }

  getDynamicInformation('#height')
  getDynamicInformation('#weight')
  getDynamicInformation('#age')
}

export default calc
