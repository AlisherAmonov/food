document.addEventListener('DOMContentLoaded', () => {
  // Tabs

  const tabs = document.querySelectorAll('.tabheader__item')
  const tabsContent = document.querySelectorAll('.tabcontent')
  const tabsParent = document.querySelector('.tabheader__items')

  function hideTabContent() {
    tabsContent.forEach((item) => {
      item.classList.remove('show', 'fade')
      item.classList.add('hide')
    })

    tabs.forEach((item) => {
      item.classList.remove('tabheader__item_active')
    })
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add('show', 'fade')
    tabsContent[i].classList.remove('hide')
    tabs[i].classList.add('tabheader__item_active')
  }

  hideTabContent()
  showTabContent()

  tabsParent.addEventListener('click', (e) => {
    const target = e.target

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent()
          showTabContent(i)
        }
      })
    }
  })

  // Timer

  const deadline = '2025-05-11'

  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds
    const total = Date.parse(endtime) - Date.parse(new Date())

    if (total <= 0) {
      days = 0
      hours = 0
      minutes = 0
      seconds = 0
    } else {
      days = Math.floor(total / (1000 * 60 * 60 * 24))
      hours = Math.floor((total / (1000 * 60 * 60)) % 24)
      minutes = Math.floor((total / 1000 / 60) % 60)
      seconds = Math.floor((total / 1000) % 60)
    }

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    }
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`
    } else {
      return num
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector)
    const days = timer.querySelector('#days')
    const hours = timer.querySelector('#hours')
    const minutes = timer.querySelector('#minutes')
    const seconds = timer.querySelector('#seconds')

    const timeInterval = setInterval(updateClock, 1000)

    updateClock()

    function updateClock() {
      const t = getTimeRemaining(endtime)

      days.innerHTML = getZero(t.days)
      hours.innerHTML = getZero(t.hours)
      minutes.innerHTML = getZero(t.minutes)
      seconds.innerHTML = getZero(t.seconds)

      if (t.total <= 0) {
        clearInterval(timeInterval)
      }
    }
  }

  setClock('.timer', deadline)

  // Modal

  const modal = document.querySelector('.modal')
  const modalTrigger = document.querySelectorAll('[data-modal]')

  function openModal() {
    modal.classList.add('show')
    modal.classList.remove('hide')
    document.body.style.overflow = 'hidden'
    clearInterval(modalTimerId)
  }

  modalTrigger.forEach((btn) => {
    btn.addEventListener('click', openModal)
  })

  function closeModal() {
    modal.classList.add('hide')
    modal.classList.remove('show')
    document.body.style.overflow = ''
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '') {
      closeModal()
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      closeModal()
    }
  })

  const modalTimerId = setTimeout(openModal, 50000)

  function showModalByScroll() {
    if (
      window.scrollY + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      openModal()
    }
    window.removeEventListener('scroll', showModalByScroll)
  }

  window.addEventListener('scroll', showModalByScroll)

  // Classes for cards

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src
      this.alt = alt
      this.title = title
      this.descr = descr
      this.price = price
      this.classes = classes
      this.parent = document.querySelector(parentSelector)
    }

    render() {
      const element = document.createElement('div')
      if (this.classes.length === 0) {
        element.classList.add('menu__item')
      } else {
        this.classes.forEach((className) => element.classList.add(className))
      }

      element.innerHTML = `
            <img src=${this.src} alt=${this.alt} />
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">
              ${this.descr}
            </div>
              <div class="menu__item-divider"></div>
              <div class="menu__item-price">
                <div class="menu__item-cost">Price:</div>
                <div class="menu__item-total"><span>${this.price}</span> dollars/day</div>
            </div>
      `
      this.parent.append(element)
    }
  }

  const getRecourse = async (url) => {
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`)
    }

    return await res.json()
  }

  getRecourse('http://localhost:3000/menu').then((data) => {
    data.forEach(({ img, alting, title, descr, price }) => {
      new MenuCard(
        img,
        alting,
        title,
        descr,
        price,
        '.menu .container'
      ).render()
    })
  })

  // Forms

  const forms = document.querySelectorAll('form')

  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Thank you. We will contact you soon.',
    failure: 'Something went wrong...',
  }

  forms.forEach((item) => {
    bindPostData(item)
  })

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: data,
    })
    return await res.json()
  }

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()

      const statusMessage = document.createElement('img')
      statusMessage.src = message.loading
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `
      form.insertAdjacentElement('afterend', statusMessage)

      const formData = new FormData(form)

      const json = JSON.stringify(Object.fromEntries(formData.entries()))

      postData('http://localhost:3000/requests', json)
        .then((data) => {
          console.log(data)
          showThanksModal(message.success)
          statusMessage.remove()
        })
        .catch(() => {
          showThanksModal(message.failure)
        })
        .finally(() => {
          form.reset()
        })
    })
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog')

    prevModalDialog.classList.add('hide')
    openModal()

    const thanksModal = document.createElement('div')
    thanksModal.classList.add('modal__dialog')
    thanksModal.innerHTML = `
        <div class="modal__content">
        <div class="modal__close" data-close>×</div>
        <div class="modal__title">${message}</div>
        </div>
    `
    document.querySelector('.modal').append(thanksModal)
    setTimeout(() => {
      thanksModal.remove()
      prevModalDialog.classList.add('show')
      prevModalDialog.classList.remove('hide')
      closeModal()
    }, 4000)
  }

  fetch('http://localhost:3000/menu').then((data) =>
    data.json().then((res) => console.log(res))
  )
})
